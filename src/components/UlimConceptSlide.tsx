import React, { useState } from "react";
import { 
  Heart, 
  MessageSquare, 
  Sparkles, 
  Smile, 
  ShieldCheck, 
  Dribbble, 
  UserCheck, 
  AlertTriangle,
  Flame,
  Scale
} from "lucide-react";
import { motion } from "motion/react";

export default function UlimConceptSlide() {
  const [activeCompetency, setActiveCompetency] = useState<number | null>(null);

  const competencies = [
    {
      title: "공감 (Empathy)",
      subtitle: "마음의 눈으로 친구 보기",
      description: "체육 시간에는 누구나 긴장하고 실수할 수 있습니다. 운동 실력이 부족한 친구의 속상한 마음과 위축된 감정을 먼저 헤아리고 다정하게 건네는 말 한마디가 공감의 출발입니다.",
      icon: <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />,
      color: "border-rose-200 hover:border-rose-500 bg-rose-50/20",
      pillColor: "bg-rose-100 text-rose-800 border-rose-300",
      accent: "bg-rose-500"
    },
    {
      title: "의사소통 (Communication)",
      subtitle: "화내지 않고 나 전달하기",
      description: "골을 놓쳤을 때 '너 때문에 졌다'라는 짜증 가득한 비난 대신, '이기고 싶었던 마음이 컸는데 너무 아쉽다. 다음 찬스에는 긴장하지 말고 편하게 차보자!'라고 존중을 담아 이야기합니다.",
      icon: <MessageSquare className="w-6 h-6 text-emerald-600" />,
      color: "border-emerald-200 hover:border-emerald-500 bg-emerald-50/20",
      pillColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
      accent: "bg-emerald-500"
    },
    {
      title: "감정조절 (Self-Regulation)",
      subtitle: "격분할 때 3초 멈추기",
      description: "경기 도중 억울한 판정이나 격한 몸싸움으로 화가 치밀어 오를 때는 즉각적으로 말이나 몸을 쓰기보다, 숨을 깊게 들이쉬며 3초를 세고 침착하게 룰을 논의하는 냉철함을 유지합니다.",
      icon: <Flame className="w-6 h-6 text-amber-500" />,
      color: "border-amber-200 hover:border-amber-500 bg-amber-50/20",
      pillColor: "bg-amber-100 text-amber-800 border-amber-300",
      accent: "bg-amber-500"
    },
    {
      title: "자기존중감 (Self-Esteem)",
      subtitle: "실수해도 괜찮은 내 자신",
      description: "운동 능력이 좀 부족해도 나는 이 교실과 체육 경기에 당당히 참여할 자격이 있습니다. 한 번 실패했다고 주눅 들지 않고 나의 가치와 잠재력을 소중히 생각하는 굳건함입니다.",
      icon: <Smile className="w-6 h-6 text-sky-500" />,
      color: "border-sky-200 hover:border-sky-500 bg-sky-50/20",
      pillColor: "bg-sky-100 text-sky-800 border-sky-300",
      accent: "bg-sky-500"
    },
    {
      title: "갈등해결 (Conflict Resolution)",
      subtitle: "평화롭게 합의점 찾기",
      description: "두 편의 주장과 의견이 대립할 때 무력이나 욕설로 상대를 꺾으려 하지 않고, 경기 규정을 확인하거나 양보와 조율을 통해 다 함께 경기를 다시 즐길 수 있는 창의적인 대안을 제안합니다.",
      icon: <Scale className="w-6 h-6 text-teal-500" />,
      color: "border-teal-200 hover:border-teal-500 bg-teal-50/20",
      pillColor: "bg-teal-100 text-teal-800 border-teal-300",
      accent: "bg-teal-500"
    },
    {
      title: "학교폭력 인식·대처",
      subtitle: "폭력을 방관하지 않는 용기",
      description: "교실이나 운동장에서 친구가 다른 무리에게 소외당하거나 비난을 듣고 있을 때, 침묵하지 않고 '우리 다 같이 하는 체육이잖아'라고 말하며 친구를 안으로 데려올 수 있는 방어자의 용기입니다.",
      icon: <ShieldCheck className="w-6 h-6 text-indigo-500" />,
      color: "border-indigo-200 hover:border-indigo-500 bg-indigo-50/20",
      pillColor: "bg-indigo-100 text-indigo-800 border-indigo-300",
      accent: "bg-indigo-500"
    }
  ];

  return (
    <div className="space-y-10" id="ulim-concept-slide">
      {/* Intro Bold Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-8 relative overflow-hidden border-4 border-slate-900 shadow-[6px_6px_0px_#4f46e5]">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 opacity-15">
          <Dribbble size={260} className="text-indigo-400" />
        </div>
        <div className="relative z-10 space-y-3">
          <span className="px-3 py-1 rounded bg-yellow-400 text-slate-900 border-2 border-slate-900 text-[10px] font-black inline-flex items-center gap-1.5 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> Ulim Core Competencies
          </span>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none">
            갈등을 이기는 6가지 마음 장비 🛡️
          </h2>
          <p className="text-slate-300 text-xs md:text-sm max-w-2xl leading-relaxed font-semibold">
            체육 활동은 몸만 발달시키는 시간이 아닙니다. 친구와 부딪치고 대화하며 성숙한 '어울림'을 훈련하는 시간입니다. 6가지 핵심 가치 카드를 터치하여 그 상세 행동 지침을 직접 읽고 익혀봅시다.
          </p>
        </div>
      </div>

      {/* Grid Cards with bold styling */}
      <div className="space-y-4">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
          <UserCheck className="w-5 h-5 text-indigo-600" /> 어울림 역량 카드 (각 카드를 클릭하세요!)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {competencies.map((comp, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`border-4 border-slate-900 rounded-2xl p-5 cursor-pointer transition-all duration-300 relative overflow-hidden bg-white shadow-[4px_4px_0px_#0f172a] ${
                activeCompetency === idx ? "shadow-[8px_8px_0px_#0f172a] -translate-y-1" : ""
              }`}
              onClick={() => setActiveCompetency(activeCompetency === idx ? null : idx)}
            >
              {/* Top Accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-2 ${comp.accent}`}></div>

              <div className="flex items-start justify-between mb-4 mt-2">
                <div className="p-2 bg-white rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]">
                  {comp.icon}
                </div>
                <span className={`px-2 py-0.5 rounded border-2 text-[9px] font-black uppercase tracking-tight ${comp.pillColor}`}>
                  {comp.title.split(" ")[0]}
                </span>
              </div>

              <h4 className="text-lg font-black text-slate-800 tracking-tight">{comp.title}</h4>
              <p className="text-xs text-slate-500 font-extrabold mb-3 italic">{comp.subtitle}</p>

              {/* Dynamic content transition */}
              <motion.div
                initial={false}
                animate={{ height: activeCompetency === idx ? "auto" : "55px" }}
                className="overflow-hidden"
              >
                <p className="text-xs text-slate-600 leading-relaxed font-bold">
                  {comp.description}
                </p>
              </motion.div>

              <div className="mt-4 pt-3 border-t-2 border-dashed border-slate-100 flex items-center justify-between text-[10px] font-black">
                <span className="text-slate-400">STATUS: READY</span>
                <span className="text-indigo-600 uppercase">
                  {activeCompetency === idx ? "접기 ▲" : "자세히 보기 ▼"}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Extreme Warning Bento for Sport Violence */}
      <div className="bg-white border-4 border-slate-900 rounded-2xl p-6 shadow-[6px_6px_0px_#0f172a] space-y-4">
        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          경고 : 우리가 몰랐던 체육 시간 학교폭력의 실체 🚨
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-rose-50 border-2 border-slate-900 p-5 rounded-xl space-y-2 relative shadow-[3px_3px_0px_#0f172a]">
            <span className="px-2 py-0.5 bg-rose-600 text-white font-black text-[9px] uppercase border-2 border-slate-900 rounded">
              비난은 폭력이다
            </span>
            <h4 className="text-base font-black text-slate-900">“너 때문에 졌어!”</h4>
            <p className="text-xs text-slate-700 leading-relaxed font-semibold">
              실수한 친구에게 인격적인 무시나 지적을 가하는 행위는 이기기 위한 비판이 아닌 엄연한 <strong>'언어폭력(모욕)'</strong>입니다.
            </p>
          </div>

          <div className="bg-yellow-50 border-2 border-slate-900 p-5 rounded-xl space-y-2 relative shadow-[3px_3px_0px_#0f172a]">
            <span className="px-2 py-0.5 bg-yellow-400 text-slate-900 font-black text-[9px] uppercase border-2 border-slate-900 rounded">
              배제는 폭력이다
            </span>
            <h4 className="text-base font-black text-slate-900">“얜 빼고 패스하자”</h4>
            <p className="text-xs text-slate-700 leading-relaxed font-semibold">
              운동 실력이 부족한 친구를 따돌리거나 고의로 경기 참여에서 누락시키는 것은 교묘한 <strong>'관계적 따돌림'</strong>입니다.
            </p>
          </div>

          <div className="bg-slate-50 border-2 border-slate-900 p-5 rounded-xl space-y-2 relative shadow-[3px_3px_0px_#0f172a]">
            <span className="px-2 py-0.5 bg-slate-900 text-white font-black text-[9px] uppercase border-2 border-slate-900 rounded">
              위협은 폭력이다
            </span>
            <h4 className="text-base font-black text-slate-900">“밖으로 나와 한판 뜨자”</h4>
            <p className="text-xs text-slate-700 leading-relaxed font-semibold">
              파울 판정에 눈을 부릅뜨고 덤벼들거나 신체적인 싸움을 도발하는 것은 스포츠가 아니라 형법에 근거하는 <strong>'신체 협박'</strong>입니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
