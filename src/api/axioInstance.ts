import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";

const BASE_URL = "https://localhost:7148/api";
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
    "Content-Type": "application/json",
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

async function refreshAccessToken() {
  try {
    const response = await api.post("/auth/refresh-token", null, { withCredentials: true });
    const { accessToken } = response.data;
    storeAccessTokenInMemory(accessToken);


    return accessToken;
  } catch {
    logout();
    throw new Error("Session expired");
  }
}

// Axios interceptor for auto-refresh
api.interceptors.response.use(
  response => response,
  async (error) => {
    if (error.response.status === 401) {
      // Access token expired, try refreshing
      try {
        const newAccessToken = await refreshAccessToken();
        error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api.request(error.config);
      } catch {
        // Refresh also failed => logout
        logout();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
function storeAccessTokenInMemory(accessToken: string) {
  localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
  if (process.env.NODE_ENV === "development") {
    console.log("Access token updated in localStorage:", accessToken);
  }
}


