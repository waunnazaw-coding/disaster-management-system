
// // // src/app/(dashboard)/assistant-request/page.tsx
// // import { Button } from "@/components/ui/button";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";
// // import { Textarea } from "@/components/ui/textarea";
// // import { useDisasterEvents } from "@/hooks/useDisasterEvents";
// // import { useAssistanceRequestsStore } from "@/store/assistanceRequestStore";
// // import { CreateAssistanceRequestDto } from "@/types/assistanceRequests";
// // import { FormEvent, useState } from "react";
// // import { toast } from "sonner";

// // const AssistanceRequestPage = () => {
// //   const { disasterEvents } = useDisasterEvents();
// //   const createRequest = useAssistanceRequestsStore(
// //     (state) => state.createRequest
// //   );
// //   const [isSubmitting, setIsSubmitting] = useState(false);

// //   // Form state
// //   const [formData, setFormData] = useState<CreateAssistanceRequestDto>({
// //     disasterEventId: undefined,
// //     supportType: "",
// //     quantity: undefined,
// //     unit: "",
// //     description: "",
// //     priority: "Medium",
// //     contactName: "",
// //     email: "",
// //     contactPhone: "",
// //     detailedAddress: "",
// //   });

// //   const handleChange = (
// //     field: keyof CreateAssistanceRequestDto,
// //     value: string | number | undefined
// //   ) => {
// //     setFormData((prev) => ({
// //       ...prev,
// //       [field]: value,
// //     }));
// //   };

// //   const handleSubmit = async (e: FormEvent) => {
// //     e.preventDefault();
// //     setIsSubmitting(true);

// //     try {
// //       await createRequest(formData);
// //       toast.success("Request Created", {
// //         description: "Your assistance request has been submitted successfully",
// //       });
// //       // Reset form
// //       setFormData({
// //         disasterEventId: undefined,
// //         supportType: "",
// //         quantity: undefined,
// //         unit: "",
// //         description: "",
// //         priority: "Medium",
// //         contactName: "",
// //         email: "",
// //         contactPhone: "",
// //         detailedAddress: "",
// //       });
// //     } catch (error) {
// //       toast.error("Submission Failed", {
// //         description: "There was an error submitting your request",
// //       });
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   return (
// //     <div className="container mx-auto px-4 py-8">
// //       <div className="max-w-4xl mx-auto">
// //         <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
// //           Request Assistance
// //         </h1>
// //         <p className="text-gray-600 dark:text-gray-400 mb-8">
// //           Submit a request for assistance during a disaster event
// //         </p>

// //         <Card className="shadow-lg rounded-xl overflow-hidden">
// //           <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
// //             <CardTitle className="text-xl">Assistance Request Form</CardTitle>
// //           </CardHeader>
// //           <CardContent className="p-6">
// //             <form onSubmit={handleSubmit} className="space-y-6">
// //               {/* Disaster Event Selection */}
// //               <div className="grid grid-cols-1 gap-6">
// //                 <div>
// //                   <Label htmlFor="disasterEvent" className="block mb-2">
// //                     Disaster Event *
// //                   </Label>
// //                   <Select
// //                     value={formData.disasterEventId?.toString() || ""}
// //                     onValueChange={(value) =>
// //                       handleChange(
// //                         "disasterEventId",
// //                         value ? parseInt(value) : undefined
// //                       )
// //                     }
// //                     required
// //                   >
// //                     <SelectTrigger className="w-full">
// //                       <SelectValue placeholder="Select a disaster event" />
// //                     </SelectTrigger>
// //                     <SelectContent>
// //                       {disasterEvents.map((event) => (
// //                         <SelectItem
// //                           key={event.id}
// //                           value={event.id.toString()}
// //                           className="py-3"
// //                         >
// //                           <div className="flex flex-col">
// //                             <span className="font-medium">{event.name}</span>
// //                             <span className="text-xs text-gray-500">
// //                               {event.disasterType} | {event.locationName}
// //                             </span>
// //                           </div>
// //                         </SelectItem>
// //                       ))}
// //                     </SelectContent>
// //                   </Select>
// //                 </div>
// //               </div>

// //               {/* Support Information */}
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //                 <div>
// //                   <Label htmlFor="supportType" className="block mb-2">
// //                     Support Type *
// //                   </Label>
// //                   <Input
// //                     id="supportType"
// //                     value={formData.supportType}
// //                     onChange={(e) =>
// //                       handleChange("supportType", e.target.value)
// //                     }
// //                     placeholder="e.g., Food, Water, Medical Supplies"
// //                     required
// //                   />
// //                 </div>
                
// //                 <div className="grid grid-cols-2 gap-4">
// //                   <div>
// //                     <Label htmlFor="quantity" className="block mb-2">
// //                       Quantity
// //                     </Label>
// //                     <Input
// //                       id="quantity"
// //                       type="number"
// //                       value={formData.quantity || ""}
// //                       onChange={(e) =>
// //                         handleChange(
// //                           "quantity",
// //                           e.target.value ? parseInt(e.target.value) : undefined
// //                         )
// //                       }
// //                       placeholder="e.g., 100"
// //                     />
// //                   </div>
// //                   <div>
// //                     <Label htmlFor="unit" className="block mb-2">
// //                       Unit
// //                     </Label>
// //                     <Input
// //                       id="unit"
// //                       value={formData.unit}
// //                       onChange={(e) => handleChange("unit", e.target.value)}
// //                       placeholder="e.g., kg, boxes"
// //                     />
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Priority and Description */}
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //                 <div>
// //                   <Label htmlFor="priority" className="block mb-2">
// //                     Priority *
// //                   </Label>
// //                   <Select
// //                     value={formData.priority}
// //                     onValueChange={(value) =>
// //                       handleChange("priority", value)
// //                     }
// //                     required
// //                   >
// //                     <SelectTrigger className="w-full">
// //                       <SelectValue placeholder="Select priority" />
// //                     </SelectTrigger>
// //                     <SelectContent>
// //                       <SelectItem value="Low">Low</SelectItem>
// //                       <SelectItem value="Medium">Medium</SelectItem>
// //                       <SelectItem value="High">High</SelectItem>
// //                       <SelectItem value="Critical">Critical</SelectItem>
// //                     </SelectContent>
// //                   </Select>
// //                 </div>
                
