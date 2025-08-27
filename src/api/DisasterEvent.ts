import { DisasterEvent } from "@/types/DisasterEvent";
import api from "./axioInstance";

/**
 * Get all disaster events.
 */
export const getAllDisasterEvents = async (): Promise<DisasterEvent[]> => {
  const response = await api.get("/DisasterEvent/all");

  console.log(response.data); // full response
  return response.data.data; // ✅ return only the array
};


export const fetchDisasterEvents = async () => {
  try {
    const response = await api.get("/GdacsDisasterEvent")
    return response.data
  } catch (error) {
    throw error
  }
}