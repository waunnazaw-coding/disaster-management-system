"use client"

import { useAdminStore } from "../../store/adminStore"
import { cn } from "../../lib/utils"
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
} from "lucide-react"
import { Button } from "../ui/button"
import { useNavigate } from "react-router-dom"

const navigation = [
  { id: "dashboard", name: "Overview", icon: LayoutDashboard, path: "dashboard" },
  { id: "events", name: "Disaster Events", icon: Calendar, path: "events" },
  { id: "reports", name: "Reports", icon: AlertTriangle, path: "reports" },
  { id: "requests", name: "Requests", icon: HelpCircle, path: "requests" },
  { id: "teams", name: "Relief Teams", icon: Users, path: "teams" },
  { id: "donations", name: "Donators", icon: Heart, path: "donations" },
]

export function AdminSidebar() {
  const { dashboardStats, sidebarCollapsed, toggleSidebar, setActiveTab } = useAdminStore()
  const navigate = useNavigate()

  const handleNavigation = (path: string, tabId: string) => {
    setActiveTab(tabId)
    navigate(`/admin/${path}`)
  }

  const getBadgeCount = (tabId: string) => {
    switch (tabId) {
      case "reports":
        return dashboardStats.pendingReports
      case "requests":
        return dashboardStats.pendingRequests
      case "donations":
        return dashboardStats.pendingDonations
      default:
        return 0
    }
  }

  return (
      <div
          className={cn(
              "fixed left-0 top-0 h-full bg-gradient-to-b from-blue-950 via-blue-900 to-blue-800 shadow-lg border-r border-blue-800 transition-all duration-300 z-50",
              sidebarCollapsed ? "w-16" : "w-64"
          )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-blue-700 bg-blue-900">
          {!sidebarCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">DisasterAdmin</h1>
                  <p className="text-xs text-blue-300">Management Portal</p>
                </div>
              </div>
          )}
          <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="p-1.5 hover:bg-blue-700/50 text-white"
              aria-label="Toggle Sidebar"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-2">
          {navigation.map((item) => {
            const Icon = item.icon
            const badgeCount = getBadgeCount(item.id)
            const active = item.id === useAdminStore.getState().activeTab

            return (
                <div
                    key={item.id}
                    onClick={() => handleNavigation(item.path, item.id)}
                    className={cn(
                        "w-full flex items-center justify-between px-3 py-3 mb-1 rounded-lg cursor-pointer text-sm font-medium transition",
                        active
                            ? "bg-blue-700 text-blue-300 shadow-md border border-blue-600"
                            : "text-blue-300 hover:bg-blue-800 hover:text-white"
                    )}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") handleNavigation(item.path, item.id)
                    }}
                    aria-current={active ? "page" : undefined}
                >
                  <div className="flex items-center">
                    <Icon className={cn("w-5 h-5", active ? "text-blue-400" : "text-blue-400/70")} />
                    {!sidebarCollapsed && <span className="ml-3 truncate">{item.name}</span>}
                  </div>
                  {!sidebarCollapsed && badgeCount > 0 && (
                      <span className="bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow select-none">
                  {badgeCount}
                </span>
                  )}
                </div>
            )
          })}
        </nav>

        {/* Stats Summary */}
        {!sidebarCollapsed && (
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-blue-800 rounded-lg p-3 border border-blue-700 shadow-sm">
                <h3 className="text-sm font-semibold text-white mb-2">Quick Stats</h3>
                <div className="space-y-1 text-xs text-blue-300">
                  <div className="flex justify-between">
                    <span>Active Events:</span>
                    <span className="font-medium text-blue-400">{dashboardStats.activeEvents}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pending Items:</span>
                    <span className="font-medium text-orange-400">
                  {dashboardStats.pendingReports + dashboardStats.pendingRequests + dashboardStats.pendingDonations}
                </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Teams:</span>
                    <span className="font-medium text-green-400">{dashboardStats.activeTeams}</span>
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
  )
}
