import { create } from "zustand"
import type { User, DisasterReport, DisasterEvent, HelpRequest, Donation } from "../types"

interface AppState {
  // User state
  currentUser: User | null
  setCurrentUser: (user: User | null) => void

  // Reports state
  reports: DisasterReport[]
  addReport: (report: Omit<DisasterReport, "id" | "createdAt" | "updatedAt">) => void
  updateReport: (id: string, updates: Partial<DisasterReport>) => void
  getUserReports: (userId: string) => DisasterReport[]

  // Events state
  events: DisasterEvent[]
  addEvent: (event: Omit<DisasterEvent, "id" | "createdAt" | "updatedAt">) => void
  getEventById: (id: string) => DisasterEvent | undefined

  // Help requests state
  helpRequests: HelpRequest[]
  addHelpRequest: (request: Omit<HelpRequest, "id" | "createdAt">) => void

  // Donations state
  donations: Donation[]
  addDonation: (donation: Omit<Donation, "id" | "createdAt">) => void
}

export const useStore = create<AppState>((set, get) => ({
  // User state
  currentUser: {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  setCurrentUser: (user) => set({ currentUser: user }),

  // Reports state
  reports: [
    {
      id: "1",
      userId: "1",
      userName: "John Doe",
      userAvatar: "/placeholder.svg?height=40&width=40",
      disasterType: "flood",
      title: "Severe Flooding in Downtown",
      description:
        "Heavy rainfall caused severe flooding in the downtown area. Water levels reached 3 feet in some areas.",
      location: "Downtown Yangon",
      photos: ["/placeholder.svg?height=300&width=400"],
      impact: "Multiple homes damaged, roads blocked, power outages affecting 500+ families",
      status: "merged",
      eventId: "1",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T14:00:00Z",
    },
    {
      id: "2",
      userId: "2",
      userName: "Jane Smith",
      userAvatar: "/placeholder.svg?height=40&width=40",
      disasterType: "flood",
      title: "Flood Damage in Residential Area",
      description: "Flooding affected residential buildings and local businesses.",
      location: "North Yangon",
      photos: ["/placeholder.svg?height=300&width=400"],
      impact: "Local market flooded, 20+ families evacuated",
      status: "merged",
      eventId: "1",
      createdAt: "2024-01-15T11:30:00Z",
      updatedAt: "2024-01-15T14:00:00Z",
    },
  ],

  addReport: (reportData) => {
    const newReport: DisasterReport = {
      ...reportData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    set((state) => ({ reports: [...state.reports, newReport] }))
  },

  updateReport: (id, updates) => {
    set((state) => ({
      reports: state.reports.map((report) =>
        report.id === id ? { ...report, ...updates, updatedAt: new Date().toISOString() } : report,
      ),
    }))
  },

  getUserReports: (userId) => {
    return get().reports.filter((report) => report.userId === userId)
  },

  // Events state
  events: [
    {
      id: "1",
      title: "Yangon Flood Emergency 2024",
      date: "2024-01-15",
      location: "Yangon, Myanmar",
      summary:
        "Severe flooding affected multiple areas of Yangon due to heavy monsoon rains. Emergency response teams were deployed to assist affected communities.",
      photos: ["/placeholder.svg?height=400&width=600"],
      reportIds: ["1", "2"],
      reporters: [
        { id: "1", name: "John Doe", avatar: "/placeholder.svg?height=40&width=40" },
        { id: "2", name: "Jane Smith", avatar: "/placeholder.svg?height=40&width=40" },
      ],
      impacts: [
        "Multiple homes damaged, roads blocked, power outages affecting 500+ families",
        "Local market flooded, 20+ families evacuated",
      ],
      helpRequests: [],
      createdAt: "2024-01-15T14:00:00Z",
      updatedAt: "2024-01-15T14:00:00Z",
    },
  ],

  addEvent: (eventData) => {
    const newEvent: DisasterEvent = {
      ...eventData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    set((state) => ({ events: [...state.events, newEvent] }))
  },

  getEventById: (id) => {
    return get().events.find((event) => event.id === id)
  },

  // Help requests state
  helpRequests: [],
  addHelpRequest: (requestData) => {
    const newRequest: HelpRequest = {
      ...requestData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    set((state) => ({ helpRequests: [...state.helpRequests, newRequest] }))
  },

  // Donations state
  donations: [],
  addDonation: (donationData) => {
    const newDonation: Donation = {
      ...donationData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    set((state) => ({ donations: [...state.donations, newDonation] }))
  },
}))
