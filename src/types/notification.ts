// src/types/notification.ts
export interface NotificationDto {
  id: number;
  userId: string;
  message: string;
  isRead: boolean;
  createdAt?: Date;
  type?: string;
  relatedEntityId?: number;
  status?: string;
}

// For SignalR incoming notifications
export interface SignalRNotification {
  id: number;
  userId: string;
  message: string;
  isRead: boolean;
  createdAt?: string; // Note: This comes as string from server
  type?: string;
  relatedEntityId?: number;
  status?: string;
}

// export interface CreateNotificationDto {
//   userId: string;
//   message: string;
//   type: string;
//   relatedEntityId?: number;
//   status?: string;
// }