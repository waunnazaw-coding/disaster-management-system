"use client"

import { Bell, Check, Eye, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Notification } from "@/types/user"

interface NotificationsTabProps {
  notifications: Notification[]
  onMarkAsRead: (id: number) => void
  onMarkAllAsRead: () => void
}

export default function NotificationsTab({ notifications, onMarkAsRead, onMarkAllAsRead }: NotificationsTabProps) {
  const unreadCount = notifications.filter((n) => !n.isRead).length

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      case "info":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            Notifications ({notifications.length})
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} unread
              </Badge>
            )}
          </CardTitle>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={onMarkAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              Mark all read
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No notifications yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Message</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notifications.map((notification) => (
                  <TableRow key={notification.id} className={!notification.isRead ? "bg-blue-50" : ""}>
                    <TableCell>
                      <div className="max-w-md">
                        <p className={`${!notification.isRead ? "font-medium" : ""}`}>{notification.message}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(notification.type || "info")}>{notification.type || "Info"}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(notification.createdAt)}</TableCell>
                    <TableCell>
                      <Badge variant={notification.isRead ? "secondary" : "default"}>
                        {notification.isRead ? "Read" : "Unread"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {!notification.isRead && (
                          <Button variant="ghost" size="sm" onClick={() => onMarkAsRead(notification.id)}>
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
