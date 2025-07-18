import { useAdminStore } from "../../store/adminStore"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { Bell, BellOff, User, Settings, LogOut } from "lucide-react"

// Note: lucide-react currently doesn’t have a filled Bell icon. 
// You can either use Bell with extra styles or use BellOff as a placeholder.

export function ReliefTeamNavbarExtras() {
  const currentUser = useAdminStore((state) => state.currentUser)

  const logout = () => {
    alert("Logging out - replace with real logic")
  }

  return (
    <div className="ml-auto flex items-center space-x-4">
      {/* Notification Icon Only */}
      <Button
        variant="ghost"
        size="sm"
        className="text-white hover:bg-white/20"
        aria-label="Notifications"
      >
        {/* Use Bell icon bigger and bolder */}
        <Bell className="w-8 h-8" />
      </Button>

      {/* Profile Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-8 w-8 rounded-full p-0 text-white hover:bg-white/20"
            aria-label="User menu"
          >
            <Avatar className="h-8 w-8 ring-2 ring-green-300 ring-offset-2">
              <AvatarImage src={currentUser?.avatar || "/placeholder.svg"} alt={currentUser?.name || "User"} />
              <AvatarFallback className="bg-green-500 text-white font-semibold">
                {currentUser?.name?.charAt(0).toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{currentUser?.name || "User"}</p>
              <p className="text-xs leading-none text-green-200">{currentUser?.email || "user@example.com"}</p>
              {currentUser?.role && (
                <Badge variant="secondary" className="w-fit mt-1 bg-green-100 text-green-800 border-green-200">
                  {currentUser.role}
                </Badge>
              )}
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem className="flex items-center space-x-2 cursor-pointer hover:bg-green-100">
            <User className="w-4 h-4 text-green-600" />
            <span>Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="flex items-center space-x-2 cursor-pointer hover:bg-green-100">
            <Settings className="w-4 h-4 text-green-600" />
            <span>Settings</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={logout}
            className="flex items-center space-x-2 cursor-pointer hover:bg-red-100 text-red-600"
          >
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
