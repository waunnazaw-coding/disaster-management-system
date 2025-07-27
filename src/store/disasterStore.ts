import { create } from "zustand";
import api from "../api/axioInstance"; // your configured axios instance

interface DisasterEvent {
  id: number;
  title: string;
  description?: string;
  location: string;
  date: string; // ISO string
  severity: string;
  status: string;
  affectedPeople: number;
}

interface DisasterStore {
  events: DisasterEvent[];
  fetchEvents: () => Promise<void>;
}

export const useDisasterStore = create<DisasterStore>((set) => ({
  events: [],
  fetchEvents: async () => {
    try {
      const response = await api.get("/DisasterEvent/all");
      const data = response.data.data || [];

      // Map API data to frontend expected shape
      const mappedEvents: DisasterEvent[] = data.map((ev: any) => ({
        id: ev.id,
        title: ev.name,
        description: ev.description,
        location: ev.locationName,
        date: ev.startDate, // assuming ISO string, else convert to ISO
        severity: ev.severity || "Low",
        status: ev.status || "Active",
        affectedPeople: ev.affectedPeople || 0,
      }));

      set({ events: mappedEvents });
    } catch (error) {
      console.error("Failed to load disaster events:", error);
      set({ events: [] });
    }
  },
}));
