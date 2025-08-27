// import { useState, useEffect } from "react"
// import { Save, X, AlertCircle, Loader2, Gift, Package, User, FileText, Landmark, Info } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import toast from "react-hot-toast"
// import { donationService, type DonationDto, type UpdateDonationDto } from "@/api/donationService"
// import kpayLogo from "../../../pages/donation/images/kpay.png";
// import wavepayLogo from "../../../pages/donation/images/wavepay.png";

// interface EditDonationDialogProps {
//   donation: DonationDto | null
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   onSuccess: (updatedDonation: DonationDto) => void
// }

// const sourceTypes = [
//   { value: "Personal", label: "Personal", icon: <User className="h-5 w-5" /> },
//   { value: "Organization", label: "Organization", icon: <FileText className="h-5 w-5" /> },
//   { value: "NGO", label: "NGO", icon: <HeartHandshakeIcon className="h-5 w-5" /> },
//   { value: "Company", label: "Company", icon: <Building2Icon className="h-5 w-5" /> },
//   { value: "Anonymous", label: "Anonymous", icon: <UserXIcon className="h-5 w-5" /> },
// ]

// // Updated payment methods with logos only (no text)
// const paymentMethods = [
//   { 
//     value: "KPay", 
//     label: "KPay",
//     icon: (
//       <div className="bg-blue-100 rounded-lg p-1 w-full h-full flex items-center justify-center">
//         <img src={kpayLogo} alt="KPay" className="h-8 w-auto object-contain" />
//       </div>
//     )
//   },
//   { 
//     value: "BankTransfer", 
//     label: "Bank Transfer",
//     icon: (
//       <div className="bg-gray-100 rounded-lg p-1 w-full h-full flex items-center justify-center">
//         <Landmark className="h-8 w-8 text-blue-600" />
//       </div>
//     )
//   },
//   { 
//     value: "WavePay", 
//     label: "Wave Pay",
//     icon: (
//       <div className="bg-purple-100 rounded-lg p-1 w-full h-full flex items-center justify-center">
//         <img src={wavepayLogo} alt="WavePay" className="h-8 w-auto object-contain" />
//       </div>
//     )
//   },
// ]

// export default function EditDonationDialog({
//   donation,
//   open,
//   onOpenChange,
//   onSuccess,
// }: EditDonationDialogProps) {
//   const [editForm, setEditForm] = useState<UpdateDonationDto>({
//     name: "",
//     type: "Money",
//     description: "",
//     sourceType: "Personal",
//     amount: undefined,
//     currency: "MMK",
//     paymentMethod: undefined,
//     quantity: undefined,
//     unit: "",
//     donorPhoneNumber: "",
//   })
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [errors, setErrors] = useState<Record<string, string>>({})

//   useEffect(() => {
//     if (donation && open) {
//       setEditForm({
//         name: donation.name || "",
//         type: donation.type as "Money" | "Item",
//         description: donation.description || "",
//         sourceType: donation.sourceType as
//           | "Personal"
//           | "Organization"
//           | "NGO"
//           | "Company"
//           | "Anonymous",
//         amount: donation.amount,
//         currency: donation.currency || "MMK",
//         paymentMethod: donation.paymentMethod as "KPay" | "BankTransfer" | "WavePay" | undefined,
//         quantity: donation.quantity,
//         unit: donation.unit || "",
//         donorPhoneNumber: donation.donorPhoneNumber || "",
//       })
//       setErrors({})
//     }
//   }, [donation, open])

//   const validateForm = (): boolean => {
//     const newErrors: Record<string, string> = {}
//     if (!editForm.name.trim()) newErrors.name = "Donation name is required"

//     if (editForm.type === "Money") {
//       if (!editForm.amount || editForm.amount <= 0)
//         newErrors.amount = "Amount must be greater than 0"
//       if (!editForm.currency) newErrors.currency = "Currency is required"
//       if (!editForm.paymentMethod)
//         newErrors.paymentMethod = "Payment method is required"
//     } else {
//       if (!editForm.quantity || editForm.quantity <= 0)
//         newErrors.quantity = "Quantity must be greater than 0"
//       if (!editForm.unit?.trim()) newErrors.unit = "Unit is required"
//     }
//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   const handleSubmit = async () => {
//     if (!donation || !validateForm()) return

