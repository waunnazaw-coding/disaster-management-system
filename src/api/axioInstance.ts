// src/api/axioInstance.ts
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import {
  getAccessToken,
  getRefreshToken,
  storeTokens,
  removeTokens,
  isTokenExpired
} from "@/hooks/setToken";

const BASE_URL = "http://localhost:5188/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    // no content-type set globally, it will be set automatically based on request data
  },
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Refresh token logic
async function refreshAccessToken() {
  try {
    const refreshToken = getRefreshToken();
    const accessToken = getAccessToken();
    if (!refreshToken) throw new Error("No refresh token found");

    const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {
      accessToken,
      refreshToken,
    });

    const { accessToken: newToken, refreshToken: newRefresh, accessTokenExpiration } =
      response.data.data || response.data;

    storeTokens(newToken, newRefresh ?? refreshToken, accessTokenExpiration);
    return newToken;
  } catch {
    // Properly clear auth state as well
    const logout = useAuthStore.getState().logout;
    await logout();
    throw new Error("Session expired");
  }
}

// Auto-refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const newAccessToken = await refreshAccessToken();
        error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api.request(error.config);
      } catch {
        const logout = useAuthStore.getState().logout;
        await logout();
      }
    }
    return Promise.reject(error);
  }
);


export { storeTokens, isTokenExpired };
export default api;
