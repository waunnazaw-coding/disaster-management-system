import React, { useEffect, useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { RouterProvider } from "react-router-dom";
import router from "../routes/routes";
import api from "@/api/axioInstance";
import useUserStore from "@/store/userStore";
import {
  getAccessToken,
  getRefreshToken,
  isTokenExpired,
  storeTokens,
} from "@/hooks/setToken";
import { useAuthStore } from "@/store/authStore";

const GOOGLE_CLIENT_ID =
  "412277597098-bkuavvhll6m7u9j4sj6oha2js64ne02d.apps.googleusercontent.com";

// Try silent token refresh before the app renders protected routes
async function trySilentRefresh() {
  const refreshToken = getRefreshToken();
  const accessToken = getAccessToken();
  const logout = useAuthStore.getState().logout;
  
  // no refresh token → not logged in
  if (!refreshToken) {
    console.info("No refresh token found — skipping silent refresh");
    return;
  }

  // Only refresh if access token is expired
  if (isTokenExpired()) {
    try {
      console.info("🔄 Access token expired — trying silent refresh...");
      const response = await api.post("/auth/refresh-token", {
        accessToken,
        refreshToken,
      });

      const data = response.data.data || response.data;
      const {
        accessToken: newToken,
        refreshToken: newRefresh,
        accessTokenExpiration,
      } = data;

      storeTokens(newToken, newRefresh ?? refreshToken, accessTokenExpiration);

      console.info("Silent token refresh successful");
    } catch (err) {
      console.warn("Silent refresh failed — logging out", err);
      await logout();
    }
  } else {
    console.info("Access token still valid — no refresh needed");
  }
}

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    (async () => {
      await trySilentRefresh(); // ensure token is refreshed BEFORE rendering
      await initializeAuth();
      setLoading(false);
    })();
  }, []);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  );
}
