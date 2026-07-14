import React, { useState } from "react";
import { SCENARIOS, QUIZ_ITEMS } from "./data";
import { evaluateStudentAnswer } from "./utils/evaluationEngine";
import TeacherLessonView from "./components/TeacherLessonView";
import UlimConceptSlide from "./components/UlimConceptSlide";
import { 
  Award, 
  MessageSquare, 
  Play, 
  CheckCircle, 
  AlertCircle, 
  ChevronRight, 
  User, 
  Send, 
  RefreshCw,
  Trophy,
  Sparkles,
  BookOpen,
  UserCheck,
  Flame,
  XCircle,
  Clock,
  ThumbsUp,
  Download,
  Share2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";

interface Sticker {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
  criterion: string;
}

const STICKERS: Sticker[] = [
  {
    id: "peace-maker",
    title: "평화 해결사",
    description: "갈등 상황에서 차분하게 마음을 전하는 나-전달법을 훌륭히 구사했어요!",
    emoji: "🕊️",
    color: "bg-indigo-500",
    criterion: "갈등 시뮬레이션 완료 (50점 이상)"
  },
  {
    id: "quiz-king",
    title: "어울림 퀴즈왕",
    description: "스포츠맨십과 학교폭력 예방을 위한 핵심 퀴즈 골든벨을 완수했어요!",
    emoji: "🔥",
    color: "bg-yellow-500",
    criterion: "형성평가 퀴즈 완주"
  },
  {
    id: "pledge-hero",
    title: "명예 서약자",
    description: "정정당당한 경기와 서로를 아끼는 마음을 담은 스포츠맨십 서약을 선언했어요!",
    emoji: "🛡️",
    color: "bg-emerald-500",
    criterion: "스포츠맨십 공식 서약"
  }
];

export default function App() {
  // Navigation & Progress State
  const [activeTab, setActiveTab] = useState<"intro" | "competencies" | "simulator" | "quiz_pledge">("intro");
  
  // Simulator State
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("soccer-blame");
  const [studentInput, setStudentInput] = useState<string>("");
  const [evaluationResult, setEvaluationResult] = useState<any | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  // Quiz State
  const [currentQuizIdx, setCurrentQuizIdx] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: any }>({});
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  // Pledge State
  const [studentName, setStudentName] = useState<string>("");
  const [pledgeAction1, setPledgeAction1] = useState<string>("동료가 실수해도 따뜻하게 괜찮아라고 먼저 응원해주겠습니다.");
  const [pledgeAction2, setPledgeAction2] = useState<string>("나와 팀원의 안전을 위해 과격한 신체접촉 대신 룰을 준수하겠습니다.");
  const [isPledged, setIsPledged] = useState<boolean>(false);

  // Praise Sticker States
  const [earnedStickerIds, setEarnedStickerIds] = useState<string[]>([]);
  const [newlyEarnedSticker, setNewlyEarnedSticker] = useState<Sticker | null>(null);

  // Trigger continuous colorful confetti
  const triggerConfetti = () => {
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const interval = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }
      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: ["#6366f1", "#eab308", "#10b981", "#ef4444", "#3b82f6", "#ec4899"]
      });
    }, 200);
  };

  const earnSticker = (stickerId: string) => {
    if (earnedStickerIds.includes(stickerId)) return;
    const sticker = STICKERS.find(s => s.id === stickerId);
    if (sticker) {
      setEarnedStickerIds(prev => [...prev, stickerId]);
      setNewlyEarnedSticker(sticker);
      triggerConfetti();
    }
  };

  // Class Energy dynamic level (starts at 75%, climbs as student completes actions)
  let classEnergy = 60;
  if (evaluationResult) classEnergy += 15;
  if (quizFinished) classEnergy += 15;
  if (isPledged) classEnergy += 10;

  // Handler for evaluation
  const handleEvaluate = () => {
    if (!studentInput.trim()) {
      alert("갈등 대처 대사를 적어주세요!");
      return;
    }
    setIsEvaluating(true);
    setTimeout(() => {
      const scenario = SCENARIOS.find(s => s.id === selectedScenarioId);
      if (scenario) {
        const result = evaluateStudentAnswer(selectedScenarioId, studentInput);
        setEvaluationResult(result);
        if (result.score >= 50) {
          earnSticker("peace-maker");
        }
      }
      setIsEvaluating(false);
    }, 1000);
  };

  // Reset simulator
  const handleResetSimulator = () => {
    setStudentInput("");
    setEvaluationResult(null);
  };

  // Handler for Quiz selection
  const handleSelectQuizAnswer = (answer: any) => {
    const currentQuiz = QUIZ_ITEMS[currentQuizIdx];
    const isCorrect = currentQuiz.answer === answer;
    
    setQuizAnswers({
      ...quizAnswers,
      [currentQuiz.id]: {
        selected: answer,
        isCorrect
      }
    });

    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    }

    // Advance or finish after short delay
    setTimeout(() => {
      if (currentQuizIdx < QUIZ_ITEMS.length - 1) {
        setCurrentQuizIdx(prev => prev + 1);
      } else {
        setQuizFinished(true);
        earnSticker("quiz-king");
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setCurrentQuizIdx(0);
    setQuizAnswers({});
    setQuizScore(0);
    setQuizFinished(false);
  };

  const selectedScenario = SCENARIOS.find(s => s.id === selectedScenarioId) || SCENARIOS[0];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800" id="tp-root">
      
      {/* 1. Header Banner - Strong Bold Theme */}
      <header className="h-20 bg-indigo-600 text-white flex items-center justify-between px-6 sm:px-10 border-b-8 border-slate-900 shadow-lg relative z-10">
        <div className="flex items-center gap-4">
          <div className="bg-white text-indigo-600 font-black text-2xl w-12 h-12 flex items-center justify-center rounded-xl border-4 border-slate-900 shadow-[2px_2px_0px_#000]">
            TP
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tighter italic flex items-center gap-2">
              Together Play <span className="text-yellow-300">스포츠 어울림</span>
            </h1>
            <p className="text-[10px] sm:text-xs font-bold text-indigo-200 tracking-wider">
              2026학년도 학교폭력 예방 수업지원단 [학예 2단]
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Target Grade</p>
            <p className="text-xs font-extrabold">중학교 1학년 체육교과 연계</p>
          </div>
          <div className="bg-slate-900 px-3 py-1.5 rounded border-2 border-slate-700 font-black text-xs text-yellow-400 uppercase tracking-widest animate-pulse">
            Class Mode
          </div>
        </div>
      </header>

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Sidebar - Lesson Tracker */}
        <aside className="w-full lg:w-80 bg-white border-b-4 lg:border-b-0 lg:border-r-4 border-slate-950 p-6 flex flex-col justify-between shrink-0">
          <div className="space-y-6">
            <h2 className="text-3xl font-black mb-6 leading-none border-b-4 border-indigo-600 pb-2 uppercase tracking-tighter">
              Lesson<br />Flow
            </h2>
            
            {/* Step 1: Intro */}
            <button 
              onClick={() => setActiveTab("intro")}
              className={`w-full text-left flex gap-4 items-start p-3 rounded-xl transition-all duration-200 border-2 ${
                activeTab === "intro" 
                  ? "bg-indigo-50 border-slate-900 shadow-[3px_3px_0px_#000]" 
                  : "border-transparent hover:bg-slate-50"
              }`}
            >
              <span className={`text-3xl font-black ${activeTab === "intro" ? "text-indigo-600" : "text-slate-300"}`}>01</span>
              <div>
                <p className="font-black text-sm leading-tight text-slate-800">도입: 성취기준 매핑</p>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5">교수학습과정안 & 인트로 (8분)</p>
              </div>
            </button>

            {/* Step 2: Competency */}
            <button 
              onClick={() => setActiveTab("competencies")}
              className={`w-full text-left flex gap-4 items-start p-3 rounded-xl transition-all duration-200 border-2 ${
                activeTab === "competencies" 
                  ? "bg-indigo-50 border-slate-900 shadow-[3px_3px_0px_#000]" 
                  : "border-transparent hover:bg-slate-50"
              }`}
            >
              <span className={`text-3xl font-black ${activeTab === "competencies" ? "text-indigo-600" : "text-slate-300"}`}>02</span>
              <div>
                <p className="font-black text-sm leading-tight text-slate-800">전개 1: 어울림 핵심 역량</p>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5">6대 도구 가치 알아보기 (7분)</p>
              </div>
            </button>

            {/* Step 3: Simulator */}
            <button 
              onClick={() => setActiveTab("simulator")}
              className={`w-full text-left flex gap-4 items-start p-3 rounded-xl transition-all duration-200 border-2 ${
                activeTab === "simulator" 
                  ? "bg-indigo-50 border-slate-900 shadow-[3px_3px_0px_#000]" 
                  : "border-transparent hover:bg-slate-50"
              }`}
            >
              <span className={`text-3xl font-black ${activeTab === "simulator" ? "text-indigo-600" : "text-slate-300"}`}>03</span>
              <div>
                <p className="font-black text-sm leading-tight text-slate-800 flex items-center gap-1">
                  전개 2: 갈등 시뮬레이션
                  {evaluationResult && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                </p>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5">축구·피구·농구 대처법 (15분)</p>
              </div>
            </button>

            {/* Step 4: Quiz & Pledge */}
            <button 
              onClick={() => setActiveTab("quiz_pledge")}
              className={`w-full text-left flex gap-4 items-start p-3 rounded-xl transition-all duration-200 border-2 ${
                activeTab === "quiz_pledge" 
                  ? "bg-indigo-50 border-slate-900 shadow-[3px_3px_0px_#000]" 
                  : "border-transparent hover:bg-slate-50"
              }`}
            >
              <span className={`text-3xl font-black ${activeTab === "quiz_pledge" ? "text-indigo-600" : "text-slate-300"}`}>04</span>
              <div>
                <p className="font-black text-sm leading-tight text-slate-800">정리: 퀴즈 & 스포츠 서약</p>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5">평가 및 다짐 카드 획득 (15분)</p>
              </div>
            </button>
          </div>

          {/* Sidebar Section: Sticker Book */}
          <div className="p-4 bg-amber-50 border-4 border-slate-950 rounded-2xl shadow-[4px_4px_0px_#000] space-y-3 mt-4">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" /> 나의 칭찬 스티커 북
              <span className="ml-auto text-[10px] bg-slate-900 text-white px-1.5 py-0.5 rounded font-black">
                {earnedStickerIds.length} / {STICKERS.length}
              </span>
            </h3>
            
            <div className="grid grid-cols-3 gap-2">
              {STICKERS.map((sticker) => {
                const isEarned = earnedStickerIds.includes(sticker.id);
                return (
                  <div 
                    key={sticker.id}
                    className={`relative aspect-square flex flex-col items-center justify-center rounded-xl border-2 transition-all group ${
                      isEarned 
                        ? `${sticker.color} border-slate-900 shadow-[2px_2px_0px_#000] cursor-pointer scale-100 hover:scale-105` 
                        : "bg-slate-100 border-slate-200 opacity-45 grayscale"
                    }`}
                  >
                    <span className="text-2xl">{sticker.emoji}</span>
                    <span className="text-[9px] font-black tracking-tight text-slate-900 mt-1 block max-w-full truncate px-1">
                      {sticker.title}
                    </span>
                    
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-900 text-white text-[9px] p-2 rounded-lg font-bold shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50 leading-relaxed border border-slate-700">
                      <p className="font-black text-yellow-400">{sticker.title}</p>
                      <p className="mt-0.5 text-slate-300">{sticker.description}</p>
                      <p className="mt-1 text-[8px] text-slate-400 italic font-medium">{sticker.criterion}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar Bottom: Class Energy Board */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl border-4 border-slate-950 mt-4 shadow-[4px_4px_0px_#000]">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Class Energy</span>
              <span className="text-xl font-black text-yellow-400">{classEnergy}%</span>
            </div>
            <div className="h-4 bg-slate-800 rounded-full overflow-hidden border-2 border-slate-700">
              <div 
                className="h-full bg-indigo-500 transition-all duration-500"
                style={{ width: `${classEnergy}%` }}
              ></div>
            </div>
            <p className="text-[9px] text-slate-400 mt-2 font-medium">
              * 학생들이 탭을 학습하고 서약서를 완성할수록 교실 폭력 예방 지수가 상승합니다.
            </p>
          </div>
        </aside>

        {/* Right Active Interaction Container */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-8">
          
          {/* Header Action Indicator */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-4 border-slate-900 pb-6">
            <div>
              <span className="bg-yellow-400 text-slate-900 font-black text-[10px] px-2 py-0.5 uppercase border-2 border-slate-900 rounded tracking-wider">
                Active Chapter
              </span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none text-slate-900 mt-1">
                {activeTab === "intro" && "01. 지도안 & 성취기준"}
                {activeTab === "competencies" && "02. 어울림 6대 역량"}
                {activeTab === "simulator" && "03. 갈등 극복 시뮬레이션"}
                {activeTab === "quiz_pledge" && "04. 어울림 퀴즈 & 서약"}
              </h2>
            </div>

            {/* Quick action button */}
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  if (activeTab === "intro") setActiveTab("competencies");
                  else if (activeTab === "competencies") setActiveTab("simulator");
                  else if (activeTab === "simulator") setActiveTab("quiz_pledge");
                  else setActiveTab("intro");
                }}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black uppercase text-xs tracking-wider rounded-lg border-2 border-slate-900 shadow-[3px_3px_0px_#000] flex items-center gap-1.5 transition-transform active:translate-x-0.5 active:translate-y-0.5"
              >
                Next Step <ChevronRight className="w-4 h-4 text-yellow-400" />
              </button>
            </div>
          </div>

          {/* Dynamic Render Section based on active tab */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              {activeTab === "intro" && <TeacherLessonView />}
              
              {activeTab === "competencies" && <UlimConceptSlide />}
              
              {activeTab === "simulator" && (
                <div className="space-y-8 max-w-5xl mx-auto">
                  
                  {/* Scenario selection bar */}
                  <div className="bg-white border-4 border-slate-900 p-5 rounded-2xl shadow-[4px_4px_0px_#000] space-y-4">
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-indigo-600" /> 시합 갈등 시나리오 선택 (중학교 1학년 맞춤형 상황)
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {SCENARIOS.map((scenario) => (
                        <button
                          key={scenario.id}
                          onClick={() => {
                            setSelectedScenarioId(scenario.id);
                            handleResetSimulator();
                          }}
                          className={`p-4 border-2 rounded-xl text-left transition-all duration-200 relative overflow-hidden ${
                            selectedScenarioId === scenario.id 
                              ? "bg-indigo-50/80 border-indigo-600 shadow-md" 
                              : "border-slate-200 bg-white hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{scenario.icon}</span>
                            <div>
                              <h4 className="font-black text-sm text-slate-800">{scenario.title}</h4>
                              <p className="text-[10px] font-bold text-slate-400">{scenario.tag}</p>
                            </div>
                          </div>
                          {selectedScenarioId === scenario.id && (
                            <div className="absolute right-2 top-2 bg-indigo-600 text-white rounded-full p-0.5">
                              <CheckCircle className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Simulator Area split in Webtoon Dialogue & Answer box */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Left: Interactive Dialogue Webtoon (5 columns) */}
                    <div className="lg:col-span-5 bg-white border-4 border-slate-900 rounded-2xl p-6 shadow-[5px_5px_0px_#000] flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="border-b-2 border-slate-200 pb-2">
                          <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 font-black text-[9px] uppercase tracking-wider rounded">
                            {selectedScenario.tag}
                          </span>
                          <h4 className="text-base font-black text-slate-900 mt-1">{selectedScenario.title}</h4>
                        </div>
                        
                        <p className="text-xs font-bold text-slate-500 leading-normal">
                          {selectedScenario.description}
                        </p>

                        {/* Speech Bubbles */}
                        <div className="space-y-4 pt-4 border-t border-slate-100">
                          {selectedScenario.dialogue.map((line, lIdx) => (
                            <div 
                              key={lIdx} 
                              className={`flex gap-3 items-start ${line.side === "right" ? "flex-row-reverse" : ""}`}
                            >
                              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl border-2 border-slate-900 shadow-[1px_1px_0px_#000]">
                                {line.avatar}
                              </div>
                              <div className="max-w-[75%] space-y-0.5">
                                <span className="text-[10px] font-black text-slate-400 block px-1">
                                  {line.speaker}
                                </span>
                                <div className={`p-3 rounded-2xl border-2 border-slate-900 text-xs font-bold leading-normal relative ${
                                  line.side === "right" 
                                    ? "bg-indigo-600 text-white rounded-tr-none" 
                                    : "bg-slate-50 text-slate-800 rounded-tl-none shadow-[2px_2px_0px_#000]"
                                }`}>
                                  {line.text}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 p-3 bg-yellow-50 border-2 border-yellow-200 rounded-xl text-[10px] text-yellow-800 font-bold flex items-start gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-yellow-600" />
                        <span>친구의 거친 비난과 강한 따돌림 상황에서 상대의 감정을 존중하며 나-전달법(I-Message)을 시도해보세요.</span>
                      </div>
                    </div>

                    {/* Right: Answer & Dynamic Evaluation (7 columns) */}
                    <div className="lg:col-span-7 flex flex-col gap-6">
                      
                      {/* Form block */}
                      <div className="bg-white border-4 border-slate-900 p-6 rounded-2xl shadow-[5px_5px_0px_#000] space-y-4">
                        <h4 className="text-lg font-black text-slate-900 flex items-center gap-1.5 uppercase">
                          <User className="w-5 h-5 text-indigo-600" /> 어울림 대처 방안 작성하기
                        </h4>
                        
                        <p className="text-xs font-bold text-slate-600 leading-normal bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                          <strong>💡 미션 질문:</strong> {selectedScenario.reflectionPrompt}
                        </p>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">상대방에게 건넬 나의 대답</label>
                          <textarea
                            value={studentInput}
                            onChange={(e) => setStudentInput(e.target.value)}
                            disabled={!!evaluationResult}
                            placeholder={selectedScenario.placeholderText}
                            rows={4}
                            className="w-full p-4 border-2 border-slate-900 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50"
                          />
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                          {evaluationResult ? (
                            <button
                              onClick={handleResetSimulator}
                              className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-black text-xs uppercase tracking-wider rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_#000] flex items-center gap-1.5"
                            >
                              <RefreshCw className="w-4 h-4" /> 다른 답변 적기
                            </button>
                          ) : (
                            <button
                              onClick={handleEvaluate}
                              disabled={isEvaluating}
                              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-lg border-2 border-slate-900 shadow-[3px_3px_0px_#000] flex items-center gap-1.5 transition-transform active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
                            >
                              {isEvaluating ? (
                                <>분석 중...</>
                              ) : (
                                <>
                                  평가 완료하기 <Send className="w-4 h-4 text-yellow-300" />
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* AI Empathy Coach Result Block */}
                      {evaluationResult && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-slate-900 text-white border-4 border-slate-900 p-6 rounded-2xl shadow-[5px_5px_0px_#000] space-y-4"
                        >
                          <div className="flex justify-between items-center border-b-2 border-slate-800 pb-3">
                            <div className="flex items-center gap-2">
                              <Trophy className="w-5 h-5 text-yellow-400" />
                              <h4 className="text-base font-black text-indigo-400 uppercase tracking-tight">
                                어울림 지수 평가서
                              </h4>
                            </div>
                            <div className="bg-yellow-400 text-slate-900 px-3 py-1 font-black rounded border-2 border-slate-900 text-base">
                              {evaluationResult.score} / 100 점
                            </div>
                          </div>

                          <div className="space-y-4 text-xs">
                            <div className="space-y-1 bg-slate-800/60 p-3 rounded-lg border border-slate-800">
                              <span className="font-black text-indigo-400 text-[10px] tracking-wider uppercase block">
                                💬 총평 (Summary)
                              </span>
                              <p className="font-bold text-slate-100 leading-relaxed text-sm">
                                "{evaluationResult.summary}"
                              </p>
                            </div>

                            {/* 나-전달법(I-Message) 정밀 분석 결과 표시 */}
                            {evaluationResult.iMessageAnalysis && (
                              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-750 space-y-3">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700 pb-2">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-sm">📢</span>
                                    <h5 className="font-black text-indigo-300 text-xs sm:text-sm">
                                      나-전달법(I-Message) 정밀 분석
                                    </h5>
                                  </div>
                                  <span className={`text-[9px] font-black px-2 py-0.5 rounded border leading-none ${
                                    evaluationResult.iMessageAnalysis.level === "excellent"
                                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                      : evaluationResult.iMessageAnalysis.level === "good"
                                      ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
                                      : evaluationResult.iMessageAnalysis.level === "developing"
                                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                                      : "bg-rose-500/20 text-rose-300 border-rose-500/40"
                                  }`}>
                                    도달도: {evaluationResult.iMessageAnalysis.levelKorean}
                                  </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                  {Object.entries(evaluationResult.iMessageAnalysis.elements).map(([key, value]: [string, any]) => (
                                    <div 
                                      key={key} 
                                      className={`p-2 rounded-lg border text-[11px] font-bold ${
                                        value.checked 
                                          ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-100" 
                                          : "bg-slate-900/60 border-slate-800 text-slate-400"
                                      }`}
                                    >
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="font-black">{value.name}</span>
                                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-black leading-none ${
                                          value.checked ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-500"
                                        }`}>
                                          {value.checked ? "통과 ✔" : "미반영 ✖"}
                                        </span>
                                      </div>
                                      <p className={`text-[10px] font-medium leading-normal ${value.checked ? "text-emerald-300" : "text-slate-500"}`}>
                                        {value.checked ? value.detectedText : "키워드가 감지되지 않았습니다."}
                                      </p>
                                      <p className="text-[9px] text-slate-500 font-medium leading-normal mt-1 border-t border-slate-800/80 pt-1">
                                        {value.explanation}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                                <p className="text-[9px] text-slate-400 font-bold leading-normal">
                                  💡 * 나-전달법은 행동, 영향, 감정, 요청의 4가지를 유기적으로 표현할 때 최고의 평화 소통 효과를 발휘합니다.
                                </p>
                              </div>
                            )}

                            <div className="space-y-1">
                              <span className="font-black text-emerald-400 text-[10px] tracking-wider uppercase block">
                                👍 칭찬할 점 (Strengths)
                              </span>
                              <p className="font-bold text-slate-300 leading-relaxed">
                                {evaluationResult.strengths}
                              </p>
                            </div>

                            <div className="space-y-1">
                              <span className="font-black text-amber-400 text-[10px] tracking-wider uppercase block">
                                🤔 깊이 생각해볼 점 (Further Reflection)
                              </span>
                              <p className="font-bold text-slate-300 leading-relaxed">
                                {evaluationResult.reflections}
                              </p>
                            </div>

                            <div className="space-y-1">
                              <span className="font-black text-rose-400 text-[10px] tracking-wider uppercase block">
                                🏃 스포츠 행동 처방 지침 (Next Action Guide)
                              </span>
                              <p className="font-bold text-slate-300 leading-relaxed bg-slate-800/40 p-3 rounded-lg border border-dashed border-slate-700">
                                {evaluationResult.advice}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}

                    </div>
                  </div>
                </div>
              )}

              {activeTab === "quiz_pledge" && (
                <div className="space-y-10 max-w-5xl mx-auto">
                  
                  {/* Two Part 정리: 1. Quiz 2. Pledge Card */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Left: OX / Choice 어울림 퀴즈 (5 columns) */}
                    <div className="lg:col-span-5 bg-white border-4 border-slate-900 rounded-2xl p-6 shadow-[5px_5px_0px_#000] flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="border-b-2 border-slate-200 pb-2">
                          <span className="px-2 py-0.5 bg-yellow-400 text-slate-900 font-black text-[9px] uppercase tracking-wider rounded border border-slate-900">
                            어울림 가치 형성 평가
                          </span>
                          <h4 className="text-base font-black text-slate-900 mt-1">스포츠맨십 & 학교폭력 예방 퀴즈</h4>
                        </div>

                        {!quizFinished ? (
                          <div className="space-y-4">
                            {/* Quiz counter */}
                            <div className="flex justify-between items-center text-xs text-slate-400 font-black">
                              <span>QUESTION {currentQuizIdx + 1} / {QUIZ_ITEMS.length}</span>
                              <span className="text-indigo-600">성공 지수 +{Math.round(100 / QUIZ_ITEMS.length)}%</span>
                            </div>

                            <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-xl border-2 border-slate-200">
                              {QUIZ_ITEMS[currentQuizIdx].question}
                            </p>

                            {/* Option list based on type */}
                            <div className="space-y-2 pt-2">
                              {QUIZ_ITEMS[currentQuizIdx].type === "ox" ? (
                                <div className="grid grid-cols-2 gap-4">
                                  <button
                                    onClick={() => handleSelectQuizAnswer("O")}
                                    className="py-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-black text-xl rounded-xl border-2 border-emerald-500 shadow-sm transition-all"
                                  >
                                    O
                                  </button>
                                  <button
                                    onClick={() => handleSelectQuizAnswer("X")}
                                    className="py-4 bg-rose-50 hover:bg-rose-100 text-rose-800 font-black text-xl rounded-xl border-2 border-rose-500 shadow-sm transition-all"
                                  >
                                    X
                                  </button>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  {QUIZ_ITEMS[currentQuizIdx].options?.map((opt, oIdx) => (
                                    <button
                                      key={oIdx}
                                      onClick={() => handleSelectQuizAnswer(oIdx)}
                                      className="w-full text-left p-3 border-2 border-slate-900 bg-white hover:bg-slate-50 font-bold text-xs rounded-xl shadow-sm transition-all"
                                    >
                                      {opt}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Showing check of previous question if already selected */}
                            {quizAnswers[QUIZ_ITEMS[currentQuizIdx].id] && (
                              <div className={`p-3 rounded-xl border text-xs font-bold ${
                                quizAnswers[QUIZ_ITEMS[currentQuizIdx].id].isCorrect
                                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                  : "bg-rose-50 border-rose-200 text-rose-700"
                              }`}>
                                <div className="flex items-center gap-1.5 mb-1 font-black">
                                  {quizAnswers[QUIZ_ITEMS[currentQuizIdx].id].isCorrect ? (
                                    <>🎉 정답입니다!</>
                                  ) : (
                                    <>😢 틀렸습니다.</>
                                  )}
                                </div>
                                <p className="leading-relaxed">{QUIZ_ITEMS[currentQuizIdx].explanation}</p>
                              </div>
                            )}

                          </div>
                        ) : (
                          <div className="space-y-4 text-center py-6">
                            <Trophy className="w-14 h-14 text-yellow-400 mx-auto animate-bounce" />
                            <h5 className="text-lg font-black text-slate-900">어울림 골든벨 완주!</h5>
                            <div className="bg-slate-900 text-yellow-400 p-4 rounded-xl border-2 border-slate-700 font-black text-2xl">
                              {Math.round((quizScore / QUIZ_ITEMS.length) * 100)} 점
                            </div>
                            <p className="text-xs font-semibold text-slate-500 leading-normal">
                              골격 있는 체육 인성 개념을 아주 성실히 이수해내었습니다. 다음으로 나만의 스포츠맨십 서약 카드를 작성해 완성합시다!
                            </p>
                            <button
                              onClick={resetQuiz}
                              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs border-2 border-slate-900 rounded-lg shadow-sm"
                            >
                              퀴즈 다시 풀기
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="text-[10px] text-slate-400 font-semibold border-t border-slate-100 pt-4 mt-4">
                        * 퀴즈는 총 {QUIZ_ITEMS.length}문항으로 구성되어 있으며 스포츠 배려 개념을 평가합니다.
                      </div>
                    </div>

                    {/* Right: 스포츠맨십 서약 카드 발급기 (7 columns) */}
                    <div className="lg:col-span-7 bg-white border-4 border-slate-900 rounded-2xl p-6 shadow-[5px_5px_0px_#000] space-y-6">
                      <div className="border-b-2 border-slate-200 pb-2">
                        <span className="px-2 py-0.5 bg-indigo-600 text-white font-black text-[9px] uppercase tracking-wider rounded">
                          스포츠맨십 서약기
                        </span>
                        <h4 className="text-xl font-black text-slate-900 mt-1">공식 스포츠맨십 다짐 라이선스</h4>
                      </div>

                      <div className="space-y-4 text-xs">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="font-black text-slate-500">학생 이름 서명</label>
                            <input
                              type="text"
                              value={studentName}
                              onChange={(e) => setStudentName(e.target.value)}
                              placeholder="예: 홍길동"
                              className="w-full p-2.5 border-2 border-slate-900 rounded-lg text-xs font-bold"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-black text-slate-500">지킬 행동 1 (언어/배려)</label>
                            <select
                              value={pledgeAction1}
                              onChange={(e) => setPledgeAction1(e.target.value)}
                              className="w-full p-2.5 border-2 border-slate-900 rounded-lg text-xs font-bold"
                            >
                              <option value="동료가 실수해도 따뜻하게 괜찮아라고 먼저 응원해주겠습니다.">
                                동료가 실수해도 '괜찮아'라고 응원하기
                              </option>
                              <option value="경기 결과에 승복하고 이긴 팀에 먼저 다가가 축하의 악수를 청하겠습니다.">
                                경기 결과 인정하고 축하해 주기
                              </option>
                              <option value="비난형 발언이 나오려 할 때 입을 다물고 심호흡 3초를 세겠습니다.">
                                비난을 멈추고 3초 심호흡하기
                              </option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="font-black text-slate-500">지킬 행동 2 (협동/안전)</label>
                          <select
                            value={pledgeAction2}
                            onChange={(e) => setPledgeAction2(e.target.value)}
                            className="w-full p-2.5 border-2 border-slate-900 rounded-lg text-xs font-bold"
                          >
                            <option value="나와 팀원의 안전을 위해 과격한 신체접촉 대신 룰을 준수하겠습니다.">
                              과격한 신체 부딪침 자제하고 룰 지키기
                            </option>
                            <option value="팀에 실력이 서툰 친구가 있다면 먼저 패스하고 외야 공간을 마련해주겠습니다.">
                              실력 서툰 친구에게 먼저 기회 양보하기
                            </option>
                            <option value="친구가 다른 무리에게 소외당해 외로워할 때 가장 먼저 어깨동무해주겠습니다.">
                              소외된 친구에게 다가가 방어자 되어주기
                            </option>
                          </select>
                        </div>

                        <div className="flex justify-end pt-2">
                          <button
                            onClick={() => {
                              if (!studentName.trim()) {
                                alert("서약서에 명시할 이름을 입력해주세요!");
                                return;
                              }
                              setIsPledged(true);
                              earnSticker("pledge-hero");
                            }}
                            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest rounded-lg border-2 border-slate-900 shadow-[3px_3px_0px_#000] flex items-center gap-1.5 transition-transform active:translate-x-0.5 active:translate-y-0.5"
                          >
                            서약 라이선스 생성하기 <UserCheck className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Display Pledge Card License when pressed */}
                      {isPledged && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-6 bg-slate-900 text-white border-4 border-slate-900 rounded-2xl relative overflow-hidden shadow-[6px_6px_0px_#059669]"
                        >
                          {/* Watermark logo */}
                          <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-5 text-emerald-400">
                            <Trophy size={180} />
                          </div>

                          <div className="text-center space-y-4 relative z-10">
                            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-black uppercase tracking-widest rounded">
                              Official Sportsmanship Card
                            </div>

                            <h5 className="text-xl font-black uppercase tracking-tighter leading-none italic text-emerald-400">
                              스포츠맨십 준수 서약 카드
                            </h5>

                            <div className="py-4 border-y-2 border-dashed border-slate-800 space-y-3 text-left">
                              <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                                위 학생 <span className="text-white font-black text-sm bg-indigo-600 px-2 py-0.5 rounded border border-slate-700">{studentName}</span>은 2022 개정 교육과정 체육교과 성취기준 <span className="text-yellow-400 font-extrabold">[9체02-26]</span>을 적극 받들어, 향후 이어지는 모든 체육 시합과 훈련 과정에서 아래의 스포츠 어울림 행동 약속을 철저히 준수하여 정정당당한 학급 공동체를 만들 것을 엄숙히 다짐하고 서명합니다.
                              </p>

                              <div className="space-y-1.5 pl-2 text-xs">
                                <div className="flex items-start gap-1.5 font-bold text-slate-100">
                                  <span className="text-emerald-500 font-black">1.</span>
                                  <span>{pledgeAction1}</span>
                                </div>
                                <div className="flex items-start gap-1.5 font-bold text-slate-100">
                                  <span className="text-emerald-500 font-black">2.</span>
                                  <span>{pledgeAction2}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-between items-center text-[10px] text-slate-500 font-black pt-1">
                              <span>발급단체: 예방교육 수업지원단</span>
                              <span className="text-emerald-400">서명 날인 완료 ✔</span>
                            </div>

                            <div className="flex justify-center gap-2 pt-2">
                              <button 
                                onClick={() => alert("서약서 카드가 학생 기기 보관함(Local)에 성공적으로 저장되었습니다.")}
                                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-[10px] rounded border border-slate-700 flex items-center gap-1"
                              >
                                <Download className="w-3 h-3 text-emerald-400" /> 다운로드
                              </button>
                              <button 
                                onClick={() => alert("서약 링크가 학급 전체 게시판 및 교사용 보드에 공유되었습니다.")}
                                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-[10px] rounded border border-slate-700 flex items-center gap-1"
                              >
                                <Share2 className="w-3 h-3 text-indigo-400" /> 교사에게 공유
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}

                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* 3. Bottom Teacher Guidance bar - Bold typography style */}
          <div className="bg-white rounded-2xl p-5 shadow-inner flex flex-col md:flex-row items-center gap-6 border-4 border-slate-900 shadow-[4px_4px_0px_#000]">
            <div className="w-14 h-14 bg-indigo-600 border-2 border-slate-900 flex items-center justify-center rounded-xl shrink-0 shadow-[2px_2px_0px_#000]">
              <span className="text-white font-black text-2xl">?</span>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h6 className="text-xs font-black uppercase text-indigo-600 tracking-tighter">예방교육 지원단 교사 꿀팁 (Guidance)</h6>
              <p className="text-xs sm:text-sm font-bold text-slate-700 mt-1 leading-normal">
                {activeTab === "intro" && "성취기준 [9체02-26]과 45분 시간 분배를 강조하세요. 교실 안에서 단순 놀이가 학교폭력이 되는 과정을 마주보게 하는 단계입니다."}
                {activeTab === "competencies" && "카드를 직접 터치하여 상세 어울림 가치를 설명하세요. 언어폭력과 배제, 신체도발이라는 3대 금지 조항을 칠판에 적어두면 좋습니다."}
                {activeTab === "simulator" && "모둠원끼리 서로의 태블릿 답변을 교환하게 하여, 가장 따뜻하고 배려적인 한마디를 보낸 우수 공감왕을 골라 추가 칭찬 스티커를 배부하세요."}
                {activeTab === "quiz_pledge" && "골든벨 퀴즈를 성실하게 완수한 후, 실천 가짐이 담긴 다짐 카드를 생성하도록 하세요. 이 카드를 저장해 다음 실기 수업 시간 체육 조끼에 핀으로 직접 착용하도록 하면 효과적입니다."}
              </p>
            </div>
            <button 
              onClick={() => {
                if (activeTab === "intro") setActiveTab("competencies");
                else if (activeTab === "competencies") setActiveTab("simulator");
                else if (activeTab === "simulator") setActiveTab("quiz_pledge");
                else setActiveTab("intro");
              }}
              className="px-6 py-3.5 bg-indigo-600 text-white font-black uppercase tracking-widest text-xs rounded-xl border-2 border-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-[3px_3px_0px_#000]"
            >
              Next Activity
            </button>
          </div>

        </main>
      </div>

      {/* 4. Celebrate Praise Sticker Modal Overlay */}
      <AnimatePresence>
        {newlyEarnedSticker && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50"
            id="sticker-modal"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0, transition: { type: "spring", damping: 15 } }}
              exit={{ scale: 0.8, y: 50 }}
              className="bg-white border-4 border-slate-950 p-6 sm:p-8 rounded-3xl max-w-sm w-full text-center space-y-6 shadow-[8px_8px_0px_#000] relative overflow-hidden"
            >
              {/* Spinning background effect */}
              <div className="absolute -inset-10 bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-yellow-100/40 via-transparent to-transparent animate-spin duration-1000 opacity-80 pointer-events-none" />

              <div className="space-y-2 relative z-10">
                <span className="bg-yellow-400 text-slate-900 border-2 border-slate-950 px-3 py-1 text-[10px] font-black tracking-widest uppercase rounded-full inline-block shadow-[2px_2px_0px_#000]">
                  칭찬 스티커 대획득! 🎉
                </span>
                <h3 className="text-2xl font-black text-slate-950">참 잘했어요!</h3>
                <p className="text-xs font-bold text-slate-500 leading-normal">
                  어울림 가치 훈련을 모범적으로 실천하여 아래의 공식 칭찬 스티커를 획득했습니다.
                </p>
              </div>

              {/* Big Sticker Badge */}
              <div className="flex justify-center py-4 relative z-10">
                <motion.div 
                  initial={{ rotate: -15, scale: 0.5 }}
                  animate={{ rotate: 0, scale: 1, transition: { delay: 0.2, type: "spring" } }}
                  className={`${newlyEarnedSticker.color} w-36 h-36 rounded-full border-4 border-slate-950 shadow-[4px_4px_0px_#000] flex flex-col items-center justify-center relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
                  <span className="text-6xl animate-bounce duration-1000">{newlyEarnedSticker.emoji}</span>
                  <span className="absolute bottom-3 bg-white text-slate-950 font-black text-[9px] px-2 py-0.5 border-2 border-slate-950 rounded shadow-[1px_1px_0px_#000] uppercase tracking-tight">
                    {newlyEarnedSticker.title}
                  </span>
                </motion.div>
              </div>

              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border-2 border-slate-950 text-left relative z-10">
                <h4 className="font-black text-sm text-slate-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" /> {newlyEarnedSticker.title}
                </h4>
                <p className="text-xs font-bold text-slate-600 leading-relaxed">
                  {newlyEarnedSticker.description}
                </p>
                <div className="text-[10px] text-indigo-600 font-extrabold flex items-center gap-1">
                  <span>🎯 획득 조건:</span>
                  <span>{newlyEarnedSticker.criterion}</span>
                </div>
              </div>

              <button
                onClick={() => setNewlyEarnedSticker(null)}
                className="w-full py-3 bg-slate-950 hover:bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-xl border-2 border-slate-950 shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all relative z-10"
              >
                스티커 북에 저장하고 닫기
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
