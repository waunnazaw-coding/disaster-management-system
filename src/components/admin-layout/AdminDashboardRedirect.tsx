// AdminDashboardRedirect.tsx
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

const AdminDashboardRedirect = () => {
  const user = useAuthStore(state => state.user);
  const userRole = user?.role;

  if (userRole === 'DisasterManagementAdmin') {
    return <Navigate to="/admin/gdacs-events" replace />;
  } else if (userRole === 'FinancialAdmin') {
    return <Navigate to="/admin/donations" replace />;
  } else {
    return <Navigate to="/admin/gdacs-events" replace />;
  }
};

export default AdminDashboardRedirect;