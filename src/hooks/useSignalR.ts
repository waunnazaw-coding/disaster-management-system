// src/hooks/useSignalR.ts
import { useEffect, useState } from 'react';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';
import { toast } from 'react-hot-toast';
import { SignalRNotification } from '../types/notification';

export const useSignalR = (): HubConnection | null => {
  const { isAuthenticated } = useAuthStore();
  const { addNotification, incrementUnreadCount } = useNotificationStore();
  const [connection, setConnection] = useState<HubConnection | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const newConnection = new HubConnectionBuilder()
      .withUrl(`https://localhost:7148/notificationHub`, {
        accessTokenFactory: () => localStorage.getItem('accessToken') || ''
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    const handleNotification = (notification: SignalRNotification) => {
      // Transform the SignalR notification to match NotificationDto
      const transformedNotification = {
        ...notification,
        createdAt: notification.createdAt ? new Date(notification.createdAt) : new Date()
      };
      
      addNotification(transformedNotification);
      incrementUnreadCount();
      
      toast(notification.message, {
        position: 'top-right',
        duration: 5000,
        icon: '🔔'
      });
    };

    const startConnection = async () => {
      try {
        await newConnection.start();
        console.log('SignalR Connected');
        newConnection.on('ReceiveNotification', handleNotification);
        setConnection(newConnection);
      } catch (err) {
        console.error('SignalR Connection Error:', err);
        setTimeout(startConnection, 5000);
      }
    };

    startConnection();

    return () => {
      if (newConnection) {
        newConnection.off('ReceiveNotification', handleNotification);
        newConnection.stop();
      }
    };
  }, [isAuthenticated, addNotification, incrementUnreadCount]);

  return connection;
};