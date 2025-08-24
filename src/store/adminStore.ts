// import { create } from "zustand";
// import { immer } from "zustand/middleware/immer";
// import type {
//   DisasterReport,
//   AssistanceRequest,
//   ReliefTeam,
//   Donation,
//   DisasterEvent,
//   DashboardStats,
//   DisasterType,
//   Location,
//   CreateDisasterEventForm,
//   User,
// } from "../types";

// import { authService, UserResponseDto } from "@/api/auth"; 

// export interface AdminStore {
//   reliefTeamMembers: any;

//   sidebarCollapsed: boolean;
//   activeTab: string;
//   currentUser: UserResponseDto | null;

//   dashboardStats: DashboardStats;
//   disasterReports: DisasterReport[];
//   assistanceRequests: AssistanceRequest[];
//   reliefTeams: ReliefTeam[];
//   donations: Donation[];
//   disasterEvents: DisasterEvent[];
//   disasterTypes: DisasterType[];
//   locations: Location[];
//   loading: boolean;

//   toggleSidebar: () => void;
//   setActiveTab: (tab: string) => void;
//   setLoading: (loading: boolean) => void;

//   logout: (navigate: () => void) => Promise<void>;

//   updateReportStatus: (id: number, status: DisasterReport["status"]) => void;
//   updateRequestStatus: (id: number, status: AssistanceRequest["status"]) => void;
//   assignReliefTeam: (requestId: number, teamId: number) => void;
//   updateTeamStatus: (id: number, status: ReliefTeam["status"]) => void;
//   updateDonationStatus: (id: number, status: Donation["status"]) => void;
//   createDisasterEvent: (eventData: CreateDisasterEventForm) => Promise<void>;
//   updateDisasterEventStatus: (id: number, status: DisasterEvent["status"]) => void;

//   initializeData: () => Promise<void>;
// }

// export const useAdminStore = create(
//   immer<AdminStore>((set, get) => ({
//     reliefTeamMembers: null,

//     sidebarCollapsed: false,
//     activeTab: "dashboard",
//     currentUser: null,

//     dashboardStats: {
//       totalReports: 0,
//       pendingReports: 0,
//       activeEvents: 0,
//       pendingRequests: 0,
//       activeTeams: 0,
//       totalDonations: 0,
//       pendingDonations: 0,
//       totalAffected: 0,
//     },

//     disasterReports: [],
//     assistanceRequests: [],
//     reliefTeams: [],
//     donations: [],
//     disasterEvents: [],
//     disasterTypes: [],
//     locations: [],
//     loading: false,

//     toggleSidebar: () =>
//       set((state) => {
//         state.sidebarCollapsed = !state.sidebarCollapsed;
//       }),

//     setActiveTab: (tab: string) =>
//       set((state) => {
//         state.activeTab = tab;
//       }),

//     setLoading: (loading: boolean) =>
//       set((state) => {
//         state.loading = loading;
//       }),

//     logout: async (navigate: () => void) => {
//       set((state) => {
//         state.loading = true;
//       });

//       try {
//         // Call your authService logout to clear tokens, backend session etc.
//         await authService.logout();

//         set((state) => {
//           state.currentUser = null;
//         });

//         // Navigate to home after logout clears state
//         navigate();
//       } catch (error) {
//         console.error("Logout failed:", error);
//       } finally {
//         set((state) => {
//           state.loading = false;
//         });
//       }
//     },

//     updateReportStatus: (id: number, status: DisasterReport["status"]) =>
//       set((state) => {
//         const report = state.disasterReports.find((r) => r.id === id);
//         if (report) report.status = status;
//       }),

//     updateRequestStatus: (id: number, status: AssistanceRequest["status"]) =>
//       set((state) => {
//         const request = state.assistanceRequests.find((r) => r.id === id);
//         if (request) request.status = status;
//       }),

//     assignReliefTeam: (requestId: number, teamId: number) => {
//       console.log(`Assigning team ${teamId} to request ${requestId}`);
//     },

//     updateTeamStatus: (id: number, status: ReliefTeam["status"]) =>
//       set((state) => {
//         const team = state.reliefTeams.find((t) => t.id === id);
//         if (team) team.status = status;
//       }),

//     updateDonationStatus: (id: number, status: Donation["status"]) =>
//       set((state) => {
//         const donation = state.donations.find((d) => d.id === id);
//         if (donation) donation.status = status;
//       }),

//     createDisasterEvent: async (
//       eventData: CreateDisasterEventForm
//     ): Promise<void> => {
//       set((state) => {
//         state.loading = true;
//       });

//       try {
//         // TODO: Replace with real API call
//         await new Promise((resolve) => setTimeout(resolve, 1000));
//       } catch (error) {
//         console.error("Failed to create disaster event:", error);
//       } finally {
//         set((state) => {
//           state.loading = false;
//         });
//       }
//     },

//     updateDisasterEventStatus: (id: number, status: DisasterEvent["status"]) =>
//       set((state) => {
//         const event = state.disasterEvents.find((e) => e.id === id);
//         if (event) event.status = status;
//       }),

//     initializeData: async (): Promise<void> => {
//       set((state) => {
//         state.loading = true;
//       });

//       try {
//         // Use your real authService to fetch current user
//         const user = await authService.getCurrentUser();

//         // TODO: Add here calls to fetch your app data (e.g. dashboardStats, disasterReports, etc.)

//         set((state) => {
//           //state.currentUser = user;
//           state.dashboardStats = {
//             totalReports: 0,
//             pendingReports: 0,
//             activeEvents: 0,
//             pendingRequests: 0,
//             activeTeams: 0,
//             totalDonations: 0,
//             pendingDonations: 0,
//             totalAffected: 0,
//           };
//           // Initialize data arrays empty or with real fetched data
//           state.disasterReports = [];
//           state.assistanceRequests = [];
//           state.reliefTeams = [];
//           state.donations = [];
//           state.disasterEvents = [];
//           state.disasterTypes = [];
//           state.locations = [];
//         });
//       } catch (error) {
//         console.error("Failed to initialize admin data", error);
//         set((state) => {
//           state.currentUser = null;
//         });
//       } finally {
//         set((state) => {
//           state.loading = false;
//         });
//       }
//     },
//   }))
// );



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
    // authService.logout();
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
