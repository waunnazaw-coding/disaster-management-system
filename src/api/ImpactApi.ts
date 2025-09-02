import api from "./axioInstance";

export interface Impact {
    id: number;
    relatedEvent?: string;
    relatedReport?: string;
    type: string;
    value: string;
    objectName?: string | null;
    status: string;
}

export async function getAllImpacts(): Promise<Impact[]> {
    try {
        const response = await api.get<Impact[]>("/Impact/all-impacts");
        return response.data;
    } catch (error) {
        console.error("Failed to fetch impacts", error);
        return [];
    }
}

export const updateImpactStatus = async (id: number, status: string) => {
    const { data } = await api.put(`/Impact/${id}/status`, { status });
    return data;
};
