// src/api/tokenHelper.ts

const ACCESS_TOKEN_KEY = "authToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const EXPIRY_KEY = "accessTokenExpiry";

/**
 * Save tokens in localStorage
 */
export function storeTokens(
  accessToken: string,
  refreshToken: string,
  accessTokenExpiration?: string
) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

  if (accessTokenExpiration) {
    localStorage.setItem(EXPIRY_KEY, accessTokenExpiration);
  }
}

/**
 * Alternative alias for storeTokens (if old code calls setTokens)
 */
export function setTokens(
  accessToken: string,
  refreshToken: string,
  accessTokenExpiration?: string
) {
  storeTokens(accessToken, refreshToken, accessTokenExpiration);
}

/**
 * Getters
 */
export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getAccessTokenExpiry(): string | null {
  return localStorage.getItem(EXPIRY_KEY);
}

/**
 * Remove tokens
 */
export function removeTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(EXPIRY_KEY);
}

/**
 * Check if access token expired (with 1 min buffer)
 */
export function isTokenExpired(): boolean {
  const expiryStr = getAccessTokenExpiry();
  if (!expiryStr) return true; // No expiry stored → treat as expired

  const expiryTime = new Date(expiryStr).getTime();
  const bufferMs = 60 * 1000; // refresh 1 min before actual expiry
  return Date.now() >= expiryTime - bufferMs;
}
