import { useAdminStore } from "../../store/adminStore"
import { cn } from "../../lib/utils"
import { Users, HelpCircle, Heart, LayoutDashboard } from "lucide-react"
import { useNavigate } from "react-router-dom"

const navigation = [
  { id: "dashboard", name: "Dashboard", icon: LayoutDashboard, path: "dashboard" },
  { id: "members", name: "Team Members", icon: Users, path: "members" },
  { id: "requests", name: "Assistance Requests", icon: HelpCircle, path: "requests" },
  { id: "donations", name: "Donations", icon: Heart, path: "donations" },
]

export function ReliefTeamSidebar() {
  const activeTab = useAdminStore((s) => s.activeTab)
  const setActiveTab = useAdminStore((s) => s.setActiveTab)
  const navigate = useNavigate()
  const sidebarCollapsed = useAdminStore((s) => s.sidebarCollapsed)

  const handleNavigation = (path: string, tabId: string) => {
    setActiveTab(tabId)
    navigate(`/relief/${path}`)
  }

  return (
    <nav className="mt-4 flex flex-col space-y-1">
      {navigation.map(({ id, name, icon: Icon, path }) => {
        const active = activeTab === id
        return (
          <button
            key={id}
            onClick={() => handleNavigation(path, id)}
            className={cn(
              "flex items-center px-4 py-3 w-full text-left rounded-md transition-colors",
              active ? "bg-green-100 text-green-900 font-semibold" : "text-green-700 hover:bg-green-50"
            )}
          >
            <Icon className="w-5 h-5 mr-3" />
            {!sidebarCollapsed && <span>{name}</span>}
          </button>
        )
      })}
    </nav>
  )
}
