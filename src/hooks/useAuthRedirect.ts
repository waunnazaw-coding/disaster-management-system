// src/hooks/useAuthRedirect.ts
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Roles } from "../types/index";

export const useAuthRedirect = () => {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user?.role) {
      switch (user.role) {
        // case Roles.Admin:
        case Roles.DisasterManagementAdmin:
        case Roles.FinancialAdmin:
        case Roles.SysAdmin:
          navigate("/admin/dashboard", { replace: true });
          break;
        case Roles.ReliefTeam:
          navigate("/relief/assignments", { replace: true });
          break;
        default:
          navigate("/", { replace: true });
          break;
      }
    }
  }, [isAuthenticated, user?.role, navigate]);
};
