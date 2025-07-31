"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  Check,
  Loader2,
  Phone,
  MapPin,
  AlertCircle,
  HeartHandshake,
  ShieldAlert,
  User,
  Mail,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

// Form schema remains the same but we'll add some refinements
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

// Priority options with icons and descriptions
const priorityOptions = [
  {
    value: "Low",
    label: "Low Priority",
    description: "Non-urgent needs that can wait a few days",
    color: "bg-green-100 text-green-800",
    icon: <ShieldAlert className="h-5 w-5 text-green-600" />,
  },
  {
    value: "Medium",
    label: "Medium Priority",
    description: "Important but not immediately life-threatening",
    color: "bg-blue-100 text-blue-800",
    icon: <ShieldAlert className="h-5 w-5 text-blue-600" />,
  },
  {
    value: "High",
    label: "High Priority",
    description: "Urgent needs requiring prompt attention",
    color: "bg-yellow-100 text-yellow-800",
    icon: <ShieldAlert className="h-5 w-5 text-yellow-600" />,
  },
  {
    value: "Critical",
    label: "Critical Priority",
    description: "Immediate life-saving needs",
    color: "bg-red-100 text-red-800",
    icon: <ShieldAlert className="h-5 w-5 text-red-600" />,
  },
];

// Common support types
const supportTypes = [
  { value: "Food", label: "Food Supplies" },
  { value: "Water", label: "Drinking Water" },
  { value: "Shelter", label: "Temporary Shelter" },
  { value: "Medical", label: "Medical Assistance" },
  { value: "Clothing", label: "Clothing" },
  { value: "Transport", label: "Transportation" },
  { value: "Other", label: "Other Support" },
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
  const disasterEventId = watch("disasterEventId");

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col items-center text-center">
        {/* Back Button - Top Left */}
        <div className="self-start mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-white hover:bg-white/20 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Safety
          </Button>
        </div>
        
        {/* Main Header Content */}
        <div className="flex flex-col items-center max-w-2xl mx-auto">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 mb-6">
            <HeartHandshake className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
            {isEdit ? "Update Your Assistance Request" : "Request Emergency Assistance"}
          </h1>
          <p className="text-lg text-blue-100 opacity-90">
            {isEdit 
              ? "Update your details to get the help you need" 
              : "Tell us what you need and we'll connect you with help"}
          </p>
        </div>
      </div>
    </div>
  </div>

        {/* Enhanced Progress Steps */}
  <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-10">
    <div className="relative">
      {/* Progress bar background */}
      <div className="absolute inset-0 flex items-center">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
            style={{ width: `${(currentStep - 1) * 50}%` }}
          />
        </div>
      </div>
      
      {/* Steps container */}
      <div className="relative flex justify-between">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex flex-col items-center z-10">
            {/* Step circle */}
            <div 
              className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                currentStep >= step 
                  ? 'bg-blue-600 border-blue-700 text-white shadow-lg'
                  : 'bg-white border-gray-300 text-gray-500'
              }`}
            >
              <span className="font-bold">{step}</span>
            </div>
            
            {/* Step label */}
            <div className="mt-3 text-center">
              <span className={`block text-sm font-medium ${
                currentStep >= step ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {step === 1 ? 'Request Type' : step === 2 ? 'Contact Details' : 'Final Details'}
              </span>
              <span className={`block text-xs mt-1 ${
                currentStep >= step ? 'text-blue-600' : 'text-gray-400'
              }`}>
                {step === 1 ? 'What you need'
                 : step === 2 ? 'How to reach you' 
                 : 'Additional info'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Hidden disasterEventId field */}
          <input
            type="hidden"
            {...register("disasterEventId", { valueAsNumber: true })}
          />

          {/* Step 1: Request Type */}
          {currentStep === 1 && (
            <Card className="shadow-lg border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
                <CardTitle className="flex items-center gap-3">
                  Assistance Request Type
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2 w-full">
                  <Select
                    value={supportType || ""}
                    onValueChange={(value) => setValue("supportType", value)}
                  >
                    <SelectTrigger className="h-12 text-base w-full">
                      <SelectValue placeholder="Select support type" />
                    </SelectTrigger>
                    <SelectContent>
                      {supportTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.supportType && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {errors.supportType.message}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-semibold text-gray-900">
                    How urgent is your request? *
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {priorityOptions.map((option) => (
                      <div key={option.value} className="relative">
                        <button
                          type="button"
                          onClick={() =>
                            setValue("priority", option.value as any)
                          }
                          className={`w-full flex items-start p-4 bg-white border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                            priority === option.value
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center mt-1">
                              {option.icon}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">
                                {option.label}
                              </div>
                              <div className="text-sm text-gray-600">
                                {option.description}
                              </div>
                            </div>
                          </div>
                          {priority === option.value && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                  {errors.priority && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {errors.priority.message}
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!supportType}
                    className="gap-2"
                  >
                    Next Step
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Contact Information */}
          {currentStep === 2 && (
            <Card className="shadow-lg border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
                <CardTitle className="flex items-center gap-3">
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="contactName"
                      className="text-base font-semibold text-gray-900"
                    >
                      Contact Name *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="contactName"
                        placeholder="Your full name"
                        className="h-12 text-base pl-10"
                        {...register("contactName")}
                      />
                    </div>
                    {errors.contactName && (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        {errors.contactName.message}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="contactPhone"
                      className="text-base font-semibold text-gray-900"
                    >
                      Contact Phone *
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="contactPhone"
                        placeholder="+95 9 123 456 789"
                        className="h-12 text-base pl-10"
                        {...register("contactPhone")}
                      />
                    </div>
                    {errors.contactPhone && (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        {errors.contactPhone.message}
                      </div>
                    )}
                  </div>

                  {/* Full-width email field */}
                  <div className="space-y-2 col-span-2">
                    {" "}
                    {/* Add col-span-2 here */}
                    <Label
                      htmlFor="email"
                      className="text-base font-semibold text-gray-900"
                    >
                      Email (Optional)
                    </Label>
                    <div className="relative w-full">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@example.com"
                        className="h-12 text-base pl-10 w-full"
                        {...register("email")}
                      />
                    </div>
                    {errors.email && (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        {errors.email.message}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="detailedAddress"
                    className="text-base font-semibold text-gray-900"
                  >
                    Detailed Address *
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Textarea
                      id="detailedAddress"
                      placeholder="Where the assistance is needed (include landmarks if possible)"
                      className="pl-10 min-h-[100px] text-base"
                      {...register("detailedAddress")}
                    />
                  </div>
                  {errors.detailedAddress && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {errors.detailedAddress.message}
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
                    disabled={
                      !watch("contactName") ||
                      !watch("contactPhone") ||
                      !watch("detailedAddress")
                    }
                    className="gap-2"
                  >
                    Request Details
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Request Details */}
          {currentStep === 3 && (
            <Card className="shadow-lg border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
                <CardTitle className="flex items-center gap-3">
                  Request Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="quantity"
                      className="text-base font-semibold text-gray-900"
                    >
                      Quantity
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
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
                    <Label
                      htmlFor="unit"
                      className="text-base font-semibold text-gray-900"
                    >
                      Unit
                    </Label>
                    <Input
                      id="unit"
                      placeholder="e.g., people, families, kg, etc."
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

                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-base font-semibold text-gray-900"
                  >
                    Detailed Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Please describe your needs in detail..."
                    className="min-h-[120px] text-base"
                    {...register("description")}
                  />
                  {errors.description && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {errors.description.message}
                    </div>
                  )}
                </div>

                <Alert className="border-blue-200 bg-blue-50">
                  <ClipboardList className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <p className="font-semibold">
                      Request Submission Guidelines:
                    </p>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>• Be as specific as possible about your needs</li>
                      <li>• Provide accurate contact information</li>
                      <li>
                        • Our team will review your request and contact you
                      </li>
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
                    type="submit"
                    disabled={loading}
                    className="gap-2 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <HeartHandshake className="h-4 w-4" />
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
    
  );
};
