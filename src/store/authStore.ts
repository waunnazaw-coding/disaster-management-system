import { create } from 'zustand';
import { type Role } from '../types/index';

interface AuthState {
  role: Role | null;
  setRole: (role: Role | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  role: null,
  setRole: (role) => set({ role }),
}));