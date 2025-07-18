import { useEffect } from "react"
import { useAdminStore } from "../../store/adminStore"
import { cn } from "../../lib/utils"
import { AdminNavbar } from "./AdminNavbar"
import { Outlet, useLocation } from "react-router-dom"
import { AdminSidebar } from "./AdminSidebar"

function Adminlayout({ children }: { children?: React.ReactNode }) {
  // Select needed store functions and values with stable references
  const initializeData = useAdminStore((state) => state.initializeData)
  const setActiveTab = useAdminStore((state) => state.setActiveTab)
  const activeTab = useAdminStore((state) => state.activeTab)
  const sidebarCollapsed = useAdminStore((state) => state.sidebarCollapsed)

  const location = useLocation()

  useEffect(() => {
    initializeData()

    // Extract last path segment to determine active tab
    const pathParts = location.pathname.split("/")
    const currentPath = pathParts[pathParts.length - 1]

    // Map URL path segment to tab id
    const tabMap: Record<string, string> = {
      dashboard: "dashboard",
      events: "events",
      reports: "reports",
      requests: "requests",
      teams: "teams",
      donations: "donations",
      "": "dashboard", // default root path
    }

    // Determine new active tab based on path
    const newActiveTab = tabMap[currentPath] || "dashboard"

    // Update active tab only if it changed to prevent infinite render loop
    if (activeTab !== newActiveTab) {
      setActiveTab(newActiveTab)
    }
  }, [location.pathname, initializeData, setActiveTab, activeTab])

  return (
      <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <AdminSidebar />
        <div
            className={cn(
                "flex-1 flex flex-col transition-all duration-300",
                sidebarCollapsed ? "ml-16" : "ml-64"
            )}
        >
          <AdminNavbar />
          <main className="flex-1 overflow-auto bg-gradient-to-br from-white/50 to-blue-50/30">
            <div className="p-6">
              <Outlet /> {/* renders the matched route component */}
              {children}
            </div>
          </main>
        </div>
      </div>
  )
}

export default Adminlayout
