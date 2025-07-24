"use client"

import {
  Check,
  X,
  Phone,
  User,
  Calendar,
  Package,
  Building2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { DonationDto } from "@/api/donationService"

interface DonationDetailsDialogProps {
  donation: DonationDto | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onVerify?: (donation: DonationDto) => void
  onReject?: (donation: DonationDto) => void
  showActions?: boolean
}

export default function DonationDetailsDialog({
  donation,
  open,
  onOpenChange,
  onVerify,
  onReject,
  showActions = false,
}: DonationDetailsDialogProps) {
  if (!donation) return null

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Distributed":
        return <Check className="h-4 w-4 text-green-600" />
      case "Verified":
        return <Check className="h-4 w-4 text-blue-600" />
      case "Pending":
        return <Package className="h-4 w-4 text-yellow-600" />
      case "Cancelled":
        return <X className="h-4 w-4 text-red-600" />
      default:
        return <Package className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Distributed":
        return "bg-green-100 text-green-800 border-green-200"
      case "Verified":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getSourceIcon = (sourceType: string) => {
    switch (sourceType) {
      case "Organization":
      case "NGO":
      case "Company":
        return <Building2 className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-full h-[95vh] flex flex-col p-0 overflow-hidden">
        {/* HEADER */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                Donation Details
                <Badge variant="outline" className="text-sm font-mono">
                  #{donation.id}
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-sm mt-1">
                View complete donation information
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(donation.status)}
              <Badge className={`${getStatusColor(donation.status)} px-3 py-1 text-sm`}>
                {donation.status}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        {/* BODY */}
        <div className="flex-1 overflow-auto p-6 space-y-8">
          {/* Overview */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Donation Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Name</p>
                <p className="text-base font-semibold break-words">
                  {donation.name || donation.type}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Type</p>
                <p className="font-medium">{donation.type}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Amount/Quantity</p>
                <p className="text-lg font-bold text-green-600">
                  {formatAmount(donation)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Source Type</p>
                <div className="flex items-center gap-2">
                  {getSourceIcon(donation.sourceType)}
                  <p className="font-medium break-words">{donation.sourceType}</p>
                </div>
              </div>
            </div>
            {donation.description && (
              <div>
                <p className="text-xs text-gray-500">Description</p>
                <p className="mt-1 text-gray-700 break-words">
                  {donation.description}
                </p>
              </div>
            )}
          </section>

          <Separator />

          {/* Payment or Item */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">
              {donation.type === "Money" ? "Payment Details" : "Item Details"}
            </h2>
            {donation.type === "Money" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Amount</p>
                  <p className="text-xl font-bold text-green-600">
                    {donation.currency} {donation.amount?.toLocaleString() || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Payment Method</p>
                  <p className="font-medium">
                    {donation.paymentMethod || "N/A"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Quantity</p>
                  <p className="text-xl font-bold text-blue-600">
                    {donation.quantity || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Unit</p>
                  <p className="font-medium">{donation.unit || "N/A"}</p>
                </div>
              </div>
            )}
          </section>

          <Separator />

          {/* Donor */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5 text-purple-600" />
              Donor
            </h2>
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-purple-100 text-purple-600">
                  {donation.donorName?.charAt(0).toUpperCase() || "A"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold break-words">
                  {donation.donorName || "Anonymous"}
                </p>
                <p className="text-sm text-gray-500 break-words">
                  {donation.sourceType}
                </p>
              </div>
            </div>
            {donation.donorPhoneNumber && (
              <div>
                <p className="text-xs text-gray-500">Phone Number</p>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <p className="text-sm">{donation.donorPhoneNumber}</p>
                </div>
              </div>
            )}
          </section>

          <Separator />

          {/* Timeline */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              Timeline
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Donation Received</p>
                  <p className="text-xs text-gray-500">
                    {donation.dateReceived
                      ? new Date(donation.dateReceived).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
              </div>
              {donation.status !== "Pending" && (
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-1 w-2 h-2 rounded-full ${
                      donation.status === "Verified"
                        ? "bg-green-500"
                        : donation.status === "Cancelled"
                        ? "bg-red-500"
                        : "bg-gray-400"
                    }`}
                  ></div>
                  <div>
                    <p className="text-sm font-medium">Status Updated</p>
                    <p className="text-xs text-gray-500">
                      Changed to {donation.status}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* FOOTER */}
        <DialogFooter className="px-6 py-4 border-t bg-gray-50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>

            {showActions && donation.status === "Pending" && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    onOpenChange(false)
                    onReject?.(donation)
                  }}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() => {
                    onOpenChange(false)
                    onVerify?.(donation)
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Verify
                </Button>
              </div>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
