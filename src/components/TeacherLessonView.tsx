import React from "react";
import { LESSON_PLAN } from "../data";
import { 
  BookOpen, 
  Clock, 
  Users, 
  Award, 
  Heart, 
  ShieldCheck, 
  Smile, 
  FileText, 
  Map, 
  Target,
  Sparkles
} from "lucide-react";

export default function TeacherLessonView() {
  return (
    <div className="space-y-10" id="teacher-lesson-view">
      {/* Heavy Border Header Banner */}
      <div className="bg-white p-8 border-4 border-slate-900 shadow-[8px_8px_0px_#0f172a] rounded-2xl relative overflow-hidden">
        <div className="absolute right-4 top-4 bg-yellow-400 text-slate-900 font-black text-xs px-3 py-1 uppercase tracking-wider border-2 border-slate-900">
          Curriculum Grade 1
        </div>
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border-2 border-indigo-600 text-xs font-black uppercase text-indigo-700 tracking-tighter">
            <Award className="w-4 h-4" /> 2026학년도 학교폭력 예방 수업지원단 [학예 2단]
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none text-slate-900">
            스포츠맨십과 어울림으로 그리는<br />
            <span className="text-indigo-600 italic underline decoration-yellow-400 decoration-wavy">평화로운 체육 시간 🏆</span>
          </h1>
          <p className="text-slate-600 font-bold text-sm md:text-base max-w-3xl leading-relaxed">
            체육 시간의 과열된 승부욕으로 일어나는 비난, 따돌림, 신체 위협을 예방하기 위한 단기 특화 교실 연계 인성 지도안입니다. <strong>스마트 갈등 시뮬레이션</strong>과 <strong>어울림 역량</strong>을 활용하여 정정당당한 공동체 의식을 함양합니다.
          </p>
        </div>
      </div>

      {/* Target Achievement Standards Card */}
      <div className="bg-indigo-600 text-white p-6 border-4 border-slate-900 shadow-[6px_6px_0px_#0f172a] rounded-2xl space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="bg-yellow-400 text-slate-900 p-1.5 border-2 border-slate-900 font-black">
            <Target className="w-5 h-5 text-slate-900" />
          </div>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">2022 개정 체육과 핵심 성취기준</h2>
        </div>
        
        <div className="bg-slate-900 text-slate-100 p-5 rounded-xl border-2 border-slate-700 space-y-2">
          <span className="text-yellow-400 font-black text-xs uppercase tracking-widest block">[9체02-26] 스포츠 성취기준</span>
          <p className="text-base font-bold leading-relaxed text-indigo-100">
            "스포츠의 연습과 경기 과정에서 구성원 간에 서로 신뢰하며 팀 목표를 달성하기 위해 노력하고 경기 예절을 갖추며 정정당당하게 참여한다."
          </p>
          <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-semibold">
            <span>🎯 핵심 예방 타겟: 언어 폭력(비난), 관계적 따돌림(소외 배제), 신체 도발(위협)</span>
          </div>
        </div>
      </div>

      {/* Profile Overview Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border-4 border-slate-900 p-5 rounded-2xl hover:-translate-y-1 transition-transform shadow-[4px_4px_0px_#0f172a]">
          <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Target Student</div>
          <div className="text-xl font-black text-slate-800">중학교 1학년</div>
          <p className="text-xs font-semibold text-slate-500 mt-1">교실 및 운동장 연계</p>
        </div>

        <div className="bg-white border-4 border-slate-900 p-5 rounded-2xl hover:-translate-y-1 transition-transform shadow-[4px_4px_0px_#0f172a]">
          <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Lesson Time</div>
          <div className="text-xl font-black text-indigo-600 flex items-center gap-1.5">
            <Clock className="w-5 h-5" /> 45분 (1차시)
          </div>
          <p className="text-xs font-semibold text-slate-500 mt-1">중학교 정규 시수 연계</p>
        </div>

        <div className="bg-white border-4 border-slate-900 p-5 rounded-2xl hover:-translate-y-1 transition-transform shadow-[4px_4px_0px_#0f172a]">
          <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Location</div>
          <div className="text-xl font-black text-slate-800 flex items-center gap-1.5">
            <Map className="w-5 h-5 text-indigo-600" /> 일반 교실
          </div>
          <p className="text-xs font-semibold text-slate-500 mt-1">모바일/크롬북 학습 지원</p>
        </div>

        <div className="bg-white border-4 border-slate-900 p-5 rounded-2xl hover:-translate-y-1 transition-transform shadow-[4px_4px_0px_#0f172a]">
          <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Main Tool</div>
          <div className="text-xl font-black text-emerald-600 flex items-center gap-1.5">
            <Sparkles className="w-5 h-5" /> 어울림 앱
          </div>
          <p className="text-xs font-semibold text-slate-500 mt-1">갈등 시뮬레이션 코칭</p>
        </div>
      </div>

      {/* Rationale / Teacher Guidance */}
      <div className="bg-white border-4 border-slate-900 p-6 rounded-2xl shadow-[6px_6px_0px_#0f172a] space-y-4">
        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
          교실에서 실천하는 예방 중심 체육 인성 교육의 필요성
        </h3>
        <div className="text-slate-700 text-xs md:text-sm leading-relaxed space-y-3 font-semibold">
          <p>
            중학교 1학년은 초등학교를 막 졸업하고 새로운 친구 관계를 맺는 과도기입니다. 이때 체육 시간의 실력 편차로 인한 <strong>"비난"</strong>과 <strong>"소외"</strong>는 다른 어떤 교과보다 상처가 크고 깊은 학교폭력의 씨앗이 됩니다.
          </p>
          <p>
            운동장이 아닌 교실에서 스마트 기기를 활용해 가상 갈등을 체험해봄으로써, 학생들은 분노나 짜증에 지배되지 않고 <strong>스포츠맨십</strong>과 <strong>어울림(공감, 나-전달법)</strong>으로 갈등을 종결하는 지혜를 기르게 됩니다.
          </p>
        </div>
      </div>

      {/* Lesson Plan Steps Grid */}
      <div className="space-y-6">
        <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-tighter">
          <FileText className="w-6 h-6 text-indigo-600" /> 45분 교수·학습 지도안 세부 흐름
        </h3>

        <div className="grid grid-cols-1 gap-6">
          {LESSON_PLAN.map((step, idx) => (
            <div 
              key={idx} 
              className="bg-white border-4 border-slate-900 rounded-2xl overflow-hidden hover:shadow-[6px_6px_0px_#4f46e5] transition-all duration-300"
            >
              {/* Header inside border */}
              <div className="bg-slate-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-2 border-b-4 border-slate-900">
                <div className="flex items-center gap-3">
                  <span className="bg-yellow-400 text-slate-900 text-xs font-black px-2.5 py-1 uppercase tracking-tight border-2 border-slate-900">
                    {step.phase}
                  </span>
                  <h4 className="text-lg font-black tracking-tight">{step.title}</h4>
                </div>
                <div className="flex items-center gap-1.5 text-yellow-400 font-black text-sm">
                  <Clock className="w-4 h-4" /> {step.time}
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
                  <div className="space-y-1 bg-indigo-50/50 p-4 rounded-xl border-2 border-indigo-100">
                    <span className="font-black text-indigo-700 uppercase tracking-widest text-[10px] block">🎯 단계별 목표</span>
                    <p className="text-slate-700 font-bold leading-normal">{step.objective}</p>
                  </div>
                  <div className="space-y-1 bg-slate-50 p-4 rounded-xl border-2 border-slate-200">
                    <span className="font-black text-slate-500 uppercase tracking-widest text-[10px] block">🎒 활용 교구</span>
                    <p className="text-slate-600 font-semibold leading-normal">{step.materials}</p>
                  </div>
                </div>

                {/* Sub activities */}
                <div className="bg-slate-900 text-slate-100 p-4 rounded-xl space-y-2">
                  <span className="font-black text-yellow-400 text-xs block uppercase tracking-widest">📝 주요 활동 로드맵</span>
                  <ul className="list-inside space-y-1.5 text-xs text-slate-300 font-medium">
                    {step.activities.map((act, actIdx) => (
                      <li key={actIdx} className="flex items-start gap-2">
                        <span className="text-indigo-400 font-black">✔</span>
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Teacher / Student Interaction */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2 border-t-2 border-dashed border-slate-200">
                  <div className="space-y-1">
                    <span className="font-black text-teal-700 uppercase tracking-tight">👨‍🏫 교사 피드백 및 발문 지도</span>
                    <p className="text-slate-600 font-semibold leading-relaxed bg-teal-50/30 p-3 rounded-lg border-2 border-teal-100">
                      {step.teacherAction}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-black text-sky-700 uppercase tracking-tight">🙋 학생의 자기주도 학습 행동</span>
                    <p className="text-slate-600 font-semibold leading-relaxed bg-sky-50/30 p-3 rounded-lg border-2 border-sky-100">
                      {step.studentAction}
                    </p>
                  </div>
                </div>

                {/* Key Points */}
                <div className="text-xs text-slate-600 bg-amber-50 border-2 border-amber-200 p-3.5 rounded-xl flex items-start gap-2">
                  <span className="text-amber-600 font-black shrink-0">💡 지도상의 유의점:</span>
                  <span className="font-medium leading-normal">{step.keyPoints}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
