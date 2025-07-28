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
import { Bell, User, Settings, LogOut } from "lucide-react"
import { useReliefStore } from "@/store/reliefStore"
import { useEffect } from "react"

export function ReliefTeamNavbarExtras() {
  const { logout, currentUser, initializeData } = useReliefStore()

  // If you haven’t already: call initializeData!
  useEffect(() => {
    initializeData();
  }, []);

  console.log("currentUser", currentUser);

  if (!currentUser) return null;

  return (
    <div className="ml-auto flex items-center space-x-4">
      <Button
        variant="ghost"
        size="sm"
        className="text-white hover:bg-white/20"
        aria-label="Notifications"
      >
        <Bell className="w-8 h-8" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-9 w-9 rounded-full hover:bg-slate-700">
            <Avatar className="h-8 w-8 border border-slate-600">
              <AvatarImage src={currentUser.avatar || ""} />
              <AvatarFallback className="bg-slate-700">
                {currentUser.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 z-50" align="end">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{currentUser.name}</p>
              <p className="text-xs leading-none text-muted-foreground">{currentUser.email}</p>
              <Badge className="w-fit mt-1 bg-slate-100 text-slate-800">
                {currentUser.role}
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
          <DropdownMenuItem
            onClick={logout}
            className="text-red-600 focus:bg-red-50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
