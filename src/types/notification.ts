// src/types/notification.ts
export interface NotificationDto {
  id: number;
  userId: string;
  message: string;
  isRead: boolean;
  createdAt?: Date;
  type?: 'Report' | 'Request' | 'Donation' | 'System';
  relatedEntityId?: number;
  status?: string;
}

export interface SignalRNotification {
  id: number;
  userId: string;
  message: string;
  isRead: boolean;
  createdAt?: string;
  type?: 'Report' | 'Request' | 'Donation' | 'System';
  relatedEntityId?: number;
  status?: string;
}