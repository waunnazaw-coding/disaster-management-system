import { create } from "zustand";
import { authService } from "../api/auth";

interface AuthState {
  isAuthenticated: boolean;
  userRole: string | null;
  userName: string | null;
  isLoading: boolean;
  initialize: () => Promise<void>;
  setUser: (name: string, role: string) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userRole: null,
  userName: null,
  isLoading: true,

  initialize: async () => {
    try {
      const token = authService.getAccessToken();
      if (token) {
        const userResponse = await authService.getCurrentUser();
        if (userResponse.isSuccess && userResponse.data) {
          set({
            isAuthenticated: true,
            userName: userResponse.data.name,
            userRole: userResponse.data.role,
            isLoading: false,
          });
          return;
        }
      }
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  setUser: (name, role) => set({
    isAuthenticated: true,
    userName: name,
    userRole: role,
    isLoading: false,
  }),

  clearUser: () => set({
    isAuthenticated: false,
    userName: null,
    userRole: null,
    isLoading: false,
  }),
}));