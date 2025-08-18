import { ColumnDef } from "@tanstack/react-table"
import { User } from "@/types/user"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { useState } from "react"
import { BlockUserModal } from "@/components/admin-layout/admin/BlockUserModal"

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as User["role"]

      const variantMap: Record<
        User["role"],
        "default" | "secondary" | "destructive" | "outline"
      > = {
        Admin: "destructive",
        SysAdmin: "destructive",
        ReliefTeam: "secondary",
        Org: "default",
        User: "outline",
      }

      const variant = variantMap[role] || "default"

      return <Badge variant={variant}>{role}</Badge>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as User["status"]
      return (
        <Badge variant={status === "Active" ? "default" : "secondary"}>
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) =>
      new Date(row.getValue("createdAt")).toLocaleDateString(),
  },
  {
    accessorKey: "Actions",
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const user = row.original
      const [blockModalOpen, setBlockModalOpen] = useState(false)

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setBlockModalOpen(true)}>
                {user.status === "Active" ? "Block User" : "Unblock User"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <BlockUserModal
            userId={user.id}
            userName={user.name}
            currentStatus={user.status}
            open={blockModalOpen}
            onOpenChange={setBlockModalOpen}
            onSuccess={() => row.toggleSelected(false)}
          />
        </>
      )
    },
  },
]
