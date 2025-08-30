import { CreateReliefTeamDto, ReliefTeamDto, UpdateReliefTeamDto } from './../types/reliefTeam';
import api from './axioInstance';

export const getReliefTeams = async (): Promise<ReliefTeamDto[]> => {
  const response = await api.get('/ReliefTeam');
  return response.data.data;
};

export const getReliefTeamById = async (id: number): Promise<ReliefTeamDto> => {
  const response = await api.get(`/ReliefTeam/${id}`);
  return response.data.data;
};

export const createReliefTeam = async (data: CreateReliefTeamDto): Promise<ReliefTeamDto> => {
  const response = await api.post('/ReliefTeam', data);
  return response.data.data;
};

export const updateReliefTeam = async (id: number, data: UpdateReliefTeamDto): Promise<ReliefTeamDto> => {
  const response = await api.put(`/ReliefTeam/${id}`, data);
  return response.data.data;
};

export const deleteReliefTeam = async (id: number): Promise<void> => {
  await api.delete(`/ReliefTeam/${id}`);
};



export const getReliefTeamByUser = async (userId: string): Promise<number | null> => {
  const response = await api.get(`/ReliefTeam/by-user/${userId}`);

  if (!response.data.isSuccess || response.data.data == null) {
    throw new Error(response.data.message || "No relief team found for this user");
  }

  return response.data.data; // This is the team ID (number|null)
};


// import api from "./axioInstance"
// import type { CreateReliefTeamDto, ReliefTeamDto, UpdateReliefTeamDto } from "./../types/reliefTeam"

// interface ApiResult<T> {
//   isSuccess: boolean
//   data: T | null
//   message: string | null
//   isError: boolean
//   isNotFoundError: boolean
//   isValidationError: boolean
// }

// export const getReliefTeams = async (): Promise<ReliefTeamDto[]> => {
//   const response = await api.get<ApiResult<ReliefTeamDto[]>>("/ReliefTeam")
//   if (!response.data.isSuccess || !response.data.data) {
//     throw new Error(response.data.message || "Failed to fetch relief teams")
//   }
//   return response.data.data
// }

// export const getReliefTeamById = async (id: number): Promise<ReliefTeamDto> => {
//   const response = await api.get<ApiResult<ReliefTeamDto>>(`/ReliefTeam/${id}`)
//   if (!response.data.isSuccess || !response.data.data) {
//     throw new Error(response.data.message || "Failed to fetch relief team")
//   }
//   return response.data.data
// }

// export const createReliefTeam = async (data: CreateReliefTeamDto): Promise<ReliefTeamDto> => {
//   const response = await api.post<ApiResult<ReliefTeamDto>>("/ReliefTeam", data)
//   if (!response.data.isSuccess || !response.data.data) {
//     throw new Error(response.data.message || "Failed to create relief team")
//   }
//   return response.data.data
// }

// export const updateReliefTeam = async (id: number, data: UpdateReliefTeamDto): Promise<ReliefTeamDto> => {
//   const response = await api.put<ApiResult<ReliefTeamDto>>(`/ReliefTeam/${id}`, data)
//   if (!response.data.isSuccess || !response.data.data) {
//     throw new Error(response.data.message || "Failed to update relief team")
//   }
//   return response.data.data
// }

// export const deleteReliefTeam = async (id: number): Promise<void> => {
//   const response = await api.delete<ApiResult<null>>(`/ReliefTeam/${id}`)
//   if (!response.data.isSuccess) {
//     throw new Error(response.data.message || "Failed to delete relief team")
//   }
// }