//     try {
//       setIsSubmitting(true)
//       const updatedDonation = await donationService.updateDonation(
//         donation.id,
//         editForm
//       )
//       onSuccess(updatedDonation)
//       onOpenChange(false)
//       toast.success("Donation updated successfully!")
//     } catch (error: any) {
//       toast.error(error.message || "Failed to update donation")
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const formatAmount = (donation: DonationDto) => {
//     if (donation.amount && donation.currency) {
//       return `${donation.currency} ${donation.amount.toLocaleString()}`
//     }
//     if (donation.quantity && donation.unit) {
//       return `${donation.quantity} ${donation.unit}`
//     }
//     return "N/A"
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-3xl w-[95vw] h-[95vh] max-h-[95vh] flex flex-col p-0 overflow-hidden bg-white rounded-xl shadow-2xl border border-gray-200">
//         <DialogHeader className="px-6 pt-6 pb-4 bg-gradient-to-r from-blue-700 to-blue-900 text-white">
//           <div className="flex justify-between items-start">
//             <div>
//               <DialogTitle className="text-xl font-bold flex items-center gap-2">
//                 <Gift className="h-5 w-5" />
//                 Edit Donation
//               </DialogTitle>
//               <DialogDescription className="text-blue-100 mt-1">
//                 Update donation details and information
//               </DialogDescription>
//             </div>
//             {/* <Button 
//               variant="ghost" 
//               size="icon" 
//               onClick={() => onOpenChange(false)}
//               className="text-white hover:bg-white/10 rounded-full"
//             >
//               <X className="h-5 w-5" />
//             </Button> */}
//           </div>
//         </DialogHeader>

//         <div className="flex-1 overflow-auto p-6 space-y-6">
//           {donation && (
//             <>
//               {/* Current Donation Card */}
//               <Card className="border border-gray-200 shadow-sm rounded-xl overflow-hidden">
//                 <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
//                   <CardTitle className="flex items-center gap-2 text-gray-800">
//                     <Info className="h-5 w-5 text-blue-600" />
//                     <span>Current Donation</span>
//                     <Badge variant="outline" className="ml-auto bg-white text-gray-600">
//                       #{donation.id}
//                     </Badge>
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
//                   <div className="flex flex-col">
//                     <p className="text-xs text-gray-500">Name</p>
//                     <p className="font-medium">{donation.name || donation.type}</p>
//                   </div>
//                   <div className="flex flex-col">
//                     <p className="text-xs text-gray-500">Type</p>
//                     <p className="font-medium">{donation.type}</p>
//                   </div>
//                   <div className="flex flex-col">
//                     <p className="text-xs text-gray-500">Value</p>
//                     <p className="font-medium">
//                       {formatAmount(donation)}
//                     </p>
//                   </div>
//                   <div className="flex flex-col">
//                     <p className="text-xs text-gray-500">Status</p>
//                     <Badge 
//                       variant="secondary"
//                       className="text-xs bg-yellow-100 text-yellow-800"
//                     >
//                       {donation.status}
//                     </Badge>
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Basic Information */}
//               <Card className="border border-gray-200 shadow-sm rounded-xl">
//                 <CardHeader className="border-b">
//                   <CardTitle className="flex items-center gap-2 text-gray-800">
//                     <FileText className="h-5 w-5 text-blue-600" />
//                     <span>Basic Information</span>
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="p-4 space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="edit-name" className="font-medium text-gray-700 flex items-center gap-1">
//                       Donation Name <span className="text-red-500">*</span>
//                     </Label>
//                     <Input
//                       id="edit-name"
//                       value={editForm.name}
//                       onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
//                       placeholder="Enter donation name"
//                       className={`rounded-lg ${errors.name ? "border-red-500" : ""}`}
//                     />
//                     {errors.name && (
//                       <p className="text-red-600 text-xs flex items-center gap-1">
//                         <AlertCircle className="h-4 w-4" /> {errors.name}
//                       </p>
//                     )}
//                   </div>

