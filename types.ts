
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  userAnswer?: string;
  isCorrect?: boolean;
}

export type InputType = 'image' | 'text';
export type ActiveResultTab = 'summary' | 'explanation' | 'quiz' | 'mindmap';

export interface GeneratedContent {
  summary: string;
  explanation: string;
  quiz: QuizQuestion[];
  mindMap: string;
}

export interface LoadingStates {
  generating: boolean;
  summary: boolean;
  explanation: boolean;
  quiz: boolean;
  mindMap: boolean;
}

export interface GroundingChunkWeb {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web?: GroundingChunkWeb;
  retrievedContext?: {
    uri: string;
    title: string;
  };
  // Other types of chunks can be added here if needed
}
