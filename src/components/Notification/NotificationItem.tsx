import { NotificationDto } from '../../types/notification';
import { useNotificationStore } from '../../store/notificationStore';
import { formatDistanceToNow } from 'date-fns';
import { markNotificationAsRead } from '@/api/notification';

interface NotificationItemProps {
  notification: NotificationDto;
}

export const NotificationItem = ({ notification }: NotificationItemProps) => {
  const { markAsRead } = useNotificationStore();

  const handleClick = async () => {
    if (!notification.isRead) {
      await markNotificationAsRead(notification.id);
      markAsRead(notification.id);
    }
    // Add navigation logic if needed
  };

  return (
    <div
      className={`p-3 hover:bg-gray-100 cursor-pointer ${
        !notification.isRead ? 'bg-blue-50' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex justify-between items-start">
        <p className="text-sm text-gray-800">{notification.message}</p>
        {!notification.isRead && (
          <span className="inline-block w-2 h-2 ml-2 bg-blue-500 rounded-full"></span>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-1">
        {formatDistanceToNow(new Date(notification.createdAt + 'Z'))} ago
      </p>
    </div>
  );
};
