// Create a new file: src/types/signalr.d.ts
import * as signalR from '@microsoft/signalr';

declare global {
  interface Window {
    signalR: typeof signalR;
  }
}

export type Notification = {
  id: number;
  userId: string;
  message: string;
  isRead: boolean;
  createdAt?: string;
   type?: 'Report' | 'Request' | 'Donation' | 'System';
  status?: string;
};