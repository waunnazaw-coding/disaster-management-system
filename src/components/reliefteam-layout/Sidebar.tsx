import { useAdminStore } from "../../store/adminStore"
import { cn } from "../../lib/utils"
import {
  Users,
  HelpCircle,
  Heart,
  LayoutDashboard,
  ClipboardList
} from "lucide-react"
import { useNavigate } from "react-router-dom"

const navigation = [
  { id: "dashboard", name: "Dashboard", icon: LayoutDashboard, path: "dashboard" },
  // { id: "members", name: "Team Members", icon: Users, path: "members" },
  { id: "assignments", name: "requests-assignments", icon: HelpCircle, path: "assignments" },
  // { id: "donations", name: "Donations", icon: Heart, path: "donations" },
  // { id: "activity", name: "Activity Log", icon: ClipboardList, path: "actvities" },
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
              active ? "bg-gray-100 text-gray-900 font-semibold" : "text-gray-700 hover:bg-gray-50"
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
