// src/hooks/useHandleToken.ts
import { useCallback } from "react";
import {jwtDecode} from "jwt-decode";
import { useAuthStore } from "../store/authStore";
import { Roles } from "../types/index";

export const useHandleToken = () => {
  const setUser = useAuthStore((state) => state.setUser);

  return useCallback(
    (token: string) => {
      localStorage.setItem("authToken", token);

      const decoded = jwtDecode<Record<string, any>>(token);

      const name =
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
        decoded.email ||
        "Unknown";

      const roleFromToken =
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
        "";

      const role = Object.values(Roles).includes(roleFromToken)
        ? roleFromToken
        : Roles.User;

      setUser(name, role);
    },
    [setUser]
  );
};
