import { useAdminStore } from "../../store/adminStore"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { Bell, LogOut, Settings, User, RefreshCw } from "lucide-react"
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";


export function AdminNavbar() {
  const {dashboardStats } = useAdminStore();
  const navigate = useNavigate();

  const currentUser = useAuthStore((state: { user: any }) => state.user);
  const logout = useAuthStore((state: { logout: any }) => state.logout);

   async function handleLogout() {
    await logout(navigate);
    navigate("/");
  }


  const totalPendingItems =
    dashboardStats.pendingReports + dashboardStats.pendingRequests + dashboardStats.pendingDonations

  return (
    <header className="bg-gradient-to-r from-white via-blue-50 to-indigo-100 border-b border-indigo-200/50 shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - Title and breadcrumb */}
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-xl font-semibold bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent">
              Disaster Management Dashboard
            </h1>
            <p className="text-sm text-slate-600">Monitor and coordinate emergency response operations</p>
          </div>
        </div>

        {/* Right side - Actions and user menu */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative hover:bg-blue-100/50 text-slate-700">
            <Bell className="w-5 h-5" />
            {totalPendingItems > 0 && (
              <Badge className="absolute -top-1 -right-1 px-1 min-w-[18px] h-[18px] text-xs bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 border-0 shadow-lg">
                {totalPendingItems}
              </Badge>
            )}
          </Button>

          {/* Refresh */}
          <Button variant="ghost" size="sm" className="hover:bg-blue-100/50 text-slate-700">
            <RefreshCw className="w-5 h-5" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10 ring-2 ring-blue-200 ring-offset-2">
                  <AvatarImage src={ "/placeholder.svg"} alt={currentUser?.name} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                    {currentUser?.name?.charAt(0) || "A"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{currentUser?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{currentUser?.email}</p>
                  <Badge
                    variant="secondary"
                    className="w-fit mt-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200"
                  >
                    {currentUser?.role}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
