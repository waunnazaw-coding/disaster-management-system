import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface Props {
  allowedRoles: string[];
  redirectPath?: string;
  children?: React.ReactNode; 
}

const ProtectedRoute: React.FC<Props> = ({
  allowedRoles,
  redirectPath = "/login",
  children,
}) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  if (user?.role && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (children) {
    return <>{children}</>;
  }

  return <Outlet />;
};

export default ProtectedRoute;
