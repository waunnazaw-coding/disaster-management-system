import { useNotificationStore } from '../../store/notificationStore';

export const NotificationBadge = () => {
  const { unreadCount } = useNotificationStore();

  if (unreadCount === 0) return null;

  return (
    <span className="absolute top-0 right-0 bg-red-600 text-white inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none transform translate-x-1/2 -translate-y-1/2 rounded-full">
      {unreadCount}
    </span>
  );
};