// src/pages/NotificationPage.tsx
import { useEffect } from 'react';
import { useNotificationStore } from '@/store/notificationStore';
import { getNotifications } from '@/api/notification';
import { NotificationItem } from '@/components/Notification/NotificationItem';

export const NotificationsPage = () => {
  const { notifications, addNotifications, setUnreadCount } = useNotificationStore();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        addNotifications(data);
        const unread = data.filter(n => !n.isRead).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchNotifications();
  }, [addNotifications, setUnreadCount]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-800">Notifications</h1>
        </div>
        <div className="divide-y divide-gray-200">
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <NotificationItem key={notification.id} notification={notification} />
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              You don't have any notifications yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};