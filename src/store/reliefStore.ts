import { authService } from "@/api/auth"
import { create } from "zustand"
import { immer } from "zustand/middleware/immer"

interface User {
  id: string
  name: string
  email: string
  role: "Admin" | "ReliefTeam"
  avatar?: string
}



interface ReliefStoreState {
  currentUser: User | null
  
  sidebarCollapsed: boolean
  activeTab: string
 
  // actions
  initializeData: () => void
  toggleSidebar: () => void
  setActiveTab: (tab: string) => void
  
   logout: () => void
}

export const useReliefStore = create(
  immer<ReliefStoreState>((set) => ({
    currentUser: null,
  
    sidebarCollapsed: false,
    activeTab: "dashboard",
    
    initializeData: async () => {
        try {
          const apiResponse = await authService.getCurrentUser();
          
          if (apiResponse.isSuccess && apiResponse.data) {
            set({
              currentUser: {
                id: apiResponse.data.id,
                name: apiResponse.data.name,
                email: apiResponse.data.email,
                //profile: apiResponse.data.profile,
                role: "ReliefTeam" // Or get from API if available
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
       logout: () => {
    authService.logout();
    localStorage.removeItem("authToken");
    window.location.href = "/";
  },

    toggleSidebar: () => set((state) => { state.sidebarCollapsed = !state.sidebarCollapsed }),
    setActiveTab: (tab) => set(() => ({ activeTab: tab })),

    
  }))
)
