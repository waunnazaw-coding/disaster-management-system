import { create } from "zustand"
import { immer } from "zustand/middleware/immer"

interface User {
  id: string
  name: string
  email: string
  role: "Admin" | "ReliefTeam"
  avatar?: string
}

interface ReliefTeamMember {
  id: string
  name: string
  role: string
  email: string
  phone?: string
  skills?: string[]
}

interface AssistanceRequest {
  id: string
  requesterName: string
  needDescription: string
  location: string
  urgency: "Low" | "Medium" | "High"
  assignedTo?: string
  status: "Pending" | "In Progress" | "Completed"
  dateRequested: string
}

interface Donation {
  id: string
  donorName: string
  amount: number
  date: string
  type: "Money" | "Supplies" | "Services"
  description?: string
}

interface Notification {
  id: string
  message: string
  read: boolean
  date: string
}

interface ReliefStoreState {
  currentUser: User | null
  reliefTeamMembers: ReliefTeamMember[]
  assistanceRequests: AssistanceRequest[]
  donations: Donation[]
  sidebarCollapsed: boolean
  activeTab: string
  notifications: Notification[]
  // actions
  initializeData: () => void
  toggleSidebar: () => void
  setActiveTab: (tab: string) => void
  addReliefTeamMember: (member: ReliefTeamMember) => void
  updateReliefTeamMember: (id: string, updates: Partial<ReliefTeamMember>) => void
  deleteReliefTeamMember: (id: string) => void
  addAssistanceRequest: (request: AssistanceRequest) => void
  updateAssistanceRequest: (id: string, updates: Partial<AssistanceRequest>) => void
  addDonation: (donation: Donation) => void
  importDonationsFromExcel: (data: Donation[]) => void
  markNotificationAsRead: (id: string) => void
}

export const useReliefStore = create(
  immer<ReliefStoreState>((set) => ({
    currentUser: { 
      id: "u1", 
      name: "Relief Leader", 
      email: "relief@example.com", 
      role: "ReliefTeam",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    reliefTeamMembers: [],
    assistanceRequests: [],
    donations: [],
    sidebarCollapsed: false,
    activeTab: "dashboard",
    notifications: [
      { id: "n1", message: "New assistance request received", read: false, date: "2025-07-27T10:30:00" },
      { id: "n2", message: "Donation of $500 received", read: false, date: "2025-07-27T09:15:00" },
    ],

    initializeData: () =>
      set((state) => {
        state.reliefTeamMembers = [
          { 
            id: "m1", 
            name: "John Doe", 
            role: "Field Volunteer", 
            email: "john@example.com",
            phone: "+1 555-123-4567",
            skills: ["First Aid", "Logistics"]
          },
          { 
            id: "m2", 
            name: "Jane Smith", 
            role: "Team Coordinator", 
            email: "jane@example.com",
            phone: "+1 555-987-6543",
            skills: ["Management", "Communication"]
          },
          { 
            id: "m3", 
            name: "Alex Johnson", 
            role: "Medical Specialist", 
            email: "alex@example.com",
            skills: ["Emergency Medicine", "Triage"]
          },
        ]
        state.assistanceRequests = [
          { 
            id: "r1", 
            requesterName: "Alice Brown", 
            needDescription: "Food supplies for family of 4", 
            location: "North District",
            urgency: "High",
            assignedTo: "m2", 
            status: "Pending",
            dateRequested: "2025-07-26"
          },
          { 
            id: "r2", 
            requesterName: "Bob Wilson", 
            needDescription: "Medical aid for elderly", 
            location: "Central District",
            urgency: "Medium",
            status: "In Progress",
            dateRequested: "2025-07-25"
          },
          { 
            id: "r3", 
            requesterName: "Community Center", 
            needDescription: "Blankets and warm clothing", 
            location: "West District",
            urgency: "Low",
            assignedTo: "m1",
            status: "Completed",
            dateRequested: "2025-07-20"
          },
        ]
        state.donations = [
          { 
            id: "d1", 
            donorName: "Helping Hands Foundation", 
            amount: 1000, 
            date: "2025-07-01",
            type: "Money",
            description: "General relief fund"
          },
          { 
            id: "d2", 
            donorName: "Local Business Association", 
            amount: 2500, 
            date: "2025-07-15",
            type: "Money"
          },
          { 
            id: "d3", 
            donorName: "Goodwill Supplies", 
            amount: 0, 
            date: "2025-07-10",
            type: "Supplies",
            description: "100 blankets, 50 hygiene kits"
          },
        ]
      }),

    toggleSidebar: () => set((state) => { state.sidebarCollapsed = !state.sidebarCollapsed }),
    setActiveTab: (tab) => set(() => ({ activeTab: tab })),

    addReliefTeamMember: (member) => set((state) => { state.reliefTeamMembers.push(member) }),
    updateReliefTeamMember: (id, updates) => set((state) => {
      const idx = state.reliefTeamMembers.findIndex(m => m.id === id)
      if (idx !== -1) state.reliefTeamMembers[idx] = { ...state.reliefTeamMembers[idx], ...updates }
    }),
    deleteReliefTeamMember: (id) => set((state) => {
      state.reliefTeamMembers = state.reliefTeamMembers.filter(m => m.id !== id)
    }),

    addAssistanceRequest: (request) => set((state) => { state.assistanceRequests.push(request) }),
    updateAssistanceRequest: (id, updates) => set((state) => {
      const idx = state.assistanceRequests.findIndex(r => r.id === id)
      if (idx !== -1) state.assistanceRequests[idx] = { ...state.assistanceRequests[idx], ...updates }
    }),

    addDonation: (donation) => set((state) => { state.donations.push(donation) }),
    importDonationsFromExcel: (data) => set((state) => { state.donations = [...state.donations, ...data] }),

    markNotificationAsRead: (id) => set((state) => {
      const notification = state.notifications.find(n => n.id === id)
      if (notification) notification.read = true
    }),
  }))
)
