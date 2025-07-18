import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface Props {
  allowedRoles: string[];
  redirectPath?: string;
}

const ProtectedRoute: React.FC<Props> = ({
  allowedRoles,
  redirectPath = "/login",
}) => {
  const { isAuthenticated, userRole } = useAuthStore();

  // Debug log to verify role and allowedRoles
  console.log("ProtectedRoute:", { userRole, allowedRoles });

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  if (userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
