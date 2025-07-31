
import { create } from 'zustand';
import { toast } from 'react-toastify';
import { NotificationDto } from '../types/notification';

interface NotificationState {
  notifications: NotificationDto[];
  unreadCount: number;
  addNotification: (notification: NotificationDto) => void;
  addNotifications: (notifications: NotificationDto[]) => void;
  markAsRead: (id: number) => void;
  setUnreadCount: (count: number) => void;
  incrementUnreadCount: () => void;
  decrementUnreadCount: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  addNotification: (notification) => 
    set((state) => {
      toast.info(notification.message, {
        autoClose: 5000,
        position: 'top-right',
      });
      return { 
        notifications: [notification, ...state.notifications],
        unreadCount: notification.isRead ? state.unreadCount : state.unreadCount + 1
      };
    }),
  addNotifications: (notifications) => 
    set(() => {
      const unread = notifications.filter(n => !n.isRead).length;
      return { 
        notifications,
        unreadCount: unread
      };
    }),
  markAsRead: (id) => 
    set((state) => ({
      notifications: state.notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      ),
      unreadCount: state.unreadCount > 0 ? state.unreadCount - 1 : 0
    })),
  setUnreadCount: (count) => set({ unreadCount: count }),
  incrementUnreadCount: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),
  decrementUnreadCount: () => set((state) => ({ 
    unreadCount: state.unreadCount > 0 ? state.unreadCount - 1 : 0 
  })),
}));