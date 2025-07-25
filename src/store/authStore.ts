import { create } from "zustand";
import { produce } from "immer";

interface AuthState {
  isAuthenticated: boolean;
  userRole: string | null;
  userName: string | null;
  setUser: (name: string, role: string) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userRole: null,
  userName: null,

  setUser: (name, role) =>
    set(
      produce((state) => {
        state.isAuthenticated = true;
        state.userName = name;
        state.userRole = role;
      })
    ),

  clearUser: () =>
    set(
      produce((state) => {
        state.isAuthenticated = false;
        state.userName = null;
        state.userRole = null;
      })
    ),
}));