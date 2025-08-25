export interface Word {
  id: string;
  english: string;
  korean: string;
  romanization?: string;
  theme: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed?: Date;
  correctCount: number;
  incorrectCount: number;
  streak: number;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  color: string;
  wordCount: number;
}

export interface Session {
  id: string;
  type: 'english-to-korean' | 'korean-to-english';
  theme: string;
  words: Word[];
  score: number;
  totalWords: number;
  completedAt?: Date;
  duration: number;
}

export interface UserProgress {
  totalPoints: number;
  currentStreak: number;
  bestStreak: number;
  sessionsCompleted: number;
  wordsLearned: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress: number;
  target: number;
}

export type AppView = 'dashboard' | 'practice' | 'words' | 'progress' | 'settings';