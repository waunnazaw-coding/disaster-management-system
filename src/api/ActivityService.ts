import api from './axioInstance';
import { 
  ReliefTeamActivityDTO, 
  CreateReliefTeamActivityDTO, 
  UpdateReliefTeamActivityDTO,
  ActivityStatsDTO
} from '@/types/activity';

export const getActivities = async (): Promise<ReliefTeamActivityDTO[]> => {
  const response = await api.get('/ReliefTeamActivity');
  return response.data.data;
};

export const getActivityById = async (id: number): Promise<ReliefTeamActivityDTO> => {
  try {
    const response = await api.get(`/ReliefTeamActivity/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Failed to fetch activity ${id}:`, error);
    throw new Error(`Failed to fetch activity ${id}`);
  }
};

export const createActivity = async (data: CreateReliefTeamActivityDTO): Promise<ReliefTeamActivityDTO> => {
  try {
    const formData = new FormData();
    
    // Append all fields
    formData.append('ReliefTeamId', data.reliefTeamId.toString());
    formData.append('ActivityDate', data.activityDate.toISOString());
    formData.append('Title', data.title);
    formData.append('Description', data.description);
    if (data.detailedAddress) formData.append('DetailedAddress', data.detailedAddress);
    formData.append('ActivityType', data.activityType);
    if (data.peopleHelped) formData.append('PeopleHelped', data.peopleHelped.toString());
    if (data.itemsDistributed) formData.append('ItemsDistributed', data.itemsDistributed);
    if (data.expenseAmount) formData.append('ExpenseAmount', data.expenseAmount.toString());

      // Append media files - CRITICAL FIX
    data.mediaFiles.forEach((file) => {
      formData.append('MediaFiles', file); // Name must match backend DTO
    });

    const response = await api.post('/ReliefTeamActivity', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data;
  } catch (error) {
    console.error('Failed to create activity:', error);
    throw new Error('Failed to create activity');
  }
};

export const updateActivity = async (data: UpdateReliefTeamActivityDTO): Promise<ReliefTeamActivityDTO> => {
  try {
    const formData = new FormData();

    // Append all fields
    formData.append('Id', data.id.toString());
    formData.append('ReliefTeamId', data.reliefTeamId.toString());
    formData.append('ActivityDate', data.activityDate.toISOString());
    formData.append('Title', data.title);
    formData.append('Description', data.description);
    if (data.detailedAddress) formData.append('DetailedAddress', data.detailedAddress);
    formData.append('ActivityType', data.activityType);
    if (data.peopleHelped) formData.append('PeopleHelped', data.peopleHelped.toString());
    if (data.itemsDistributed) formData.append('ItemsDistributed', data.itemsDistributed);
    if (data.expenseAmount) formData.append('ExpenseAmount', data.expenseAmount.toString());

    // Append media to delete
    if (data.mediaIdsToDelete) {
      data.mediaIdsToDelete.forEach((id, index) => {
        formData.append(`MediaIdsToDelete[${index}]`, id.toString());
      });
    }

    // Append new media files
    if (data.newMediaFiles) {
      data.newMediaFiles.forEach((file) => {
        formData.append('NewMediaFiles', file); // Name must match backend DTO
      });
    }
    const response = await api.put('/ReliefTeamActivity', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data;
  } catch (error) {
    console.error(`Failed to update activity ${data.id}:`, error);
    throw new Error(`Failed to update activity ${data.id}`);
  }
};

export const deleteActivity = async (id: number): Promise<void> => {
  try {
    await api.delete(`/ReliefTeamActivity/${id}`);
  } catch (error) {
    console.error(`Failed to delete activity ${id}:`, error);
    throw new Error(`Failed to delete activity ${id}`);
  }
};

export const getActivityStats = async (): Promise<ActivityStatsDTO> => {
  const response = await api.get('/ReliefTeamActivity/stats');
  return response.data.data;
};

export const getActivitiesByTeam = async (teamId: number): Promise<ReliefTeamActivityDTO[]> => {
  const response = await api.get(`/ReliefTeamActivity/team/${teamId}`);
  return response.data.data;
};

export const getActivitiesByType = async (activityType: string): Promise<ReliefTeamActivityDTO[]> => {
  const response = await api.get(`/ReliefTeamActivity/type/${activityType}`);
  return response.data.data;
};