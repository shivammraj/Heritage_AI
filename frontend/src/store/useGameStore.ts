import { create } from 'zustand';

interface GameState {
  score: number;
  cluesUsed: number;
  revealedClues: boolean[];
  hasGuessed: boolean;
  lastGuessCorrect: boolean | null;
  guessedStateId: string | null;
  pointsEarned: number;
  addScore: (pts: number) => void;
  unlockClue: (index: number) => void;
  setGuessed: (correct: boolean, stateId: string, points: number) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  score: 300,
  cluesUsed: 0,
  revealedClues: [true, false, false],
  hasGuessed: false,
  lastGuessCorrect: null,
  guessedStateId: null,
  pointsEarned: 0,
  addScore: (pts) => set((s) => ({ score: s.score + pts })),
  unlockClue: (index) =>
    set((s) => {
      const revealedClues = [...s.revealedClues];
      revealedClues[index] = true;
      return {
        revealedClues,
        cluesUsed: s.cluesUsed + 1,
        score: Math.max(50, s.score - 100),
      };
    }),
  setGuessed: (correct, stateId, points) =>
    set({ hasGuessed: true, lastGuessCorrect: correct, guessedStateId: stateId, pointsEarned: points }),
  resetGame: () =>
    set({ score: 300, cluesUsed: 0, revealedClues: [true, false, false], hasGuessed: false, lastGuessCorrect: null, guessedStateId: null, pointsEarned: 0 }),
}));