//                   <div className="space-y-2">
//                     <Label className="font-medium text-gray-700 flex items-center gap-1">
//                       Donation Type <span className="text-red-500">*</span>
//                     </Label>
//                     <div className="flex gap-4">
//                       <Button
//                         variant={editForm.type === "Money" ? "default" : "outline"}
//                         className={`flex items-center gap-2 ${editForm.type === "Money" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
//                         onClick={() => setEditForm(prev => ({ ...prev, type: "Money" }))}
//                       >
//                         <CreditCardIcon className="h-4 w-4" />
//                         Money
//                       </Button>
//                       <Button
//                         variant={editForm.type === "Item" ? "default" : "outline"}
//                         className={`flex items-center gap-2 ${editForm.type === "Item" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
//                         onClick={() => setEditForm(prev => ({ ...prev, type: "Item" }))}
//                       >
//                         <Package className="h-4 w-4" />
//                         Item
//                       </Button>
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="edit-description" className="font-medium text-gray-700">
//                       Description
//                     </Label>
//                     <Textarea
//                       id="edit-description"
//                       value={editForm.description}
//                       onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
//                       placeholder="Brief description of the donation"
//                       rows={3}
//                       className="rounded-lg"
//                     />
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Payment or Item Details */}
//               {editForm.type === "Money" ? (
//                 <Card className="border border-gray-200 shadow-sm rounded-xl">
//                   <CardHeader className="border-b">
//                     <CardTitle className="flex items-center gap-2 text-gray-800">
//                       <CreditCardIcon className="h-5 w-5 text-blue-600" />
//                       <span>Payment Details</span>
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="p-4 space-y-4">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label className="font-medium text-gray-700 flex items-center gap-1">
//                           Amount <span className="text-red-500">*</span>
//                         </Label>
//                         <Input
//                           type="number"
//                           value={editForm.amount || ""}
//                           onChange={(e) => setEditForm((prev) => ({
//                             ...prev,
//                             amount: Number(e.target.value) || undefined,
//                           }))}
//                           className={`rounded-lg ${errors.amount ? "border-red-500" : ""}`}
//                         />
//                         {errors.amount && (
//                           <p className="text-red-600 text-xs flex items-center gap-1">
//                             <AlertCircle className="h-4 w-4" /> {errors.amount}
//                           </p>
//                         )}
//                       </div>
                      
//                       <div className="space-y-2">
//                         <Label className="font-medium text-gray-700 flex items-center gap-1">
//                           Currency <span className="text-red-500">*</span>
//                         </Label>
//                         <Select
//                           value={editForm.currency}
//                           onValueChange={(value) => setEditForm((prev) => ({ ...prev, currency: value }))}
//                         >
//                           <SelectTrigger className={`${errors.currency ? "border-red-500" : ""}`}>
//                             <SelectValue placeholder="Select currency" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="MMK">MMK (Myanmar Kyat)</SelectItem>
//                             <SelectItem value="USD">USD (US Dollar)</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </div>
//                     </div>
                    
//                     <div className="space-y-2">
//                       <Label className="font-medium text-gray-700 flex items-center gap-1">
//                         Payment Method <span className="text-red-500">*</span>
//                       </Label>
//                       <div className="flex justify-center gap-4">
//                         {paymentMethods.map(method => (
//                           <div 
//                             key={method.value}
//                             onClick={() => setEditForm(prev => ({
//                               ...prev,
//                               paymentMethod: method.value as "KPay" | "BankTransfer" | "WavePay"
//                             }))}
//                             className={`
//                               cursor-pointer transition-all
//                               ${editForm.paymentMethod === method.value 
//                                 ? "border-blue-500 ring-2 ring-blue-200" 
//                                 : "border-gray-200 hover:border-gray-300"}
//                               w-24 h-20 flex items-center justify-center p-2
//                             `}
//                           >
//                             {method.icon}
//                           </div>
//                         ))}
//                       </div>
//                       {errors.paymentMethod && (
//                         <p className="text-red-600 text-xs flex items-center gap-1 text-center justify-center">
//                           <AlertCircle className="h-4 w-4" /> {errors.paymentMethod}
//                         </p>
//                       )}
//                     </div>
//                   </CardContent>
//                 </Card>
//               ) : (
//                 <Card className="border border-gray-200 shadow-sm rounded-xl">
//                   <CardHeader className="border-b">
//                     <CardTitle className="flex items-center gap-2 text-gray-800">
//                       <Package className="h-5 w-5 text-blue-600" />
//                       <span>Item Details</span>
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="p-4 space-y-4">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label className="font-medium text-gray-700 flex items-center gap-1">
//                           Quantity <span className="text-red-500">*</span>
//                         </Label>
//                         <Input
//                           type="number"
//                           value={editForm.quantity || ""}
//                           onChange={(e) => setEditForm((prev) => ({
//                             ...prev,
//                             quantity: Number(e.target.value) || undefined,
//                           }))}
//                           className={`rounded-lg ${errors.quantity ? "border-red-500" : ""}`}
//                         />
//                         {errors.quantity && (
//                           <p className="text-red-600 text-xs flex items-center gap-1">
//                             <AlertCircle className="h-4 w-4" /> {errors.quantity}
//                           </p>
//                         )}
//                       </div>
                      