// //                 <div>
// //                   <Label htmlFor="description" className="block mb-2">
// //                     Description
// //                   </Label>
// //                   <Textarea
// //                     id="description"
// //                     value={formData.description}
// //                     onChange={(e) =>
// //                       handleChange("description", e.target.value)
// //                     }
// //                     placeholder="Provide details about your request"
// //                     rows={3}
// //                   />
// //                 </div>
// //               </div>

// //               {/* Contact Information */}
// //               <div className="border-t pt-6">
// //                 <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //                   <div>
// //                     <Label htmlFor="contactName" className="block mb-2">
// //                       Contact Name *
// //                     </Label>
// //                     <Input
// //                       id="contactName"
// //                       value={formData.contactName}
// //                       onChange={(e) =>
// //                         handleChange("contactName", e.target.value)
// //                       }
// //                       placeholder="Full name"
// //                       required
// //                     />
// //                   </div>
// //                   <div>
// //                     <Label htmlFor="contactPhone" className="block mb-2">
// //                       Phone Number *
// //                     </Label>
// //                     <Input
// //                       id="contactPhone"
// //                       value={formData.contactPhone}
// //                       onChange={(e) =>
// //                         handleChange("contactPhone", e.target.value)
// //                       }
// //                       placeholder="+1 (555) 123-4567"
// //                       required
// //                     />
// //                   </div>
// //                   <div>
// //                     <Label htmlFor="email" className="block mb-2">
// //                       Email Address
// //                     </Label>
// //                     <Input
// //                       id="email"
// //                       type="email"
// //                       value={formData.email}
// //                       onChange={(e) => handleChange("email", e.target.value)}
// //                       placeholder="you@example.com"
// //                     />
// //                   </div>
// //                 </div>
                
// //                 <div className="mt-4">
// //                   <Label htmlFor="detailedAddress" className="block mb-2">
// //                     Delivery Address *
// //                   </Label>
// //                   <Textarea
// //                     id="detailedAddress"
// //                     value={formData.detailedAddress}
// //                     onChange={(e) =>
// //                       handleChange("detailedAddress", e.target.value)
// //                     }
// //                     placeholder="Full address including city and zip code"
// //                     rows={2}
// //                     required
// //                   />
// //                 </div>
// //               </div>

// //               <div className="flex justify-end pt-4">
// //                 <Button
// //                   type="submit"
// //                   className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
// //                   size="lg"
// //                   disabled={isSubmitting}
// //                 >
// //                   {isSubmitting ? "Submitting..." : "Submit Request"}
// //                 </Button>
// //               </div>
// //             </form>
// //           </CardContent>
// //         </Card>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AssistanceRequestPage;


// // // "use client"

// // // //src/app/(dashboard)/assistant-request/page.tsx
// // // import { Button } from "@/components/ui/button"
// // // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// // // import { Input } from "@/components/ui/input"
// // // import { Label } from "@/components/ui/label"
// // // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// // // import { Textarea } from "@/components/ui/textarea"
// // // import { useDisasterEvents } from "@/hooks/useDisasterEvents"
// // // import { useAssistanceRequestsStore } from "@/store/assistanceRequestStore"
// // // import type { CreateAssistanceRequestDto } from "@/types/assistanceRequests"
// // // import { type FormEvent, useState } from "react"
// // // import { toast } from "sonner"

// // // const AssistanceRequestPage = () => {
// // //   const { disasterEvents } = useDisasterEvents()
// // //   const createRequest = useAssistanceRequestsStore((state) => state.createRequest)
// // //   const [isSubmitting, setIsSubmitting] = useState(false)

// // //   // Form state
// // //   const [formData, setFormData] = useState<CreateAssistanceRequestDto>({
// // //     disasterEventId: undefined,
// // //     supportType: "",
// // //     quantity: undefined,
// // //     unit: "",
// // //     description: "",
// // //     priority: "Medium",
// // //     contactName: "",
// // //     email: "",
// // //     contactPhone: "",
// // //     detailedAddress: "",
// // //   })

// // //   const handleChange = (field: keyof CreateAssistanceRequestDto, value: string | number | undefined) => {
// // //     setFormData((prev) => ({
// // //       ...prev,
// // //       [field]: value,
// // //     }))
// // //   }

// // //   const handleSubmit = async (e: FormEvent) => {
// // //     e.preventDefault()
// // //     setIsSubmitting(true)

// // //     try {
// // //       await createRequest(formData)
// // //       toast.success("Request Created", {
// // //         description: "Your assistance request has been submitted successfully",
// // //       })
// // //       // Reset form
// // //       setFormData({
// // //         disasterEventId: undefined,
// // //         supportType: "",
// // //         quantity: undefined,
// // //         unit: "",
// // //         description: "",
// // //         priority: "Medium",
// // //         contactName: "",
// // //         email: "",
// // //         contactPhone: "",
// // //         detailedAddress: "",
// // //       })
// // //     } catch (error) {
// // //       toast.error("Submission Failed", {
// // //         description: "There was an error submitting your request",
// // //       })
// // //     } finally {
// // //       setIsSubmitting(false)
// // //     }
// // //   }

// // //   return (
// // //     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
// // //       <div className="container mx-auto px-4 py-12 max-w-5xl">
// // //         <div className="text-center mb-12">
// // //           <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl mb-6 shadow-lg">
// // //             <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //               <path
// // //                 strokeLinecap="round"
// // //                 strokeLinejoin="round"
// // //                 strokeWidth={2}
// // //                 d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 11-9.75 9.75 9.75-9.75 0 019.75-9.75z"
// // //               />
// // //             </svg>
// // //           </div>
// // //           <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent mb-4">
// // //             Request Assistance
// // //           </h1>
// // //           <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
// // //             Submit a detailed request for assistance during disaster events. Our team will review and coordinate the
// // //             appropriate response.
// // //           </p>
// // //         </div>

