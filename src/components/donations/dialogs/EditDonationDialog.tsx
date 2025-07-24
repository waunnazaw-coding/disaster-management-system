"use client"

import { useState, useEffect } from "react"
import { Save, X, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import toast from "react-hot-toast"
import { donationService, type DonationDto, type UpdateDonationDto } from "@/api/donationService"

interface EditDonationDialogProps {
  donation: DonationDto | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (updatedDonation: DonationDto) => void
}

const sourceTypes = [
  { value: "Personal", label: "Personal" },
  { value: "Organization", label: "Organization" },
  { value: "NGO", label: "NGO" },
  { value: "Company", label: "Company" },
  { value: "Anonymous", label: "Anonymous" },
]

export default function EditDonationDialog({
  donation,
  open,
  onOpenChange,
  onSuccess,
}: EditDonationDialogProps) {
  const [editForm, setEditForm] = useState<UpdateDonationDto>({
    name: "",
    type: "Money",
    description: "",
    sourceType: "Personal",
    amount: undefined,
    currency: "MMK",
    paymentMethod: undefined,
    quantity: undefined,
    unit: "",
    donorPhoneNumber: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (donation && open) {
      setEditForm({
        name: donation.name || "",
        type: donation.type as "Money" | "Item",
        description: donation.description || "",
        sourceType: donation.sourceType as
          | "Personal"
          | "Organization"
          | "NGO"
          | "Company"
          | "Anonymous",
        amount: donation.amount,
        currency: donation.currency || "MMK",
        paymentMethod: donation.paymentMethod as "KPay" | "BankTransfer" | "WavePay" | undefined,
        quantity: donation.quantity,
        unit: donation.unit || "",
        donorPhoneNumber: donation.donorPhoneNumber || "",
      })
      setErrors({})
    }
  }, [donation, open])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!editForm.name.trim()) newErrors.name = "Donation name is required"

    if (editForm.type === "Money") {
      if (!editForm.amount || editForm.amount <= 0)
        newErrors.amount = "Amount must be greater than 0"
      if (!editForm.currency) newErrors.currency = "Currency is required"
      if (!editForm.paymentMethod)
        newErrors.paymentMethod = "Payment method is required"
    } else {
      if (!editForm.quantity || editForm.quantity <= 0)
        newErrors.quantity = "Quantity must be greater than 0"
      if (!editForm.unit?.trim()) newErrors.unit = "Unit is required"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!donation || !validateForm()) return

    try {
      setIsSubmitting(true)
      const updatedDonation = await donationService.updateDonation(
        donation.id,
        editForm
      )
      onSuccess(updatedDonation)
      onOpenChange(false)
      toast.success("Donation updated successfully!")
    } catch (error: any) {
      toast.error(error.message || "Failed to update donation")
    } finally {
      setIsSubmitting(false)
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
      <DialogContent className="max-w-5xl w-[95vw] h-[95vh] max-h-[95vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            Edit Donation
            {donation && (
              <Badge variant="outline" className="font-mono">
                #{donation.id}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription className="text-sm">
            Update your donation details. Only pending donations can be edited.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto p-6">
          {donation && (
            <div className="space-y-6">
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-900">
                    Current Donation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-blue-700">Name:</span>
                      <span className="ml-2">{donation.name || donation.type}</span>
                    </div>
                    <div>
                      <span className="font-medium text-blue-700">Amount:</span>
                      <span className="ml-2">{formatAmount(donation)}</span>
                    </div>
                    <div>
                      <span className="font-medium text-blue-700">Type:</span>
                      <span className="ml-2">{donation.type}</span>
                    </div>
                    <div>
                      <span className="font-medium text-blue-700">Status:</span>
                      <Badge className="ml-2 bg-yellow-100 text-yellow-800">
                        {donation.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Separator />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Info */}
                <Card className="shadow-sm overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-lg">Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">Donation Name *</Label>
                      <Input
                        id="edit-name"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm((prev) => ({ ...prev, name: e.target.value }))
                        }
                        placeholder="Name"
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && (
                        <div className="flex items-center gap-1 text-red-600 text-sm">
                          <AlertCircle className="h-3 w-3" />
                          {errors.name}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Donation Type *</Label>
                      <RadioGroup
                        value={editForm.type}
                        onValueChange={(value) =>
                          setEditForm((prev) => ({
                            ...prev,
                            type: value as "Money" | "Item",
                            amount: value === "Item" ? undefined : prev.amount,
                            currency: value === "Item" ? undefined : prev.currency,
                            paymentMethod: value === "Item" ? undefined : prev.paymentMethod,
                            quantity: value === "Money" ? undefined : prev.quantity,
                            unit: value === "Money" ? "" : prev.unit,
                          }))
                        }
                        className="flex flex-col gap-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Money" id="edit-money" />
                          <Label htmlFor="edit-money">Money Donation</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Item" id="edit-item" />
                          <Label htmlFor="edit-item">Item Donation</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-description">Description</Label>
                      <Textarea
                        id="edit-description"
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Description"
                        rows={3}
                        className="resize-none"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Payment/Item Details */}
                <Card className="shadow-sm overflow-hidden">
                  <CardHeader>
                    <CardTitle>
                      {editForm.type === "Money" ? "Payment Details" : "Item Details"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {editForm.type === "Money" ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Amount *</Label>
                            <Input
                              type="number"
                              value={editForm.amount || ""}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  amount: Number(e.target.value) || undefined,
                                }))
                              }
                              className={errors.amount ? "border-red-500" : ""}
                            />
                            {errors.amount && (
                              <div className="flex items-center gap-1 text-red-600 text-sm">
                                <AlertCircle className="h-3 w-3" />
                                {errors.amount}
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label>Currency *</Label>
                            <Select
                              value={editForm.currency}
                              onValueChange={(value) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  currency: value,
                                }))
                              }
                            >
                              <SelectTrigger
                                className={`w-full ${errors.currency ? "border-red-500" : ""}`}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="MMK">MMK</SelectItem>
                                <SelectItem value="USD">USD</SelectItem>
                              </SelectContent>
                            </Select>
                            {errors.currency && (
                              <div className="flex items-center gap-1 text-red-600 text-sm">
                                <AlertCircle className="h-3 w-3" />
                                {errors.currency}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Payment Method *</Label>
                          <Select
                            value={editForm.paymentMethod || ""}
                            onValueChange={(value) =>
                              setEditForm((prev) => ({
                                ...prev,
                                paymentMethod: value as "KPay" | "BankTransfer" | "WavePay",
                              }))
                            }
                          >
                            <SelectTrigger
                              className={`w-full ${
                                errors.paymentMethod ? "border-red-500" : ""
                              }`}
                            >
                              <SelectValue placeholder="Select Payment" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="KPay">KPay</SelectItem>
                              <SelectItem value="BankTransfer">Bank Transfer</SelectItem>
                              <SelectItem value="WavePay">WavePay</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.paymentMethod && (
                            <div className="flex items-center gap-1 text-red-600 text-sm">
                              <AlertCircle className="h-3 w-3" />
                              {errors.paymentMethod}
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Quantity *</Label>
                          <Input
                            type="number"
                            value={editForm.quantity || ""}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                quantity: Number(e.target.value) || undefined,
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Unit *</Label>
                          <Input
                            value={editForm.unit}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                unit: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Source Information */}
                <Card className="lg:col-span-2 shadow-sm overflow-hidden">
                  <CardHeader>
                    <CardTitle>Source Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <RadioGroup
                      value={editForm.sourceType}
                      onValueChange={(value) =>
                        setEditForm((prev) => ({
                          ...prev,
                          sourceType: value as
                            | "Personal"
                            | "Organization"
                            | "NGO"
                            | "Company"
                            | "Anonymous",
                        }))
                      }
                      className="flex flex-wrap gap-3"
                    >
                      {sourceTypes.map((source) => (
                        <div
                          key={source.value}
                          className="flex items-center space-x-2 border p-2 rounded"
                        >
                          <RadioGroupItem value={source.value} id={`edit-${source.value}`} />
                          <Label htmlFor={`edit-${source.value}`}>{source.label}</Label>
                        </div>
                      ))}
                    </RadioGroup>

                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input
                        value={editForm.donorPhoneNumber}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            donorPhoneNumber: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-gray-50">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            <X className="h-4 w-4 mr-2" /> Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="min-w-[120px]">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Updating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" /> Update Donation
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
