export interface User {
  id: string;
  name: string;
  email: string;
  role: 'User' | 'Admin' | 'SysAdmin' | 'ReliefTeam' | 'DisasterManagementAdmin' | 'FinancialAdmin';
  status: 'Active' | 'Blacklisted';
  authProvider?: string | null;
  createdAt: string;
}

export interface UserFilters {
  search?: string;
  role?: string;
  status?: string;
}

export interface PaginatedUsers {
  data: User[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  isError: boolean;
  isValidationError: boolean;
  isNotFoundError: boolean;
  data?: T;
  message?: string;
}

// types/user.ts
export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
  admins: number;
  sysAdmins: number;
  reliefTeams: number;
  organizations: number;
  regularUsers: number;
}