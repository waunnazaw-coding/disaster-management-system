import { create } from "zustand"
import { persist } from "zustand/middleware"

interface DisasterReport {
  id: string
  disasterType: string
  title: string
  description: string
  location: string
  impactTypes: string[]
  severity: string
  affectedPeople?: string
  contactInfo?: string
  photos: string[]
  status: "pending" | "approved" | "rejected" | "merged"
  createdAt: string
  submittedBy: string
  submittedByEmail: string
  impact?: string // User-added impact after approval
  impactAddedAt?: string
  eventId?: string // Set when merged into an event
}

interface DisasterEvent {
  id: string
  title: string
  type: string
  location: string
  date: string
  severity: string
  affectedPeople: number
  status: "Active" | "Warning" | "Recovery" | "Resolved"
  description: string
  adminSummary: string
  photos: string[]
  createdAt: string
  reportIds: string[] // IDs of reports merged into this event
  helpRequestsCount: number
  supportingOrgsCount: number
}

interface HelpRequest {
  id: string
  eventId: string
  requestType: string
  description: string
  status: "pending" | "assigned" | "in-progress" | "completed"
  requestedBy: string
  assignedTo?: string
  createdAt: string
  priority: "Low" | "Medium" | "High" | "Critical"
}

interface DisasterState {
  reports: DisasterReport[]
  events: DisasterEvent[]
  helpRequests: HelpRequest[]
  addReport: (report: DisasterReport) => void
  updateReportStatus: (reportId: string, status: DisasterReport["status"]) => void
  addImpactToReport: (reportId: string, impact: string) => void
  createEventFromReports: (event: DisasterEvent, reportIds: string[]) => void
  addHelpRequest: (request: HelpRequest) => void
  getReportsByEvent: (eventId: string) => DisasterReport[]
  getHelpRequestsByEvent: (eventId: string) => HelpRequest[]
}

export const useDisasterStore = create<DisasterState>()(
  persist(
    (set, get) => ({
      reports: [
        {
          id: "1",
          disasterType: "Flood",
          title: "Severe flooding in downtown area",
          description: "Heavy rainfall caused flooding in residential areas",
          location: "Downtown Yangon, Myanmar",
          impactTypes: ["Infrastructure Damage", "Property Loss"],
          severity: "High",
          affectedPeople: "200 families",
          photos: ["flood1.jpg", "flood2.jpg"],
          status: "merged",
          createdAt: "2025-01-15T10:30:00Z",
          submittedBy: "Thant Zin",
          submittedByEmail: "thant@email.com",
          impact: "Floodwater damaged 50 houses and destroyed crops worth $10,000",
          impactAddedAt: "2025-01-15T14:00:00Z",
          eventId: "1",
        },
        {
          id: "2",
          disasterType: "Flood",
          title: "Water rising in residential area",
          description: "Same flood affecting nearby neighborhoods",
          location: "North Yangon, Myanmar",
          impactTypes: ["Property Loss"],
          severity: "High",
          photos: ["flood3.jpg"],
          status: "merged",
          createdAt: "2025-01-15T11:00:00Z",
          submittedBy: "Aye Aye",
          submittedByEmail: "aye@email.com",
          impact: "15 families evacuated, local school closed for 3 days",
          impactAddedAt: "2025-01-15T15:30:00Z",
          eventId: "1",
        },
      ],
      events: [
        {
          id: "1",
          title: "Major Flood in Yangon Region",
          type: "Flood",
          location: "Yangon, Myanmar",
          date: "2025-01-15",
          severity: "High",
          affectedPeople: 1250,
          status: "Active",
          description: "Severe flooding affecting multiple townships in Yangon region",
          adminSummary:
            "Heavy monsoon rains have caused widespread flooding across Yangon region. Multiple townships are affected with rising water levels threatening residential and commercial areas. Emergency response teams are actively working on evacuation and relief efforts.",
          photos: ["event_flood1.jpg", "event_flood2.jpg"],
          createdAt: "2025-01-15T16:00:00Z",
          reportIds: ["1", "2"],
          helpRequestsCount: 8,
          supportingOrgsCount: 3,
        },
        {
          id: "2",
          title: "Earthquake in Sagaing Region",
          type: "Earthquake",
          location: "Sagaing, Myanmar",
          date: "2025-01-10",
          severity: "Medium",
          affectedPeople: 850,
          status: "Recovery",
          description: "5.2 magnitude earthquake caused structural damage",
          adminSummary:
            "A 5.2 magnitude earthquake struck Sagaing region causing moderate structural damage to buildings and infrastructure. Assessment teams are evaluating damage and coordinating repair efforts.",
          photos: ["earthquake1.jpg"],
          createdAt: "2025-01-10T08:00:00Z",
          reportIds: ["3"],
          helpRequestsCount: 5,
          supportingOrgsCount: 2,
        },
      ],
      helpRequests: [],

      addReport: (report) =>
        set((state) => ({
          reports: [...state.reports, report],
        })),

      updateReportStatus: (reportId, status) =>
        set((state) => ({
          reports: state.reports.map((r) => (r.id === reportId ? { ...r, status } : r)),
        })),

      addImpactToReport: (reportId, impact) =>
        set((state) => ({
          reports: state.reports.map((r) =>
            r.id === reportId ? { ...r, impact, impactAddedAt: new Date().toISOString() } : r,
          ),
        })),

      createEventFromReports: (event, reportIds) =>
        set((state) => ({
          events: [...state.events, { ...event, reportIds }],
          reports: state.reports.map((r) =>
            reportIds.includes(r.id) ? { ...r, status: "merged", eventId: event.id } : r,
          ),
        })),

      addHelpRequest: (request) =>
        set((state) => ({
          helpRequests: [...state.helpRequests, request],
        })),

      getReportsByEvent: (eventId) => {
        return get().reports.filter((r) => r.eventId === eventId)
      },

      getHelpRequestsByEvent: (eventId) => {
        return get().helpRequests.filter((r) => r.eventId === eventId)
      },
    }),
    {
      name: "disaster-storage",
    },
  ),
)
