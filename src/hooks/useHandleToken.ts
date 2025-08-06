import { useCallback } from "react";
import {jwtDecode} from "jwt-decode";
import { useAuthStore } from "../store/authStore";
import { Roles } from "../types/index";

interface JwtPayload {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"?: string;
  email?: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
}

export const useHandleToken = () => {
  const setUser = useAuthStore((state) => state.setUser);

  return useCallback(
    (token: string) => {
      localStorage.setItem("authToken", token);

      const decoded = jwtDecode<JwtPayload>(token);

      const name =
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
        decoded.email ||
        "Unknown";

      const roleFromToken: string =
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "";

      const role: Roles = Object.values(Roles).includes(roleFromToken as Roles)
        ? (roleFromToken as Roles)
        : Roles.User;

      setUser({ name, role });
    },
    [setUser]
  );
};
