// src/api/authService.ts
import axios from "axios";
import api from "./axioInstance";
import {storeTokens} from "@/hooks/setToken"

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiration: string;
}

export type UserResponseDto = {
  id: string;
  name: string;
  email: string;
  profile: string;
  role: string;
};

interface GoogleLoginDto {
  idToken: string;
}

interface ResetPasswordData {
  email: string;
  token: string;
  newPassword: string;
}
interface ResetPasswordResponse {
  message: string;
}

interface AdminInviteRequestDto {
  email: string;
  name?: string;
}

interface AdminInviteResponseDto {
  email: string;
  inviteSentAt: string;
  inviteUrl?: string;
}

interface AcceptAdminInviteDto {
  email: string;
  token: string;
  newPassword: string;
}

interface ApiResult<T> {
  isSuccess: boolean;
  data: T | null;
  message: string | null;
  isError: boolean;
  isNotFoundError: boolean;
  isValidationError: boolean;
}

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<ApiResult<AuthResponse>>("/auth/register", data);
    if (!response.data.isSuccess || !response.data.data) {
      throw new Error(response.data.message || "Registration failed");
    }
    const { accessToken, refreshToken, accessTokenExpiration } = response.data.data;
    storeTokens(accessToken, refreshToken, accessTokenExpiration);
    return response.data.data;
  },

  async login(data: LoginData): Promise<AuthResponse> {
  try {
    const response = await api.post<ApiResult<AuthResponse>>("/auth/login", data);

    // Check if backend response flags success and data exist
    if (!response.data.isSuccess || !response.data.data) {
      throw new Error(response.data.message || "Login failed");
    }

    const { accessToken, refreshToken, accessTokenExpiration } = response.data.data;
    storeTokens(accessToken, refreshToken, accessTokenExpiration);
    console.log(response.data.data);
    return response.data.data;

  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || "An error occurred during login";

        if (status === 500 || status === 401 || status === 400) {
          throw new Error(message || "Incorrect email or password");
        } 
      }
      // Network or other Axios error
      throw new Error("Network error. Please check your connection and try again.");
    }

    // Non-Axios or unknown error
    if (error instanceof Error) throw error;

    throw new Error("An unknown error occurred during login");
  }
},


  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
  try {
    const response = await api.patch<{ message: string }>("/auth/reset-password", data);
    if (response.status === 200) {
      return response.data;  
    } else {
      throw new Error(response.data.message || "Reset password failed");
    }

    } catch (error: unknown) {
      if (error instanceof Error) throw error;
      throw new Error("An unknown error occurred.");
    }
  },

  async sendAdminInvite(data: AdminInviteRequestDto): Promise<AdminInviteResponseDto> {
    const response = await api.post<ApiResult<AdminInviteResponseDto>>("/auth/admin-invite", data);
    if (!response.data.isSuccess || !response.data.data) {
      throw new Error(response.data.message || "Failed to send admin invite");
    }
    return response.data.data;
  },

  async acceptAdminInvite(data: AcceptAdminInviteDto): Promise<AuthResponse> {
    const response = await api.patch<ApiResult<AuthResponse>>("/auth/accept-admin-invite", data);
    if (!response.data.isSuccess || !response.data.data) {
      throw new Error(response.data.message || "Failed to accept admin invite");
    }
    const { accessToken, refreshToken, accessTokenExpiration } = response.data.data;
    storeTokens(accessToken, refreshToken, accessTokenExpiration);
    return response.data.data;
  },

  async googleLogin(data: GoogleLoginDto): Promise<AuthResponse & { user: UserResponseDto }> {
    const response = await api.post<ApiResult<AuthResponse & { user: UserResponseDto }>>("/auth/google-login", data);
    if (!response.data.isSuccess || !response.data.data) {
      throw new Error(response.data.message || "Google login failed");
    }
    const { accessToken, refreshToken, accessTokenExpiration } = response.data.data;
    storeTokens(accessToken, refreshToken, accessTokenExpiration);
    return response.data.data;
  },

  async getCurrentUser(): Promise<ApiResult<UserResponseDto>> {
    try {
      const response = await api.get<ApiResult<UserResponseDto>>("/auth/profile");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      return {
        isSuccess: false,
        isError: true,
        isNotFoundError: false,
        isValidationError: false,
        data: null,
        message: "Failed to fetch user profile"
      };
    }
  }
};
