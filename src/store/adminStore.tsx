import { create } from "zustand"
import { authService } from "../api/auth"
import type { UserResponseDto } from "../api/auth" // Import the type from your auth service

interface DashboardStats {
  activeEvents: number
  pendingReports: number
  pendingRequests: number
  pendingDonations: number
  activeTeams: number
}

interface AdminState {
  currentUser: {
    id: string
    name: string
    email: string
    avatar?: string | null  // Make sure this is included
    profile?: string | null
    role: string
  } | null
  activeTab: string
  sidebarCollapsed: boolean
  dashboardStats: DashboardStats
  initializeData: () => Promise<void>
  setActiveTab: (tab: string) => void
  toggleSidebar: () => void
  logout: () => void
  updateDashboardStats: (stats: Partial<DashboardStats>) => void
}

export const useAdminStore = create<AdminState>((set) => ({
  currentUser: null,
  activeTab: "dashboard",
  sidebarCollapsed: false,
  dashboardStats: {
    activeEvents: 0,
    pendingReports: 0,
    pendingRequests: 0,
    pendingDonations: 0,
    activeTeams: 0,
  },
  
  initializeData: async () => {
    try {
      const apiResponse = await authService.getCurrentUser();
      
      if (apiResponse.isSuccess && apiResponse.data) {
        set({
          currentUser: {
            id: apiResponse.data.id,
            name: apiResponse.data.name,
            email: apiResponse.data.email,
            profile: apiResponse.data.profile,
            role: "Admin" // Or get from API if available
          },
          dashboardStats: {
            activeEvents: 0, // You would fetch these from your API
            pendingReports: 0,
            pendingRequests: 0,
            pendingDonations: 0,
            activeTeams: 0,
          },
        });
        
        // You might want to fetch dashboard stats separately
        // await fetchDashboardStats();
      } else {
        throw new Error(apiResponse.message || "Failed to load user data");
      }
    } catch (error) {
      console.error("Initialization error:", error);
      // Clear auth and redirect if initialization fails
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  
  logout: () => {
    authService.logout();
    localStorage.removeItem("authToken");
    window.location.href = "/";
  },
    updateDashboardStats: (stats) =>
    set((state) => ({
      dashboardStats: {
        ...state.dashboardStats,
        ...stats,
      },
    })),
}));

// Optional: Separate function to fetch dashboard stats
async function fetchDashboardStats() {
  // You would implement API calls to get real stats here
  return {
    activeEvents: 3,
    pendingReports: 12,
    pendingRequests: 8,
    pendingDonations: 5,
    activeTeams: 4,
  };
}