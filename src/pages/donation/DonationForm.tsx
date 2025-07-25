"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNavigate } from "react-router-dom"
import {
  Gift,
  Package,
  User,
  FileText,
  Building2,
  ArrowLeft,
  AlertCircle,
  Banknote,
  University,
  Info,
  Heart,
  Phone,
  Loader2,
  ChevronRight,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import toast from "react-hot-toast"
import { donationService, type CreateDonationDto } from "../../api/donationService"
import kpayLogo from "./images/kpay.png";
import wavepayLogo from "./images/wavepay.png";

const donationSchema = z
  .object({
    name: z.string().min(1, "Donation name is required"),
    type: z.string().refine((val) => val === "Money" || val === "Item", {
      message: "Please select donation type",
    }),
    description: z.string().optional(),
    sourceType: z.string().refine((val) => ["Personal", "Organization", "NGO", "Anonymous", "Company"].includes(val), {
      message: "Please select source type",
    }),
    amount: z.coerce.number().optional(),
    currency: z.string().optional(),
    paymentMethod: z.string().optional(),
    quantity: z.coerce.number().optional(),
    unit: z.string().optional(),
    donorPhoneNumber: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "Money") {
      if (!data.amount || data.amount <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Amount is required and must be greater than 0",
          path: ["amount"],
        })
      }
      if (!data.currency) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Currency is required for money donations",
          path: ["currency"],
        })
      }
      if (!data.paymentMethod) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Payment method is required for money donations",
          path: ["paymentMethod"],
        })
      }
    }
    if (data.type === "Item") {
      if (!data.quantity || data.quantity <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Quantity is required and must be greater than 0",
          path: ["quantity"],
        })
      }
      if (!data.unit) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Unit is required for item donations",
          path: ["unit"],
        })
      }
    }
  })

type DonationFormInputs = z.infer<typeof donationSchema>

