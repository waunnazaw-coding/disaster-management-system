import api from './axioInstance';
import { User, UserFilters, PaginatedUsers, ApiResponse, UserStats } from '../types/user';

// api/userService.ts
export const getUsers = async (
  page: number, 
  pageSize: number, 
  filters?: {
    search?: string;
    role?: string;
    status?: string;
  }
): Promise<ApiResponse<PaginatedUsers>> => {
  try {
    const response = await api.get('/users', {
      params: {
        pageNumber: page,
        pageSize,
        ...(filters?.search && { search: filters.search }),
        ...(filters?.role && { role: filters.role }),
        ...(filters?.status && { status: filters.status }),
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    return {
      isSuccess: false,
      isError: true,
      isValidationError: false,
      isNotFoundError: false,
      message: 'Failed to fetch users'
    };
  }
};

export const deleteUser = async (userId: string): Promise<ApiResponse<boolean>> => {
  try {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    return {
      isSuccess: false,
      isError: true,
      isValidationError: false,
      isNotFoundError: false,
      message: 'Failed to delete user',
    };
  }
};


export const getUserStats = async (): Promise<ApiResponse<UserStats>> => {
  try {
    const response = await api.get('/users/stats');
    console.log('Raw stats response:', response); // Debug log
    
    // Ensure the response matches ApiResponse structure
    return {
      isSuccess: true,
      isError: false,
       isValidationError: false,
      isNotFoundError: false,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      isSuccess: false,
      isError: true,
      isValidationError: false,
      isNotFoundError: false,
      message: 'Failed to fetch user statistics'
    };
  }
};

export const blockUser = async (userId: string): Promise<ApiResponse<User>> => {
  try {
    const response = await api.post(`/users/${userId}/block`);
    return response.data;
  } catch (error) {
    return {
      isSuccess: false,
      isError: true,
      isValidationError: false,
      isNotFoundError: false,
      message: 'Failed to block user'
    };
  }
};

export const unblockUser = async (userId: string): Promise<ApiResponse<User>> => {
  try {
    const response = await api.post(`/users/${userId}/unblock`);
    return response.data;
  } catch (error) {
    return {
      isSuccess: false,
      isError: true,
      isValidationError: false,
      isNotFoundError: false,
      message: 'Failed to unblock user'
    };
  }
};

export const changeUserRole = async (
  userId: string, 
  role: User['role']
): Promise<ApiResponse<User>> => {
  try {
    const response = await api.post(`/users/${userId}/changerole`, null, {
      params: { role }
    });
    return response.data;
  } catch (error) {
    return {
      isSuccess: false,
      isError: true,
      isValidationError: false,
      isNotFoundError: false,
      message: 'Failed to change user role'
    };
  }
};

// api/userService.ts