// // //         <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl overflow-hidden">
// // //           <CardHeader className="bg-gradient-to-r from-red-600 via-red-600 to-red-700 text-white p-8">
// // //             <div className="flex items-center gap-4">
// // //               <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
// // //                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //                   <path
// // //                     strokeLinecap="round"
// // //                     strokeLinejoin="round"
// // //                     strokeWidth={2}
// // //                     d="M9 12h6m-6 4h6m2 5H7a2 2 0 11-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
// // //                   />
// // //                 </svg>
// // //               </div>
// // //               <div>
// // //                 <CardTitle className="text-2xl font-bold">Assistance Request Form</CardTitle>
// // //                 <p className="text-red-100 mt-1">Please fill out all required fields marked with *</p>
// // //               </div>
// // //             </div>
// // //           </CardHeader>

// // //           <CardContent className="p-8">
// // //             <form onSubmit={handleSubmit} className="space-y-8">
// // //               <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-red-100 dark:border-red-800">
// // //                 <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-4 flex items-center gap-2">
// // //                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //                     <path
// // //                       strokeLinecap="round"
// // //                       strokeLinejoin="round"
// // //                       strokeWidth={2}
// // //                       d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
// // //                     />
// // //                   </svg>
// // //                   Disaster Event Information
// // //                 </h3>
// // //                 <div>
// // //                   <Label
// // //                     htmlFor="disasterEvent"
// // //                     className="block mb-3 text-sm font-medium text-gray-700 dark:text-gray-300"
// // //                   >
// // //                     Select Disaster Event *
// // //                   </Label>
// // //                   <Select
// // //                     value={formData.disasterEventId?.toString() || ""}
// // //                     onValueChange={(value) =>
// // //                       handleChange("disasterEventId", value ? Number.parseInt(value) : undefined)
// // //                     }
// // //                     required
// // //                   >
// // //                     <SelectTrigger className="w-full h-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-red-500 focus:ring-red-500">
// // //                       <SelectValue placeholder="Choose the disaster event you need assistance for" />
// // //                     </SelectTrigger>
// // //                     <SelectContent className="rounded-xl border-2">
// // //                       {disasterEvents.map((event) => (
// // //                         <SelectItem key={event.id} value={event.id.toString()} className="py-4 px-4 rounded-lg">
// // //                           <div className="flex flex-col">
// // //                             <span className="font-semibold text-gray-900 dark:text-gray-100">{event.name}</span>
// // //                             <span className="text-sm text-gray-500 dark:text-gray-400">
// // //                               {event.disasterType} • {event.locationName}
// // //                             </span>
// // //                           </div>
// // //                         </SelectItem>
// // //                       ))}
// // //                     </SelectContent>
// // //                   </Select>
// // //                 </div>
// // //               </div>

// // //               <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
// // //                 <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2">
// // //                   <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //                     <path
// // //                       strokeLinecap="round"
// // //                       strokeLinejoin="round"
// // //                       strokeWidth={2}
// // //                       d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
// // //                     />
// // //                   </svg>
// // //                   Support Requirements
// // //                 </h3>

// // //                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// // //                   <div className="lg:col-span-2">
// // //                     <Label
// // //                       htmlFor="supportType"
// // //                       className="block mb-3 text-sm font-medium text-gray-700 dark:text-gray-300"
// // //                     >
// // //                       Type of Support Needed *
// // //                     </Label>
// // //                     <Input
// // //                       id="supportType"
// // //                       value={formData.supportType}
// // //                       onChange={(e) => handleChange("supportType", e.target.value)}
// // //                       placeholder="e.g., Emergency Food Supplies, Medical Equipment, Shelter Materials"
// // //                       className="h-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-red-500 focus:ring-red-500"
// // //                       required
// // //                     />
// // //                   </div>

// // //                   <div className="grid grid-cols-2 gap-4">
// // //                     <div>
// // //                       <Label
// // //                         htmlFor="quantity"
// // //                         className="block mb-3 text-sm font-medium text-gray-700 dark:text-gray-300"
// // //                       >
// // //                         Quantity
// // //                       </Label>
// // //                       <Input
// // //                         id="quantity"
// // //                         type="number"
// // //                         value={formData.quantity || ""}
// // //                         onChange={(e) =>
// // //                           handleChange("quantity", e.target.value ? Number.parseInt(e.target.value) : undefined)
// // //                         }
// // //                         placeholder="100"
// // //                         className="h-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-red-500 focus:ring-red-500"
// // //                       />
// // //                     </div>
// // //                     <div>
// // //                       <Label htmlFor="unit" className="block mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
// // //                         Unit
// // //                       </Label>
// // //                       <Input
// // //                         id="unit"
// // //                         value={formData.unit}
// // //                         onChange={(e) => handleChange("unit", e.target.value)}
// // //                         placeholder="kg, boxes, people"
// // //                         className="h-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-red-500 focus:ring-red-500"
// // //                       />
// // //                     </div>
// // //                   </div>

// // //                   <div>
// // //                     <Label
// // //                       htmlFor="priority"
// // //                       className="block mb-3 text-sm font-medium text-gray-700 dark:text-gray-300"
// // //                     >
// // //                       Priority Level *
// // //                     </Label>
// // //                     <Select
// // //                       value={formData.priority}
// // //                       onValueChange={(value) => handleChange("priority", value)}
// // //                       required
// // //                     >
// // //                       <SelectTrigger className="w-full h-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-red-500 focus:ring-red-500">
// // //                         <SelectValue placeholder="Select urgency level" />
// // //                       </SelectTrigger>
// // //                       <SelectContent className="rounded-xl border-2">
// // //                         <SelectItem value="Low" className="py-3 px-4">
// // //                           <div className="flex items-center gap-2">
// // //                             <div className="w-3 h-3 bg-green-500 rounded-full"></div>
// // //                             <span>Low Priority</span>
// // //                           </div>
// // //                         </SelectItem>
// // //                         <SelectItem value="Medium" className="py-3 px-4">
// // //                           <div className="flex items-center gap-2">
// // //                             <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
// // //                             <span>Medium Priority</span>
// // //                           </div>
// // //                         </SelectItem>
// // //                         <SelectItem value="High" className="py-3 px-4">
// // //                           <div className="flex items-center gap-2">
// // //                             <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
// // //                             <span>High Priority</span>
// // //                           </div>
// // //                         </SelectItem>
// // //                         <SelectItem value="Critical" className="py-3 px-4">
// // //                           <div className="flex items-center gap-2">
// // //                             <div className="w-3 h-3 bg-red-500 rounded-full"></div>
// // //                             <span>Critical Priority</span>
// // //                           </div>
// // //                         </SelectItem>
// // //                       </SelectContent>
// // //                     </Select>
// // //                   </div>
// // //                 </div>

