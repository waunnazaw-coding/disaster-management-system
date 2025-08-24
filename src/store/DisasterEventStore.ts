// src/store/disasterEventStore.ts
import { getAllDisasterEvents } from '@/api/DisasterEvent';
import { DisasterEvent } from '@/types/DisasterEvent';  // ✅ unified import
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface DisasterEventsState {
  disasterEvents: DisasterEvent[];
  fetchDisasterEvents: () => Promise<void>;
}

export const useDisasterEventsStore = create<DisasterEventsState>()(
  devtools(
    (set) => ({
      disasterEvents: [],
      fetchDisasterEvents: async () => {
        try {
          const events = await getAllDisasterEvents();
          set({ disasterEvents: events }); // ✅ no more type mismatch
        } catch (error) {
          console.error("Failed to fetch disaster events:", error);
        }
      },
    }),
    { name: "DisasterEventsStore" }
  )
);
