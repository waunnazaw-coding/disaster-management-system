// src/hooks/useRoleNavigation.ts
import { useAuthStore } from "@/store/authStore";

export const useRoleNavigation = () => {
  const { userRole } = useAuthStore();

  const getDashboardPath = () => {
    switch(userRole) {
      case 'Admin':
      case 'SysAdmin':
        return '/admin/dashboard';
      case 'ReliefTeam':
        return '/relief/dashboard';
      default:
        return '/profile';
    }
  };

  const getDashboardLabel = () => {
    switch(userRole) {
      case 'Admin':
      case 'SysAdmin':
        return 'Admin Dashboard';
      case 'ReliefTeam':
        return 'Team Dashboard';
      default:
        return 'Profile';
    }
  };

  return { getDashboardPath, getDashboardLabel };
};