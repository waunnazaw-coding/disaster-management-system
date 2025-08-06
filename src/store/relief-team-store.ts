import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type {
  ReliefTeam,
  CreateReliefTeamRequest,
  UpdateReliefTeamRequest,
  CreateInviteRequest,
} from "@/types/relief-team";
import { ReliefTeamService } from "@/api/relief-team";

interface ReliefTeamState {
  teams: ReliefTeam[];
  selectedTeam: ReliefTeam | null;
  loading: boolean;
  error: string | null;

  fetchTeams: () => Promise<void>;
  fetchTeamById: (id: number) => Promise<void>;
  createTeam: (teamData: CreateReliefTeamRequest) => Promise<void>;
  updateTeam: (teamData: UpdateReliefTeamRequest) => Promise<void>;
  deleteTeam: (id: number) => Promise<void>;
  createInvite: (inviteData: CreateInviteRequest) => Promise<void>;
  clearError: () => void;
  clearSelectedTeam: () => void;
}

export const useReliefTeamStore = create<ReliefTeamState>()(
  immer((set, get) => ({
    teams: [],
    selectedTeam: null,
    loading: false,
    error: null,

    fetchTeams: async () => {
      set((state) => {
        state.loading = true;
        state.error = null;
      });

      try {
        const teams = await ReliefTeamService.getAllTeams();
        set((state) => {
          state.teams = teams;
          state.loading = false;
        });
      } catch (error) {
        set((state) => {
          state.error =
            error instanceof Error ? error.message : "Failed to fetch teams";
          state.loading = false;
        });
      }
    },

    fetchTeamById: async (id: number) => {
      set((state) => {
        state.loading = true;
        state.error = null;
      });

      try {
        const team = await ReliefTeamService.getTeamById(id);
        set((state) => {
          state.selectedTeam = team;
          state.loading = false;
        });
      } catch (error) {
        set((state) => {
          state.error =
            error instanceof Error ? error.message : "Failed to fetch team";
          state.loading = false;
        });
      }
    },

    createTeam: async (teamData: CreateReliefTeamRequest) => {
      set((state) => {
        state.loading = true;
        state.error = null;
      });

      try {
        const newTeam = await ReliefTeamService.createTeam(teamData);
        set((state) => {
          state.teams.push(newTeam);
          state.teams = [...state.teams]; // Trigger React updates
          state.loading = false;
        });
      } catch (error) {
        set((state) => {
          state.error =
            error instanceof Error ? error.message : "Failed to create team";
          state.loading = false;
        });
        throw error;
      }
    },

    updateTeam: async (teamData: UpdateReliefTeamRequest) => {
      set((state) => {
        state.loading = true;
        state.error = null;
      });

      try {
        const updatedTeam = await ReliefTeamService.updateTeam(teamData);
        set((state) => {
          const idx = state.teams.findIndex((t) => t.id === updatedTeam.id);
          if (idx !== -1) {
            state.teams[idx] = updatedTeam;
            state.teams = [...state.teams]; // Important for React reactivity
          } else {
            // You can push or ignore, but generally warn
            console.warn(`Team with id ${updatedTeam.id} not found during update.`);
          }
          if (state.selectedTeam?.id === updatedTeam.id) {
            state.selectedTeam = updatedTeam;
          }
          state.loading = false;
        });
      } catch (error) {
        set((state) => {
          state.error =
            error instanceof Error ? error.message : "Failed to update team";
          state.loading = false;
        });
        throw error;
      }
    },

    deleteTeam: async (id: number) => {
      set((state) => {
        state.loading = true;
        state.error = null;
      });

      try {
        await ReliefTeamService.deleteTeam(id);
        set((state) => {
          state.teams = state.teams.filter((t) => t.id !== id);
          if (state.selectedTeam?.id === id) {
            state.selectedTeam = null;
          }
          state.loading = false;
        });
      } catch (error) {
        set((state) => {
          state.error =
            error instanceof Error ? error.message : "Failed to delete team";
          state.loading = false;
        });
        throw error;
      }
    },

    createInvite: async (inviteData: CreateInviteRequest) => {
      set((state) => {
        state.loading = true;
        state.error = null;
      });

      try {
        await ReliefTeamService.createInvite(inviteData);
        set((state) => {
          state.loading = false;
        });
      } catch (error) {
        set((state) => {
          state.error =
            error instanceof Error ? error.message : "Failed to create invite";
          state.loading = false;
        });
        throw error;
      }
    },

    clearError: () => set((state) => { state.error = null; }),

    clearSelectedTeam: () => set((state) => { state.selectedTeam = null; }),
  }))
);
