import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";

const BASE_URL = "http://localhost:5000/api";
const AUTH_TOKEN_KEY = "authToken";
const USER_DATA_KEY = "userData";

// Centralized logout function
const logout = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
  if (!window.location.pathname.includes("/login")) {
    window.location.href = "/login";
  }
};

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    // no content-type set globally, it will be set automatically based on request data
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    config.headers = config.headers ?? {};
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      if (process.env.NODE_ENV === "development") {
        console.debug("[API] Authorization header set");
      }
    } else {
      if ("Authorization" in config.headers) {
        delete config.headers["Authorization"];
      }
      if (process.env.NODE_ENV === "development") {
        console.debug("[API] No token found, Authorization header removed");
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;

      switch (status) {
        case 401:
          console.warn("[API] 401 Unauthorized - token may be invalid or expired");
          // Optional: Implement token refresh logic here
          // For example:
          // if (!error.config._retry) {
          //   error.config._retry = true;
          //   const newToken = await refreshToken();
          //   if (newToken) {
          //     localStorage.setItem(AUTH_TOKEN_KEY, newToken);
          //     error.config.headers['Authorization'] = `Bearer ${newToken}`;
          //     return api(error.config);
          //   }
          // }
          logout();
          break;

        case 404:
          console.error(`[API] 404 Not Found: ${error.config?.url}`);
          // Optional: Show user-friendly notification here
          break;

        default:
          if (process.env.NODE_ENV === "development") {
            console.warn(`[API] Error ${status}:`, error.response.data);
          }
          break;
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error("[API] No response received:", error.request);
    } else {
      // Something else happened setting up the request
      console.error("[API] Request error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
