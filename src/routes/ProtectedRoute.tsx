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
  const { isAuthenticated, user } = useAuthStore();


  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  if (user?.role && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
