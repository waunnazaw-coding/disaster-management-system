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
import { useAuthStore } from "@/store/authStore"
import { useNavigate } from "react-router-dom"

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

// Inside your component:
const { isAuthenticated } = useAuthStore();
const navigate = useNavigate();

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault()
  
  // Check if user is logged in using your auth store
  if (!isAuthenticated) {
    toast.error("Authentication Required", {
      description: "Please log in to submit a request for assistance",
    });
    // Optionally redirect to login:
   // navigate('/login');
    return;
  }
  
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
