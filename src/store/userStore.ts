// src/store/userStore.ts
import { create } from 'zustand';
import { getUsers, blockUser, unblockUser, getUserStats, deleteUser } from '../api/userService';
import { User, UserFilters, PaginatedUsers, UserStats } from '../types/user';

interface UserStoreState {
  users: User[];
  loading: boolean;
  error: string | null;
  stats: UserStats | null;
  statsLoading: boolean;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  filters: {
    search?: string;
    role?: string;
    status?: string;
  };
}

interface UserStoreActions {
  fetchUsers: () => Promise<void>;
  fetchStats: () => Promise<void>;
  setPage: (page: number) => void;
  toggleBlockUser: (userId: string, currentStatus: 'Active' | 'Blacklisted') => Promise<void>;
  setFilters: (filters: UserFilters) => void;
  clearFilters: () => void;
   deleteUser: (userId: string) => Promise<void>;  // 👈 add here
}

const useUserStore = create<UserStoreState & UserStoreActions>((set, get) => ({
  users: [],
  loading: false,
  error: null,
  stats: null,
  statsLoading: false,
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  },
  filters: {},

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const { page, pageSize } = get().pagination;
      const { search, role, status } = get().filters;
      
      const apiFilters: Record<string, string> = {};
      if (search) apiFilters.search = search;
      if (role) apiFilters.role = role;
      if (status) apiFilters.status = status;

      const response = await getUsers(page, pageSize, apiFilters);
      
      if (response.isSuccess && response.data) {
        set({
          users: response.data.data,
          pagination: {
            page: response.data.pageNumber,
            pageSize: response.data.pageSize,
            total: response.data.totalRecords,
            totalPages: response.data.totalPages,
          },
        });
      } else {
        set({ error: response.message || 'Failed to fetch users' });
      }
    } catch (error) {
      set({ error: 'An unexpected error occurred' });
    } finally {
      set({ loading: false });
    }
  },
fetchStats: async () => {
  set({ statsLoading: true });
  try {
    const response = await getUserStats();
    console.log('Stats response:', response); // Debug log
    
    if (response.isSuccess) {
      console.log('Setting stats:', response.data); // Debug log
      set({ stats: response.data });
    } else {
      console.error('Failed to fetch stats:', response.message);
      set({ stats: null });
    }
  } catch (error) {
    console.error('Stats fetch error:', error);
    set({ stats: null });
  } finally {
    set({ statsLoading: false });
  }
},
  setPage: (page) => {
    set((state) => ({
      pagination: {
        ...state.pagination,
        page,
      },
    }));
    get().fetchUsers();
  },

  setFilters: (filters) => {
    set({ filters });
    set((state) => ({
      pagination: {
        ...state.pagination,
        page: 1,
      },
    }));
    get().fetchUsers();
  },

  clearFilters: () => {
    set({ 
      filters: {},
      pagination: {
        ...get().pagination,
        page: 1,
      },
    });
    get().fetchUsers();
  },

  toggleBlockUser: async (userId, currentStatus) => {
    try {
      const action = currentStatus === 'Active' ? blockUser : unblockUser;
      const response = await action(userId);
      
      if (response.isSuccess) {
        await get().fetchUsers();
        await get().fetchStats(); // Refresh stats after status change
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to update user status:', error);
      throw error;
    }
  },

  deleteUser: async (userId) => {
  try {
    const response = await deleteUser(userId);
    if (response.isSuccess) {
      // refresh list & stats
      await get().fetchUsers();
      await get().fetchStats();
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    console.error('Failed to delete user:', error);
    throw error;
  }
},
}));

export default useUserStore;