// src/hooks/useDisasterEvents.ts
import { useDisasterEventsStore } from "@/store/DisasterEventStore";
import { useEffect } from "react";

export const useDisasterEvents = () => {
  const { disasterEvents, fetchDisasterEvents } = useDisasterEventsStore();
  
  useEffect(() => {
    if (disasterEvents.length === 0) {
      fetchDisasterEvents();
    }
  }, [disasterEvents.length, fetchDisasterEvents]);

  return {
    disasterEvents,
    isLoading: disasterEvents.length === 0,
  };
};