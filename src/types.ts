export interface DialogueLine {
  speaker: string;
  avatar: string;
  text: string;
  side: "left" | "right";
}

export interface Scenario {
  id: string;
  title: string;
  icon: string;
  tag: string;
  conflictType: string;
  description: string;
  dialogue: DialogueLine[];
  reflectionPrompt: string;
  placeholderText: string;
}

export interface IMessageElement {
  checked: boolean;
  name: string;
  detectedText: string;
  explanation: string;
}

export interface IMessageAnalysis {
  hasBehavior: boolean;
  hasEffect: boolean;
  hasFeeling: boolean;
  hasRequest: boolean;
  level: "excellent" | "good" | "developing" | "weak";
  levelKorean: string;
  scoreContribution: number;
  elements: {
    behavior: IMessageElement;
    effect: IMessageElement;
    feeling: IMessageElement;
    request: IMessageElement;
  };
}

export interface EvaluationResponse {
  score: number;
  summary: string;
  strengths: string;
  reflections: string;
  advice: string;
  isDemo?: boolean;
  warning?: string;
  iMessageAnalysis?: IMessageAnalysis;
}

export interface LessonSegment {
  phase: "도입" | "전개" | "정리";
  title: string;
  time: string;
  objective: string;
  teacherAction: string;
  studentAction: string;
  materials: string;
  keyPoints: string;
  activities: string[];
}

export interface QuizItem {
  id: number;
  type: "ox" | "choice";
  question: string;
  options?: string[];
  answer: "O" | "X" | number;
  explanation: string;
}
