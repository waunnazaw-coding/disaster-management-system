import { create } from "zustand"
import { immer } from "zustand/middleware/immer"
import { getActiveEventCount } from "../api/disasterEventApi";
import type {
  DisasterReport,
  AssistanceRequest,
  ReliefTeam,
  Donation,
  DisasterEvent,
  DashboardStats,
  DisasterType,
  Location,
  CreateDisasterEventForm,
  User,
} from "../types"

interface AdminStore {
  reliefTeamMembers: any[]
  sidebarCollapsed: boolean
  activeTab: string
  currentUser: User | null
  dashboardStats: DashboardStats
  disasterReports: DisasterReport[]
  assistanceRequests: AssistanceRequest[]
  reliefTeams: ReliefTeam[]
  donations: Donation[]
  disasterEvents: DisasterEvent[]
  disasterTypes: DisasterType[]
  locations: Location[]
  loading: boolean
  initializeData: () => Promise<void>;

  toggleSidebar: () => void
  setActiveTab: (tab: string) => void
  setLoading: (loading: boolean) => void
  logout: () => void

  updateReportStatus: (id: number, status: DisasterReport["status"]) => void
  updateRequestStatus: (id: number, status: AssistanceRequest["status"]) => void
  assignReliefTeam: (requestId: number, teamId: number) => void
  updateTeamStatus: (id: number, status: ReliefTeam["status"]) => void
  updateDonationStatus: (id: number, status: Donation["status"]) => void
  createDisasterEvent: (eventData: CreateDisasterEventForm) => Promise<void>
  updateDisasterEventStatus: (id: number, status: DisasterEvent["status"]) => void
}

export const useAdminStore = create(
  immer<AdminStore>((set, get) => ({
    sidebarCollapsed: false,
    activeTab: "dashboard",
    currentUser: {
      id: "admin-1",
      name: "Admin User",
      email: "admin@disaster.gov",
      role: "Admin",
      status: "Active",
      createdAt: "2024-01-01T00:00:00Z",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
    },
    dashboardStats: {
      totalReports: 0,
      pendingReports: 0,
      activeEvents: 0,
      pendingRequests: 0,
      activeTeams: 0,
      totalDonations: 0,
      pendingDonations: 0,
      totalAffected: 0,
    },
    reliefTeamMembers: [],
    disasterReports: [],
    assistanceRequests: [],
    reliefTeams: [],
    donations: [],
    disasterEvents: [],
    disasterTypes: [],
    locations: [],
    loading: false,

    toggleSidebar: () => set((state) => { state.sidebarCollapsed = !state.sidebarCollapsed }),
    setActiveTab: (tab) => set((state) => { state.activeTab = tab }),
    setLoading: (loading) => set((state) => { state.loading = loading }),
    logout: () => set((state) => { console.log("Logging out..."); state.currentUser = null }),

    updateReportStatus: (id, status) => set((state) => {
      const report = state.disasterReports.find((r) => r.id === id)
      if (report) report.status = status
    }),

    updateRequestStatus: (id, status) => set((state) => {
      const request = state.assistanceRequests.find((r) => r.id === id)
      if (request) request.status = status
    }),

    assignReliefTeam: (requestId, teamId) => {
      console.log(`Assigning team ${teamId} to request ${requestId}`)
    },

    updateTeamStatus: (id, status) => set((state) => {
      const team = state.reliefTeams.find((t) => t.id === id)
      if (team) team.status = status
    }),

    updateDonationStatus: (id, status) => set((state) => {
      const donation = state.donations.find((d) => d.id === id)
      if (donation) donation.status = status
    }),

    createDisasterEvent: async (eventData) => {
      set((state) => { state.loading = true })
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const newEvent: DisasterEvent = {
          id: Date.now(),
          ...eventData,
          status: "Active",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          disasterType: get().disasterTypes.find(dt => dt.id === eventData.disasterTypeId),
          location: get().locations.find(loc => loc.id === eventData.locationId),
        }
        set((state) => {
          state.disasterEvents.unshift(newEvent)
          state.dashboardStats.activeEvents++
        })
      } finally {
        set((state) => { state.loading = false })
      }
    },

    updateDisasterEventStatus: (id, status) => set((state) => {
      const event = state.disasterEvents.find((e) => e.id === id)
      if (event) event.status = status
    }),

    initializeData: async () => {
      set((state) => {
        state.loading = true
      });

      try {
        const activeEventCount = await getActiveEventCount();
        console.log("Active Event Count:", activeEventCount);
        set((state) => {
          state.dashboardStats.activeEvents = activeEventCount;
        });
      } catch (error) {
        console.error("Failed to fetch active event count:", error);
      } finally {
        set((state) => {
          state.loading = false;
        });
      }
    }

  }))
)
