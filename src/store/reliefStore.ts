// import { authService } from "@/api/auth"
// import { create } from "zustand"
// import { immer } from "zustand/middleware/immer"

// interface User {
//   id: string
//   name: string
//   email: string
//   role: "Admin" | "ReliefTeam"
//   avatar?: string
// }



// interface ReliefStoreState {
//   currentUser: User | null
  
//   sidebarCollapsed: boolean
//   activeTab: string
 
//   // actions
//   initializeData: () => void
//   toggleSidebar: () => void
//   setActiveTab: (tab: string) => void
  
//    logout: () => void
// }

// export const useReliefStore = create(
//   immer<ReliefStoreState>((set) => ({
//     currentUser: null,
  
//     sidebarCollapsed: false,
//     activeTab: "dashboard",
    
//     initializeData: async () => {
//         try {
//           const apiResponse = await authService.getCurrentUser();
          
//           if (apiResponse.isSuccess && apiResponse.data) {
//             set({
//               currentUser: {
//                 id: apiResponse.data.id,
//                 name: apiResponse.data.name,
//                 email: apiResponse.data.email,
//                 //profile: apiResponse.data.profile,
//                 role: "ReliefTeam" // Or get from API if available
//               },
            
//             });
            
//             // You might want to fetch dashboard stats separately
//             // await fetchDashboardStats();
//           } else {
//             throw new Error(apiResponse.message || "Failed to load user data");
//           }
//         } catch (error) {
//           console.error("Initialization error:", error);
//           // Clear auth and redirect if initialization fails
//           localStorage.removeItem("authToken");
//           window.location.href = "/login";
//         }
//       },
//        logout: () => {
//     authService.logout();
//     localStorage.removeItem("authToken");
//     window.location.href = "/";
//   },

//     toggleSidebar: () => set((state) => { state.sidebarCollapsed = !state.sidebarCollapsed }),
//     setActiveTab: (tab) => set(() => ({ activeTab: tab })),

    
//   }))
// )


// src/store/reliefStore.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { authService } from "@/api/auth";
import { getReliefTeamByUser } from "@/api/reliefTeam";
import { getAssignmentsByTeam } from "@/api/requestAssignments";
import { RequestAssignment } from "@/types/requestAssignments";

interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "ReliefTeam";
  avatar?: string;
  reliefTeamId?: number;
}

interface ReliefStoreState {
  currentUser: User | null;
  sidebarCollapsed: boolean;
  activeTab: string;
  assignments: RequestAssignment[];
  loading: boolean;
  reliefTeamId: number | null;

  // actions
  initializeData: () => Promise<void>;
  toggleSidebar: () => void;
  setActiveTab: (tab: string) => void;
  logout: () => void;
  fetchTeamAssignments: () => Promise<void>;
}

export const useReliefStore = create(
  immer<ReliefStoreState>((set) => ({
    currentUser: null,
    sidebarCollapsed: false,
    activeTab: "dashboard",
    assignments: [],
    loading: false,
    reliefTeamId: null,

    initializeData: async () => {
      try {
        set({ loading: true });
        
        // 1. Get user profile
        const userResponse = await authService.getCurrentUser();
        if (!userResponse.isSuccess || !userResponse.data) {
          throw new Error(userResponse.message || "Failed to load user data");
        }

        // 2. Get relief team ID for this user
        const teamResponse = await getReliefTeamByUser(userResponse.data.id);
        
        set({
          currentUser: {
            ...userResponse.data,
            role: "ReliefTeam",
            reliefTeamId: teamResponse.id
          },
          reliefTeamId: teamResponse.id,
          loading: false
        });

        // 3. Fetch assignments for this team
        await useReliefStore.getState().fetchTeamAssignments();
      } catch (error) {
        console.error("Initialization error:", error);
        set({ loading: false });
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      }
    },

    fetchTeamAssignments: async () => {
      set({ loading: true });
      try {
        const state = useReliefStore.getState();
        if (!state.reliefTeamId) return;
        
        const assignments = await getAssignmentsByTeam(state.reliefTeamId);
        set({ assignments, loading: false });
      } catch (error) {
        console.error("Failed to fetch assignments:", error);
        set({ loading: false });
      }
    },

    logout: () => {
      // authService.logout();
      localStorage.removeItem("authToken");
      window.location.href = "/";
    },

    toggleSidebar: () => set((state) => { 
      state.sidebarCollapsed = !state.sidebarCollapsed 
    }),
    
    setActiveTab: (tab) => set(() => ({ activeTab: tab })),
  }))
);