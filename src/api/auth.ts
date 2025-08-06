import api from "./axioInstance";

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
  accessTokenExpiration: string; // or Date, depending on your API
}

export type UserResponseDto = {
  id: string;
  name: string;
  email: string;
  profile: string | null;
  createdAt: string | null;
  role:string
  // Note: phone, role, and status are not in the API response
};

interface GoogleLoginDto {
  idToken: string; // The Google ID token from client
}

interface ResetPasswordData {
  email: string;
  token: string;
  newPassword: string;
}
interface ResetPasswordResponse {
  message: string;
}

// Add to your existing interfaces
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
  email: string;    // Must match backend exactly (case-sensitive)
  token: string;    // Must match backend exactly
  newPassword: string;  // Must match backend exactly
}

// Backend generic API response wrapper
interface ApiResult<T> {
  isSuccess: boolean;
  data: T | null;
  message: string | null;
  isError: boolean;
  isNotFoundError: boolean;
  isValidationError: boolean;
}

// Local storage keys
const ACCESS_TOKEN_KEY = "authToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_DATA_KEY = "userData";

const storeTokens = (auth: AuthResponse) => {
  console.log("Storing tokens:", auth);
  localStorage.setItem(ACCESS_TOKEN_KEY, auth.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, auth.refreshToken);
};

const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
};

const storeUserData = (user: UserResponseDto) => {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
};

const getUserData = (): UserResponseDto | null => {
  const data = localStorage.getItem(USER_DATA_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data) as UserResponseDto;
  } catch {
    return null;
  }
};

export const authService = {
  
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<ApiResult<AuthResponse>>("/auth/register", data);

    if (!response.data.isSuccess || !response.data.data) {
      throw new Error(response.data.message || "Registration failed");
    }

    storeTokens(response.data.data);
    return response.data.data;
  },

  async resetPassword(data: ResetPasswordData): Promise<ResetPasswordResponse> {
    const response = await api.patch<ApiResult<ResetPasswordResponse>>("/auth/reset-password", data);

    if (!response.data.isSuccess || !response.data.data) {
      throw new Error(response.data.message || "Reset password failed");
    }

    return response.data.data;
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
    
    storeTokens(response.data.data);
    return response.data.data;
  },

  async googleLogin(data: GoogleLoginDto): Promise<AuthResponse & { user: UserResponseDto }> {
    const response = await api.post<ApiResult<AuthResponse & { user: UserResponseDto }>>("/auth/google-login", data);

    if (!response.data.isSuccess || !response.data.data) {
      throw new Error(response.data.message || "Google login failed");
    }

    const authData = response.data.data;
    storeTokens(authData);
    storeUserData(authData.user);

    return authData;
  },

  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await api.post<ApiResult<AuthResponse>>("/auth/login", data);

      if (!response.data.isSuccess || !response.data.data) {
        throw new Error(response.data.message || "Login failed");
      }

      storeTokens(response.data.data);

      // Optionally fetch and store user data after login
      const user = await this.getCurrentUser();
      if (user) storeUserData(user);

      return response.data.data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      // If your backend supports logout endpoint, call it here
      await api.post("/auth/logout");
    } catch (error) {
      console.warn("Logout API call failed or not implemented", error);
    } finally {
      clearTokens();
      // Optionally reload or redirect handled elsewhere
    }
  },

  // Get current user profile
 async getCurrentUser(): Promise<ApiResult<UserResponseDto>> {
    try {
      const response = await api.get<ApiResult<UserResponseDto>>("/auth/profile");
      
      // The response.data already has the ApiResult structure
      if (response.data.isSuccess && response.data.data) {
        storeUserData(response.data.data);
      }
      
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      
      // Return error structure
      return {
        isSuccess: false,
        isError: true,
        isNotFoundError: false,
        isValidationError: false,
        data: null,
        message: "Failed to fetch user profile"
      };
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
};
