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

type SortOrder = "newest" | "oldest";
type Severity = "Critical" | "High" | "Medium" | "Low";

interface DisasterStore {
  events: DisasterEvent[];
  filteredEvents: DisasterEvent[];
  searchQuery: string;
  fetchEvents: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  filterEvents: (
    typeFilter: string | null,
    sortOrder: SortOrder,
    statusFilter?: string
  ) => void;
}

const severityPriority: Record<Severity, number> = {
  Critical: 1,
  High: 2,
  Medium: 3,
  Low: 4,
};

export const useDisasterStore = create<DisasterStore>((set, get) => ({
  events: [],
  filteredEvents: [],
  searchQuery: "",

  fetchEvents: async () => {
    try {
      const response = await api.get("/DisasterEvent/all-with-impacts");
      const data = response.data.data || [];

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

      set({ events: mappedEvents, filteredEvents: mappedEvents });
    } catch (error) {
      console.error("Failed to load disaster events:", error);
      set({ events: [], filteredEvents: [] });
    }
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
    // fallback to reapply filters
    get().filterEvents(null, "newest", "All");
  },

  filterEvents: (
    typeFilter: string | null,
    sortOrder: SortOrder,
    statusFilter: string = "All"
  ) => {
    const { events, searchQuery } = get();

    let filtered = [...events];

    // 1. Filter by disaster type
    if (typeFilter && typeFilter !== "All" && typeFilter !== "All Type") {
      filtered = filtered.filter(
        (ev) => ev.disasterTypeName === typeFilter
      );
    }

    // 2. Filter by status
    if (statusFilter && statusFilter !== "All") {
      filtered = filtered.filter((ev) => ev.status === statusFilter);
    }

    // 3. Filter by search query
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((ev) =>
        ev.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 4. Sort by severity first
    filtered.sort((a, b) => {
      const severityA = severityPriority[a.severity as Severity] || 99;
      const severityB = severityPriority[b.severity as Severity] || 99;

      if (severityA !== severityB) {
        return severityA - severityB;
      }

      // 5. Then sort by createdAt
      const dateA = new Date(a.createdAt ?? "").getTime();
      const dateB = new Date(b.createdAt ?? "").getTime();

      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    set({ filteredEvents: filtered });
  },
}));
