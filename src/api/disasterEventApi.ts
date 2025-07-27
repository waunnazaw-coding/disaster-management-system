import api from "./axioInstance";

export interface DisasterEvent {
  id: number;
  name: string;
  disasterTypeName: string;
  startDate: string;
  endDate?: string;
  locationName?: string;
  region?: string;
  country?: string;
  severity?: string;
  status: string;
  description?: string;
}

export async function getAllDisasterEvents(): Promise<DisasterEvent[]> {
  const response = await api.get("/DisasterEvent/all");
  return response.data.data; // Ensure backend returns data in { isSuccess, data, message }
}
