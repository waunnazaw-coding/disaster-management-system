import { create } from "zustand";
import api from "../api/axioInstance";

interface DisasterEvent {
  id: number;
  title: string;
  description?: string;
  location: string;
  date: string;
  severity: string;
  status: string;
  affectedPeople: number;
  affectedFamilies: number;
  affectedInfractructures: number;
  currencyChanges: string[];
  firstImageUrl?: string;
  disasterTypeName?: string;
  createdUserName?: string;
  createdAt?: string;
}

interface DisasterStore {
  events: DisasterEvent[];
  fetchEvents: () => Promise<void>;
}

export const useDisasterStore = create<DisasterStore>((set) => ({
  events: [],
  fetchEvents: async () => {
    try {
      const response = await api.get("/DisasterEvent/all-with-impacts");
      const data = response.data.data || [];
      console.log("Fetched disaster events:", data);

      const mappedEvents: DisasterEvent[] = data.map((ev: any) => ({
        id: ev.id,
        title: ev.name,
        description: ev.description,
        location: ev.locationName + ", " + (ev.address || ""),
        date: ev.startDate,
        severity: ev.severity || "Low",
        status: ev.status,
        affectedPeople: ev.affectedPeople || 0,
        affectedFamilies: ev.affectedFamilies || 0,
        affectedInfractructures: ev.affectedInfrastructures || 0,
        currencyChanges: ev.currencyChanges || [],
        firstImageUrl: ev.firstImageUrl || "",
        disasterTypeName: ev.disasterTypeName || "Unknown",
        createdUserName: ev.createdUserName || "N/A",
        createdAt: ev.createdAt || new Date().toISOString(),
      }));

      set({ events: mappedEvents });
    } catch (error) {
      console.error("Failed to load disaster events:", error);
      set({ events: [] });
    }
  },
}));
