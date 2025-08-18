import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { User, Settings, LogOut } from "lucide-react";
import { useReliefStore } from "@/store/reliefStore";
import { useEffect } from "react";
import { useSignalR } from "@/hooks/useSignalR";
import { HubConnection } from "@microsoft/signalr";
import { useNotificationStore } from "@/store/notificationStore";
import { Notification } from "@/types/signalr";
import { NotificationDropdown } from "../Notification/NotificationDropdown";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router";

export function ReliefTeamNavbarExtras() {
  // const { logout, currentUser, initializeData } = useReliefStore();
  const handleLogout = useAuthStore((state) => state.logout)
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate();
  const connection = useSignalR() as HubConnection | null;
  const { addNotification, incrementUnreadCount } = useNotificationStore();

  // useEffect(() => {
  //   initializeData();
  // }, []);


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

  if (!user) return null;

  return (
    <div className="ml-auto flex items-center space-x-4">
      <NotificationDropdown />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-9 w-9 rounded-full hover:bg-slate-700">
            <Avatar className="h-8 w-8 border border-slate-600">
              {/* <AvatarImage src={user?.avatar || ""} /> */}
              <AvatarFallback className="bg-slate-700">
                {user?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 z-50" align="end">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
              <Badge className="w-fit mt-1 bg-slate-100 text-slate-800">
                {user.role}
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
            onClick={() => {
              handleLogout(); 
              navigate('/login'); // Redirect to login after logout
            }
            }                                                      
            className="text-red-600 focus:bg-red-50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
