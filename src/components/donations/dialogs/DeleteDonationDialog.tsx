"use client"

import { useState } from "react"
import { Trash2, X, AlertTriangle, Loader2 } from "lucide-react"
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
import { Card, CardContent } from "@/components/ui/card"
import toast from "react-hot-toast"
import { donationService, type DonationDto } from "@/api/donationService"

interface DeleteDonationDialogProps {
  donation: DonationDto | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (deletedDonationId: number) => void
}

export default function DeleteDonationDialog({ donation, open, onOpenChange, onSuccess }: DeleteDonationDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const formatAmount = (donation: DonationDto) => {
    if (donation.amount && donation.currency) {
      return `${donation.currency} ${donation.amount.toLocaleString()}`
    }
    if (donation.quantity && donation.unit) {
      return `${donation.quantity} ${donation.unit}`
    }
    return "N/A"
  }

  const handleDelete = async () => {
    if (!donation) return

    try {
      setIsDeleting(true)
      await donationService.deleteDonation(donation.id)
      onSuccess(donation.id)
      onOpenChange(false)
      toast.success("Donation deleted successfully!")
    } catch (error: any) {
      toast.error(error.message || "Failed to delete donation")
    } finally {
      setIsDeleting(false)
    }
  }

  if (!donation) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-red-900">Delete Donation</DialogTitle>
              <DialogDescription className="text-red-600 mt-1">
                This action cannot be undone. The donation will be permanently removed.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-red-700">Donation:</span>
                <span className="font-semibold text-red-900 text-right">{donation.name || donation.type}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-red-700">Amount:</span>
                <span className="font-bold text-red-900">{formatAmount(donation)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-red-700">Status:</span>
                <Badge variant="outline" className="border-red-300 text-red-800">
                  {donation.status}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-red-700">ID:</span>
                <span className="font-mono text-sm text-red-900">#{donation.id}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting} className="min-w-[120px]">
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Donation
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
