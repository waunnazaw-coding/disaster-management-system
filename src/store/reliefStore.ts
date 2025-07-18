import {create} from "zustand"
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
}

interface AssistanceRequest {
  id: string
  requesterName: string
  needDescription: string
  assignedTo?: string
  status: "Pending" | "In Progress" | "Completed"
}

interface Donation {
  id: string
  donorName: string
  amount: number
  date: string
}

interface ReliefStoreState {
  currentUser: User | null
  reliefTeamMembers: ReliefTeamMember[]
  assistanceRequests: AssistanceRequest[]
  donations: Donation[]
  sidebarCollapsed: boolean
  activeTab: string
  // actions
  initializeData: () => void
  toggleSidebar: () => void
  setActiveTab: (tab: string) => void
  addReliefTeamMember: (member: ReliefTeamMember) => void
  updateAssistanceRequest: (id: string, updates: Partial<AssistanceRequest>) => void
  addDonation: (donation: Donation) => void
  importDonationsFromExcel: (data: Donation[]) => void
}

export const useReliefStore = create(
  immer<ReliefStoreState>((set) => ({
    currentUser: { id: "u1", name: "Relief Leader", email: "relief@example.com", role: "ReliefTeam" },
    reliefTeamMembers: [],
    assistanceRequests: [],
    donations: [],
    sidebarCollapsed: false,
    activeTab: "dashboard",

    initializeData: () =>
      set((state) => {
        // Mock data initialization
        state.reliefTeamMembers = [
          { id: "m1", name: "John Doe", role: "Volunteer", email: "john@example.com" },
          { id: "m2", name: "Jane Smith", role: "Team Lead", email: "jane@example.com" },
        ]
        state.assistanceRequests = [
          { id: "r1", requesterName: "Alice", needDescription: "Food supplies needed", assignedTo: "m2", status: "Pending" },
          { id: "r2", requesterName: "Bob", needDescription: "Medical aid required", status: "In Progress" },
        ]
        state.donations = [
          { id: "d1", donorName: "Donor A", amount: 100, date: "2025-07-01" },
          { id: "d2", donorName: "Donor B", amount: 250, date: "2025-07-15" },
        ]
      }),
    toggleSidebar: () => set((state) => { state.sidebarCollapsed = !state.sidebarCollapsed }),
    setActiveTab: (tab) => set(() => ({ activeTab: tab })),

    addReliefTeamMember: (member) => set((state) => { state.reliefTeamMembers.push(member) }),
    updateAssistanceRequest: (id, updates) => set((state) => {
      const idx = state.assistanceRequests.findIndex(r => r.id === id)
      if (idx !== -1) state.assistanceRequests[idx] = { ...state.assistanceRequests[idx], ...updates }
    }),
    addDonation: (donation) => set((state) => { state.donations.push(donation) }),
    importDonationsFromExcel: (data) => set((state) => { state.donations = [...state.donations, ...data] }),
  }))
)
