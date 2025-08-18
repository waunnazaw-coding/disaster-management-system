
import { 
  ReliefTeamActivityDTO, 
  ActivityStatsDTO,
  ACTIVITY_TYPES, 
  CreateReliefTeamActivityDTO,
  UpdateReliefTeamActivityDTO
} from '@/types/activity';
import { 
  getActivities, 
  getActivityById, 
  createActivity, 
  updateActivity, 
  deleteActivity,
  getActivityStats
} from '../api/ActivityService';
import { create } from 'zustand';
import { toast } from 'sonner';
import { ReliefTeamDto } from '@/types/reliefTeam';
import api from '@/api/axioInstance';
import { getReliefTeams } from '@/api/reliefTeam';

interface ActivityState {
    reliefTeams: ReliefTeamDto[],
  activities: ReliefTeamActivityDTO[];
  currentActivity: ReliefTeamActivityDTO | null;
  stats: ActivityStatsDTO | null;
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  hasMore: boolean;
  fetchReliefTeams: () => Promise<void>;
  fetchMoreActivities: () => Promise<void>;
  fetchActivities: () => Promise<void>;
  fetchActivity: (id: number) => Promise<void>;
  createNewActivity: (data: CreateReliefTeamActivityDTO) => Promise<void>;
  updateExistingActivity: (data: UpdateReliefTeamActivityDTO) => Promise<ReliefTeamActivityDTO>;
  removeActivity: (id: number) => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchActivityForPublic: (id: number) => Promise<void>;
}

export const useActivityStore = create<ActivityState>((set, get) => ({
  reliefTeams: [] as ReliefTeamDto[], // Add this line
  activities: [],
  currentActivity: null,
  stats: null,
  loading: false,
  error: null,
  page: 1,
  pageSize: 6, // 2 rows (3 per row)
  hasMore: true,

   // Add this method to fetch relief teams
  fetchReliefTeams: async () => {
  set({ loading: true, error: null });
  try {
    const response = await getReliefTeams();
    set({ reliefTeams: response, loading: false });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch relief teams';
    set({ error: message, loading: false });
    toast.error(message);
  }
},
  // load first-page (or all) activities
  fetchActivities: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getActivities(); // If your API supports pagination, pass page/pageSize here.
      set({ activities: data, loading: false, page: 1, hasMore: data.length >= 6 });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch activities';
      set({ error: message, loading: false });
      toast.error(message);
    }
  },

  // fetch more (append) — basic implementation
  fetchMoreActivities: async () => {
    set({ loading: true, error: null });
    try {
      const nextPage = get().page + 1;
      // If your API supports pagination, change getActivities() to:
      // const data = await getActivities(nextPage, get().pageSize);
      const data = await getActivities(); // fallback: still fetches — edit if your API accepts params
      if (!data || data.length === 0) {
        set({ hasMore: false, loading: false });
        return;
      }

      set((state) => ({
        activities: [...state.activities, ...data],
        page: nextPage,
        loading: false,
        hasMore: data.length >= state.pageSize
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch more activities';
      set({ error: message, loading: false });
      toast.error(message);
    }
  },

  fetchActivity: async (id: number) => {
    set({ loading: true, error: null });
     try {
      const data = await getActivityById(id);
      set({ 
        currentActivity: data,
        // Also update in activities list
        activities: get().activities.map(a => 
          a.id === id ? {...a, ...data} : a
        ),
        loading: false 
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch activity';
      set({ error: message, loading: false });
      toast.error(message);
    }
  },

  createNewActivity: async (data: CreateReliefTeamActivityDTO) => {
    set({ loading: true, error: null });
    try {
      const newActivity = await createActivity(data);
      set((state) => ({
        activities: [newActivity, ...state.activities],
        loading: false
      }));
      await get().fetchStats(); // Refetch stats
      toast.success('Activity created successfully!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create activity';
      set({ error: message, loading: false });
      toast.error(message);
      throw error;
    }
  },

  updateExistingActivity: async (data: UpdateReliefTeamActivityDTO): Promise<ReliefTeamActivityDTO> => {
    set({ loading: true, error: null });
    try {
      const updatedActivity = await updateActivity(data);
      set((state) => ({
        activities: state.activities.map(a =>
          a.id === updatedActivity.id ? updatedActivity : a
        ),
        currentActivity: updatedActivity,
        loading: false
      }));
      await get().fetchStats(); // Refetch stats
      toast.success('Activity updated successfully!');
      return updatedActivity;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update activity';
      set({ error: message, loading: false });
      toast.error(message);
      throw error;
    }
  },

  removeActivity: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await deleteActivity(id);
      set((state) => ({
        activities: state.activities.filter(a => a.id !== id),
        loading: false
      }));
      await get().fetchStats(); // Refetch stats
      toast.success('Activity deleted successfully!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete activity';
      set({ error: message, loading: false });
      toast.error(message);
    }
  },

  fetchStats: async () => {
    set({ loading: true, error: null });
    try {
      const stats = await getActivityStats();
      set({ stats, loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch stats';
      set({ error: message, loading: false });
      toast.error(message);
    }
  },
  fetchActivityForPublic: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const data = await getActivityById(id);
      set({ currentActivity: data, loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch activity';
      set({ error: message, loading: false });
    }
  },
  
}));
