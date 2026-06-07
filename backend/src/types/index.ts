export interface State {
  id: string;
  name: string;
  capital: string;
  demonym: string;
  language: string;
  aliases: string[];
  region: 'north' | 'south' | 'east' | 'west' | 'central' | 'northeast';
  neighbors: string[]; // state ids
}

export type Theme = 'spirit' | 'food' | 'festival' | 'nature' | 'architecture';

export interface ValidationResult {
  isValid: boolean;
  foundTerms: string[];
  attempts: number;
}

export interface Challenge {
  id: string;
  creatorId: string;
  theme: Theme;
  artworkURL: string;
  imagenPrompt: string;
  clues: string[];
  shareText: string;
  stateId_encrypted: string;
  revealAt: Date;
  guessCount: number;
  correctCount: number;
  isDaily: boolean;
  createdAt: Date;
  validationPassed: boolean;
  validationAttempts: number;
}

export interface Guess {
  id: string;
  challengeId: string;
  userId: string;
  guessedState: string;
  isCorrect: boolean;
  cluesUsed: number;
  pointsEarned: number;
  timestamp: Date;
}

export interface User {
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
  badges: string[];
}

export interface Clue {
  text: string;
  type: 'sensory' | 'cultural' | 'geographic';
  isRevealed: boolean;
}

export interface CreateChallengeRequest {
  stateId: string;
  theme: Theme;
}

export interface GuessRequest {
  challengeId: string;
  guessedState: string;
  cluesUsed: number;
}

export interface ChallengePublicData {
  id: string;
  theme: Theme;
  artworkURL: string;
  clues: string[];
  guessCount: number;
  correctCount: number;
  timeRemaining: number;
  isRevealed: boolean;
  creatorId: string;
  validationPassed: boolean;
  createdAt: Date;
}
