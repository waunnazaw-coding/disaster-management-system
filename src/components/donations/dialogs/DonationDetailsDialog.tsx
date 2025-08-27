"use client"

import {
  Check,
  X,
  Phone,
  User,
  Calendar,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { DonationDto } from "@/api/donationService"
import { toast } from "sonner"

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
    const iconClass = "h-4 w-4"
    switch (status) {
      case "Distributed":
        return <Check className={`${iconClass} text-green-600`} />
      case "Verified":
        return <Check className={`${iconClass} text-blue-600`} />
      case "Pending":
        return <Check className={`${iconClass} text-yellow-600`} />
      case "Cancelled":
        return <X className={`${iconClass} text-red-600`} />
      default:
        return <Check className={`${iconClass} text-gray-500`} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Distributed":
        return "bg-green-50 text-green-700 border-green-200"
      case "Verified":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "Pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getSourceIcon = (sourceType: string) => {
    const iconClass = "h-4 w-4 text-gray-500"
    switch (sourceType) {
      case "Organization":
      case "NGO":
      case "Company":
        return <Building2 className={iconClass} />
      default:
        return <User className={iconClass} />
    }
  }

  const formatAmount = (donation: DonationDto) => {
    if (donation.amount && donation.currency) {
      return `${donation.currency} ${donation.amount.toLocaleString()}`
    }
    return "N/A"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full h-[92vh] flex flex-col p-0 overflow-hidden rounded-xl shadow-xl">
        {/* HEADER */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-gray-50/50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                Donation Details
                <Badge variant="outline" className="text-xs font-mono px-2 py-0.5">
                  #{donation.id}
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-sm mt-1 text-gray-500">
                Detailed view of the donation record
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(donation.status)}
              <Badge className={`${getStatusColor(donation.status)} px-3 py-1 text-sm rounded-full`}>
                {donation.status}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        {/* BODY */}
        <div className="flex-1 overflow-auto p-6 space-y-8">
          {/* Overview */}
          <section className="space-y-4 bg-white p-4 rounded-lg border">
            <h2 className="text-lg font-semibold">Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem label="Name" value={donation.name} />
              <InfoItem
                label="Amount"
                value={formatAmount(donation)}
                highlight
              />
              <div>
                <p className="text-xs text-gray-500">Source Type</p>
                <div className="flex items-center gap-2 font-medium mt-1">
                  {getSourceIcon(donation.sourceType)}
                  <span>{donation.sourceType}</span>
                </div>
              </div>
            </div>
            {donation.description && (
              <InfoItem label="Description" value={donation.description} />
            )}
          </section>

          {/* Payment Details */}
          <section className="space-y-4 bg-white p-4 rounded-lg border">
            <h2 className="text-lg font-semibold">Payment Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem
                label="Amount"
                value={`${donation.currency} ${donation.amount?.toLocaleString() || "N/A"}`}
                highlight
              />
              <InfoItem label="Payment Method" value={donation.paymentMethod || "N/A"} />
            </div>
          </section>

          {/* Donor */}
          <section className="space-y-4 bg-white p-4 rounded-lg border">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5 text-purple-600" />
              Donor
            </h2>
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-purple-100 text-purple-600 font-bold">
                  {donation.donorName?.charAt(0).toUpperCase() || "A"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold">{donation.donorName || "Anonymous"}</p>
                <p className="text-sm text-gray-500">{donation.sourceType}</p>
              </div>
            </div>
            {donation.donorPhoneNumber && (
              <InfoItem
                label="Phone Number"
                value={
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {donation.donorPhoneNumber}
                  </div>
                }
              />
            )}
          </section>

          {/* Timeline */}
          <section className="space-y-4 bg-white p-4 rounded-lg border">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              Timeline
            </h2>
            <TimelineItem
              label="Donation Received"
              date={donation.dateReceived}
              color="bg-blue-500"
            />
            {donation.status !== "Pending" && (
              <TimelineItem
                label={`Status Updated to ${donation.status}`}
                color={
                  donation.status === "Verified"
                    ? "bg-green-500"
                    : donation.status === "Cancelled"
                    ? "bg-red-500"
                    : "bg-gray-400"
                }
              />
            )}
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
                    toast.info("Donation rejection initiated")
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
                    toast.info("Donation verification initiated")
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

/* Subcomponent for cleaner info rendering */
function InfoItem({ label, value, highlight }: { label: string; value: any; highlight?: boolean }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p
        className={`mt-1 break-words ${
          highlight ? "text-lg font-bold text-green-600" : "font-medium text-gray-800"
        }`}
      >
        {value}
      </p>
    </div>
  )
}

/* Subcomponent for timeline entries */
function TimelineItem({ label, date, color }: { label: string; date?: any; color: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className={`mt-1 w-2 h-2 ${color} rounded-full`}></div>
      <div>
        <p className="text-sm font-medium">{label}</p>
        {date && (
          <p className="text-xs text-gray-500">
            {new Date(date).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  )
}