// // //                 <div className="mt-6">
// // //                   <Label
// // //                     htmlFor="description"
// // //                     className="block mb-3 text-sm font-medium text-gray-700 dark:text-gray-300"
// // //                   >
// // //                     Detailed Description
// // //                   </Label>
// // //                   <Textarea
// // //                     id="description"
// // //                     value={formData.description}
// // //                     onChange={(e) => handleChange("description", e.target.value)}
// // //                     placeholder="Provide specific details about your assistance needs, current situation, and any special requirements..."
// // //                     rows={4}
// // //                     className="border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-red-500 focus:ring-red-500 resize-none"
// // //                   />
// // //                 </div>
// // //               </div>

// // //               <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
// // //                 <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-6 flex items-center gap-2">
// // //                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //                     <path
// // //                       strokeLinecap="round"
// // //                       strokeLinejoin="round"
// // //                       strokeWidth={2}
// // //                       d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
// // //                     />
// // //                   </svg>
// // //                   Contact Information
// // //                 </h3>

// // //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// // //                   <div>
// // //                     <Label
// // //                       htmlFor="contactName"
// // //                       className="block mb-3 text-sm font-medium text-gray-700 dark:text-gray-300"
// // //                     >
// // //                       Full Name *
// // //                     </Label>
// // //                     <Input
// // //                       id="contactName"
// // //                       value={formData.contactName}
// // //                       onChange={(e) => handleChange("contactName", e.target.value)}
// // //                       placeholder="Enter your full name"
// // //                       className="h-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-red-500 focus:ring-red-500"
// // //                       required
// // //                     />
// // //                   </div>

// // //                   <div>
// // //                     <Label
// // //                       htmlFor="contactPhone"
// // //                       className="block mb-3 text-sm font-medium text-gray-700 dark:text-gray-300"
// // //                     >
// // //                       Phone Number *
// // //                     </Label>
// // //                     <Input
// // //                       id="contactPhone"
// // //                       value={formData.contactPhone}
// // //                       onChange={(e) => handleChange("contactPhone", e.target.value)}
// // //                       placeholder="+1 (555) 123-4567"
// // //                       className="h-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-red-500 focus:ring-red-500"
// // //                       required
// // //                     />
// // //                   </div>

// // //                   <div>
// // //                     <Label htmlFor="email" className="block mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
// // //                       Email Address
// // //                     </Label>
// // //                     <Input
// // //                       id="email"
// // //                       type="email"
// // //                       value={formData.email}
// // //                       onChange={(e) => handleChange("email", e.target.value)}
// // //                       placeholder="your.email@example.com"
// // //                       className="h-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-red-500 focus:ring-red-500"
// // //                     />
// // //                   </div>
// // //                 </div>

// // //                 <div className="mt-6">
// // //                   <Label
// // //                     htmlFor="detailedAddress"
// // //                     className="block mb-3 text-sm font-medium text-gray-700 dark:text-gray-300"
// // //                   >
// // //                     Delivery Address *
// // //                   </Label>
// // //                   <Textarea
// // //                     id="detailedAddress"
// // //                     value={formData.detailedAddress}
// // //                     onChange={(e) => handleChange("detailedAddress", e.target.value)}
// // //                     placeholder="Enter complete address including street, city, state, and zip code. Include any special delivery instructions..."
// // //                     rows={3}
// // //                     className="border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-red-500 focus:ring-red-500 resize-none"
// // //                     required
// // //                   />
// // //                 </div>
// // //               </div>

// // //               <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
// // //                 <Button
// // //                   type="button"
// // //                   variant="outline"
// // //                   size="lg"
// // //                   className="px-8 py-3 border-2 border-gray-300 hover:border-gray-400 rounded-xl bg-transparent"
// // //                 >
// // //                   Save as Draft
// // //                 </Button>
// // //                 <Button
// // //                   type="submit"
// // //                   className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
// // //                   size="lg"
// // //                   disabled={isSubmitting}
// // //                 >
// // //                   {isSubmitting ? (
// // //                     <div className="flex items-center gap-2">
// // //                       <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
// // //                         <circle
// // //                           className="opacity-25"
// // //                           cx="12"
// // //                           cy="12"
// // //                           r="10"
// // //                           stroke="currentColor"
// // //                           strokeWidth="4"
// // //                         ></circle>
// // //                         <path
// // //                           className="opacity-75"
// // //                           fill="currentColor"
// // //                           d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
// // //                         ></path>
// // //                       </svg>
// // //                       Submitting Request...
// // //                     </div>
// // //                   ) : (
// // //                     <div className="flex items-center gap-2">
// // //                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //                         <path
// // //                           strokeLinecap="round"
// // //                           strokeLinejoin="round"
// // //                           strokeWidth={2}
// // //                           d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
// // //                         />
// // //                       </svg>
// // //                       Submit Request
// // //                     </div>
// // //                   )}
// // //                 </Button>
// // //               </div>
// // //             </form>
// // //           </CardContent>
// // //         </Card>
// // //       </div>
// // //     </div>
// // //   )
// // // }

// // // export default AssistanceRequestPage



// "use client"

// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Textarea } from "@/components/ui/textarea"
// import { useDisasterEvents } from "@/hooks/useDisasterEvents"
// import { useAssistanceRequestsStore } from "@/store/assistanceRequestStore"
// import type { CreateAssistanceRequestDto } from "@/types/assistanceRequests"
// import { type FormEvent, useState } from "react"
// import { toast } from "sonner"
// import {
//   Shield,
//   AlertTriangle,
//   User,
//   Phone,
//   Mail,
//   MapPin,
//   FileText,
//   Package,
//   Clock,
//   CheckCircle2,
//   Loader2,
// } from "lucide-react"

// const AssistanceRequestPage = () => {
//   const { disasterEvents } = useDisasterEvents()
//   const createRequest = useAssistanceRequestsStore((state) => state.createRequest)
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   // Form state
//   const [formData, setFormData] = useState<CreateAssistanceRequestDto>({
//     disasterEventId: undefined,
//     supportType: "",
//     quantity: undefined,
//     unit: "",
//     description: "",
//     priority: "Medium",
//     contactName: "",
//     email: "",
//     contactPhone: "",
//     detailedAddress: "",
//   })

//   const handleChange = (field: keyof CreateAssistanceRequestDto, value: string | number | undefined) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }))
//   }

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault()
//     setIsSubmitting(true)

//     try {
//       await createRequest(formData)
//       toast.success("Request Created", {
//         description: "Your assistance request has been submitted successfully",
//       })
//       // Reset form
//       setFormData({
//         disasterEventId: undefined,
//         supportType: "",
//         quantity: undefined,
//         unit: "",
//         description: "",
//         priority: "Medium",
//         contactName: "",
//         email: "",
//         contactPhone: "",
//         detailedAddress: "",
//       })
//     } catch (error) {
//       toast.error("Submission Failed", {
//         description: "There was an error submitting your request",
//       })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const priorityOptions = [
//     {
//       value: "Low",
//       label: "Low Priority",
//       description: "Non-urgent needs",
//       color: "bg-green-500",
//       textColor: "text-green-700",
//       bgColor: "bg-green-50",
//       borderColor: "border-green-200",
//       icon: <Clock className="h-4 w-4" />,
//     },
//     {
//       value: "Medium",
//       label: "Medium Priority",
//       description: "Important needs",
//       color: "bg-yellow-500",
//       textColor: "text-yellow-700",
//       bgColor: "bg-yellow-50",
//       borderColor: "border-yellow-200",
//       icon: <AlertTriangle className="h-4 w-4" />,
//     },
//     {
//       value: "High",
//       label: "High Priority",
//       description: "Urgent needs",
//       color: "bg-orange-500",
//       textColor: "text-orange-700",
//       bgColor: "bg-orange-50",
//       borderColor: "border-orange-200",
//       icon: <AlertTriangle className="h-4 w-4" />,
//     },
//     {
//       value: "Critical",
//       label: "Critical Priority",
//       description: "Life-threatening",
//       color: "bg-red-500",
//       textColor: "text-red-700",
//       bgColor: "bg-red-50",
//       borderColor: "border-red-200",
//       icon: <AlertTriangle className="h-4 w-4" />,
//     },
//   ]

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/30">
//       <div className="container mx-auto px-4 py-8">
//         <div className="max-w-4xl mx-auto">
//           <div className="text-center mb-8">
//             <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl mb-4 shadow-lg">
//               <Shield className="h-8 w-8 text-white" />
//             </div>
//             <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent mb-2">
//               Request Assistance
//             </h1>
//             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//               Submit a detailed request for assistance during disaster events. Our emergency response team will review
//               and coordinate the appropriate support.
//             </p>
//           </div>

//           <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm rounded-3xl overflow-hidden">
//             <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white p-8">
//               <div className="flex items-center gap-4">
//                 <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
//                   <FileText className="w-6 h-6" />
//                 </div>
//                 <div>
//                   <CardTitle className="text-2xl font-bold">Emergency Assistance Request</CardTitle>
//                   <p className="text-red-100 mt-1">Please provide accurate information for faster response</p>
//                 </div>
//               </div>
//             </CardHeader>

//             <CardContent className="p-8">
//               <form onSubmit={handleSubmit} className="space-y-8">
//                 <div className="bg-gradient-to-r from-red-50 to-red-100/50 rounded-2xl p-6 border-l-4 border-red-500">
//                   <div className="flex items-center gap-3 mb-4">
//                     <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
//                       <AlertTriangle className="h-4 w-4 text-white" />
//                     </div>
//                     <h3 className="text-lg font-semibold text-red-800">Disaster Event Information</h3>
//                   </div>
//                   <div>
//                     <Label htmlFor="disasterEvent" className="block mb-3 text-sm font-medium text-gray-700">
//                       Select Active Disaster Event *
//                     </Label>
//                     <Select
//                       value={formData.disasterEventId?.toString() || ""}
//                       onValueChange={(value) =>
//                         handleChange("disasterEventId", value ? Number.parseInt(value) : undefined)
//                       }
//                       required
//                     >
//                       <SelectTrigger className="w-full h-14 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-red-500 bg-white shadow-sm">
//                         <SelectValue placeholder="Choose the disaster event requiring assistance" />
//                       </SelectTrigger>
//                       <SelectContent className="rounded-xl border-2 shadow-lg">
//                         {disasterEvents.map((event) => (
//                           <SelectItem key={event.id} value={event.id.toString()} className="py-4 px-4 rounded-lg">
//                             <div className="flex flex-col">
//                               <span className="font-semibold text-gray-900">{event.name}</span>
//                               <span className="text-sm text-gray-500">
//                                 {/* {event.disasterType} • {event.locationName} */}
//                                 {event.disasterType}
//                               </span>
//                             </div>
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>

//                 <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-200">
//                   <div className="flex items-center gap-3 mb-6">
//                     <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
//                       <Package className="h-4 w-4 text-white" />
//                     </div>
//                     <h3 className="text-lg font-semibold text-gray-800">Support Requirements</h3>
//                   </div>

