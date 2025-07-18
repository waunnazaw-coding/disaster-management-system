import { create } from "zustand"
import { immer } from "zustand/middleware/immer"
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
  reliefTeamMembers: any
  // UI
  sidebarCollapsed: boolean
  activeTab: string
  currentUser: User | null

  // Data
  dashboardStats: DashboardStats
  disasterReports: DisasterReport[]
  assistanceRequests: AssistanceRequest[]
  reliefTeams: ReliefTeam[]
  donations: Donation[]
  disasterEvents: DisasterEvent[]
  disasterTypes: DisasterType[]
  locations: Location[]
  loading: boolean

  // UI Actions
  toggleSidebar: () => void
  setActiveTab: (tab: string) => void
  setLoading: (loading: boolean) => void
  logout: () => void

  // Data Actions
  updateReportStatus: (id: number, status: DisasterReport["status"]) => void
  updateRequestStatus: (id: number, status: AssistanceRequest["status"]) => void
  assignReliefTeam: (requestId: number, teamId: number) => void
  updateTeamStatus: (id: number, status: ReliefTeam["status"]) => void
  updateDonationStatus: (id: number, status: Donation["status"]) => void
  createDisasterEvent: (eventData: CreateDisasterEventForm) => Promise<void>
  updateDisasterEventStatus: (id: number, status: DisasterEvent["status"]) => void

  // Initialize data
  initializeData: () => void
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
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
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

    disasterReports: [],
    assistanceRequests: [],
    reliefTeams: [],
    donations: [],
    disasterEvents: [],
    disasterTypes: [],
    locations: [],
    loading: false,

    toggleSidebar: () =>
      set((state) => {
        state.sidebarCollapsed = !state.sidebarCollapsed
      }),

    setActiveTab: (tab) =>
      set((state) => {
        state.activeTab = tab
      }),

    setLoading: (loading) =>
      set((state) => {
        state.loading = loading
      }),

    logout: () =>
      set((state) => {
        console.log("Logging out...")
        state.currentUser = null
      }),

    updateReportStatus: (id, status) =>
      set((state) => {
        const report = state.disasterReports.find((r) => r.id === id)
        if (report) report.status = status
      }),

    updateRequestStatus: (id, status) =>
      set((state) => {
        const request = state.assistanceRequests.find((r) => r.id === id)
        if (request) request.status = status
      }),

    assignReliefTeam: (requestId, teamId) => {
      console.log(`Assigning team ${teamId} to request ${requestId}`)
    },

    updateTeamStatus: (id, status) =>
      set((state) => {
        const team = state.reliefTeams.find((t) => t.id === id)
        if (team) team.status = status
      }),

    updateDonationStatus: (id, status) =>
      set((state) => {
        const donation = state.donations.find((d) => d.id === id)
        if (donation) donation.status = status
      }),

    createDisasterEvent: async (eventData) => {
      set((state) => {
        state.loading = true
      })

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const newEvent: DisasterEvent = {
          id: Date.now(),
          ...eventData,
          status: "Active",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          disasterType: get().disasterTypes.find(
            (dt) => dt.id === eventData.disasterTypeId
          ),
          location: get().locations.find((l) => l.id === eventData.locationId),
        }

        set((state) => {
          state.disasterEvents.unshift(newEvent)
          state.dashboardStats.activeEvents++
        })
      } finally {
        set((state) => {
          state.loading = false
        })
      }
    },

    updateDisasterEventStatus: (id, status) =>
      set((state) => {
        const event = state.disasterEvents.find((e) => e.id === id)
        if (event) event.status = status
      }),

    initializeData: () =>
      set((state) => {
        state.dashboardStats = {
          totalReports: 156,
          pendingReports: 23,
          activeEvents: 8,
          pendingRequests: 45,
          activeTeams: 12,
          totalDonations: 89,
          pendingDonations: 15,
          totalAffected: 2500,
        }
        state.disasterTypes = [
          {
            id: 1,
            name: "Earthquake",
            category: "Natural",
            description: "Seismic activity",
          },
          { id: 2, name: "Flood", category: "Natural", description: "Water overflow" },
          {
            id: 3,
            name: "Fire",
            category: "Natural",
            description: "Wildfire or structural fire",
          },
          { id: 4, name: "Hurricane", category: "Natural", description: "Tropical cyclone" },
          {
            id: 5,
            name: "Industrial Accident",
            category: "Non-Natural",
            description: "Man-made disaster",
          },
        ]
        state.locations = [
          {
            id: 1,
            name: "Downtown District",
            address: "123 Main St",
            country: "USA",
            region: "California",
          },
          {
            id: 2,
            name: "Riverside Community",
            address: "456 River Rd",
            country: "USA",
            region: "California",
          },
          {
            id: 3,
            name: "Mountain View Area",
            address: "789 Hill Ave",
            country: "USA",
            region: "California",
          },
          {
            id: 4,
            name: "Coastal Region",
            address: "321 Beach Blvd",
            country: "USA",
            region: "California",
          },
        ]
        state.disasterEvents = [
          {
            id: 1,
            name: "California Earthquake 2024",
            disasterTypeId: 1,
            disasterType: {
              id: 1,
              name: "Earthquake",
              category: "Natural",
              description: "Seismic activity",
            },
            startDate: "2024-01-15",
            endDate: undefined,
            locationId: 1,
            location: {
              id: 1,
              name: "Downtown District",
              address: "123 Main St",
              country: "USA",
              region: "California",
            },
            severity: "High",
            status: "Active",
            description: "Major earthquake affecting multiple districts",
            estimatedAffected: 1500,
            createdAt: "2024-01-15T08:30:00Z",
            updatedAt: "2024-01-15T08:30:00Z",
          },
          {
            id: 2,
            name: "Northern Floods 2024",
            disasterTypeId: 2,
            disasterType: {
              id: 2,
              name: "Flood",
              category: "Natural",
              description: "Water overflow",
            },
            startDate: "2024-01-10",
            endDate: "2024-01-20",
            locationId: 2,
            location: {
              id: 2,
              name: "Riverside Community",
              address: "456 River Rd",
              country: "USA",
              region: "California",
            },
            severity: "Medium",
            status: "Closed",
            description: "Seasonal flooding in low-lying areas",
            estimatedAffected: 800,
            createdAt: "2024-01-10T12:00:00Z",
            updatedAt: "2024-01-20T18:00:00Z",
          },
        ]
        state.disasterReports = [
          {
            id: 1,
            locationId: 1,
            type: "Damage",
            title: "Building collapse in downtown area",
            description: "Multiple buildings damaged due to earthquake",
            severity: "High",
            status: "Pending",
            source: "Citizen",
            createdAt: "2024-01-15T10:30:00Z",
            location: {
              id: 1,
              name: "Downtown District",
              address: "123 Main St",
              country: "USA",
              region: "California",
            },
          },
          {
            id: 2,
            locationId: 2,
            type: "Situation",
            title: "Flood in residential area",
            description: "Heavy flooding affecting 50+ homes",
            severity: "Medium",
            status: "Verified",
            source: "Media",
            createdAt: "2024-01-14T15:45:00Z",
            location: {
              id: 2,
              name: "Riverside Community",
              address: "456 River Rd",
              country: "USA",
              region: "California",
            },
          },
        ]
        state.assistanceRequests = [
          {
            id: 1,
            supportType: "Medical Supplies",
            quantity: 100,
            unit: "units",
            description: "Urgent need for first aid kits and bandages",
            priority: "Critical",
            status: "Pending",
            contactName: "John Doe",
            email: "john@example.com",
            contactPhone: "+1-555-0123",
            createdAt: "2024-01-15T12:00:00Z",
            locationId: 1,
            location: {
              id: 1,
              name: "Downtown District",
              address: "123 Main St",
              country: "USA",
              region: "California",
            },
          },
          {
            id: 2,
            supportType: "Food",
            quantity: 200,
            unit: "meals",
            description: "Emergency food supplies for displaced families",
            priority: "High",
            status: "Approved",
            contactName: "Jane Smith",
            email: "jane@example.com",
            contactPhone: "+1-555-0124",
            createdAt: "2024-01-14T18:30:00Z",
            locationId: 2,
            location: {
              id: 2,
              name: "Riverside Community",
              address: "456 River Rd",
              country: "USA",
              region: "California",
            },
          },
        ]
        state.reliefTeams = [
          {
            id: 1,
            name: "Emergency Response Team Alpha",
            contactInfo: "alpha@relief.org",
            status: "Active",
            teamLeaderName: "Mike Johnson",
            email: "alpha@relief.org",
            phone: "+1-555-0200",
            numberOfMembers: 15,
            specialization: "Search & Rescue",
            createdAt: "2024-01-01T00:00:00Z",
            locationId: 1,
            location: {
              id: 1,
              name: "Downtown District",
              address: "123 Main St",
              country: "USA",
              region: "California",
            },
          },
          {
            id: 2,
            name: "Medical Response Unit",
            contactInfo: "medical@relief.org",
            status: "Active",
            teamLeaderName: "Dr. Sarah Wilson",
            email: "medical@relief.org",
            phone: "+1-555-0201",
            numberOfMembers: 8,
            specialization: "Medical",
            createdAt: "2024-01-01T00:00:00Z",
            locationId: 2,
            location: {
              id: 2,
              name: "Riverside Community",
              address: "456 River Rd",
              country: "USA",
              region: "California",
            },
          },
        ]
        state.donations = [
          {
            id: 1,
            name: "Emergency Supplies",
            type: "Medical",
            description: "First aid kits and medical supplies",
            quantity: 50,
            unit: "kits",
            amount: 2500,
            currency: "USD",
            dateReceived: "2024-01-15T09:00:00Z",
            sourceType: "Organization",
            status: "Verified",
          },
          {
            id: 2,
            name: "Food Donation",
            type: "Food",
            description: "Canned goods and non-perishables",
            quantity: 100,
            unit: "boxes",
            amount: 1500,
            currency: "USD",
            dateReceived: "2024-01-14T14:00:00Z",
            sourceType: "Company",
            status: "Pending",
          },
        ]
      }),
  }))
)
