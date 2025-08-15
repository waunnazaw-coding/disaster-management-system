"use client";

import { useAdminStore } from "../../store/adminStore";
import { cn } from "../../lib/utils";
import {
  LayoutDashboard,
  AlertTriangle,
  HelpCircle,
  Users,
  Heart,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Shield,
  Home,
  ClipboardList,
  ActivityIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

const navigation = [
  { id: "dashboard", name: "Overview", icon: LayoutDashboard, path: "dashboard" },
  { id: "events", name: "Disaster Events", icon: Calendar, path: "events" },
  { id: "reports", name: "Reports", icon: AlertTriangle, path: "reports" },
  { id: "requests", name: "Requests", icon: HelpCircle, path: "requests" },
  { id: "activity", name: "Activity", icon: ActivityIcon, path: "activity" }, // New
   { id: "assignments", name: "AssignmentsHistory", icon: ClipboardList, path: "assignments" },

  { id: "donations", name: "Donations", icon: Heart, path: "donations" },
  { id: "users", name: "Users", icon: Users, path: "users" },
   { id: "teams", name: "Relief Teams", icon: Users, path: "relief-team-lists" },
 
  { id: "teams", name: "Relief Teams", icon: Users, path: "relief-team-lists" },
  { id: "admin-invite", name: "Admin Invite", icon: Users, path: "admin-invite" },
  { id: "activity", name: "Activity", icon: ActivityIcon, path: "activity" }, // New
  { id: "financial", name: "Financial Reports", icon: Users, path: "financial-reports" },
];


interface AdminSidebarProps {
  isMobile: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function AdminSidebar({
  isMobile,
  sidebarOpen,
  setSidebarOpen,
}: AdminSidebarProps) {
  const { dashboardStats, sidebarCollapsed, toggleSidebar, setActiveTab } =
    useAdminStore();
  const navigate = useNavigate();

  const handleNavigation = (path: string, tabId: string) => {
    setActiveTab(tabId);
    navigate(`/admin/${path}`);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleHomeClick = () => {
    navigate("/");
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const getBadgeCount = (tabId: string) => {
    switch (tabId) {
      case "reports":
        return dashboardStats.pendingReports;
      case "requests":
        return dashboardStats.pendingRequests;
      case "donations":
        return dashboardStats.pendingDonations;
      default:
        return 0;
    }
  };

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-full z-50 transition-all duration-300",
        "border-r border-gray-200 bg-white",
        isMobile ? "w-64" : sidebarCollapsed ? "w-20" : "w-64",
        isMobile
          ? sidebarOpen
            ? "translate-x-0 shadow-xl"
            : "-translate-x-full"
          : ""
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-slate-800 text-white">
        {(!sidebarCollapsed || isMobile) && (
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-white" />
            <span className="font-semibold">Admin Menu</span>
          </div>
        )}
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-white hover:bg-slate-700"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        )}
      </div>

      <nav className="mt-4 px-2">
        {/* Back to Home Button */}
        {/* <div
          onClick={handleHomeClick}
          className={cn(
            "flex items-center px-3 py-3 mb-2 rounded-lg cursor-pointer",
            "text-sm font-medium transition-all",
            "text-slate-600 hover:bg-gray-50"
          )}
        >
          <Home className="w-5 h-5 text-slate-500" />
          {(!sidebarCollapsed || isMobile) && (
            <span className="ml-3">Back to Home</span>
          )}
        </div> */}

        {/* Navigation Items */}
        {navigation.map((item) => {
          const active = item.id === useAdminStore.getState().activeTab;
          const badgeCount = getBadgeCount(item.id);

          return (
            <div
              key={item.id}
              onClick={() => handleNavigation(item.path, item.id)}
              className={cn(
                "flex items-center px-3 py-3 mb-1 rounded-lg cursor-pointer",
                "text-sm font-medium transition-all",
                active
                  ? "bg-slate-100 text-slate-800 font-semibold"
                  : "text-slate-600 hover:bg-gray-50"
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5",
                  active ? "text-slate-800" : "text-slate-500"
                )}
              />
              {(!sidebarCollapsed || isMobile) && (
                <div className="flex items-center w-full">
                  <span className="ml-3 flex-grow">{item.name}</span>
                  {badgeCount > 0 && (
                    <span className="ml-auto bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {badgeCount}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
        
      </nav>

      {(!sidebarCollapsed || isMobile) && (
        <div className="absolute bottom-4 left-4 right-4 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800 mb-2">
            Quick Stats
          </h3>
          <div className="space-y-1 text-xs text-slate-700">
            <div className="flex justify-between">
              <span>Active Events:</span>
              <span className="font-medium text-slate-800">
                {dashboardStats.activeEvents}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Pending Items:</span>
              <span className="font-medium text-rose-500">
                {dashboardStats.pendingReports +
                  dashboardStats.pendingRequests +
                  dashboardStats.pendingDonations}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Active Teams:</span>
              <span className="font-medium text-emerald-500">
                {dashboardStats.activeTeams}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}