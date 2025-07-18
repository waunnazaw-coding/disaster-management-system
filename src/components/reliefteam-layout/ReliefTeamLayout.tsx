import { useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { useAdminStore } from "../../store/adminStore"
import { cn } from "../../lib/utils"
import { ReliefTeamSidebar } from "./Sidebar"
import { ReliefTeamNavbarExtras } from "./Navbar"
import { ChevronLeft, ChevronRight } from "lucide-react"

 function ReliefTeamLayout() {
  const initializeData = useAdminStore((s) => s.initializeData)
  const sidebarCollapsed = useAdminStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useAdminStore((s) => s.toggleSidebar)
  const activeTab = useAdminStore((s) => s.activeTab)
  const setActiveTab = useAdminStore((s) => s.setActiveTab)

  const location = useLocation()

  useEffect(() => {
    initializeData()

    const pathParts = location.pathname.split("/")
    const currentPath = pathParts[pathParts.length - 1]

    const tabMap: Record<string, string> = {
      "dashboard": "dashboard",
      "members": "members",
      "requests": "requests",
      "donations": "donations",
      "": "dashboard",
    }

    const newActiveTab = tabMap[currentPath] || "dashboard"
    if (activeTab !== newActiveTab) setActiveTab(newActiveTab)
  }, [location.pathname, initializeData, setActiveTab, activeTab])

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full bg-white border-r border-gray-200 shadow transition-width duration-300 z-50",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
  {!sidebarCollapsed && (
    <div className="text-lg font-semibold text-green-700">DisasterGuard</div>
  )}
  <button
    onClick={toggleSidebar}
    aria-label="Toggle sidebar"
    className="text-green-700 hover:text-green-800 focus:outline-none"
  >
    {sidebarCollapsed ? (
      <ChevronRight className="w-5 h-5" />
    ) : (
      <ChevronLeft className="w-5 h-5" />
    )}
  </button>
</div>


        {/* Nav - put links here */}
        <ReliefTeamSidebar />
      </aside>

      {/* Main content */}
      <div
        className={cn(
          "flex-1 flex flex-col transition-margin duration-300",
          sidebarCollapsed ? "ml-16" : "ml-64"
        )}
      >
        <nav className="h-14 bg-green-600 flex items-center px-4 text-white shadow">
  <h1 className="text-xl font-semibold">Relief Team Dashboard</h1>
  <ReliefTeamNavbarExtras />
</nav>
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default ReliefTeamLayout