//                       <div className="space-y-2">
//                         <Label className="font-medium text-gray-700 flex items-center gap-1">
//                           Unit <span className="text-red-500">*</span>
//                         </Label>
//                         <Input
//                           value={editForm.unit}
//                           onChange={(e) => setEditForm((prev) => ({ ...prev, unit: e.target.value }))}
//                           placeholder="e.g., kg, boxes, pieces"
//                           className={`rounded-lg ${errors.unit ? "border-red-500" : ""}`}
//                         />
//                         {errors.unit && (
//                           <p className="text-red-600 text-xs flex items-center gap-1">
//                             <AlertCircle className="h-4 w-4" /> {errors.unit}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               )}

//               {/* Source Information */}
//               <Card className="border border-gray-200 shadow-sm rounded-xl">
//                 <CardHeader className="border-b">
//                   <CardTitle className="flex items-center gap-2 text-gray-800">
//                     <User className="h-5 w-5 text-blue-600" />
//                     <span>Source Information</span>
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="p-4 space-y-4">
//                   <div className="space-y-2">
//                     <Label className="font-medium text-gray-700">
//                       Source Type
//                     </Label>
//                     <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
//                       {sourceTypes.map((source) => (
//                         <Button
//                           key={source.value}
//                           variant={editForm.sourceType === source.value ? "default" : "outline"}
//                           className={`flex flex-col h-16 ${editForm.sourceType === source.value ? "bg-blue-600 hover:bg-blue-700" : ""}`}
//                           onClick={() => setEditForm(prev => ({
//                             ...prev,
//                             sourceType: source.value as "Personal" | "Organization" | "NGO" | "Company" | "Anonymous"
//                           }))}
//                         >
//                           <div className="flex items-center justify-center mb-1">
//                             {source.icon}
//                           </div>
//                           <span className="text-xs">{source.label}</span>
//                         </Button>
//                       ))}
//                     </div>
//                   </div>
                  
//                   <div className="space-y-2">
//                     <Label className="font-medium text-gray-700">
//                       Phone Number
//                     </Label>
//                     <Input
//                       value={editForm.donorPhoneNumber}
//                       onChange={(e) => setEditForm((prev) => ({
//                         ...prev,
//                         donorPhoneNumber: e.target.value,
//                       }))}
//                       className="rounded-lg"
//                       placeholder="Enter contact number"
//                     />
//                   </div>
//                 </CardContent>
//               </Card>
//             </>
//           )}
//         </div>

//         {/* Footer */}
//         <DialogFooter className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
//           <Button 
//             variant="outline" 
//             onClick={() => onOpenChange(false)} 
//             disabled={isSubmitting}
//             className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-2"
//           >
//             <X className="h-4 w-4" /> Cancel
//           </Button>
//           <Button 
//             onClick={handleSubmit} 
//             disabled={isSubmitting}
//             className="min-w-[140px] bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:shadow-lg rounded-lg flex items-center gap-2"
//           >
//             {isSubmitting ? (
//               <>
//                 <Loader2 className="h-4 w-4 animate-spin" /> Saving...
//               </>
//             ) : (
//               <>
//                 <Save className="h-4 w-4" /> Update Donation
//               </>
//             )}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }

// // Custom icons for better visual consistency
// function CreditCardIcon(props: any) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <rect width="20" height="14" x="2" y="5" rx="2" />
//       <line x1="2" x2="22" y1="10" y2="10" />
//     </svg>
//   )
// }

// function HeartHandshakeIcon(props: any) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
//       <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66" />
//       <path d="m18 15-2-2" />
//       <path d="m15 18-2-2" />
//     </svg>
//   )
// }

