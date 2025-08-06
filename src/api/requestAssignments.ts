import { fromPairs } from 'lodash';
import api from './axioInstance';
import type {
  RequestAssignment,
  CreateAssignmentData,
  UpdateAssignmentStatusData
} from '../types/requestAssignments';

export const getAssignments = async (): Promise<RequestAssignment[]> => {
  const response = await api.get('/RequestAssignments');
  return response.data.data;
};

export const getAssignmentsByTeam = async (teamId: number): Promise<RequestAssignment[]> => {
  const response = await api.get(`/RequestAssignments/team/${teamId}`);
  return response.data.data;
};

export const createAssignment = async (data: CreateAssignmentData): Promise<RequestAssignment> => {
  const response = await api.post('/RequestAssignments', data);
  return response.data.data;
};

export const updateAssignmentStatus = async (
  id: number,
  data: UpdateAssignmentStatusData
): Promise<RequestAssignment> => {
  const response = await api.put(`/RequestAssignments/${id}/status`, data);
  return response.data.data;
};