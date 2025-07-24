"use client"

import { useState, useEffect } from "react"
import {
  Gift,
  Check,
  X,
  Eye,
  RefreshCw,
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import toast from "react-hot-toast"
import { donationService, type DonationDto } from "@/api/donationService"
import { useAdminStore } from "@/store/adminStore"
import DonationFilters from "@/components/donations/DonationFilters"
import DonationStats from "@/components/donations/DonationStats"
import DonationDetailsDialog from "@/components/donations/dialogs/DonationDetailsDialog"

// Pagination configuration
const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100]
const DEFAULT_ITEMS_PER_PAGE = 10

// Date sorting options
type DateSortOrder = "asc" | "desc" | null

export default function DonationManagement() {
  const [donations, setDonations] = useState<DonationDto[]>([])
  const [filteredDonations, setFilteredDonations] = useState<DonationDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [selectedDonation, setSelectedDonation] = useState<DonationDto | null>(null)
  const [detailsDialog, setDetailsDialog] = useState(false)
  const [actionDialog, setActionDialog] = useState<{
    open: boolean
    action: "verify" | "reject" | null
    donation: DonationDto | null
  }>({
    open: false,
    action: null,
    donation: null,
  })
  const [activeTab, setActiveTab] = useState("all")

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE)

  // Date sorting state
  const [dateSortOrder, setDateSortOrder] = useState<DateSortOrder>(null)

  // Get dashboard stats from admin store
  const updateDashboardStats = useAdminStore((state) => state.updateDashboardStats)

  const fetchDonations = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await donationService.getAllDonations()
      setDonations(data)

      // Update dashboard stats
      updateDashboardStats({
        pendingDonations: data.filter((d) => d.status === "Pending").length,
      })

      applyFilters(data, searchTerm, statusFilter, typeFilter, activeTab, dateSortOrder)
    } catch (err: any) {
      setError("Failed to load donations. Please try again.")
      console.error("Error fetching donations:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDonations()
  }, [])

  const applyFilters = (
    data: DonationDto[],
    search: string,
    status: string,
    type: string,
    tab: string,
    sortOrder: DateSortOrder,
  ) => {
    let filtered = [...data]

    // Apply tab filter first
    if (tab === "pending") {
      filtered = filtered.filter((d) => d.status === "Pending")
    } else if (tab === "verified") {
      filtered = filtered.filter((d) => d.status === "Verified")
    } else if (tab === "distributed") {
      filtered = filtered.filter((d) => d.status === "Distributed")
    } else if (tab === "cancelled") {
      filtered = filtered.filter((d) => d.status === "Cancelled")
    }

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        (donation) =>
          donation.name?.toLowerCase().includes(searchLower) ||
          donation.donorName?.toLowerCase().includes(searchLower) ||
          donation.description?.toLowerCase().includes(searchLower) ||
          donation.type.toLowerCase().includes(searchLower) ||
          donation.donorPhoneNumber?.toLowerCase().includes(searchLower) ||
          donation.id.toString().includes(searchLower),
      )
    }

    // Filter by status
    if (status !== "all") {
      filtered = filtered.filter((donation) => donation.status === status)
    }

    // Filter by type
    if (type !== "all") {
      filtered = filtered.filter((donation) => donation.type === type)
    }

    // Apply date sorting
    if (sortOrder) {
      filtered.sort((a, b) => {
        const dateA = a.dateReceived ? new Date(a.dateReceived).getTime() : 0
        const dateB = b.dateReceived ? new Date(b.dateReceived).getTime() : 0

        if (sortOrder === "asc") {
          return dateA - dateB
        } else {
          return dateB - dateA
        }
      })
    }

    setFilteredDonations(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }

  useEffect(() => {
    applyFilters(donations, searchTerm, statusFilter, typeFilter, activeTab, dateSortOrder)
  }, [donations, searchTerm, statusFilter, typeFilter, activeTab, dateSortOrder])

  const handleStatusUpdate = async (donationId: number, newStatus: string) => {
    try {
      await donationService.updateDonationStatus(donationId, newStatus)

      // Update local state
      const updatedDonations = donations.map((donation) =>
        donation.id === donationId ? { ...donation, status: newStatus as any } : donation,
      )
      setDonations(updatedDonations)

      // Update dashboard stats
      updateDashboardStats({
        pendingDonations: updatedDonations.filter((d) => d.status === "Pending").length,
      })

      toast.success(`Donation ${newStatus.toLowerCase()} successfully!`)
      setActionDialog({ open: false, action: null, donation: null })
    } catch (error: any) {
      toast.error(`Failed to ${newStatus.toLowerCase()} donation. Please try again.`)
      console.error("Error updating donation status:", error)
    }
  }

  const openActionDialog = (action: "verify" | "reject", donation: DonationDto) => {
    setActionDialog({ open: true, action, donation })
  }

  const viewDonationDetails = (donation: DonationDto) => {
    setSelectedDonation(donation)
    setDetailsDialog(true)
  }

  const handleDateSort = () => {
    if (dateSortOrder === null) {
      setDateSortOrder("desc") // Most recent first
    } else if (dateSortOrder === "desc") {
      setDateSortOrder("asc") // Oldest first
    } else {
      setDateSortOrder(null) // No sorting
    }
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Distributed":
        return <Check className="h-4 w-4 text-green-600" />
      case "Verified":
        return <Check className="h-4 w-4 text-blue-600" />
      case "Pending":
        return <RefreshCw className="h-4 w-4 text-yellow-600" />
      case "Cancelled":
        return <X className="h-4 w-4 text-red-600" />
      default:
        return <RefreshCw className="h-4 w-4 text-gray-600" />
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

  // Pagination calculations
  const totalItems = filteredDonations.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = filteredDonations.slice(startIndex, endIndex)

  // Generate page numbers for pagination
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

  const pendingCount = donations.filter((d) => d.status === "Pending").length
  const verifiedCount = donations.filter((d) => d.status === "Verified").length
  const distributedCount = donations.filter((d) => d.status === "Distributed").length
  const cancelledCount = donations.filter((d) => d.status === "Cancelled").length

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-green-600" />
            Donation Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Loading donations...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-green-600" />
            Donation Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={fetchDonations} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Donation Management</h1>
        <Button variant="outline" onClick={fetchDonations}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Statistics Cards */}
      <DonationStats
        totalCount={donations.length}
        pendingCount={pendingCount}
        verifiedCount={verifiedCount}
        distributedCount={distributedCount}
        cancelledCount={cancelledCount}
      />

      {/* Main Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-green-600" />
            Donations
          </CardTitle>
          <CardDescription>
            Manage and review all donations in the system. Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of{" "}
            {totalItems} donations
          </CardDescription>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending" className="text-yellow-600">
                Pending ({pendingCount})
              </TabsTrigger>
              <TabsTrigger value="verified" className="text-blue-600">
                Verified ({verifiedCount})
              </TabsTrigger>
              <TabsTrigger value="distributed" className="text-green-600">
                Distributed ({distributedCount})
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="text-red-600">
                Cancelled ({cancelledCount})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <DonationFilters
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            typeFilter={typeFilter}
            itemsPerPage={itemsPerPage}
            onSearchChange={setSearchTerm}
            onStatusFilterChange={setStatusFilter}
            onTypeFilterChange={setTypeFilter}
            onItemsPerPageChange={setItemsPerPage}
          />
        </CardHeader>

        <CardContent>
          {currentItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Gift className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No donations found</p>
              {searchTerm && <p className="text-sm mt-2">Try adjusting your search criteria</p>}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">#</TableHead>
                      <TableHead>Donor</TableHead>
                      <TableHead>Name & Type</TableHead>
                      <TableHead>Amount/Quantity</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleDateSort}
                          className="h-8 px-2 flex items-center gap-1"
                        >
                          <Calendar className="h-4 w-4" />
                          Date
                          {getDateSortIcon()}
                        </Button>
                      </TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentItems.map((donation, index) => {
                      const sequentialNumber = startIndex + index + 1
                      return (
                        <TableRow key={donation.id}>
                          <TableCell className="font-medium text-center">{sequentialNumber}</TableCell>
                          <TableCell>
                            <div className="max-w-[150px]">
                              <p className="font-medium truncate">{donation.donorName || "Anonymous"}</p>
                              <p className="text-xs text-gray-500 truncate">{donation.sourceType}</p>
                              {donation.donorPhoneNumber && (
                                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                  <Phone className="h-3 w-3" />
                                  <span className="truncate">{donation.donorPhoneNumber}</span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs">
                              <p className="font-medium truncate">{donation.name || donation.type}</p>
                              <p className="text-sm text-gray-500">{donation.type}</p>
                              {donation.description && (
                                <p className="text-xs text-gray-400 truncate mt-1" title={donation.description}>
                                  {donation.description}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">{formatAmount(donation)}</span>
                          </TableCell>
                          <TableCell>
                            {donation.paymentMethod ? (
                              <Badge variant="outline">{donation.paymentMethod}</Badge>
                            ) : (
                              <span className="text-gray-400">N/A</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{donation.sourceType}</Badge>
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
                                  <div>{new Date(donation.dateReceived).toLocaleDateString()}</div>
                                  <div className="text-xs text-gray-500">
                                    {new Date(donation.dateReceived).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </div>
                                </>
                              ) : (
                                "N/A"
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => viewDonationDetails(donation)}
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {donation.status === "Pending" && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openActionDialog("verify", donation)}
                                    className="text-green-600 hover:text-green-800"
                                    title="Verify"
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openActionDialog("reject", donation)}
                                    className="text-red-600 hover:text-red-800"
                                    title="Reject"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-500">
                    Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} donations
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
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
                              onClick={() => setCurrentPage(page as number)}
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
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Action Confirmation Dialog */}
      <Dialog
        open={actionDialog.open}
        onOpenChange={(open) => !open && setActionDialog({ open: false, action: null, donation: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{actionDialog.action === "verify" ? "Verify Donation" : "Reject Donation"}</DialogTitle>
            <DialogDescription>
              Are you sure you want to {actionDialog.action} donation #{actionDialog.donation?.id}?
              {actionDialog.action === "verify" &&
                " This will mark the donation as verified and ready for distribution."}
              {actionDialog.action === "reject" && " This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog({ open: false, action: null, donation: null })}>
              Cancel
            </Button>
            <Button
              variant={actionDialog.action === "verify" ? "default" : "destructive"}
              onClick={() => {
                if (actionDialog.donation) {
                  handleStatusUpdate(
                    actionDialog.donation.id,
                    actionDialog.action === "verify" ? "Verified" : "Cancelled",
                  )
                }
              }}
            >
              {actionDialog.action === "verify" ? "Verify" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Donation Details Dialog */}
      <DonationDetailsDialog
        donation={selectedDonation}
        open={detailsDialog}
        onOpenChange={setDetailsDialog}
        onVerify={(donation) => openActionDialog("verify", donation)}
        onReject={(donation) => openActionDialog("reject", donation)}
        showActions={true}
      />
    </div>
  )
}
