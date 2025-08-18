import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Search } from "lucide-react"
import type { FinancialAllocationResponseDto } from "@/api/financialAllocationService"


interface AllocationsTableProps {
  allocations: FinancialAllocationResponseDto[]
  onEdit: (allocation: FinancialAllocationResponseDto) => void
  onDelete: (id: number) => void
}


export function AllocationsTable({ allocations, onEdit, onDelete }: AllocationsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof FinancialAllocationResponseDto>("allocationDate")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const filteredAllocations = allocations.filter(
    (allocation) =>
      allocation.detailName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      allocation.allocationTypeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (allocation.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false),
  )

  const sortedAllocations = [...filteredAllocations].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return aValue.localeCompare(bValue) * (sortDirection === "asc" ? 1 : -1)
    }

    return 0
  })

  const handleSort = (field: keyof FinancialAllocationResponseDto) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "-"
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      Education: "bg-blue-100 text-blue-800",
      Healthcare: "bg-green-100 text-green-800",
      Environment: "bg-emerald-100 text-emerald-800",
      Community: "bg-purple-100 text-purple-800",
      "Emergency Relief": "bg-red-100 text-red-800",
    }
    return colors[type] || "bg-gray-100 text-gray-800"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Financial Allocations</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search allocations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("detailName")}>
                  Detail Name {sortField === "detailName" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("allocationTypeName")}
                >
                  Type {sortField === "allocationTypeName" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("amount")}>
                  Amount {sortField === "amount" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("allocationDate")}>
                  Date {sortField === "allocationDate" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="w-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAllocations.map((allocation) => (
                <TableRow key={allocation.allocationId}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">{allocation.detailName}</div>
                      {allocation.detailDescription && (
                        <div className="text-sm text-muted-foreground">{allocation.detailDescription}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(allocation.allocationTypeName)}>
                      {allocation.allocationTypeName}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold">{formatCurrency(allocation.amount)}</TableCell>
                  <TableCell>{formatDate(allocation.allocationDate)}</TableCell>
                  <TableCell className="max-w-xs truncate">{allocation.notes || "-"}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(allocation)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(allocation.allocationId)} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {sortedAllocations.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">No allocations found matching your search.</div>
        )}
      </CardContent>
    </Card>
  )
}
