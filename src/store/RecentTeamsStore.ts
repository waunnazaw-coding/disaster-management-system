// src/store/RecentTeamsStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RecentTeam {
  id: number;
  name: string;
  lastUsed: Date;
}

interface RecentTeamsStore {
  recentTeams: RecentTeam[];
  addRecentTeam: (team: Omit<RecentTeam, 'lastUsed'>) => void;
  getRecentTeams: (limit?: number) => RecentTeam[];
  clearRecentTeams: () => void;
}

export const useRecentTeamsStore = create<RecentTeamsStore>()(
  persist(
    (set, get) => ({
      recentTeams: [],
      
      addRecentTeam: (team) => {
        const existingIndex = get().recentTeams.findIndex(t => t.id === team.id);
        let newRecentTeams = [...get().recentTeams];
        
        if (existingIndex !== -1) {
          // Remove existing entry to re-add it at the beginning
          newRecentTeams.splice(existingIndex, 1);
        }
        
        // Add new team at the beginning
        newRecentTeams.unshift({
          ...team,
          lastUsed: new Date()
        });
        
        // Keep only the most recent 5 teams
        newRecentTeams = newRecentTeams.slice(0, 5);
        
        set({ recentTeams: newRecentTeams });
      },
      
      getRecentTeams: (limit = 5) => {
        return get().recentTeams.slice(0, limit);
      },
      
      clearRecentTeams: () => {
        set({ recentTeams: [] });
      }
    }),
    {
      name: 'recent-teams-storage',
    }
  )
);