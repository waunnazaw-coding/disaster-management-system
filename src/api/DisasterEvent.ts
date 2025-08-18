// src/api/disasterEvents.ts

import { DisasterEvent } from "@/types/DisasterEvent";
import api from "./axioInstance"; // ✅ your existing axios instance

/**
 * Get all disaster events.
 */
export const getAllDisasterEvents = async (): Promise<DisasterEvent[]> => {
  const response = await api.get("/DisasterEvent/all");

   console.log(response.data.data);
  return response.data.data;
};
