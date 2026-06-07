import { create } from 'zustand';
import { UserProfile } from '../types';

interface AppState {
  user: UserProfile | null;
  authToken: string | null;
  isAuthLoading: boolean;
  setUser: (user: UserProfile | null) => void;
  setAuthToken: (token: string | null) => void;
  setAuthLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  authToken: null,
  isAuthLoading: true,
  setUser: (user) => set({ user }),
  setAuthToken: (authToken) => set({ authToken }),
  setAuthLoading: (isAuthLoading) => set({ isAuthLoading }),
  logout: () => set({ user: null, authToken: null }),
}));
