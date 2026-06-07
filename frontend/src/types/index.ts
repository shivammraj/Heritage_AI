export type Theme = 'spirit' | 'food' | 'festival' | 'nature' | 'architecture';
export type Region = 'north' | 'south' | 'east' | 'west' | 'central' | 'northeast';

export interface State {
  id: string;
  name: string;
  capital: string;
  demonym: string;
  language: string;
  aliases: string[];
  region: Region;
  neighbors: string[];
}

export interface Challenge {
  id: string;
  creatorId: string;
  theme: Theme;
  artworkURL: string;
  clues: string[];
  shareText: string;
  guessCount: number;
  correctCount: number;
  isDaily: boolean;
  isRevealed: boolean;
  timeRemaining: number;
  validationPassed: boolean;
  createdAt: string;
  choices?: { id: string; name: string }[];
  stateName?: string;
  title?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  points?: number;
  hint?: string;
  funFact?: string;
  category?: string;
}

export interface RevealData {
  stateName: string;
  stateId: string;
  culturalFact: string;
  accuracy: number;
  guessCount: number;
  correctCount: number;
}

export interface GuessResult {
  isCorrect: boolean;
  pointsEarned: number;
  correctState?: string;
}

export interface LeaderboardEntry {
  rank: number;
  uid: string;
  name: string;
  photoURL: string;
  challengesCreated?: number;
  correctGuesses?: number;
  score: number;
  accuracy?: number;
}

export interface UserProfile {
  uid: string;
  name: string;
  photoURL: string;
  challengesCreated: number;
  totalGuesses: number;
  correctGuesses: number;
  score: number;
  accuracy: number;
  statesCreated: string[];
  statesGuessedCorrectly: string[];
  statesGuessedIncorrectly?: string[];
  badges: string[];
}

export interface CreateChallengeResponse {
  challengeId: string;
  artworkURL: string;
  shareCardURL: string;
  clues: string[];
  shareText: string;
  validationPassed: boolean;
  validationAttempts: number;
}
