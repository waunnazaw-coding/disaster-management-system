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
import { LogOut, Settings, User, Menu, X } from "lucide-react"
import { NotificationDropdown } from "../Notification/NotificationDropdown"
import { useSignalR } from "@/hooks/useSignalR"
import { useNotificationStore } from "@/store/notificationStore"
import { useEffect } from "react"
import { HubConnection } from '@microsoft/signalr';
import { Notification } from "@/types/signalr";
import { useAuthStore } from "@/store/authStore"
import { useNavigate } from "react-router-dom"

interface AdminNavbarProps {
  isMobile: boolean
  onToggleSidebar: () => void
  sidebarOpen: boolean
}

export function AdminNavbar({ isMobile, onToggleSidebar, sidebarOpen }: AdminNavbarProps) {
  const { currentUser, dashboardStats } = useAdminStore()
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()
  const connection = useSignalR() as HubConnection | null;
  const { addNotification, incrementUnreadCount } = useNotificationStore();

  useEffect(() => {
    if (!connection) return;

    const handler = (notification: Notification) => {
      addNotification({
        ...notification,
        createdAt: notification.createdAt ? new Date(notification.createdAt) : new Date()
      });
      incrementUnreadCount();
    };

    connection.on('ReceiveNotification', handler);

    return () => {
      connection.off('ReceiveNotification', handler);
    };
  }, [connection, addNotification, incrementUnreadCount]);
  
  const totalPendingItems =
    dashboardStats.pendingReports + dashboardStats.pendingRequests + dashboardStats.pendingDonations

  if (!currentUser) {
    return <div className="h-16 bg-slate-800"></div>
  }

  return (
    <header className="bg-slate-800 text-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="text-slate-200 hover:bg-slate-700"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          <div>
            <h1 className="text-lg font-semibold">Admin Dashboard</h1>
            <p className="text-xs text-slate-300 hidden sm:block">Management Console</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <NotificationDropdown/>
        
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 w-9 rounded-full hover:bg-slate-700">
                <Avatar className="h-8 w-8 border border-slate-600">
                  <AvatarImage src={currentUser.avatar} />
                  <AvatarFallback className="bg-slate-700">
                    {currentUser.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
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
                 onClick={async () => {
                    await logout(); 
                    navigate('/login');
                  }}
                className="text-red-600 focus:bg-red-50"
              >
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