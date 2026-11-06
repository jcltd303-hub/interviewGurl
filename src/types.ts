export type TabType = 'copilot' | 'rag' | 'mock' | 'questions' | 'analytics' | 'settings';

export interface SuggestedAnswer {
  title: string;
  headlineScript: string;
  bulletPoints: string[];
  codeSnippet?: string;
}

export interface SentimentData {
  score: number; // -100 to 100
  label: 'Confident' | 'Neutral' | 'Nervous' | 'Rambling' | 'Hesitant';
  advice: string;
}

export interface PacingData {
  wpm: number;
  fillerWordsDetected: string[];
  critique: string;
}

export interface TranscriptItem {
  id: string;
  speaker: 'Interviewer' | 'You';
  text: string;
  timestamp: string;
}

export interface InterviewConfig {
  role: string;
  companyName: string;
  jobDescription: string;
  resume: string;
  isRAGIndexed?: boolean;
  indexedAt?: number;
  ragStats?: {
    totalChunks: number;
    resumeChunks: number;
    jdChunks: number;
    extractedSkills: string[];
  };
}
