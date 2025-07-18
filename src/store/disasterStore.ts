import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { Point } from "geojson";

interface Location {
  id: string;
  name: string;
  address?: string;
  geography?: Point;
  country: string;
  region?: string;
}

interface DisasterEvent {
  id: string;
  title: string;
  date: string; // Changed from startDate to date
  location: string; // Simplified location
  severity: string;
  status: "Active" | "Warning" | "Recovery" | "Resolved"; // Updated Status
  description: string;
  adminSummary: string; // Added adminSummary
  affectedPeople: number; // Added affectedPeople
  reports: Report[]; // Added reports
}

interface Report {
  id: string;
  title: string;
  description: string;
  submittedBy: string;
  createdAt: string;
  location: string;
  severity: string;
  photos: string[];
  impact?: string;
  impactAddedAt?: string;
}

interface HelpRequest {
  id: string;
  type: string;
  description: string;
  status: string; // e.g., "pending", "assigned", "in-progress", "completed"
  requestedBy: string;
  assignedTo?: string;
  completedAt?: string;
  priority: string;
}

interface DisasterState {
  events: DisasterEvent[];
  addEvent: (event: DisasterEvent) => void;
  updateEvent: (eventId: string, updates: Partial<DisasterEvent>) => void; // Function to update an event
  addReport: (eventId: string, report: Report) => void;
  helpRequests: HelpRequest[];
  addHelpRequest: (request: HelpRequest) => void;
  updateHelpRequest: (
    requestId: string,
    updates: Partial<HelpRequest>
  ) => void;
}

export const useDisasterStore = create<DisasterState>()(
  persist(
    immer((set, get) => ({
      events: [
        {
          id: "1",
          title: "Floods in Yangon 2025",
          date: "2025-06-12",
          location: "Yangon Downtown",
          severity: "High",
          status: "Active",
          description:
            "Heavy seasonal flooding in downtown region, affecting residential areas.",
          adminSummary:
            "Verified reports indicate significant flooding, with water levels reaching critical points in residential zones.",
          affectedPeople: 5000,
          reports: [
            {
              id: "101",
              title: "Rising Water Levels",
              description:
                "Water levels are rising rapidly, many homes are flooded.",
              submittedBy: "Kyaw Kyaw",
              createdAt: "2025-06-12T09:00:00Z",
              location: "Downtown Yangon",
              severity: "High",
              photos: [
                "/images/flood1.jpeg",
                "/images/flood2.jpeg",
                "/images/flood3.jpeg",
              ],
              impact: "Homes flooded, roads impassable",
              impactAddedAt: "2025-06-12T10:00:00Z",
            },
          ],
        },
        {
          id: "2",
          title: "Sagaing Earthquake 2025",
          date: "2025-04-08",
          location: "Sagaing Township",
          severity: "Medium",
          status: "Resolved",
          description: "Magnitude 5.2 earthquake, moderate damage to structures.",
          adminSummary:
            "Earthquake caused moderate damage. Key infrastructure remains intact.",
          affectedPeople: 1500,
          reports: [
            {
              id: "201",
              title: "Cracked buildings",
              description: "Many buildings have cracks.",
              submittedBy: "Aye Aye",
              createdAt: "2025-04-08T02:00:00Z",
              location: "Sagaing",
              severity: "Medium",
              photos: [],
            },
          ],
        },
      ],
      helpRequests: [],
      addEvent: (event) =>
        set((state) => {
          state.events.push(event);
        }),
      updateEvent: (eventId: string, updates: Partial<DisasterEvent>) => {
        set((state) => {
          const eventIndex = state.events.findIndex((event) => event.id === eventId);
          if (eventIndex !== -1) {
            state.events[eventIndex] = { ...state.events[eventIndex], ...updates };
          }
        });
      },
      addReport: (eventId: string, report: Report) => {
        set((state) => {
          const eventIndex = state.events.findIndex((event) => event.id === eventId);
          if (eventIndex !== -1) {
            state.events[eventIndex].reports.push(report);
          }
        });
      },
      addHelpRequest: (request: HelpRequest) =>
        set((state) => {
          state.helpRequests.push(request);
        }),
      updateHelpRequest: (requestId: string, updates: Partial<HelpRequest>) => {
        set((state) => {
          const requestIndex = state.helpRequests.findIndex((request) => request.id === requestId);
          if (requestIndex !== -1) {
            state.helpRequests[requestIndex] = { ...state.helpRequests[requestIndex], ...updates };
          }
        });
      },
    })),
    { name: "disaster-storage" }
  )
);