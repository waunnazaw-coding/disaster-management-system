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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

// Form schema
export const formSchema = z.object({
  disasterEventId: z.number().optional(),
  supportType: z.string().min(1, "Support type is required"),
  quantity: z.number().min(1, "Quantity must be at least 1").optional(),
  unit: z.string().optional(),
  description: z.string().min(10, "Description should be at least 10 characters").optional(),
  priority: z.enum(["Low", "Medium", "High", "Critical"]),
  contactName: z.string().min(1, "Contact name is required"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  contactPhone: z.string().min(10, "Phone number should be at least 10 digits"),
  detailedAddress: z.string().min(10, "Address should be at least 10 characters"),
});

type RequestFormInputs = z.infer<typeof formSchema>;

interface RequestFormProps {
  initialData?: Partial<RequestFormInputs>;
  onSubmit: (values: RequestFormInputs) => Promise<void>;
  loading?: boolean;
  isEdit?: boolean;
}

// Priority options with icons
const priorityOptions = [
  {
    value: "Low",
    label: "Low",
    description: "Non-urgent needs",
    color: "bg-green-500",
    icon: <AlertTriangle className="h-4 w-4 text-white" />,
  },
  {
    value: "Medium",
    label: "Medium",
    description: "Important needs",
    color: "bg-blue-500",
    icon: <AlertTriangle className="h-4 w-4 text-white" />,
  },
  {
    value: "High",
    label: "High",
    description: "Urgent needs",
    color: "bg-yellow-500",
    icon: <AlertTriangle className="h-4 w-4 text-white" />,
  },
  {
    value: "Critical",
    label: "Critical",
    description: "Life-threatening",
    color: "bg-red-500",
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
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <div className="flex items-center space-x-8">
              {[1, 2, 3].map((step) => (
                <div 
                  key={step} 
                  className={`flex items-center space-x-2 cursor-default ${currentStep >= step ? 'text-blue-600' : 'text-gray-400'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                    {step}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">
                    {step === 1 ? 'Request' : step === 2 ? 'Contact' : 'Details'}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="w-24"></div> {/* Spacer for balance */}
          </div>
        </div>
      </div>

      {/* Main Form Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {isEdit ? 'Edit Assistance Request' : 'New Assistance Request'}
        </h1>
        <p className="text-gray-600 mb-8">
          {isEdit 
            ? 'Update your request details below' 
            : 'Please provide details about the assistance needed'}
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Hidden disasterEventId field */}
          <input
            type="hidden"
            {...register("disasterEventId", { valueAsNumber: true })}
          />

          {/* Step 1: Request Type */}
          {currentStep === 1 && (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <Label className="text-gray-700 font-medium">
                    What type of support do you need? *
                  </Label>
                  <Input
                    placeholder="e.g., Medical supplies, Food, Shelter, etc."
                    className="h-12"
                    {...register("supportType")}
                  />
                  {errors.supportType && (
                    <div className="flex items-center text-red-600 text-sm mt-1">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.supportType.message}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <Label className="text-gray-700 font-medium">
                    Priority Level *
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {priorityOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setValue("priority", option.value as any)}
                        className={`flex flex-col items-center p-4 rounded-lg border transition-all ${
                          priority === option.value
                            ? `border-${option.color.split('-')[1]}-300 bg-${option.color.split('-')[1]}-50`
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full ${option.color} flex items-center justify-center mb-2`}>
                          {option.icon}
                        </div>
                        <span className="font-medium text-gray-800">{option.label}</span>
                        <span className="text-xs text-gray-500 mt-1">{option.description}</span>
                      </button>
                    ))}
                  </div>
                  {errors.priority && (
                    <div className="flex items-center text-red-600 text-sm mt-1">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.priority.message}
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!supportType}
                  >
                    Continue
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Contact Information */}
          {currentStep === 2 && (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">
                      Contact Name *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Full name"
                        className="h-12 pl-10"
                        {...register("contactName")}
                      />
                    </div>
                    {errors.contactName && (
                      <div className="flex items-center text-red-600 text-sm mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.contactName.message}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">
                      Contact Phone *
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Phone number"
                        className="h-12 pl-10"
                        {...register("contactPhone")}
                      />
                    </div>
                    {errors.contactPhone && (
                      <div className="flex items-center text-red-600 text-sm mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.contactPhone.message}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-gray-700 font-medium">
                      Email (Optional)
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Email address"
                        className="h-12 pl-10"
                        {...register("email")}
                      />
                    </div>
                    {errors.email && (
                      <div className="flex items-center text-red-600 text-sm mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.email.message}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-gray-700 font-medium">
                      Detailed Address *
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Textarea
                        placeholder="Full address including any landmarks"
                        className="pl-10 min-h-[100px]"
                        {...register("detailedAddress")}
                      />
                    </div>
                    {errors.detailedAddress && (
                      <div className="flex items-center text-red-600 text-sm mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.detailedAddress.message}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={nextStep}
                  >
                    Continue
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Request Details */}
          {currentStep === 3 && (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">
                      Quantity
                    </Label>
                    <Input
                      type="number"
                      min="1"
                      placeholder="1"
                      className="h-12"
                      {...register("quantity", { valueAsNumber: true })}
                    />
                    {errors.quantity && (
                      <div className="flex items-center text-red-600 text-sm mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.quantity.message}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">
                      Unit
                    </Label>
                    <Input
                      placeholder="e.g., people, kg, boxes"
                      className="h-12"
                      {...register("unit")}
                    />
                    {errors.unit && (
                      <div className="flex items-center text-red-600 text-sm mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.unit.message}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-gray-700 font-medium">
                      Detailed Description
                    </Label>
                    <Textarea
                      placeholder="Please describe your needs in detail..."
                      className="min-h-[120px]"
                      {...register("description")}
                    />
                    {errors.description && (
                      <div className="flex items-center text-red-600 text-sm mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.description.message}
                      </div>
                    )}
                  </div>
                </div>

                <Alert variant="default" className="bg-blue-50 border-blue-200">
                  <ClipboardList className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <p className="font-medium">Submission Guidelines:</p>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>• Be specific about your needs</li>
                      <li>• Provide accurate contact information</li>
                      <li>• Our team will review and contact you</li>
                    </ul>
                  </AlertDescription>
                </Alert>

                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        {isEdit ? 'Update Request' : 'Submit Request'}
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