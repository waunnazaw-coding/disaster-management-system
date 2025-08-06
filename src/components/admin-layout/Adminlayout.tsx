import  { ReactNode, useEffect } from "react";
import { useAdminStore } from "../../store/adminStore";
import { cn } from "../../lib/utils";
import { AdminNavbar } from "./AdminNavbar";
import { Outlet, useLocation } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { Toaster } from "react-hot-toast";

interface AdminlayoutProps {
  children?: ReactNode;
}

function Adminlayout({ children }: AdminlayoutProps) {
  const initializeData = useAdminStore((state) => state.initializeData);
  const setActiveTab = useAdminStore((state) => state.setActiveTab);
  const activeTab = useAdminStore((state) => state.activeTab);
  const sidebarCollapsed = useAdminStore((state) => state.sidebarCollapsed);

  const location = useLocation();

  // Initialize data once on mount
  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // Change active tab on route change
  useEffect(() => {
    const pathParts = location.pathname.split("/");
    const currentPath = pathParts[pathParts.length - 1];

    const tabMap: Record<string, string> = {
      dashboard: "dashboard",
      events: "events",
      reports: "reports",
      requests: "requests",
      teams: "admin/relief-team-lists",
      donations: "donations",
      "": "dashboard",
    };

    const newActiveTab = tabMap[currentPath] || "dashboard";

    if (activeTab !== newActiveTab) {
      setActiveTab(newActiveTab);
    }
  }, [location.pathname, setActiveTab, activeTab]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <AdminSidebar />

      <Toaster position="bottom-right" />

      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          sidebarCollapsed ? "ml-16" : "ml-64"
        )}
      >
        <AdminNavbar />
        <main className="flex-1 overflow-auto bg-gradient-to-br from-white/50 to-blue-50/30">
          <div className="p-6">
            <Outlet />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Adminlayout;