//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                     <div className="lg:col-span-2">
//                       <Label htmlFor="supportType" className="block mb-3 text-sm font-medium text-gray-700">
//                         Type of Support Needed *
//                       </Label>
//                       <Input
//                         id="supportType"
//                         value={formData.supportType}
//                         onChange={(e) => handleChange("supportType", e.target.value)}
//                         placeholder="e.g., Emergency Food Supplies, Medical Equipment, Shelter Materials"
//                         className="h-12 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-red-500 bg-white shadow-sm"
//                         required
//                       />
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <Label htmlFor="quantity" className="block mb-3 text-sm font-medium text-gray-700">
//                           Quantity
//                         </Label>
//                         <Input
//                           id="quantity"
//                           type="number"
//                           value={formData.quantity || ""}
//                           onChange={(e) =>
//                             handleChange("quantity", e.target.value ? Number.parseInt(e.target.value) : undefined)
//                           }
//                           placeholder="100"
//                           className="h-12 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-red-500 bg-white shadow-sm"
//                         />
//                       </div>
//                       <div>
//                         <Label htmlFor="unit" className="block mb-3 text-sm font-medium text-gray-700">
//                           Unit
//                         </Label>
//                         <Input
//                           id="unit"
//                           value={formData.unit}
//                           onChange={(e) => handleChange("unit", e.target.value)}
//                           placeholder="kg, boxes, people"
//                           className="h-12 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-red-500 bg-white shadow-sm"
//                         />
//                       </div>
//                     </div>

//                     <div>
//                       <Label htmlFor="priority" className="block mb-3 text-sm font-medium text-gray-700">
//                         Priority Level *
//                       </Label>
//                       <div className="grid grid-cols-2 gap-3">
//                         {priorityOptions.map((option) => (
//                           <button
//                             key={option.value}
//                             type="button"
//                             onClick={() => handleChange("priority", option.value)}
//                             className={`p-4 rounded-xl border-2 transition-all duration-200 ${
//                               formData.priority === option.value
//                                 ? `${option.borderColor} ${option.bgColor} shadow-md`
//                                 : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
//                             }`}
//                           >
//                             <div className="flex items-center gap-3">
//                               <div
//                                 className={`w-8 h-8 rounded-lg ${option.color} flex items-center justify-center text-white`}
//                               >
//                                 {option.icon}
//                               </div>
//                               <div className="text-left">
//                                 <div
//                                   className={`font-medium ${formData.priority === option.value ? option.textColor : "text-gray-800"}`}
//                                 >
//                                   {option.label}
//                                 </div>
//                                 <div className="text-xs text-gray-500">{option.description}</div>
//                               </div>
//                             </div>
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="mt-6">
//                     <Label htmlFor="description" className="block mb-3 text-sm font-medium text-gray-700">
//                       Detailed Description
//                     </Label>
//                     <Textarea
//                       id="description"
//                       value={formData.description}
//                       onChange={(e) => handleChange("description", e.target.value)}
//                       placeholder="Provide specific details about your assistance needs, current situation, and any special requirements..."
//                       rows={4}
//                       className="border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-red-500 resize-none bg-white shadow-sm"
//                     />
//                   </div>
//                 </div>

//                 <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
//                   <div className="flex items-center gap-3 mb-6">
//                     <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
//                       <User className="h-4 w-4 text-white" />
//                     </div>
//                     <h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <Label htmlFor="contactName" className="block mb-3 text-sm font-medium text-gray-700">
//                         Full Name *
//                       </Label>
//                       <div className="relative">
//                         <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                         <Input
//                           id="contactName"
//                           value={formData.contactName}
//                           onChange={(e) => handleChange("contactName", e.target.value)}
//                           placeholder="Enter your full name"
//                           className="h-12 pl-10 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-red-500 bg-white shadow-sm"
//                           required
//                         />
//                       </div>
//                     </div>

//                     <div>
//                       <Label htmlFor="contactPhone" className="block mb-3 text-sm font-medium text-gray-700">
//                         Phone Number *
//                       </Label>
//                       <div className="relative">
//                         <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                         <Input
//                           id="contactPhone"
//                           value={formData.contactPhone}
//                           onChange={(e) => handleChange("contactPhone", e.target.value)}
//                           placeholder="+1 (555) 123-4567"
//                           className="h-12 pl-10 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-red-500 bg-white shadow-sm"
//                           required
//                         />
//                       </div>
//                     </div>

//                     <div>
//                       <Label htmlFor="email" className="block mb-3 text-sm font-medium text-gray-700">
//                         Email Address (Optional)
//                       </Label>
//                       <div className="relative">
//                         <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                         <Input
//                           id="email"
//                           type="email"
//                           value={formData.email}
//                           onChange={(e) => handleChange("email", e.target.value)}
//                           placeholder="your.email@example.com"
//                           className="h-12 pl-10 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-red-500 bg-white shadow-sm"
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   <div className="mt-6">
//                     <Label htmlFor="detailedAddress" className="block mb-3 text-sm font-medium text-gray-700">
//                       Delivery Address *
//                     </Label>
//                     <div className="relative">
//                       <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                       <Textarea
//                         id="detailedAddress"
//                         value={formData.detailedAddress}
//                         onChange={(e) => handleChange("detailedAddress", e.target.value)}
//                         placeholder="Enter complete address including street, city, state, and zip code. Include any special delivery instructions or landmarks..."
//                         rows={3}
//                         className="pl-10 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-red-500 resize-none bg-white shadow-sm"
//                         required
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-gradient-to-r from-red-50 to-red-100/50 rounded-2xl p-6 border-l-4 border-red-500">
//                   <div className="flex items-start gap-3 mb-4">
//                     <CheckCircle2 className="h-5 w-5 text-red-600 mt-0.5" />
//                     <div>
//                       <h4 className="font-semibold text-red-800 mb-2">Submission Guidelines</h4>
//                       <ul className="text-sm text-red-700 space-y-1">
//                         <li>• Ensure all required fields are completed accurately</li>
//                         <li>• Provide specific details about your assistance needs</li>
//                         <li>• Our emergency response team will contact you within 24 hours</li>
//                         <li>• Keep your phone accessible for urgent communications</li>
//                       </ul>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     size="lg"
//                     className="px-8 py-3 border-2 border-gray-300 hover:border-red-300 hover:text-red-600 rounded-xl bg-white shadow-sm"
//                   >
//                     Save as Draft
//                   </Button>
//                   <Button
//                     type="submit"
//                     className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
//                     size="lg"
//                     disabled={isSubmitting}
//                   >
//                     {isSubmitting ? (
//                       <div className="flex items-center gap-2">
//                         <Loader2 className="h-5 w-5 animate-spin" />
//                         Submitting Request...
//                       </div>
//                     ) : (
//                       <div className="flex items-center gap-2">
//                         <Shield className="h-5 w-5" />
//                         Submit Emergency Request
//                       </div>
//                     )}
//                   </Button>
//                 </div>
//               </form>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default AssistanceRequestPage


