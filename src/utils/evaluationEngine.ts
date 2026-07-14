import { EvaluationResponse, IMessageAnalysis } from "../types";

// 체육 수업 학교폭력 예방을 위한 어울림 의사소통 키워드 데이터베이스
const GOOD_KEYWORDS = {
  empathy: ["괜찮아", "이해해", "속상", "슬프", "힘들", "마음", "긴장", "미안", "안부", "다치", "불안", "무섭", "어렵", "기분", "속상하", "공감"],
  communication: ["말해", "대화", "부탁", "해줘", "좋겠어", "의견", "생각", "나전달", "내 마음", "속상했어", "아쉬워", "제안", "소통"],
  cooperation: ["같이", "함께", "협동", "우리", "팀", "도와", "다같이", "모두", "격려", "응원", "지지", "기다려", "도전", "도와줄게", "패스해줄게"],
  sportsmanship: ["스포츠맨십", "정정당당", "규칙", "룰", "심판", "결과", "존중", "배려", "다음에", "수행평가", "평화", "매너", "악수", "우정"]
};

export function evaluateStudentAnswer(
  scenarioId: string,
  answer: string
): EvaluationResponse {
  const trimmed = answer.trim();

  if (!trimmed) {
    return {
      score: 10,
      summary: "답변이 비어 있습니다. 친구에게 건넬 따뜻한 한마디를 입력해 주세요.",
      strengths: "아직 작성된 내용이 없습니다.",
      reflections: "갈등 상황에서 내가 먼저 평화의 목소리를 내어 보세요.",
      advice: "상대의 마음에 공감하고 비방하지 않는 존중의 표현을 작성해 보세요."
    };
  }

  // 1. 거친 비속어 및 직접적인 조롱 어휘 감지 (explicit toxic terms)
  const explicitBadWords = [
    "꺼져", "짜증", "극혐", "민폐", "바보", "징징", "새끼", "개판", "진지충", "어쩔", 
    "겁쟁이", "킹받", "노답", "핵노답", "쓰레기", "존나", "졸라", "씨발", "시발", 
    "병신", "호구", "찐따", "엄살", "나가라", "꺼지", "골치", "발로 차", "발로 하냐", 
    "손은 장식", "개진상", "급식충", "틀딱", "지랄", "꼴값", "미친", "알빠임", "알빠", "닥쳐", "시끄러"
  ];

  let penaltyCount = 0;
  const detectedBadWords: string[] = [];

  for (const word of explicitBadWords) {
    if (trimmed.includes(word)) {
      penaltyCount++;
      detectedBadWords.push(word);
    }
  }

  // 2. 상대방 탓을 하며 책임을 미루는 비난형 표현 감지
  const isBlamingOthers = 
    (trimmed.includes("너 때문") || trimmed.includes("네 때문") || trimmed.includes("니 때문") || 
     trimmed.includes("너때문") || trimmed.includes("니때문") || trimmed.includes("네때문") || 
     trimmed.includes("남 탓") || trimmed.includes("너 탓") || trimmed.includes("니 탓") || 
     trimmed.includes("네 탓") || trimmed.includes("탓이잖아") || trimmed.includes("탓이야") || 
     trimmed.includes("네가 잘못") || trimmed.includes("너가 잘못")) && 
    !(trimmed.includes("누구 탓도") || trimmed.includes("내 탓") || trimmed.includes("나 때문") || trimmed.includes("내 실수"));

  if (isBlamingOthers) {
    penaltyCount++;
    detectedBadWords.push("상대 탓/책임 전가");
  }

  // 3. "못하" 또는 "못한"과 같은 실력 비하 발언 감지
  const isDefendingOrEncouraging = 
    trimmed.includes("못해도 괜찮") || 
    trimmed.includes("못하더라도") || 
    trimmed.includes("잘 못") || 
    trimmed.includes("잘못") || 
    trimmed.includes("못하지만") ||
    trimmed.includes("지 마") ||
    trimmed.includes("지마") ||
    trimmed.includes("말자") ||
    trimmed.includes("안 돼") ||
    trimmed.includes("안돼") ||
    trimmed.includes("마라") ||
    trimmed.includes("마세요") ||
    trimmed.includes("나도") ||
    trimmed.includes("내가") ||
    trimmed.includes("우리가");

  const hasIncompetentBlame = (trimmed.includes("못하") || trimmed.includes("못한")) && !isDefendingOrEncouraging;

  if (hasIncompetentBlame) {
    penaltyCount++;
    detectedBadWords.push("상대방 기량 비하");
  }

  // 4. 나-전달법(I-Message) 정밀 분석
  // [행동] 상대의 행동을 비방 없이 사실적으로 표현하는가?
  const behaviorKeywords = [
    "할 때", "했을 때", "장난할", "장난칠", "실수할", "실수했을", "비난할", "비난했을", 
    "패스 안 할", "말할", "말했을", "조롱할", "조롱했을", "소리지를", "소리질렀을"
  ];
  let detectedBehavior = "";
  for (const kw of behaviorKeywords) {
    if (trimmed.includes(kw)) {
      detectedBehavior = kw;
      break;
    }
  }
  const hasBehavior = detectedBehavior !== "";

  // [영향] 나에게 미치는 구체적/객관적 영향을 기술하는가?
  const effectKeywords = [
    "위험", "다칠까", "다칠", "점수가", "패배", "결과", "분위기", "오해", "상처", "피해", "사고", "진행이"
  ];
  let detectedEffect = "";
  for (const kw of effectKeywords) {
    if (trimmed.includes(kw)) {
      detectedEffect = kw;
      break;
    }
  }
  const hasEffect = detectedEffect !== "";

  // [감정] 나의 주관적 감정을 '속상하다/아쉽다/걱정되다' 등으로 솔직히 표현하는가?
  const feelingKeywords = [
    "속상", "아쉬", "걱정", "무섭", "슬프", "불안", "당황", "기분", "마음", "서운"
  ];
  let detectedFeeling = "";
  for (const kw of feelingKeywords) {
    if (trimmed.includes(kw)) {
      detectedFeeling = kw;
      break;
    }
  }
  const hasFeeling = detectedFeeling !== "";

  // [요청] 내가 상대방에게 바라는 명확하고 정중한 부탁/대안을 제시하는가?
  const requestKeywords = [
    "해줘", "좋겠어", "부탁", "하자", "응원", "격려", "사과", "말해", "알려줘", "조심해", "존중해"
  ];
  let detectedRequest = "";
  for (const kw of requestKeywords) {
    if (trimmed.includes(kw)) {
      detectedRequest = kw;
      break;
    }
  }
  const hasRequest = detectedRequest !== "";

  // I-Message Level 판정
  const foundElementsCount = (hasBehavior ? 1 : 0) + (hasEffect ? 1 : 0) + (hasFeeling ? 1 : 0) + (hasRequest ? 1 : 0);
  let iMessageLevel: "excellent" | "good" | "developing" | "weak" = "weak";
  let iMessageLevelKorean = "노력 필요 (1단계 이하)";

  if (foundElementsCount === 4) {
    iMessageLevel = "excellent";
    iMessageLevelKorean = "매우 탁월 (4단계 전체 완비!)";
  } else if (foundElementsCount === 3) {
    iMessageLevel = "good";
    iMessageLevelKorean = "우수 (3개 단계 완료)";
  } else if (foundElementsCount === 2) {
    iMessageLevel = "developing";
    iMessageLevelKorean = "보통 (2개 단계 완료)";
  }

  const iMessageAnalysis: IMessageAnalysis = {
    hasBehavior,
    hasEffect,
    hasFeeling,
    hasRequest,
    level: iMessageLevel,
    levelKorean: iMessageLevelKorean,
    scoreContribution: foundElementsCount * 5 + (foundElementsCount === 4 ? 10 : 0), // 최대 +30점
    elements: {
      behavior: {
        checked: hasBehavior,
        name: "행동 (사실적 기술)",
        detectedText: hasBehavior ? `'${detectedBehavior}' 표현 감지됨` : "감지되지 않음",
        explanation: "비난 섞인 말투 대신 친구의 행동이나 일어난 일의 상황을 있는 그대로 객관적으로 적습니다."
      },
      effect: {
        checked: hasEffect,
        name: "영향 (구체적 결과)",
        detectedText: hasEffect ? `'${detectedEffect}' 표현 감지됨` : "감지되지 않음",
        explanation: "그 행동이 나 혹은 우리 팀 활동에 미치는 구체적이고 실질적인 영향을 설명합니다."
      },
      feeling: {
        checked: hasFeeling,
        name: "감정 (솔직한 마음)",
        detectedText: hasFeeling ? `'${detectedFeeling}' 표현 감지됨` : "감지되지 않음",
        explanation: "분노 대신 '속상하다, 당황스럽다, 아쉽다' 등 내면의 솔직한 주관적 감정을 털어놓습니다."
      },
      request: {
        checked: hasRequest,
        name: "요청 (대안 및 바람)",
        detectedText: hasRequest ? `'${detectedRequest}' 표현 감지됨` : "감지되지 않음",
        explanation: "친구에게 바라는 명확하고 정중한 요청사항 및 평화적인 협력 대안을 제시합니다."
      }
    }
  };

  // 5. 어울림 핵심 가치 단어 포함 및 카테고리 매칭
  const matchedCategories: string[] = [];
  let empathyBonus = 0;
  let commBonus = 0;
  let coopBonus = 0;
  let sportsBonus = 0;

  for (const word of GOOD_KEYWORDS.empathy) {
    if (trimmed.includes(word)) {
      empathyBonus = 10;
      matchedCategories.push("공감");
      break;
    }
  }

  for (const word of GOOD_KEYWORDS.communication) {
    if (trimmed.includes(word)) {
      commBonus = 10;
      matchedCategories.push("의사소통");
      break;
    }
  }

  for (const word of GOOD_KEYWORDS.cooperation) {
    if (trimmed.includes(word)) {
      coopBonus = 10;
      matchedCategories.push("협동·배려");
      break;
    }
  }

  for (const word of GOOD_KEYWORDS.sportsmanship) {
    if (trimmed.includes(word)) {
      sportsBonus = 10;
      matchedCategories.push("스포츠맨십");
      break;
    }
  }

  // 6. 기본 점수 및 세부 가점 채점 로직
  let score = 40; // 기본 출발선 40점
  const length = trimmed.length;

  // 길이에 따른 성의도 가산점 (비속어가 없을 때만 적용)
  if (penaltyCount === 0) {
    if (length >= 8) score += 10;
    if (length >= 20) score += 10;
    if (length >= 35) score += 10;

    // 카테고리 보너스 합산
    score += empathyBonus + commBonus + coopBonus + sportsBonus;

    // 나-전달법 구성도 보너스 합산
    score += iMessageAnalysis.scoreContribution;
  }

  // 7. 비속어/비난 검출 시 강력한 패널티 적용 (F학점 보장)
  if (penaltyCount > 0) {
    // 비난이 섞여 있으면 보너스를 전부 소멸하고, 최대 30점 미만으로 강제 낙제시킵니다.
    const penaltyReduction = penaltyCount * 15;
    score = Math.max(10, Math.min(30, 40 - penaltyReduction));
  } else {
    // 비속어는 없는데 답변이 무성의하거나 의미 없는 짧은 한 마디일 경우 (예: "미안", "싫음")
    if (length < 8 && matchedCategories.length === 0) {
      score = Math.min(45, score); // 45점을 넘을 수 없음
    } else if (length < 15 && matchedCategories.length <= 1) {
      score = Math.min(65, score); // 기본 점수 억제
    }
  }

  // 최종 점수 범위 제어 (최대 100, 최소 10)
  score = Math.max(10, Math.min(100, score));

  // 시나리오 맞춤형 격려 피드백 문구 조립
  let summary = "";
  let strengths = "";
  let reflections = "";
  let advice = "";

  if (penaltyCount > 0) {
    summary = `작성된 답변에 상대방에게 상처를 주거나 비난/조롱하는 부적절한 표현(${detectedBadWords.join(", ")})이 감지되었습니다.`;
    strengths = `경쟁 상황이라도 거친 표현이나 상대를 비하하는 어조를 사용하는 것은 또 다른 학교폭력(언어폭력)으로 갈등을 악화시킬 뿐입니다.`;
    reflections = `친구의 아쉬운 기분이나 행동에 대해 화를 내기보다, 내 아쉬운 감정을 차분히 털어놓고 긍정적인 대안을 제안하는 '나-전달법'을 사용해 다시 적어보세요.`;
    advice = `예시: '${detectedBadWords[0]}'와 같은 표현을 지우고, "속상하겠지만 나도 최선을 다했어. 다음부터는 화내지 말고 좋게 알려주면 좋겠어"라고 의젓하게 표현해보세요.`;
  } else {
    // 훌륭한 정상 답변에 대한 피드백 문구 구성
    if (length < 8 && matchedCategories.length === 0) {
      summary = `작성된 답변이 다소 짧고 갈등해결 요소(공감, 대화)가 부족합니다.`;
      strengths = `비속어는 사용하지 않았지만, 상대방과 구체적으로 문제를 풀어나가려는 노력이 더 필요합니다.`;
      reflections = `친구가 서운해했을 마음을 헤아리고, 앞으로 다 함께 즐겁게 체육을 이어가기 위한 구체적인 대안을 담아 15자 이상으로 작성해보세요.`;
      advice = `예시: "속상했을 텐데 미안해. 다음 시합에는 우리 더 열심히 호흡 맞춰서 해보자."`;
    } else {
      if (scenarioId === "soccer-blame") {
        summary = `실수한 친구를 탓하지 않고 평화롭게 대화하려는 의도가 잘 묻어나는 답변입니다.`;
        strengths = `민우의 공격적인 발언에 흥분하여 맞받아치지 않고, 함께 팀 스포츠를 맞춰가는 주체적인 입장에서 존중의 룰을 상기시켰습니다. ${
          matchedCategories.length > 0 ? `'${matchedCategories.join(", ")}' 역량이 특히 돋보입니다.` : ""
        }`;
        reflections = `만약 상대방이 심하게 흥분한 상태라면, 가볍게 '나도 골을 넣지 못해 정말 아쉬웠다'는 감정의 아쉬움을 먼저 고백(나 전달법)해보는 것은 어떨까요?`;
        advice = `다음 축구 시합 중에는 친구가 헛발질을 하거나 패스 실수를 했을 때, 화를 내기보다는 손바닥을 부딪치며 "아깝다! 다음 찬스엔 나한테 줘!"라고 외쳐봅시다.`;
      } else if (scenarioId === "dodgeball-exclusion") {
        summary = `피구 활동에서 소외될 뻔한 지호를 따뜻하게 공동체 안으로 감싸 안은 속 깊은 해법입니다.`;
        strengths = `팀의 승리보다 '우리 반 모두의 고른 참여와 즐거움'이라는 스포츠맨십 및 공동체 안전 가치를 훌륭히 수호하고 있습니다.`;
        reflections = `지호가 잘 못한다고 배제당해 느꼈을 부끄러움이나 소외감에 대해 "지호도 이 시합을 함께 즐기고 싶을 거야"라는 구체적인 감정 옹호를 덧붙여주면 완벽합니다.`;
        advice = `실제 피구 시합 중에는 실력이 서툰 친구가 아웃되지 않도록 옆에서 수비 팁을 알려주거나, 외야에서 공을 잡았을 때 먼저 친구에게 토스해 던질 기회를 만들어보세요.`;
      } else if (scenarioId === "basketball-ballhog") {
        summary = `신체 다툼과 도발적 상황 앞에서 감정을 조절하며, 경기 룰에 기반한 정의로운 해법을 제안했습니다.`;
        strengths = `재호의 감정적인 싸움 도발에 휘말려 언성을 높이거나 신체적 주먹다짐으로 치닫지 않고, 스포츠가 정한 규칙대로 경기를 중재하려 한 태도가 매우 모범적입니다.`;
        reflections = `비난이나 지적을 하기 전에, 손을 가볍게 들어 타임아웃을 부르고 심판에게 안전한 판정을 먼저 정중히 요구하는 절차를 밟는 것도 아주 똑똑한 갈등해결법입니다.`;
        advice = `농구나 축구 등 신체 부딪침이 잦은 영역형 스포츠를 할 때 파울이 생기면, "미안, 괜찮아?"라며 먼저 사과하고, 상대도 "나도 괜찮아!"라며 화답하는 상호 악수를 생활화해봅시다.`;
      } else if (scenarioId === "badminton-partner-blame") {
        summary = `파트너와의 호흡과 공동의 성장 가치를 높게 인지한 훌륭한 배드민턴 갈등 조율법입니다.`;
        strengths = `수행평가 점수 하락에 민감할 성진이의 조급함을 받아주면서도, 서로 비난하기보다는 전술을 수정하거나 더 명확한 역할 조율을 도출하려 시도했습니다.`;
        reflections = `'성진아, 점수가 깎일까 봐 조바심 나는 마음에 화낸 건 알아'와 같이 상대의 기분(조바심)을 먼저 알아채주고 내 의견을 건네면 대립이 한결 가라앉습니다.`;
        advice = `복식 경기 중 파트너가 헛스윙을 하거나 셔틀콕을 놓치면, 가볍게 라켓 헤드를 서로 부딪치며 '다음 점수 가져오자, 파이팅!'이라고 환기시키는 습관을 들여보세요.`;
      } else if (scenarioId === "relay-drop-mocking") {
        summary = `장난을 빌미로 행해지는 단체방 조롱에 대항하여 자신의 감정을 의젓하고 당당하게 표현하였습니다.`;
        strengths = `친구가 '단순 장난'이라며 회피하려는 프레임에 갇히지 않고, 타인의 실수를 비방거리로 삼는 문화가 폭력이 될 수 있음을 당당히 환기시켰습니다.`;
        reflections = `더 나아가, 주변 친구들에게 '실수한 친구를 계속 부각시키는 대화는 학급의 스포츠 공동체 단결을 저해한다'며 건강하게 동의를 구하는 방어자(Defender) 역할을 추가해볼 수 있습니다.`;
        advice = `단체 메신저방에서 누군가의 실수가 조롱거리가 될 때는, 절대 같이 웃거나 호응하지 말고 '그때 우리 다 고생했어! 다음 체육대회 때 더 잘하자!'라며 선의로 대화의 방향을 돌려주세요.`;
      } else if (scenarioId === "gymnastics-fear-laugh") {
        summary = `신체 활동의 공포를 극복하려는 친구 곁에서 가장 필요한 용기와 안심을 안겨주는 따뜻한 응원입니다.`;
        strengths = `체육 기량이 떨어지는 친구를 조롱하고 약자로 지목하는 주원이의 폭력적 행동을 직접적이고 담대하게 중단시키며, 수민이의 상처받은 마음과 과거 두려움을 훌륭하게 방어했습니다.`;
        reflections = `조롱하는 친구에게 화를 내기보다, "수민이가 과거에 다쳐서 트라우마가 있어. 우리 조금만 시간을 두고 안전하게 구르도록 매트 양옆에서 보조해주자"처럼 대안적 방안을 제안하는 것도 적극적인 방법입니다.`;
        advice = `매트나 뵤틀처럼 두려움이 가득한 교재교구를 다룰 때는, 앞선 학생이 뒤 학생에게 시범을 천천히 보여주거나 "내가 옆에서 잡아줄 테니 한 단계씩 같이 해보자"며 든든한 페이스메이커가 되어주세요.`;
      } else if (scenarioId === "tabletennis-equipment-blame") {
        summary = `낡은 탁구 장비로 인해 실수한 친구를 깎아내리거나 비난하지 않고, 격려를 선택한 매우 의젓한 대답입니다.`;
        strengths = `장비나 실력이 부족한 친구도 학급 스포츠의 소중한 일원임을 강조하고, 태혁이의 차가운 태도를 슬기롭게 완충하는 리더십을 보였습니다.`;
        reflections = `친구들과 경쟁하는 스포츠에서도 물품이나 장비에 연연하기보다는 '같이 땀 흘리며 한 세트를 완성하는 참재미'를 전파하면 반 분위기가 한결 좋아집니다.`;
        advice = `운동할 때 누군가 실수하면 "장비가 아쉽다! 괜찮아, 다음 판에 집중하자!"라며 기운을 불어넣어 보세요.`;
      } else if (scenarioId === "swimming-dangerous-prank") {
        summary = `위험천만한 수영장 물장난에 대처하여 안전의 엄격함을 일깨운 아주 훌륭한 평화 수호자의 답변입니다.`;
        strengths = `'장난'이라는 핑계 뒤에 숨은 안전 위협이 폭력이자 대형 사고의 전초전이 될 수 있음을 당당하고 차분하게 짚어 주었습니다.`;
        reflections = `상대방이 '진지충'이라고 비하하더라도 주눅 들지 않고, '안전하지 않은 스포츠는 즐거울 수 없다'는 절대적 가치를 수호한 태도가 매우 빛납니다.`;
        advice = `물놀이나 기계체조 등 위험이 따르는 활동을 할 때는 무리한 내기를 하거나 뒤에서 잡는 등의 도를 넘은 행동을 칼같이 제재해 주세요.`;
      } else {
        // 추가 혹은 사용자 정의 시나리오에 대한 기본 피드백
        summary = `평화롭게 대화하고 갈등을 이겨내려는 따뜻한 시도가 가득한 답변입니다.`;
        strengths = `갈등 상황에서도 감정을 차분히 조절하고 정중히 의견을 표출한 점이 아주 돋보입니다.`;
        reflections = `상대방의 상황이나 서운했던 감정을 한 마디만 더 짚어주면 한층 수준 높은 대화가 완성됩니다.`;
        advice = `앞으로 운동장에서 친구가 실수할 때 먼저 미소로 하이파이브를 건네주는 멋진 리더십을 보장해 주세요!`;
      }
    }
  }

  return {
    score,
    summary,
    strengths,
    reflections,
    advice,
    iMessageAnalysis
  };
}