export default function DonationForm() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<DonationFormInputs>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      currency: "MMK",
      type: "",
      sourceType: "",
      donorPhoneNumber: "",
    },
    mode: "onChange",
  })

  const donationType = watch("type")
  const paymentMethod = watch("paymentMethod")
  const currency = watch("currency")
  const sourceType = watch("sourceType")

  // Source types data
  const sourceTypes = [
    { value: "Personal", label: "Personal", icon: <User className="h-4 w-4" />, description: "Individual donation" },
    {
      value: "Organization",
      label: "Organization",
      icon: <Building2 className="h-4 w-4" />,
      description: "Non-profit organization",
    },
    { value: "NGO", label: "NGO", icon: <FileText className="h-4 w-4" />, description: "Non-governmental org" },
    { value: "Company", label: "Company", icon: <Building2 className="h-4 w-4" />, description: "Corporate donation" },
    { value: "Anonymous", label: "Anonymous", icon: <User className="h-4 w-4" />, description: "Anonymous donor" },
  ]

  // Payment methods data
  const paymentMethods = [
    {
      id: "KPay",
      name: "KPay",
      icon: (
        <img
          src={kpayLogo}
          alt="KPay"
          className="h-5 w-5"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg?height=20&width=20&text=KPay"
          }}
        />
      ),
      description: "Mobile payment",
      accountName: "Disaster Relief Admin",
      accountNumber: "09123456789",
    },
    {
      id: "WavePay",
      name: "Wave Pay",
      icon: (
        <img
          src={wavepayLogo}
          alt="Wave Pay"
          className="h-5 w-5"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg?height=20&width=20&text=Wave"
          }}
        />
      ),
      description: "Mobile payment",
      accountName: "Disaster Relief Admin",
      accountNumber: "09987654321",
    },
    {
      id: "BankTransfer",
      name: "Bank Transfer",
      icon: <University className="h-5 w-5" />,
      description: "Direct bank transfer",
      accountName: "Disaster Relief Organization",
      accountNumber: "123-456-789-012",
      bankName: "Myanmar Economic Bank",
    },
  ]

  const onSubmit = async (data: DonationFormInputs) => {
    setIsSubmitting(true)

    try {
      const donationData: CreateDonationDto = {
        type: data.type as "Money" | "Item",
        name: data.name,
        description: data.description || undefined,
        sourceType: data.sourceType as "Personal" | "Organization" | "NGO" | "Anonymous" | "Company",
        donorPhoneNumber: data.donorPhoneNumber || undefined,
      }

      if (data.type === "Money") {
        donationData.amount = Number(data.amount)
        donationData.currency = data.currency
        donationData.paymentMethod = data.paymentMethod as "KPay" | "WavePay" | "BankTransfer"
      } else if (data.type === "Item") {
        donationData.quantity = Number(data.quantity)
        donationData.unit = data.unit
        donationData.amount = undefined
        donationData.currency = undefined
        donationData.paymentMethod = undefined
      }

      await donationService.createDonation(donationData)
      toast.success("Donation submitted successfully! Thank you for your generosity.")
      navigate("/profile?tab=donations")
    } catch (error: any) {
      console.error("Donation submission error:", error)
      if (error.response?.data?.message) {
        toast.error(`Error: ${error.response.data.message}`)
      } else if (error.message) {
        toast.error(`Error: ${error.message}`)
      } else {
        toast.error("Failed to submit donation. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = async () => {
    // Validate current step fields before proceeding
    let isValid = false
    
    if (currentStep === 1) {
      isValid = await trigger(["type"])
    } else if (currentStep === 2) {
      isValid = await trigger(["name", "sourceType"])
    } else if (currentStep === 3) {
      if (donationType === "Money") {
        isValid = await trigger(["amount", "currency", "paymentMethod"])
      } else {
        isValid = await trigger(["quantity", "unit"])
      }
    }

    if (isValid) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  // Get the selected payment method details
  const selectedPaymentMethod = paymentMethods.find(method => method.id === paymentMethod)
  // Get the selected source type details
  const selectedSourceType = sourceTypes.find(source => source.value === sourceType)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-900  to-blue-600 text-white py-3">
        <div className="max-w-4xl mx-auto px-6">
          <Button variant="ghost" onClick={() => navigate("/")} className="text-white hover:bg-white/20 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <Heart className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Make a Donation</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Your contribution helps us provide essential support during disasters and emergencies.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-8 pb-12">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10">
            <div 
              className="h-1 bg-blue-600 transition-all duration-300" 
              style={{ 
                width: `${(currentStep - 1) * 33.33}%`,
                display: currentStep > 1 ? 'block' : 'none'
              }}
            />
          </div>
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mb-2 ${
                  currentStep >= step ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                {step}
              </div>
              <span className={`text-sm font-medium ${
                currentStep >= step ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {step === 1 ? 'Type' : 
                 step === 2 ? 'Details' : 
                 step === 3 ? (donationType === 'Money' ? 'Payment' : 'Item Info') : 
                 'Review'}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Step 1: Donation Type Selection */}
          {currentStep === 1 && (
            <Card className="shadow-lg border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
                <CardTitle className="flex items-center gap-3">
                  Select Donation Type
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <Label className="text-base font-semibold text-gray-900">What would you like to donate? *</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setValue("type", "Money")}
                        className={`w-full flex flex-col items-center justify-center p-6 bg-white border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                          donationType === "Money" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-green-300 hover:bg-green-50"
                        }`}
                      >
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                          <Banknote className="h-6 w-6 text-green-600" />
                        </div>
                        <span className="font-semibold text-gray-900 mb-1">Money Donation</span>
                        <span className="text-sm text-gray-600 text-center">Contribute funds for emergency relief</span>
                        {donationType === "Money" && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </button>
                    </div>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setValue("type", "Item")}
                        className={`w-full flex flex-col items-center justify-center p-6 bg-white border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                          donationType === "Item" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                        }`}
                      >
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                          <Package className="h-6 w-6 text-blue-600" />
                        </div>
                        <span className="font-semibold text-gray-900 mb-1">Item Donation</span>
                        <span className="text-sm text-gray-600 text-center">Donate physical items and supplies</span>
                        {donationType === "Item" && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                  {errors.type && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {errors.type.message}
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-4">
                  <Button 
                    type="button" 
                    onClick={nextStep}
                    disabled={!donationType}
                    className="gap-2"
                  >
                    Next Step
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Donation Details */}
          {currentStep === 2 && (
            <Card className="shadow-lg border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
                <CardTitle className="flex items-center gap-3">
                  Donation Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                {/* Donation Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base font-semibold text-gray-900">
                    Donation Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g., Emergency Relief Fund, Medical Supplies, Winter Clothing"
                    className="h-12 text-base"
                    {...register("name")}
                  />
                  {errors.name && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {errors.name.message}
                    </div>
                  )}
                </div>

                {/* Source Type - Full Width Select */}
                <div className="space-y-2">
                  <Label htmlFor="sourceType" className="text-base font-semibold text-gray-900">
                    Source Type *
                  </Label>
                  <Select 
                    value={sourceType || ""}
                    onValueChange={(value) => setValue("sourceType", value)}
                  >
                    <SelectTrigger className="h-12 text-base w-full">
                      <SelectValue placeholder="Select source type" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      {sourceTypes.map((source) => (
                        <SelectItem key={source.value} value={source.value}>
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                              {source.icon}
                            </div>
                            <div>
                              <div>{source.label}</div>
                              <div className="text-xs text-gray-500">{source.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.sourceType && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {errors.sourceType.message}
                    </div>
                  )}
                </div>

                {/* Donor Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="donorPhoneNumber" className="text-base font-semibold text-gray-900">
                    Contact Phone Number <span className="text-gray-500 font-normal">(Optional)</span>
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="donorPhoneNumber"
                      type="tel"
                      placeholder="e.g., +95 9 123 456 789"
                      className="h-12 text-base pl-10"
                      {...register("donorPhoneNumber")}
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    Providing your phone number helps us contact you for donation verification and updates.
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-base font-semibold text-gray-900">
                    Description <span className="text-gray-500 font-normal">(Optional)</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Tell us more about your donation and its intended purpose..."
                    rows={4}
                    className="text-base resize-none"
                    {...register("description")}
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={prevStep}
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button 
                    type="button" 
                    onClick={nextStep}
                    disabled={!watch("name") || !sourceType}
                    className="gap-2"
                  >
                    {donationType === 'Money' ? 'Payment Details' : 'Item Details'}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Payment or Item Details */}
          {currentStep === 3 && donationType === "Money" && (
            <Card className="shadow-lg border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
                <CardTitle className="flex items-center gap-3">
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                {/* Amount and Currency */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-base font-semibold text-gray-900">
                      Amount *
                    </Label>
                    <div className="relative">
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        min="0.01"
                        max="1000000"
                        placeholder="0.00"
                        className="h-12 text-base pl-12"
                        {...register("amount", { valueAsNumber: true })}
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        {currency === "MMK" ? "₭" : currency === "USD" ? "$" : "€"}
                      </div>
                    </div>
                    {errors.amount && (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        {errors.amount.message}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-base font-semibold text-gray-900">
                      Currency *
                    </Label>
                    <Select value={currency || "MMK"} onValueChange={(value) => setValue("currency", value)}>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MMK">
                          <div className="flex items-center gap-2">
                            <span>₭</span>
                            MMK (Myanmar Kyat)
                          </div>
                        </SelectItem>
                        <SelectItem value="USD">
                          <div className="flex items-center gap-2">
                            <span>$</span>
                            USD (US Dollar)
                          </div>
                        </SelectItem>
                        <SelectItem value="EUR">
                          <div className="flex items-center gap-2">
                            <span>€</span>
                            EUR (Euro)
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.currency && (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        {errors.currency.message}
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold text-gray-900">Payment Method *</Label>
                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="space-y-2">
                        <button
                          type="button"
                          onClick={() => setValue("paymentMethod", method.id)}
                          className={`w-full flex items-center p-4 bg-white border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                            paymentMethod === method.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                          }`}
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                              {method.icon}
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900">{method.name}</div>
                              <div className="text-sm text-gray-600">{method.description}</div>
                            </div>
                            {paymentMethod === method.id && (
                              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <Check className="h-4 w-4 text-white" />
                              </div>
                            )}
                          </div>
                        </button>
                        
                        {/* Payment Instructions (shown only for selected method) */}
                        {paymentMethod === method.id && (
                          <div className="ml-14 pl-2 border-l-2 border-blue-200">
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <div className="space-y-2 text-sm">
                                <p className="font-medium text-blue-800">Payment Instructions:</p>
                                <p>
                                  <span className="text-gray-600">Account Name:</span> {method.accountName}
                                </p>
                                <p>
                                  <span className="text-gray-600">
                                    {method.id === "BankTransfer" ? "Account Number" : "Phone Number"}:
                                  </span> {method.accountNumber}
                                </p>
                                {method.bankName && (
                                  <p>
                                    <span className="text-gray-600">Bank:</span> {method.bankName}
                                  </p>
                                )}
                                <p className="text-xs text-gray-500 mt-2">
                                  Please send your donation and keep your receipt for verification.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {errors.paymentMethod && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {errors.paymentMethod.message}
                    </div>
                  )}
                </div>

                <div className="flex justify-between pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={prevStep}
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button 
                    type="button" 
                    onClick={nextStep}
                    disabled={!paymentMethod || !watch("amount")}
                    className="gap-2"
                  >
                    Review Donation
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Item Details */}
          {currentStep === 3 && donationType === "Item" && (
            <Card className="shadow-lg border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
                <CardTitle className="flex items-center gap-3">
                  Item Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="quantity" className="text-base font-semibold text-gray-900">
                      Quantity *
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      max="10000"
                      placeholder="1"
                      className="h-12 text-base"
                      {...register("quantity", { valueAsNumber: true })}
                    />
                    {errors.quantity && (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        {errors.quantity.message}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unit" className="text-base font-semibold text-gray-900">
                      Unit *
                    </Label>
                    <Input
                      id="unit"
                      placeholder="e.g., pieces, boxes, kg, etc."
                      className="h-12 text-base"
                      {...register("unit")}
                    />
                    {errors.unit && (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        {errors.unit.message}
                      </div>
                    )}
                  </div>
                </div>

                <Alert className="border-orange-200 bg-orange-50">
                  <Package className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    <p className="font-semibold mb-2">Item Donation Guidelines:</p>
                    <ul className="space-y-1 text-sm">
                      <li>• Items should be new or in good condition</li>
                      <li>• Please ensure items are clean and properly packaged</li>
                      <li>• Contact us for pickup arrangements after submission</li>
                    </ul>
                  </AlertDescription>
                </Alert>

                <div className="flex justify-between pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={prevStep}
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button 
                    type="button" 
                    onClick={nextStep}
                    disabled={!watch("quantity") || !watch("unit")}
                    className="gap-2"
                  >
                    Review Donation
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Review Donation */}
          {currentStep === 4 && (
            <Card className="shadow-lg border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
                <CardTitle className="flex items-center gap-3">
                  Review Your Donation
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Donation Summary</h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Donation Type:</span>
                        <span className="font-medium">
                          {donationType === "Money" ? "Money Donation" : "Item Donation"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Donation Name:</span>
                        <span className="font-medium">{watch("name")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Source Type:</span>
                        <span className="font-medium">
                          {selectedSourceType?.label}
                        </span>
                      </div>
                      {watch("donorPhoneNumber") && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Contact Number:</span>
                          <span className="font-medium">{watch("donorPhoneNumber")}</span>
                        </div>
                      )}
                      {watch("description") && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Description:</span>
                          <span className="font-medium">{watch("description")}</span>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {donationType === "Money" ? (
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Amount:</span>
                          <span className="font-medium">
                            {currency === "MMK" ? "₭" : currency === "USD" ? "$" : "€"}
                            {watch("amount")?.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Currency:</span>
                          <span className="font-medium">
                            {currency === "MMK" ? "MMK (Myanmar Kyat)" : 
                             currency === "USD" ? "USD (US Dollar)" : "EUR (Euro)"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Method:</span>
                          <span className="font-medium">
                            {selectedPaymentMethod?.name}
                          </span>
                        </div>
                        {selectedPaymentMethod && (
                          <div className="mt-4 space-y-2">
                            <h4 className="font-medium text-gray-900">Payment Instructions:</h4>
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <div className="space-y-2 text-sm">
                                <p>
                                  <span className="text-gray-600">Account Name:</span> {selectedPaymentMethod.accountName}
                                </p>
                                <p>
                                  <span className="text-gray-600">
                                    {selectedPaymentMethod.id === "BankTransfer" ? "Account Number" : "Phone Number"}:
                                  </span> {selectedPaymentMethod.accountNumber}
                                </p>
                                {selectedPaymentMethod.bankName && (
                                  <p>
                                    <span className="text-gray-600">Bank:</span> {selectedPaymentMethod.bankName}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Quantity:</span>
                          <span className="font-medium">{watch("quantity")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Unit:</span>
                          <span className="font-medium">{watch("unit")}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <Alert className="border-green-200 bg-green-50">
                    <Info className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      <p className="font-semibold">Thank you for your donation!</p>
                      <p className="text-sm mt-1">
                        {donationType === "Money" 
                          ? "Please complete your payment using the instructions above."
                          : "Our team will contact you shortly to arrange for item pickup."}
                      </p>
                    </AlertDescription>
                  </Alert>
                </div>

                <div className="flex justify-between pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={prevStep}
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Gift className="h-4 w-4" />
                        Confirm & Submit
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </form>
      </div>
    </div>
  )
}