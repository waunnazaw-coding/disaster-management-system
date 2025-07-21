"use client"

import { useState, useEffect } from "react"
import { Gift, Check, X, Eye, RefreshCw, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import toast from "react-hot-toast"
import { donationService, type DonationDto } from "@/api/donationService"

export default function DonationManagement() {
  const [donations, setDonations] = useState<DonationDto[]>([])
  const [filteredDonations, setFilteredDonations] = useState<DonationDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedDonation, setSelectedDonation] = useState<DonationDto | null>(null)
  const [actionDialog, setActionDialog] = useState<{
    open: boolean
    action: "verify" | "reject" | null
    donation: DonationDto | null
  }>({
    open: false,
    action: null,
    donation: null,
  })

  const fetchDonations = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await donationService.getAllDonations()
      setDonations(data)
      setFilteredDonations(data)
    } catch (err) {
      setError("Failed to load donations. Please try again.")
      console.error("Error fetching donations:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDonations()
  }, [])

  useEffect(() => {
    let filtered = donations

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (donation) =>
          donation.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          donation.donorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          donation.type.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((donation) => donation.status === statusFilter)
    }

    setFilteredDonations(filtered)
  }, [donations, searchTerm, statusFilter])

  const handleStatusUpdate = async (donationId: number, newStatus: string) => {
    try {
      await donationService.updateDonationStatus(donationId, newStatus)

      // Update local state
      setDonations((prev) =>
        prev.map((donation) => (donation.id === donationId ? { ...donation, status: newStatus as any } : donation)),
      )

      toast.success(`Donation ${newStatus.toLowerCase()} successfully!`)
      setActionDialog({ open: false, action: null, donation: null })
    } catch (error) {
      toast.error(`Failed to ${newStatus.toLowerCase()} donation. Please try again.`)
      console.error("Error updating donation status:", error)
    }
  }

  const openActionDialog = (action: "verify" | "reject", donation: DonationDto) => {
    setActionDialog({ open: true, action, donation })
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

  const pendingCount = donations.filter((d) => d.status === "Pending").length
  const verifiedCount = donations.filter((d) => d.status === "Verified").length
  const distributedCount = donations.filter((d) => d.status === "Distributed").length

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
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Donations</p>
                <p className="text-2xl font-bold">{donations.length}</p>
              </div>
              <Gift className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <RefreshCw className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Verified</p>
                <p className="text-2xl font-bold text-blue-600">{verifiedCount}</p>
              </div>
              <Check className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Distributed</p>
                <p className="text-2xl font-bold text-green-600">{distributedCount}</p>
              </div>
              <Check className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-green-600" />
              All Donations ({filteredDonations.length})
            </CardTitle>
            <Button variant="outline" size="sm" onClick={fetchDonations}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mt-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search donations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Verified">Verified</SelectItem>
                <SelectItem value="Distributed">Distributed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredDonations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Gift className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No donations found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Donor</TableHead>
                    <TableHead>Name & Type</TableHead>
                    <TableHead>Amount/Quantity</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDonations.map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell className="font-medium">#{donation.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{donation.donorName || "Anonymous"}</p>
                          <p className="text-xs text-gray-500">{donation.sourceType}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="font-medium">{donation.name || donation.type}</p>
                          <p className="text-sm text-gray-500">{donation.type}</p>
                          {donation.description && (
                            <p className="text-xs text-gray-400 truncate">{donation.description}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{formatAmount(donation)}</span>
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
                        {donation.dateReceived ? new Date(donation.dateReceived).toLocaleDateString() : "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedDonation(donation)}
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
                  ))}
                </TableBody>
              </Table>
            </div>
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
    </div>
  )
}
