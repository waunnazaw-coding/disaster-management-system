// "use client";

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import {
//   ArrowLeft,
//   ChevronRight,
//   Check,
//   Loader2,
//   Phone,
//   MapPin,
//   AlertCircle,
//   User,
//   Mail,
//   ClipboardList,
//   AlertTriangle,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Separator } from "@/components/ui/separator";
// import { useNavigate } from "react-router-dom";
// import { Badge } from "@/components/ui/badge";

// // Form schema
// export const formSchema = z.object({
//   disasterEventId: z.number().optional(),
//   supportType: z.string().min(1, "Support type is required"),
//   quantity: z.number().min(1, "Quantity must be at least 1").optional(),
//   unit: z.string().optional(),
//   description: z.string().min(10, "Description should be at least 10 characters").optional(),
//   priority: z.enum(["Low", "Medium", "High", "Critical"]),
//   contactName: z.string().min(1, "Contact name is required"),
//   email: z.string().email("Invalid email format").optional().or(z.literal("")),
//   contactPhone: z.string().min(10, "Phone number should be at least 10 digits"),
//   detailedAddress: z.string().min(10, "Address should be at least 10 characters"),
// });

// type RequestFormInputs = z.infer<typeof formSchema>;

// interface RequestFormProps {
//   initialData?: Partial<RequestFormInputs>;
//   onSubmit: (values: RequestFormInputs) => Promise<void>;
//   loading?: boolean;
//   isEdit?: boolean;
// }

// // Priority options with icons
// const priorityOptions = [
//   {
//     value: "Low",
//     label: "Low",
//     description: "Non-urgent needs",
//     color: "bg-green-500",
//     icon: <AlertTriangle className="h-4 w-4 text-white" />,
//   },
//   {
//     value: "Medium",
//     label: "Medium",
//     description: "Important needs",
//     color: "bg-blue-500",
//     icon: <AlertTriangle className="h-4 w-4 text-white" />,
//   },
//   {
//     value: "High",
//     label: "High",
//     description: "Urgent needs",
//     color: "bg-yellow-500",
//     icon: <AlertTriangle className="h-4 w-4 text-white" />,
//   },
//   {
//     value: "Critical",
//     label: "Critical",
//     description: "Life-threatening",
//     color: "bg-red-500",
//     icon: <AlertTriangle className="h-4 w-4 text-white" />,
//   },
// ];

// export const RequestForm = ({
//   initialData,
//   onSubmit,
//   loading,
//   isEdit = false,
// }: RequestFormProps) => {
//   const navigate = useNavigate();
//   const [currentStep, setCurrentStep] = useState(1);

//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     trigger,
//     formState: { errors },
//   } = useForm<RequestFormInputs>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       priority: "Medium",
//       ...initialData,
//     },
//   });

//   const priority = watch("priority");
//   const supportType = watch("supportType");

//   // Steps navigation
//   const nextStep = async () => {
//     let isValid = false;

//     if (currentStep === 1) {
//       isValid = await trigger(["supportType", "priority"]);
//     } else if (currentStep === 2) {
//       isValid = await trigger([
//         "contactName",
//         "contactPhone",
//         "email",
//         "detailedAddress",
//       ]);
//     } else if (currentStep === 3) {
//       isValid = await trigger(["quantity", "unit", "description"]);
//     }

//     if (isValid) {
//       setCurrentStep(currentStep + 1);
//     }
//   };

//   const prevStep = () => {
//     setCurrentStep(currentStep - 1);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header Section */}
//       <div className="bg-white shadow-sm">
//         <div className="max-w-4xl mx-auto px-4 py-6">
//           <div className="flex items-center justify-between">
//             <Button
//               variant="ghost"
//               onClick={() => navigate(-1)}
//               className="text-gray-600 hover:bg-gray-100"
//             >
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Back
//             </Button>

//             <div className="flex items-center space-x-8">
//               {[1, 2, 3].map((step) => (
//                 <div
//                   key={step}
//                   className={`flex items-center space-x-2 cursor-default ${currentStep >= step ? 'text-blue-600' : 'text-gray-400'}`}
//                 >
//                   <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
//                     {step}
//                   </div>
//                   <span className="hidden sm:inline text-sm font-medium">
//                     {step === 1 ? 'Request' : step === 2 ? 'Contact' : 'Details'}
//                   </span>
//                 </div>
//               ))}
//             </div>

//             <div className="w-24"></div> {/* Spacer for balance */}
//           </div>
//         </div>
//       </div>

//       {/* Main Form Content */}
//       <div className="max-w-4xl mx-auto px-4 py-8">
//         <h1 className="text-2xl font-bold text-gray-800 mb-2">
//           {isEdit ? 'Edit Assistance Request' : 'New Assistance Request'}
//         </h1>
//         <p className="text-gray-600 mb-8">
//           {isEdit
//             ? 'Update your request details below'
//             : 'Please provide details about the assistance needed'}
//         </p>

//         <form onSubmit={handleSubmit(onSubmit)}>
//           {/* Hidden disasterEventId field */}
//           <input
//             type="hidden"
//             {...register("disasterEventId", { valueAsNumber: true })}
//           />

//           {/* Step 1: Request Type */}
//           {currentStep === 1 && (
//             <Card className="border-0 shadow-sm">
//               <CardContent className="p-6 space-y-6">
//                 <div className="space-y-4">
//                   <Label className="text-gray-700 font-medium">
//                     What type of support do you need? *
//                   </Label>
//                   <Input
//                     placeholder="e.g., Medical supplies, Food, Shelter, etc."
//                     className="h-12"
//                     {...register("supportType")}
//                   />
//                   {errors.supportType && (
//                     <div className="flex items-center text-red-600 text-sm mt-1">
//                       <AlertCircle className="h-4 w-4 mr-1" />
//                       {errors.supportType.message}
//                     </div>
//                   )}
//                 </div>

//                 <div className="space-y-4">
//                   <Label className="text-gray-700 font-medium">
//                     Priority Level *
//                   </Label>
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                     {priorityOptions.map((option) => (
//                       <button
//                         key={option.value}
//                         type="button"
//                         onClick={() => setValue("priority", option.value as any)}
//                         className={`flex flex-col items-center p-4 rounded-lg border transition-all ${
//                           priority === option.value
//                             ? `border-${option.color.split('-')[1]}-300 bg-${option.color.split('-')[1]}-50`
//                             : "border-gray-200 hover:border-gray-300 bg-white"
//                         }`}
//                       >
//                         <div className={`w-10 h-10 rounded-full ${option.color} flex items-center justify-center mb-2`}>
//                           {option.icon}
//                         </div>
//                         <span className="font-medium text-gray-800">{option.label}</span>
//                         <span className="text-xs text-gray-500 mt-1">{option.description}</span>
//                       </button>
//                     ))}
//                   </div>
//                   {errors.priority && (
//                     <div className="flex items-center text-red-600 text-sm mt-1">
//                       <AlertCircle className="h-4 w-4 mr-1" />
//                       {errors.priority.message}
//                     </div>
//                   )}
//                 </div>

//                 <div className="flex justify-end pt-4">
//                   <Button
//                     type="button"
//                     onClick={nextStep}
//                     disabled={!supportType}
//                   >
//                     Continue
//                     <ChevronRight className="h-4 w-4 ml-2" />
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {/* Step 2: Contact Information */}
//           {currentStep === 2 && (
//             <Card className="border-0 shadow-sm">
//               <CardContent className="p-6 space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <Label className="text-gray-700 font-medium">
//                       Contact Name *
//                     </Label>
//                     <div className="relative">
//                       <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                       <Input
//                         placeholder="Full name"
//                         className="h-12 pl-10"
//                         {...register("contactName")}
//                       />
//                     </div>
//                     {errors.contactName && (
//                       <div className="flex items-center text-red-600 text-sm mt-1">
//                         <AlertCircle className="h-4 w-4 mr-1" />
//                         {errors.contactName.message}
//                       </div>
//                     )}
//                   </div>

//                   <div className="space-y-2">
//                     <Label className="text-gray-700 font-medium">
//                       Contact Phone *
//                     </Label>
//                     <div className="relative">
//                       <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                       <Input
//                         placeholder="Phone number"
//                         className="h-12 pl-10"
//                         {...register("contactPhone")}
//                       />
//                     </div>
//                     {errors.contactPhone && (
//                       <div className="flex items-center text-red-600 text-sm mt-1">
//                         <AlertCircle className="h-4 w-4 mr-1" />
//                         {errors.contactPhone.message}
//                       </div>
//                     )}
//                   </div>

//                   <div className="space-y-2 md:col-span-2">
//                     <Label className="text-gray-700 font-medium">
//                       Email (Optional)
//                     </Label>
//                     <div className="relative">
//                       <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                       <Input
//                         placeholder="Email address"
//                         className="h-12 pl-10"
//                         {...register("email")}
//                       />
//                     </div>
//                     {errors.email && (
//                       <div className="flex items-center text-red-600 text-sm mt-1">
//                         <AlertCircle className="h-4 w-4 mr-1" />
//                         {errors.email.message}
//                       </div>
//                     )}
//                   </div>

//                   <div className="space-y-2 md:col-span-2">
//                     <Label className="text-gray-700 font-medium">
//                       Detailed Address *
//                     </Label>
//                     <div className="relative">
//                       <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                       <Textarea
//                         placeholder="Full address including any landmarks"
//                         className="pl-10 min-h-[100px]"
//                         {...register("detailedAddress")}
//                       />
//                     </div>
//                     {errors.detailedAddress && (
//                       <div className="flex items-center text-red-600 text-sm mt-1">
//                         <AlertCircle className="h-4 w-4 mr-1" />
//                         {errors.detailedAddress.message}
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <div className="flex justify-between pt-4">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={prevStep}
//                   >
//                     <ArrowLeft className="h-4 w-4 mr-2" />
//                     Back
//                   </Button>
//                   <Button
//                     type="button"
//                     onClick={nextStep}
//                   >
//                     Continue
//                     <ChevronRight className="h-4 w-4 ml-2" />
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {/* Step 3: Request Details */}
//           {currentStep === 3 && (
//             <Card className="border-0 shadow-sm">
//               <CardContent className="p-6 space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <Label className="text-gray-700 font-medium">
//                       Quantity
//                     </Label>
//                     <Input
//                       type="number"
//                       min="1"
//                       placeholder="1"
//                       className="h-12"
//                       {...register("quantity", { valueAsNumber: true })}
//                     />
//                     {errors.quantity && (
//                       <div className="flex items-center text-red-600 text-sm mt-1">
//                         <AlertCircle className="h-4 w-4 mr-1" />
//                         {errors.quantity.message}
//                       </div>
//                     )}
//                   </div>

//                   <div className="space-y-2">
//                     <Label className="text-gray-700 font-medium">
//                       Unit
//                     </Label>
//                     <Input
//                       placeholder="e.g., people, kg, boxes"
//                       className="h-12"
//                       {...register("unit")}
//                     />
//                     {errors.unit && (
//                       <div className="flex items-center text-red-600 text-sm mt-1">
//                         <AlertCircle className="h-4 w-4 mr-1" />
//                         {errors.unit.message}
//                       </div>
//                     )}
//                   </div>

//                   <div className="space-y-2 md:col-span-2">
//                     <Label className="text-gray-700 font-medium">
//                       Detailed Description
//                     </Label>
//                     <Textarea
//                       placeholder="Please describe your needs in detail..."
//                       className="min-h-[120px]"
//                       {...register("description")}
//                     />
//                     {errors.description && (
//                       <div className="flex items-center text-red-600 text-sm mt-1">
//                         <AlertCircle className="h-4 w-4 mr-1" />
//                         {errors.description.message}
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <Alert variant="default" className="bg-blue-50 border-blue-200">
//                   <ClipboardList className="h-4 w-4 text-blue-600" />
//                   <AlertDescription className="text-blue-800">
//                     <p className="font-medium">Submission Guidelines:</p>
//                     <ul className="mt-2 space-y-1 text-sm">
//                       <li>• Be specific about your needs</li>
//                       <li>• Provide accurate contact information</li>
//                       <li>• Our team will review and contact you</li>
//                     </ul>
//                   </AlertDescription>
//                 </Alert>

//                 <div className="flex justify-between pt-4">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={prevStep}
//                   >
//                     <ArrowLeft className="h-4 w-4 mr-2" />
//                     Back
//                   </Button>
//                   <Button
//                     type="submit"
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <>
//                         <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                         Submitting...
//                       </>
//                     ) : (
//                       <>
//                         {isEdit ? 'Update Request' : 'Submit Request'}
//                       </>
//                     )}
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// };

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  ChevronRight,
  Check,
  Loader2,
  Phone,
  MapPin,
  AlertCircle,
  User,
  Mail,
  ClipboardList,
  AlertTriangle,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";

// Form schema
export const formSchema = z.object({
  disasterEventId: z.number().optional(),
  supportType: z.string().min(1, "Support type is required"),
  quantity: z.number().min(1, "Quantity must be at least 1").optional(),
  unit: z.string().optional(),
  description: z
    .string()
    .min(10, "Description should be at least 10 characters")
    .optional(),
  priority: z.enum(["Low", "Medium", "High", "Critical"]),
  contactName: z.string().min(1, "Contact name is required"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  contactPhone: z.string().min(10, "Phone number should be at least 10 digits"),
  detailedAddress: z
    .string()
    .min(10, "Address should be at least 10 characters"),
});

type RequestFormInputs = z.infer<typeof formSchema>;

interface RequestFormProps {
  initialData?: Partial<RequestFormInputs>;
  onSubmit: (values: RequestFormInputs) => Promise<void>;
  loading?: boolean;
  isEdit?: boolean;
}

const priorityOptions = [
  {
    value: "Low",
    label: "Low",
    description: "Non-urgent needs",
    color: "bg-emerald-500",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    textColor: "text-emerald-700",
    icon: <AlertTriangle className="h-4 w-4 text-white" />,
  },
  {
    value: "Medium",
    label: "Medium",
    description: "Important needs",
    color: "bg-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
    icon: <AlertTriangle className="h-4 w-4 text-white" />,
  },
  {
    value: "High",
    label: "High",
    description: "Urgent needs",
    color: "bg-amber-500",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-700",
    icon: <AlertTriangle className="h-4 w-4 text-white" />,
  },
  {
    value: "Critical",
    label: "Critical",
    description: "Life-threatening",
    color: "bg-red-500",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-700",
    icon: <AlertTriangle className="h-4 w-4 text-white" />,
  },
];

export const RequestForm = ({
  initialData,
  onSubmit,
  loading,
  isEdit = false,
}: RequestFormProps) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<RequestFormInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      priority: "Medium",
      ...initialData,
    },
  });

  const priority = watch("priority");
  const supportType = watch("supportType");

  // Steps navigation
  const nextStep = async () => {
    let isValid = false;

    if (currentStep === 1) {
      isValid = await trigger(["supportType", "priority"]);
    } else if (currentStep === 2) {
      isValid = await trigger([
        "contactName",
        "contactPhone",
        "email",
        "detailedAddress",
      ]);
    } else if (currentStep === 3) {
      isValid = await trigger(["quantity", "unit", "description"]);
    }

    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/30">
      <div className="bg-white shadow-lg border-b border-gray-100 ">
         <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg mr-4">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {isEdit
                      ? "Update Assistance Request"
                      : "Request Assistance"}
                  </h1>
                </div>
              </div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                {isEdit
                  ? "Update your request details to ensure we can provide the best assistance possible"
                  : "Help us understand your needs so we can provide the most effective assistance during this difficult time"}
              </p>
            </div>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
           
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 px-4 py-2 rounded-lg"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-6">
              {[1, 2, 3].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                        currentStep >= step
                          ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-400 border-2 border-gray-200"
                      }`}
                    >
                      {currentStep > step ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        step
                      )}
                    </div>
                    <div className="hidden sm:block">
                      <div
                        className={`text-sm font-semibold ${
                          currentStep >= step ? "text-red-600" : "text-gray-400"
                        }`}
                      >
                        {step === 1
                          ? "Request Type"
                          : step === 2
                          ? "Contact Info"
                          : "Details"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {step === 1
                          ? "What you need"
                          : step === 2
                          ? "How to reach you"
                          : "Additional info"}
                      </div>
                    </div>
                  </div>
                  {index < 2 && (
                    <div
                      className={`hidden sm:block w-12 h-0.5 mx-4 ${
                        currentStep > step ? "bg-red-500" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="w-20"></div> {/* Spacer for balance */}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Hidden disasterEventId field */}
          <input
            type="hidden"
            {...register("disasterEventId", { valueAsNumber: true })}
          />

          {/* Step 1: Request Type */}
          {currentStep === 1 && (
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-red-50 to-red-50/50 border-b border-red-100">
                <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center">
                  <ClipboardList className="h-6 w-6 text-red-600 mr-3" />
                  What assistance do you need?
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Please specify the type of support required and its urgency
                  level
                </p>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-4">
                  <Label className="text-gray-800 font-semibold text-lg">
                    Type of Support Needed *
                  </Label>
                  <Input
                    placeholder="e.g., Medical supplies, Food packages, Temporary shelter, Clean water, etc."
                    className="h-14 text-lg border-2 border-gray-200 focus:border-red-500 focus:ring-red-500/20 rounded-xl"
                    {...register("supportType")}
                  />
                  {errors.supportType && (
                    <div className="flex items-center text-red-600 text-sm mt-2 bg-red-50 p-3 rounded-lg">
                      <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                      {errors.supportType.message}
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <Label className="text-gray-800 font-semibold text-lg">
                    Priority Level *
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {priorityOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          setValue("priority", option.value as any)
                        }
                        className={`flex flex-col items-center p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                          priority === option.value
                            ? `${option.borderColor} ${option.bgColor} shadow-lg transform scale-105`
                            : "border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50"
                        }`}
                      >
                        <div
                          className={`w-12 h-12 rounded-full ${option.color} flex items-center justify-center mb-3 shadow-md`}
                        >
                          {option.icon}
                        </div>
                        <span
                          className={`font-semibold text-lg ${
                            priority === option.value
                              ? option.textColor
                              : "text-gray-800"
                          }`}
                        >
                          {option.label}
                        </span>
                        <span className="text-sm text-gray-500 mt-1 text-center">
                          {option.description}
                        </span>
                      </button>
                    ))}
                  </div>
                  {errors.priority && (
                    <div className="flex items-center text-red-600 text-sm mt-2 bg-red-50 p-3 rounded-lg">
                      <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                      {errors.priority.message}
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-6">
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!supportType}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Continue
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Contact Information */}
          {currentStep === 2 && (
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-50/50 border-b border-blue-100">
                <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center">
                  <User className="h-6 w-6 text-blue-600 mr-3" />
                  Contact Information
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Please provide your contact details so our team can reach you
                </p>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-gray-800 font-semibold">
                      Full Name *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        placeholder="Enter your full name"
                        className="h-14 pl-12 text-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                        {...register("contactName")}
                      />
                    </div>
                    {errors.contactName && (
                      <div className="flex items-center text-red-600 text-sm mt-2 bg-red-50 p-3 rounded-lg">
                        <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                        {errors.contactName.message}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label className="text-gray-800 font-semibold">
                      Phone Number *
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        placeholder="Enter your phone number"
                        className="h-14 pl-12 text-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                        {...register("contactPhone")}
                      />
                    </div>
                    {errors.contactPhone && (
                      <div className="flex items-center text-red-600 text-sm mt-2 bg-red-50 p-3 rounded-lg">
                        <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                        {errors.contactPhone.message}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 md:col-span-2">
                    <Label className="text-gray-800 font-semibold">
                      Email Address (Optional)
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        placeholder="Enter your email address"
                        className="h-14 pl-12 text-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                        {...register("email")}
                      />
                    </div>
                    {errors.email && (
                      <div className="flex items-center text-red-600 text-sm mt-2 bg-red-50 p-3 rounded-lg">
                        <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                        {errors.email.message}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 md:col-span-2">
                    <Label className="text-gray-800 font-semibold">
                      Complete Address *
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                      <Textarea
                        placeholder="Please provide your complete address including street, township, city, and any notable landmarks"
                        className="pl-12 min-h-[120px] text-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl resize-none"
                        {...register("detailedAddress")}
                      />
                    </div>
                    {errors.detailedAddress && (
                      <div className="flex items-center text-red-600 text-sm mt-2 bg-red-50 p-3 rounded-lg">
                        <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                        {errors.detailedAddress.message}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="px-8 py-3 text-lg font-semibold rounded-xl border-2 border-gray-300 hover:bg-gray-50 bg-transparent"
                  >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Continue
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Request Details */}
          {currentStep === 3 && (
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-emerald-50/50 border-b border-emerald-100">
                <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center">
                  <ClipboardList className="h-6 w-6 text-emerald-600 mr-3" />
                  Additional Details
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Provide specific details about your request to help us assist
                  you better
                </p>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-gray-800 font-semibold">
                      Quantity Needed
                    </Label>
                    <Input
                      type="number"
                      min="1"
                      placeholder="Enter quantity"
                      className="h-14 text-lg border-2 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                      {...register("quantity", { valueAsNumber: true })}
                    />
                    {errors.quantity && (
                      <div className="flex items-center text-red-600 text-sm mt-2 bg-red-50 p-3 rounded-lg">
                        <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                        {errors.quantity.message}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label className="text-gray-800 font-semibold">
                      Unit of Measurement
                    </Label>
                    <Input
                      placeholder="e.g., people, kg, boxes, liters"
                      className="h-14 text-lg border-2 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                      {...register("unit")}
                    />
                    {errors.unit && (
                      <div className="flex items-center text-red-600 text-sm mt-2 bg-red-50 p-3 rounded-lg">
                        <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                        {errors.unit.message}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 md:col-span-2">
                    <Label className="text-gray-800 font-semibold">
                      Detailed Description
                    </Label>
                    <Textarea
                      placeholder="Please provide a detailed description of your needs, current situation, and any specific requirements..."
                      className="min-h-[140px] text-lg border-2 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl resize-none"
                      {...register("description")}
                    />
                    {errors.description && (
                      <div className="flex items-center text-red-600 text-sm mt-2 bg-red-50 p-3 rounded-lg">
                        <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                        {errors.description.message}
                      </div>
                    )}
                  </div>
                </div>

                <Alert className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <AlertDescription className="text-blue-900 ml-2">
                    <div className="space-y-3">
                      <p className="font-semibold text-lg">
                        Before You Submit:
                      </p>
                      <ul className="space-y-2 text-base">
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span>
                            Double-check all contact information for accuracy
                          </span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span>
                            Be as specific as possible about your needs
                          </span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span>
                            Our response team will contact you within 24 hours
                          </span>
                        </li>
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>

                <div className="flex justify-between pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="px-8 py-3 text-lg font-semibold rounded-xl border-2 border-gray-300 hover:bg-gray-50 bg-transparent"
                  >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Submitting Request...
                      </>
                    ) : (
                      <>
                        <Shield className="h-5 w-5 mr-2" />
                        {isEdit ? "Update Request" : "Submit Request"}
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
  );
};
