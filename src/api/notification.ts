import axiosInstance from './axioInstance';
import { NotificationDto } from '../types/notification';

export const getNotifications = async (): Promise<NotificationDto[]> => {
  const response = await axiosInstance.get('/notification');
  return response.data;
};

export const markNotificationAsRead = async (id: number): Promise<void> => {
  await axiosInstance.patch(`/notification/${id}/read`);
};

export const getUnreadCount = async (): Promise<number> => {
  const response = await axiosInstance.get('/notification/unread-count');
  return response.data;
};