// function Building2Icon(props: any) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
//       <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
//       <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
//       <path d="M10 6h4" />
//       <path d="M10 10h4" />
//       <path d="M10 14h4" />
//       <path d="M10 18h4" />
//     </svg>
//   )
// }

// function UserXIcon(props: any) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
//       <circle cx="9" cy="7" r="4" />
//       <line x1="17" x2="22" y1="8" y2="13" />
//       <line x1="22" x2="17" y1="8" y2="13" />
//     </svg>
//   )
// }

import { useState, useEffect } from "react"
import {
  Save,
  X,
  AlertCircle,
  Loader2,
  Gift,
  User,
  FileText,
  Landmark,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import{toast} from 'sonner';
import {
  donationService,
  type DonationDto,
  type UpdateDonationDto,
} from "@/api/donationService"
import kpayLogo from "../../../pages/donation/images/kpay.png"
import wavepayLogo from "../../../pages/donation/images/wavepay.png"

interface EditDonationDialogProps {
  donation: DonationDto | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (updatedDonation: DonationDto) => void
}

const sourceTypes = [
  { value: "Personal", label: "Personal", icon: <User className="h-5 w-5" /> },
  {
    value: "Organization",
    label: "Organization",
    icon: <FileText className="h-5 w-5" />,
  },
  { value: "NGO", label: "NGO", icon: <Gift className="h-5 w-5" /> },
  { value: "Company", label: "Company", icon: <Info className="h-5 w-5" /> },
  {
    value: "Anonymous",label: "Anonymous", icon: <User className="h-5 w-5" />
  }
]

const paymentMethods = [
  {
    value: "KPay",
    label: "KPay",
    icon: (
      <div className="bg-red-50 rounded-lg p-1 w-full h-full flex items-center justify-center">
        <img src={kpayLogo} alt="KPay" className="h-8 w-auto object-contain" />
      </div>
    ),
  },
  {
    value: "BankTransfer",
    label: "Bank Transfer",
    icon: (
      <div className="bg-red-50 rounded-lg p-1 w-full h-full flex items-center justify-center">
        <Landmark className="h-8 w-8 text-red-600" />
      </div>
    ),
  },
  {
    value: "WavePay",
    label: "Wave Pay",
    icon: (
      <div className="bg-red-50 rounded-lg p-1 w-full h-full flex items-center justify-center">
        <img
          src={wavepayLogo}
          alt="WavePay"
          className="h-8 w-auto object-contain"
        />
      </div>
    ),
  },
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
    donorPhoneNumber: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (donation && open) {
      setEditForm({
        name: donation.name || "",
        type: "Money", // force money only
        description: donation.description || "",
        sourceType: donation.sourceType as "Personal" | "Organization",
        amount: donation.amount,
        currency: donation.currency || "MMK",
        paymentMethod: donation.paymentMethod as
          | "KPay"
          | "BankTransfer"
          | "WavePay"
          | undefined,
        donorPhoneNumber: donation.donorPhoneNumber || "",
      })
      setErrors({})
    }
  }, [donation, open])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!editForm.name.trim()) newErrors.name = "Donation name is required"
    if (!editForm.amount || editForm.amount <= 0)
      newErrors.amount = "Amount must be greater than 0"
    if (!editForm.currency) newErrors.currency = "Currency is required"
    if (!editForm.paymentMethod)
      newErrors.paymentMethod = "Payment method is required"

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
    return "N/A"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-[95vw] h-[95vh] max-h-[95vh] flex flex-col p-0 overflow-hidden bg-white rounded-2xl shadow-2xl border border-gray-200">
        {/* HEADER */}
        <DialogHeader className="px-6 pt-6 pb-4 bg-gradient-to-r from-red-600 to-red-800 text-white">
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Edit Donation
              </DialogTitle>
              <DialogDescription className="text-red-100 mt-1">
                Update donation details
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* BODY */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {donation && (
            <>
              {/* Current Donation */}
              <Card className="border border-gray-200 shadow-sm rounded-xl overflow-hidden">
                <CardHeader className="bg-red-50 border-b">
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Info className="h-5 w-5 text-red-600" />
                    <span>Current Donation</span>
                    <Badge
                      variant="outline"
                      className="ml-auto bg-white text-gray-600"
                    >
                      #{donation.id}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="font-medium">{donation.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Value</p>
                    <p className="font-medium">{formatAmount(donation)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <Badge className="bg-red-100 text-red-700 text-xs">
                      {donation.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Basic Information */}
              <Card className="border border-gray-200 shadow-sm rounded-xl">
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <FileText className="h-5 w-5 text-red-600" />
                    <span>Basic Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label className="font-medium text-gray-700">
                      Donation Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="Enter donation name"
                      className={`rounded-lg ${
                        errors.name ? "border-red-500" : ""
                      }`}
                    />
                    {errors.name && (
                      <p className="text-red-600 text-xs flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" /> {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label className="font-medium text-gray-700">
                      Description
                    </Label>
                    <Textarea
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Brief description of the donation"
                      rows={3}
                      className="rounded-lg"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Details */}
              <Card className="border border-gray-200 shadow-sm rounded-xl">
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <CreditCardIcon className="h-5 w-5 text-red-600" />
                    <span>Payment Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Amount */}
                    <div className="space-y-2">
                      <Label className="font-medium text-gray-700">
                        Amount <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="number"
                        value={editForm.amount || ""}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            amount: Number(e.target.value) || undefined,
                          }))
                        }
                        className={`rounded-lg ${
                          errors.amount ? "border-red-500" : ""
                        }`}
                      />
                      {errors.amount && (
                        <p className="text-red-600 text-xs flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" /> {errors.amount}
                        </p>
                      )}
                    </div>

                    {/* Currency */}
                    <div className="space-y-2">
                      <Label className="font-medium text-gray-700">
                        Currency <span className="text-red-500">*</span>
                      </Label>
                      <select
                        value={editForm.currency}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            currency: e.target.value,
                          }))
                        }
                        className={`w-full rounded-lg border p-2 ${
                          errors.currency ? "border-red-500" : "border-gray-300"
                        }`}
                      >
                        <option value="MMK">MMK (Myanmar Kyat)</option>
                        <option value="USD">USD (US Dollar)</option>
                      </select>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-2">
                    <Label className="font-medium text-gray-700">
                      Payment Method <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex justify-center gap-4">
                      {paymentMethods.map((method) => (
                        <div
                          key={method.value}
                          onClick={() =>
                            setEditForm((prev) => ({
                              ...prev,
                              paymentMethod: method.value as
                                | "KPay"
                                | "BankTransfer"
                                | "WavePay",
                            }))
                          }
                          className={`cursor-pointer transition-all w-24 h-20 flex items-center justify-center p-2 rounded-xl border ${
                            editForm.paymentMethod === method.value
                              ? "border-red-500 ring-2 ring-red-200"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {method.icon}
                        </div>
                      ))}
                    </div>
                    {errors.paymentMethod && (
                      <p className="text-red-600 text-xs flex items-center gap-1 text-center justify-center">
                        <AlertCircle className="h-4 w-4" />{" "}
                        {errors.paymentMethod}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Source Info */}
              <Card className="border border-gray-200 shadow-sm rounded-xl">
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <User className="h-5 w-5 text-red-600" />
                    <span>Source Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {sourceTypes.map((source) => (
                      <Button
                        key={source.value}
                        variant={
                          editForm.sourceType === source.value
                            ? "default"
                            : "outline"
                        }
                        className={`flex flex-col h-16 ${
                          editForm.sourceType === source.value
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : ""
                        }`}
                        onClick={() =>
                          setEditForm((prev) => ({
                            ...prev,
                            sourceType: source.value as
                              | "Personal"
                              | "Organization"
                              | "NGO"
                              | "Company"
                              |"Anonymous",
                          }))
                        }
                      >
                        <div className="flex items-center justify-center mb-1">
                          {source.icon}
                        </div>
                        <span className="text-xs">{source.label}</span>
                      </Button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label className="font-medium text-gray-700">
                      Phone Number
                    </Label>
                    <Input
                      value={editForm.donorPhoneNumber}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          donorPhoneNumber: e.target.value,
                        }))
                      }
                      className="rounded-lg"
                      placeholder="Enter contact number"
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* FOOTER */}
        <DialogFooter className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-2"
          >
            <X className="h-4 w-4" /> Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="min-w-[140px] bg-gradient-to-r from-red-600 to-red-800 text-white hover:shadow-lg rounded-lg flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> Update Donation
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function CreditCardIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  )
}
