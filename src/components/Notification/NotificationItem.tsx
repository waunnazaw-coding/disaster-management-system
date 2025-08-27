// import { NotificationDto } from '../../types/notification';
// import { useNotificationStore } from '../../store/notificationStore';
// import { formatDistanceToNow } from 'date-fns';
// import { markNotificationAsRead } from '@/api/notification';

// interface NotificationItemProps {
//   notification: NotificationDto;
// }

// export const NotificationItem = ({ notification }: NotificationItemProps) => {
//   const { markAsRead } = useNotificationStore();

//   const handleClick = async () => {
//     if (!notification.isRead) {
//       await markNotificationAsRead(notification.id);
//       markAsRead(notification.id);
//     }
//     // Add navigation logic if needed
//   };

//   return (
//     <div
//       className={`p-3 hover:bg-gray-100 cursor-pointer ${
//         !notification.isRead ? 'bg-blue-50' : ''
//       }`}
//       onClick={handleClick}
//     >
//       <div className="flex justify-between items-start">
//         <p className="text-sm text-gray-800">{notification.message}</p>
//         {!notification.isRead && (
//           <span className="inline-block w-2 h-2 ml-2 bg-blue-500 rounded-full"></span>
//         )}
//       </div>
//       <p className="text-xs text-gray-500 mt-1">
//         {formatDistanceToNow(new Date(notification.createdAt + 'Z'))} ago
//       </p>
//     </div>
//   );
// };
// src/components/Notification/NotificationItem.tsx
import { NotificationDto } from '@/types/notification';
import { useNotificationStore } from '@/store/notificationStore';
import { formatDistanceToNow } from 'date-fns';
import { markNotificationAsRead } from '@/api/notification';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface NotificationItemProps {
  notification: NotificationDto;
}

export const NotificationItem = ({ notification }: NotificationItemProps) => {
  const { markAsRead } = useNotificationStore();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleClick = async () => {
    try {
      if (!notification.isRead) {
        await markNotificationAsRead(notification.id);
        markAsRead(notification.id);
      }

      // Determine the correct path based on notification type and user role
      let path = '/notifications'; // Default fallback

      if (notification.type && notification.relatedEntityId) {
        switch (notification.type) {
          case 'Donation':
            if (user?.role === 'Admin' || user?.role === 'SysAdmin') {
              path = `/admin/donations`;
            } else {
              path = '/profile';
            }
            break;
            
          case 'Report':
            if (user?.role === 'Admin' || user?.role === 'SysAdmin') {
              path = `/admin/requests/${notification.relatedEntityId}`;
            } else {
              path = '/disasters/report';
            }
            break;
            
          case 'Request':
            if (user?.role === 'Admin' || user?.role === 'SysAdmin') {
              path = `/admin/requests/`;
            } else if (user?.role === 'User') {
              path = `/profile`;
            } else {
              path = '/requests/assistant';
            }
            break;
          case 'TeamAssignment':
            if (user?.role === 'Admin' || user?.role === 'SysAdmin') {
              path = `/admin/assignments`;
            } else if (user?.role === 'User') {
              path = `/profile`;
            } else {
              path = '/relief/assignments';
            }
            break;
        }
      }

      navigate(path);
    } catch (error) {
      console.error('Error handling notification click:', error);
      navigate('/notifications');
    }
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