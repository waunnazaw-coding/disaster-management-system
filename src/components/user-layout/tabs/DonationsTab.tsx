"use client"

import { useState, useEffect } from "react"
import { Gift, Eye, Edit, Trash2, Clock, CheckCircle, XCircle, RefreshCw, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { donationService, type DonationDto } from "@/api/donationService"
import EditDonationDialog from "@/components/donations/dialogs/EditDonationDialog"
import DeleteDonationDialog from "@/components/donations/dialogs/DeleteDonationDialog"
import DonationDetailsDialog from "@/components/donations/dialogs/DonationDetailsDialog"

interface DonationsTabProps {
  refreshTrigger?: number
}

export default function DonationsTab({ refreshTrigger }: DonationsTabProps) {
  const [donations, setDonations] = useState<DonationDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Dialog states
  const [editDialog, setEditDialog] = useState<{
    open: boolean
    donation: DonationDto | null
  }>({
    open: false,
    donation: null,
  })

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    donation: DonationDto | null
  }>({
    open: false,
    donation: null,
  })

  const [detailsDialog, setDetailsDialog] = useState<{
    open: boolean
    donation: DonationDto | null
  }>({
    open: false,
    donation: null,
  })

  const fetchDonations = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await donationService.getUserDonations()
      setDonations(data)
    } catch (err) {
      setError("Failed to load donations. Please try again.")
      console.error("Error fetching donations:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDonations()
  }, [refreshTrigger])

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
        <div className="text-xs text-gray-500">
          <div>{donation.paymentMethod}</div>
          {donation.donorPhoneNumber && (
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <span className="truncate">{donation.donorPhoneNumber}</span>
            </div>
          )}
        </div>
      )
    }
    return null
  }

  const handleEditSuccess = (updatedDonation: DonationDto) => {
    setDonations((prev) => prev.map((d) => (d.id === updatedDonation.id ? updatedDonation : d)))
  }

  const handleDeleteSuccess = (deletedDonationId: number) => {
    setDonations((prev) => prev.filter((d) => d.id !== deletedDonationId))
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-green-600" />
            My Donations
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
            My Donations
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
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-green-600" />
              My Donations ({donations.length})
            </CardTitle>
            <Button variant="outline" size="sm" onClick={fetchDonations}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {donations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Gift className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="mb-4">No donations made yet</p>
              <Button onClick={() => (window.location.href = "/donations/new")}>Make Your First Donation</Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name & Type</TableHead>
                    <TableHead>Amount/Quantity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donations.map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="font-medium truncate">{donation.name || donation.type}</p>
                          <p className="text-sm text-gray-500">{donation.type}</p>
                          {donation.description && (
                            <p className="text-xs text-gray-400 truncate">{donation.description}</p>
                          )}
                          {getPaymentInfo(donation)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{formatAmount(donation)}</span>
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
                            title="View Details"
                            onClick={() => setDetailsDialog({ open: true, donation })}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {donation.status === "Pending" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                title="Edit"
                                onClick={() => setEditDialog({ open: true, donation })}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-800"
                                title="Delete"
                                onClick={() => setDeleteDialog({ open: true, donation })}
                              >
                                <Trash2 className="h-4 w-4" />
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

      {/* Dialogs */}
      <EditDonationDialog
        donation={editDialog.donation}
        open={editDialog.open}
        onOpenChange={(open) => setEditDialog({ open, donation: open ? editDialog.donation : null })}
        onSuccess={handleEditSuccess}
      />

      <DeleteDonationDialog
        donation={deleteDialog.donation}
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, donation: open ? deleteDialog.donation : null })}
        onSuccess={handleDeleteSuccess}
      />

      <DonationDetailsDialog
        donation={detailsDialog.donation}
        open={detailsDialog.open}
        onOpenChange={(open) => setDetailsDialog({ open, donation: open ? detailsDialog.donation : null })}
        showActions={false}
      />
    </>
  )
}
