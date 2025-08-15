import { create } from "zustand";
import { produce } from "immer";
import { authService } from "@/api/auth";
import { removeTokens } from "@/hooks/setToken";

export interface User {
  name: string;
  role: string;
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;

  setUser: (user: User) => void;
  clearUser: () => void;

  initializeAuth: () => Promise<void>;
  logout: () => Promise<void>;

  // Add isAuthenticated method here:
  isAuthenticatedFn: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  user: null,

  setUser: (user) =>
    set(
      produce((state) => {
        state.user = user;
        state.isAuthenticated = true;
      })
    ),

  clearUser: () =>
    set(
      produce((state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
    ),

  initializeAuth: async () => {
    try {
      const user = await authService.getCurrentUser();

      console.log(`User data fetched during initialization:`, user);

      if (user.data) {
        set(
          produce((state) => {
            state.user = user.data;
            state.isAuthenticated = true;
          })
        );
      } else {
        set(
          produce((state) => {
            state.user = null;
            state.isAuthenticated = false;
          })
        );
      }
    } catch (error) {
      console.error("Failed to initialize auth:", error);
      set(
        produce((state) => {
          state.user = null;
          state.isAuthenticated = false;
        })
      );
    }
  },

  logout: async () => {
    try {
      removeTokens()
      set(
        produce((state) => {
          state.user = null;
          state.isAuthenticated = false;
        })
      );
      
    } catch (error) {
      console.error("Logout failed:", error);
      set(
        produce((state) => {
          state.user = null;
          state.isAuthenticated = false;
        })
      );
    }
  },

  // The new method returns the current authenticated status:
  isAuthenticatedFn: () => {
    const state = get();
    return state.isAuthenticated && state.user !== null;
  },
}));