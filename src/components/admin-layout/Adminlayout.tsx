"use client";

import { useEffect, useState } from "react";
import { useAdminStore } from "../../store/adminStore";
import { cn } from "../../lib/utils";
import { AdminNavbar } from "./AdminNavbar";
import { Outlet, useLocation } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { Toaster } from "sonner";
import DisasterNotification from "@/components/disaster-alert/disaster-notification";

function AdminLayout({ children }: { children?: React.ReactNode }) {
  const initializeData = useAdminStore((state) => state.initializeData);
  const setActiveTab = useAdminStore((state) => state.setActiveTab);
  const activeTab = useAdminStore((state) => state.activeTab);
  const sidebarCollapsed = useAdminStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useAdminStore((state) => state.toggleSidebar);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    initializeData();

    const pathParts = location.pathname.split("/");
    const currentPath = pathParts[pathParts.length - 1];

    const tabMap: Record<string, string> = {
      dashboard: "dashboard",
      events: "events",
      reports: "reports",
      requests: "requests",
      teams: "teams",
      donations: "donations",
      users: "users",
      "": "dashboard",
    };

    const newActiveTab = tabMap[currentPath] || "events";

    if (activeTab !== newActiveTab) {
      setActiveTab(newActiveTab);
    }
  }, [location.pathname, initializeData, setActiveTab, activeTab]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleToggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      toggleSidebar();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          !isMobile && sidebarCollapsed ? "lg:ml-20" : "lg:ml-64",
          "w-full"
        )}
      >
        <AdminNavbar
          isMobile={isMobile}
          onToggleSidebar={handleToggleSidebar}
          sidebarOpen={sidebarOpen}
        />
        <main className="flex-1 overflow-auto bg-white">
          <div className="p-4 md:p-6">
            <Outlet />
            {children}
          </div>
        </main>
      </div>

      <DisasterNotification />

      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          classNames: {
            toast: "font-sans",
            title: "font-semibold",
          },
        }}
      />
    </div>
  );
}

export default AdminLayout;