"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useDisasterEvents } from "@/hooks/useDisasterEvents"
import { useAssistanceRequestsStore } from "@/store/assistanceRequestStore"
import type { CreateAssistanceRequestDto } from "@/types/assistanceRequests"
import { type FormEvent, useState } from "react"
import { toast } from "sonner"
import {
  Shield,
  AlertTriangle,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  Package,
  Clock,
  CheckCircle2,
  Loader2,
  Zap,
  AlertOctagon,
} from "lucide-react"

const AssistanceRequestPage = () => {
  const { disasterEvents } = useDisasterEvents()
  const createRequest = useAssistanceRequestsStore((state) => state.createRequest)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState<CreateAssistanceRequestDto>({
    disasterEventId: undefined,
    supportType: "",
    quantity: undefined,
    unit: "",
    description: "",
    priority: "Medium",
    contactName: "",
    email: "",
    contactPhone: "",
    detailedAddress: "",
  })

  const handleChange = (field: keyof CreateAssistanceRequestDto, value: string | number | undefined) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await createRequest(formData)
      toast.success("Request Created", {
        description: "Your assistance request has been submitted successfully",
      })
      // Reset form
      setFormData({
        disasterEventId: undefined,
        supportType: "",
        quantity: undefined,
        unit: "",
        description: "",
        priority: "Medium",
        contactName: "",
        email: "",
        contactPhone: "",
        detailedAddress: "",
      })
    } catch (error) {
      toast.error("Submission Failed", {
        description: "There was an error submitting your request",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const priorityOptions = [
    {
      value: "Low",
      label: "Low",
      description: "Non-urgent",
      color: "bg-emerald-500",
      textColor: "text-emerald-700",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-300",
      hoverColor: "hover:bg-emerald-100",
      icon: <Clock className="h-5 w-5" />,
    },
    {
      value: "Medium",
      label: "Medium",
      description: "Important",
      color: "bg-amber-500",
      textColor: "text-amber-700",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-300",
      hoverColor: "hover:bg-amber-100",
      icon: <AlertTriangle className="h-5 w-5" />,
    },
    {
      value: "High",
      label: "High",
      description: "Urgent",
      color: "bg-orange-500",
      textColor: "text-orange-700",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-300",
      hoverColor: "hover:bg-orange-100",
      icon: <Zap className="h-5 w-5" />,
    },
    {
      value: "Critical",
      label: "Critical",
      description: "Life-threatening",
      color: "bg-red-600",
      textColor: "text-red-700",
      bgColor: "bg-red-50",
      borderColor: "border-red-300",
      hoverColor: "hover:bg-red-100",
      icon: <AlertOctagon className="h-5 w-5" />,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-3xl mb-6 shadow-xl">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent mb-4">
              Emergency Assistance Request
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Submit a comprehensive request for emergency assistance. Our specialized response team will prioritize and
              coordinate the appropriate support based on your needs.
            </p>
          </div>

          <Card className="shadow-2xl border-0 bg-white/98 backdrop-blur-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white p-10">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold mb-2">Request Form</CardTitle>
                  <p className="text-red-100 text-md">Complete all sections for optimal response coordination</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-10">
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="bg-gradient-to-r from-red-50 to-red-100/60 rounded-2xl p-8 border-l-4 border-red-600 shadow-sm">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-md">
                      <AlertTriangle className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-red-800">Disaster Event Selection</h3>
                  </div>
                  <div>
                    <Label htmlFor="disasterEvent" className="block mb-4 text-sm font-semibold text-gray-700">
                      Active Disaster Event *
                    </Label>
                    <Select
                      value={formData.disasterEventId?.toString() || ""}
                      onValueChange={(value) =>
                        handleChange("disasterEventId", value ? Number.parseInt(value) : undefined)
                      }
                      required
                    >
                      <SelectTrigger className="w-full h-16 border-2 border-gray-300 rounded-xl focus:border-red-600 focus:ring-2 focus:ring-red-600/20 bg-white shadow-sm text-base">
                        <SelectValue placeholder="Select the disaster event requiring immediate assistance" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-2 shadow-xl">
                        {disasterEvents.map((event) => (
                          <SelectItem key={event.id} value={event.id.toString()} className="py-4 px-6 rounded-lg">
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-900 text-base">{event.name}</span>
                              <span className="text-sm text-gray-500 mt-1">{event.disasterType}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-slate-50/80 rounded-2xl p-8 border border-gray-200 shadow-sm">
  <div className="flex items-center gap-4 mb-8">
    <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-md">
      <Package className="h-5 w-5 text-white" />
    </div>
    <h3 className="text-xl font-bold text-gray-800">Support Requirements</h3>
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div className="lg:col-span-2">
      <Label htmlFor="supportType" className="block mb-4 text-sm font-semibold text-gray-700">
        Type of Support Needed *
      </Label>
      <Input
        id="supportType"
        value={formData.supportType}
        onChange={(e) => handleChange("supportType", e.target.value)}
        placeholder="e.g., Emergency Medical Supplies, Food & Water, Temporary Shelter, Rescue Equipment"
        className="h-14 border-2 border-gray-300 rounded-xl focus:border-red-600 focus:ring-2 focus:ring-red-600/20 bg-white shadow-sm text-base"
        required
      />
    </div>

    {/* Modified section - now spans full width */}
    <div className="lg:col-span-2 grid grid-cols-2 gap-6">
      <div>
        <Label htmlFor="quantity" className="block mb-4 text-sm font-semibold text-gray-700">
          Quantity
        </Label>
        <Input
          id="quantity"
          type="number"
          value={formData.quantity || ""}
          onChange={(e) =>
            handleChange("quantity", e.target.value ? Number.parseInt(e.target.value) : undefined)
          }
          placeholder="100"
          className="h-14 border-2 border-gray-300 rounded-xl focus:border-red-600 focus:ring-2 focus:ring-red-600/20 bg-white shadow-sm text-base w-full"
        />
      </div>
      <div>
        <Label htmlFor="unit" className="block mb-4 text-sm font-semibold text-gray-700">
          Unit
        </Label>
        <Input
          id="unit"
          value={formData.unit}
          onChange={(e) => handleChange("unit", e.target.value)}
          placeholder="kg, boxes, people"
          className="h-14 border-2 border-gray-300 rounded-xl focus:border-red-600 focus:ring-2 focus:ring-red-600/20 bg-white shadow-sm text-base w-full"
        />
      </div>
    </div>

    <div className="lg:col-span-2">
      <Label htmlFor="priority" className="block mb-4 text-sm font-semibold text-gray-700">
        Priority Level *
      </Label>
      <div className="grid grid-cols-4 gap-4">
        {priorityOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleChange("priority", option.value)}
            className={`p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
              formData.priority === option.value
                ? `${option.borderColor} ${option.bgColor} shadow-lg ring-2 ring-offset-2 ring-${option.color.split("-")[1]}-200`
                : `border-gray-300 bg-white hover:border-gray-400 ${option.hoverColor} hover:shadow-md`
            }`}
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div
                className={`w-12 h-12 rounded-xl ${option.color} flex items-center justify-center text-white shadow-md`}
              >
                {option.icon}
              </div>
              <div>
                <div
                  className={`font-bold text-base ${formData.priority === option.value ? option.textColor : "text-gray-800"}`}
                >
                  {option.label}
                </div>
                <div className="text-xs text-gray-500 mt-1">{option.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  </div>

  <div className="mt-8">
    <Label htmlFor="description" className="block mb-4 text-sm font-semibold text-gray-700">
      Detailed Description
    </Label>
    <Textarea
      id="description"
      value={formData.description}
      onChange={(e) => handleChange("description", e.target.value)}
      placeholder="Provide comprehensive details about your assistance needs, current situation, number of people affected, specific requirements, and any critical information that will help our response team..."
      rows={5}
      className="border-2 border-gray-300 rounded-xl focus:border-red-600 focus:ring-2 focus:ring-red-600/20 resize-none bg-white shadow-sm text-base"
    />
  </div>
</div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50/80 rounded-2xl p-8 border border-blue-200 shadow-sm">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-md">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Contact Information</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <Label htmlFor="contactName" className="block mb-4 text-sm font-semibold text-gray-700">
                        Full Name *
                      </Label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="contactName"
                          value={formData.contactName}
                          onChange={(e) => handleChange("contactName", e.target.value)}
                          placeholder="Enter your complete name"
                          className="h-14 pl-12 border-2 border-gray-300 rounded-xl focus:border-red-600 focus:ring-2 focus:ring-red-600/20 bg-white shadow-sm text-base"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="contactPhone" className="block mb-4 text-sm font-semibold text-gray-700">
                        Phone Number *
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="contactPhone"
                          value={formData.contactPhone}
                          onChange={(e) => handleChange("contactPhone", e.target.value)}
                          placeholder="+1 (555) 123-4567"
                          className="h-14 pl-12 border-2 border-gray-300 rounded-xl focus:border-red-600 focus:ring-2 focus:ring-red-600/20 bg-white shadow-sm text-base"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email" className="block mb-4 text-sm font-semibold text-gray-700">
                        Email Address (Optional)
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          placeholder="your.email@example.com"
                          className="h-14 pl-12 border-2 border-gray-300 rounded-xl focus:border-red-600 focus:ring-2 focus:ring-red-600/20 bg-white shadow-sm text-base"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <Label htmlFor="detailedAddress" className="block mb-4 text-sm font-semibold text-gray-700">
                      Complete Delivery Address *
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                      <Textarea
                        id="detailedAddress"
                        value={formData.detailedAddress}
                        onChange={(e) => handleChange("detailedAddress", e.target.value)}
                        placeholder="Enter complete address including street, city, state, postal code. Include specific landmarks, building details, or special delivery instructions that will help our response team locate you quickly..."
                        rows={4}
                        className="pl-12 border-2 border-gray-300 rounded-xl focus:border-red-600 focus:ring-2 focus:ring-red-600/20 resize-none bg-white shadow-sm text-base"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-red-50 to-red-100/60 rounded-2xl p-8 border-l-4 border-red-600 shadow-sm">
                  <div className="flex items-start gap-4 mb-4">
                    <CheckCircle2 className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-red-800 mb-3 text-lg">Submission Guidelines</h4>
                      <ul className="text-sm text-red-700 space-y-2 leading-relaxed">
                        <li>
                          • <strong>Accuracy:</strong> Ensure all required information is complete and accurate
                        </li>
                        <li>
                          • <strong>Specificity:</strong> Provide detailed descriptions to help prioritize your request
                        </li>
                        <li>
                          • <strong>Response Time:</strong> Emergency team will contact you within 2-4 hours for
                          critical requests
                        </li>
                        <li>
                          • <strong>Availability:</strong> Keep your primary contact number accessible at all times
                        </li>
                        <li>
                          • <strong>Updates:</strong> You will receive status updates via your preferred contact method
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 justify-end pt-8 border-t-2 border-gray-200">
                  {/* <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="px-10 py-4 border-2 border-gray-400 hover:border-red-400 hover:text-red-600 rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-200 text-sm font-semibold"
                  >
                    Save as Draft
                  </Button> */}
                  <Button
                    type="submit"
                    className="px-10 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-sm"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-3">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        Processing Request...
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Shield className="h-6 w-6" />
                        Submit Emergency Request
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AssistanceRequestPage
