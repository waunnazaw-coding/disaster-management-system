import api from "./axioInstance";

export interface AppLocation {
  id: number;
  name: string | null;
  geography: string | null;
  address: string | null;
  country: string | null;
  region: string | null;
}

export interface DisasterReport {
  id: number;
  title: string;
  description: string;
  severity: string;
  source: string;
  status: string;
  createdAt: string;   // ISO date string
  updatedAt: string;   // ISO date string
  locationId: number;
  disasterEventId: number | null;
  userId: string | null;
  addressDetail: string | null;
  location: AppLocation | null;
  disasterEvent: any | null;         // if you later expand, make a DisasterEvent interface
  impacts: any[];                    // same here, can replace with Impact[] type
  assistanceRequests: any[];
  reportPhotos: any[];
  type: string | null;
  user: any | null;                  // you can make a User interface if needed
}


export async function getAllDisasterReports(): Promise<DisasterReport[]> {
  const response = await api.get("/DisasterReport/all");
  console.log("Fetched disaster reports:", response.data.data);
  return response.data.data;
}

export async function approveDisapproveReport(id: number, approve: boolean) {
  const endpoint = approve
    ? `/DisasterReport/approve/${id}`
    : `/DisasterReport/disapprove/${id}`;

  const response = await api.post(endpoint); // Use POST, not PUT
  return response.data;
}

export async function unrejectReport(id: number) {
  try {
    const response = await api.post(`/DisasterReport/unreject/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Unreject report failed:", error);
    return { isSuccess: false, message: error.message || "Action failed" };
  }
}

export async function markReportChecked(id: number) {
  const response = await api.post(`/DisasterReport/checked/${id}`);
  return response.data;
}

export async function markReportFake(id: number) {
  const response = await api.post(`/DisasterReport/fake/${id}`);
  return response.data;
}
