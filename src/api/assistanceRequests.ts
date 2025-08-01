import type {
  AssistanceRequest,
  CreateAssistanceRequestDto,
  RequestStats,
  UpdateAssistanceRequestDto,
  UpdateRequestStatusDto
} from '@/types/assistanceRequests';
import api from './axioInstance';

export const getAssistanceRequests = async (): Promise<AssistanceRequest[]> => {
  const response = await api.get('/AssistanceRequests');
  return response.data.data;
};

export const getUserAssistanceRequests = async (): Promise<AssistanceRequest[]> => {
  const response = await api.get('/AssistanceRequests/my-requests');
  return response.data.data;
};

export const getRequestById = async (id: number): Promise<AssistanceRequest> => {
  const response = await api.get(`/AssistanceRequests/${id}`);
  return response.data.data;
};

export const createAssistanceRequest = async (
  data: CreateAssistanceRequestDto
): Promise<AssistanceRequest> => {
  const response = await api.post('/AssistanceRequests', data);
  return response.data.data;
};

export const updateAssistanceRequest = async (
  id: number,
  data: UpdateAssistanceRequestDto
): Promise<AssistanceRequest> => {
  // Remove null/undefined values from the payload
  const payload = Object.fromEntries(
    Object.entries(data).filter(([_, v]) => v != null)
  );
  
  const response = await api.put(`/AssistanceRequests/${id}`, payload);
  return response.data.data;
};

export const updateRequestStatus = async (
  id: number,
  data: UpdateRequestStatusDto
): Promise<AssistanceRequest> => {
  const response = await api.put(`/AssistanceRequests/${id}/status`, data);
  return response.data.data;
};

export const deleteAssistanceRequest = async (id: number): Promise<void> => {
  await api.delete(`/AssistanceRequests/${id}`);
};



export const getRequestStats = async (): Promise<RequestStats> => {
  const response = await api.get('/AssistanceRequests/stats');
  return response.data.data;
};
