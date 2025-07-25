import api from "./axioInstance";

export interface DisasterType {
  id: number;
  name: string;
  description: string;
  category: string;
}

export const getAllDisasterTypes = async (): Promise<DisasterType[]> => {
  try {
    const response = await api.get<DisasterType[]>("/disastertype");
    return response.data;
  } catch (error) {
    console.error("[API] Failed to fetch disaster types", error);
    throw error;
  }
};
