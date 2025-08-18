"use client"
import {
  Eye,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  Phone,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { DonationDto } from "@/api/donationService"

interface DonationTableProps {
  donations: DonationDto[]
  currentPage: number
  itemsPerPage: number
  totalItems: number
  dateSortOrder: "asc" | "desc" | null
  onPageChange: (page: number) => void
  onDateSort: () => void
  onView: (donation: DonationDto) => void
  onEdit?: (donation: DonationDto) => void
  onDelete?: (donation: DonationDto) => void
  showActions?: boolean
}

export default function DonationTable({
  donations,
  currentPage,
  itemsPerPage,
  totalItems,
  dateSortOrder,
  onPageChange,
  onDateSort,
  onView,
  onEdit,
  onDelete,
  showActions = true,
}: DonationTableProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Distributed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "Verified":
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      case "Pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "Cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Distributed":
        return "bg-green-100 text-green-800"
      case "Verified":
        return "bg-blue-100 text-blue-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatAmount = (donation: DonationDto) => {
    if (donation.amount && donation.currency) {
      return `${donation.currency} ${donation.amount.toLocaleString()}`
    }
    if (donation.quantity && donation.unit) {
      return `${donation.quantity} ${donation.unit}`
    }
    return "N/A"
  }

  const getPaymentInfo = (donation: DonationDto) => {
    if (donation.type === "Money" && donation.paymentMethod) {
      return (
        <div className="text-xs text-gray-500 mt-1">
          <div>{donation.paymentMethod}</div>
          {donation.donorPhoneNumber && (
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {donation.donorPhoneNumber}
            </div>
          )}
        </div>
      )
    }
    return null
  }

  const getDateSortIcon = () => {
    if (dateSortOrder === "desc") {
      return <ArrowDown className="h-4 w-4" />
    } else if (dateSortOrder === "asc") {
      return <ArrowUp className="h-4 w-4" />
    } else {
      return <ArrowUpDown className="h-4 w-4" />
    }
  }

  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push("...")
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push("...")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      }
    }
    return pages
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">#</TableHead>
              <TableHead>Name & Type</TableHead>
              <TableHead>Amount/Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDateSort}
                  className="h-8 px-2 flex items-center gap-1 hover:bg-gray-100"
                >
                  <Calendar className="h-4 w-4" />
                  Date
                  {getDateSortIcon()}
                </Button>
              </TableHead>
              {showActions && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {donations.map((donation, index) => {
              const sequentialNumber = startIndex + index + 1
              return (
                <TableRow key={donation.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-center text-gray-600">{sequentialNumber}</TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="font-medium text-gray-900">{donation.name || donation.type}</p>
                      <p className="text-sm text-gray-500">{donation.type}</p>
                      {donation.description && (
                        <p className="text-xs text-gray-400 truncate mt-1" title={donation.description}>
                          {donation.description}
                        </p>
                      )}
                      {getPaymentInfo(donation)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-gray-900">{formatAmount(donation)}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(donation.status)}
                      <Badge className={getStatusColor(donation.status)}>{donation.status}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {donation.dateReceived ? (
                        <>
                          <div className="font-medium text-gray-900">
                            {new Date(donation.dateReceived).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(donation.dateReceived).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </div>
                  </TableCell>
                  {showActions && (
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onView(donation)}
                          title="View Details"
                          className="hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {donation.status === "Pending" && onEdit && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(donation)}
                            title="Edit"
                            className="hover:bg-green-50 hover:text-green-600"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {donation.status === "Pending" && onDelete && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(donation)}
                            title="Delete"
                            className="hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} donations
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="hover:bg-gray-50"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, index) => (
                <div key={index}>
                  {page === "..." ? (
                    <span className="px-2 py-1 text-gray-500">...</span>
                  ) : (
                    <Button
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => onPageChange(page as number)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="hover:bg-gray-50"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
