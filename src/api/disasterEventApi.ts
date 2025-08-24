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
  address?: string;
  severity?: string;
  status: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  locationGeoJson?: any; // optional polygon GeoJSON
  firstImageUrl?: string;
  affectedPeople?: number;
  createdUserName: string;
  createdAt: string;
}


export async function getAllDisasterEvents(): Promise<DisasterEvent[]> {
  const response = await api.get("/DisasterEvent/all");
  return response.data.data;
}

export async function getAllActiveDisasterEvents(): Promise<DisasterEvent[]> {
  const response = await api.get("/DisasterEvent/all-active");
  console.log(response.data.data)
  return response.data.data;
}

export async function getAllForMapViewEvent(): Promise<DisasterEvent[]> {
  const response = await api.get("/DisasterEvent/all-map-view");
  console.log(response.data.data)
  return response.data.data;
}

export const getActiveEventCount = async (): Promise<number> => {
  const res = await api.get("/DisasterEvent/active-count");
  return res.data;
};
