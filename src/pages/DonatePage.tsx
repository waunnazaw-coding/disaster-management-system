"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"
import { Badge } from "../components/ui/badge"
import { Label } from "../components/ui/label"
import { Building2, Phone, Mail } from "lucide-react"
import { toast } from "sonner"

const organizations = [
  { id: "1", name: "Myanmar Red Cross Society", type: "International", focus: "Emergency Relief" },
  { id: "2", name: "World Vision Myanmar", type: "International", focus: "Child Protection" },
  { id: "3", name: "Save the Children Myanmar", type: "International", focus: "Education & Health" },
  { id: "4", name: "Local Community Foundation", type: "Local", focus: "Community Development" },
  { id: "5", name: "Disaster Response Network", type: "Local", focus: "Emergency Response" },
]

const donationTypes = ["Cash/Money", "Food Items", "Clothing", "Medical Supplies", "Educational Materials", "Other"]

const formSchema = z.object({
  organizationId: z.string().min(1, "Please select an organization"),
  donorName: z.string().min(2, "Name must be at least 2 characters"),
  donorEmail: z.string().email("Please enter a valid email"),
  donorPhone: z.string().optional(),
  donationType: z.string().min(1, "Please select donation type"),
  donationValue: z.string().optional(),
  description: z.string().min(10, "Please provide more details about your donation"),
  message: z.string().optional(),
  contactPreference: z.string().min(1, "Please select how you'd like to be contacted"),
})

export function DonatePage() {
  const [selectedOrganization, setSelectedOrganization] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors: formErrors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationId: "",
      donorName: "",
      donorEmail: "",
      donorPhone: "",
      donationType: "",
      donationValue: "",
      description: "",
      message: "",
      contactPreference: "",
    },
  })

  const watchedValues = watch()
  const selectedOrg = organizations.find((org) => org.id === selectedOrganization)

  const handleOrganizationSelect = (orgId: string) => {
    setSelectedOrganization(orgId)
    setValue("organizationId", orgId)
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)) // simulate API delay

      toast({
        title: "Donation Intent Submitted",
        description: `Thank you! ${selectedOrg?.name} will contact you soon to coordinate your donation.`,
      })

      reset()
      setSelectedOrganization("")
    } catch (error) {
      toast.error("Submission Failed", {
        description: "There was an error submitting your donation. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full mx-auto py-8 max-w-4xl bg-white shadow-md px-8 mt-12">
      {/* Header Section */}
      <div className="text-center mb-12">
       <h1 
  className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600"
>
  Make a Donation
</h1>

        <p className="text-xl text-gray-600">
          Support relief organizations in their mission to help disaster victims
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Organization Selection */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">Select Organization</h2>
            <p className="text-gray-600">
              Choose the organization you'd like to support with your donation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Myanmar Red Cross Society */}
  <Card
    className={`cursor-pointer transition-all hover:shadow-md ${
      selectedOrganization === "1" ? "ring-2 ring-blue-500 bg-blue-50" : ""
    }`}
    onClick={() => handleOrganizationSelect("1")}
  >
    <CardContent className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">Myanmar Red Cross Society</h3>
          <p className="text-sm text-gray-600">Emergency Relief</p>
        </div>
        <Badge variant="default" className="text-xs">
          International
        </Badge>
      </div>
    </CardContent>
  </Card>

  {/* World Vision Myanmar */}
  <Card
    className={`cursor-pointer transition-all hover:shadow-md ${
      selectedOrganization === "2" ? "ring-2 ring-blue-500 bg-blue-50" : ""
    }`}
    onClick={() => handleOrganizationSelect("2")}
  >
    <CardContent className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">World Vision Myanmar</h3>
          <p className="text-sm text-gray-600">Child Protection</p>
        </div>
        <Badge variant="default" className="text-xs">
          International
        </Badge>
      </div>
    </CardContent>
  </Card>

  {/* Save the Children Myanmar */}
  <Card
    className={`cursor-pointer transition-all hover:shadow-md ${
      selectedOrganization === "3" ? "ring-2 ring-blue-500 bg-blue-50" : ""
    }`}
    onClick={() => handleOrganizationSelect("3")}
  >
    <CardContent className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">Save the Children Myanmar</h3>
          <div className="text-sm text-gray-600">
            <p>Education & Health</p>
          </div>
        </div>
        <Badge variant="default" className="text-xs">
          International
        </Badge>
      </div>
    </CardContent>
  </Card>

  {/* Local Community Foundation */}
  <Card
    className={`cursor-pointer transition-all hover:shadow-md ${
      selectedOrganization === "4" ? "ring-2 ring-blue-500 bg-blue-50" : ""
    }`}
    onClick={() => handleOrganizationSelect("4")}
  >
    <CardContent className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">Local Community Foundation</h3>
          <p className="text-sm text-gray-600">Community Development</p>
        </div>
        <Badge variant="secondary" className="text-xs">
          Local
        </Badge>
      </div>
    </CardContent>
  </Card>

  {/* Disaster Response Network */}
  <Card
    className={`cursor-pointer transition-all hover:shadow-md ${
      selectedOrganization === "5" ? "ring-2 ring-blue-500 bg-blue-50" : ""
    }`}
    onClick={() => handleOrganizationSelect("5")}
  >
    <CardContent className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">Disaster Response Network</h3>
          <p className="text-sm text-gray-600">Emergency Response</p>
        </div>
        <Badge variant="secondary" className="text-xs">
          Local
        </Badge>
      </div>
    </CardContent>
  </Card>
</div>
          {formErrors.organizationId && <p className="text-sm text-red-600">{formErrors.organizationId.message}</p>}
        </div>

        {/* Donor Information */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="donorName" className="font-medium">
                Full Name
              </Label>
              <Input id="donorName" placeholder="Enter your full name" {...register("donorName")} />
              {formErrors.donorName && <p className="text-sm text-red-600">{formErrors.donorName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="donorEmail" className="font-medium">
                Email Address
              </Label>
              <Input id="donorEmail" placeholder="your.email@example.com" {...register("donorEmail")} />
              {formErrors.donorEmail && <p className="text-sm text-red-600">{formErrors.donorEmail.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="donorPhone" className="font-medium">
              Phone Number (Optional)
            </Label>
            <Input id="donorPhone" placeholder="+95 9 XXX XXX XXX" {...register("donorPhone")} />
            <p className="text-sm text-gray-500">Provide your phone number for faster communication</p>
          </div>
        </div>

        {/* Donation Details */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Donation Details</h2>
          
          <div className="space-y-2">
            <Label htmlFor="donationType" className="font-medium">
              Type of Donation
            </Label>
            <Select onValueChange={(value) => setValue("donationType", value)} value={watchedValues.donationType}>
              <SelectTrigger>
                <SelectValue placeholder="Select what you'd like to donate" />
              </SelectTrigger>
              <SelectContent>
                {donationTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.donationType && <p className="text-sm text-red-600">{formErrors.donationType.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="donationValue" className="font-medium">
              Estimated Value (Optional)
            </Label>
            <Input
              id="donationValue"
              placeholder="e.g., $500, 100,000 MMK, or describe quantity"
              {...register("donationValue")}
            />
            <p className="text-sm text-gray-500">Help the organization understand the scale of your donation</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="font-medium">
              Donation Details
            </Label>
            <Textarea
              id="description"
              placeholder="Describe what you're donating, quantities, condition, any special requirements..."
              className="min-h-32"
              {...register("description")}
            />
            <p className="text-sm text-gray-500">Provide specific details to help the organization prepare</p>
            {formErrors.description && <p className="text-sm text-red-600">{formErrors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="font-medium">
              Message to Organization (Optional)
            </Label>
            <Textarea
              id="message"
              placeholder="Any special message or instructions for the organization..."
              className="min-h-24"
              {...register("message")}
            />
          </div>
        </div>

        {/* Contact Preference */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Contact Preference</h2>
          <Label className="font-medium">How should the organization contact you?</Label>
          <RadioGroup
            onValueChange={(value) => setValue("contactPreference", value)}
            value={watchedValues.contactPreference}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="flex items-center space-x-2 border rounded-lg p-4">
              <RadioGroupItem value="email" id="email" />
              <label htmlFor="email" className="flex items-center cursor-pointer">
                <Mail className="mr-2 h-4 w-4" />
                Email
              </label>
            </div>
            <div className="flex items-center space-x-2 border rounded-lg p-4">
              <RadioGroupItem value="phone" id="phone" />
              <label htmlFor="phone" className="flex items-center cursor-pointer">
                <Phone className="mr-2 h-4 w-4" />
                Phone Call
              </label>
            </div>
            <div className="flex items-center space-x-2 border rounded-lg p-4">
              <RadioGroupItem value="both" id="both" />
              <label htmlFor="both" className="cursor-pointer">
                Either Method
              </label>
            </div>
          </RadioGroup>
          {formErrors.contactPreference && <p className="text-sm text-red-600">{formErrors.contactPreference.message}</p>}
        </div>

        {/* Selected Organization Info */}
        {selectedOrg && (
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-700 flex items-center">
                <Building2 className="mr-2 h-5 w-5" />
                {selectedOrg.name}
              </CardTitle>
              <CardDescription>Your donation will be coordinated with this organization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-green-600">
                <p>
                  <strong>Type:</strong> {selectedOrg.type} Organization
                </p>
                <p>
                  <strong>Focus Area:</strong> {selectedOrg.focus}
                </p>
                <p className="mt-2 text-xs">
                  The organization will contact you directly to arrange donation pickup or delivery.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full h-14 text-lg bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting Donation..." : "Submit Donation Intent"}
        </Button>
      </form>
    </div>
  )
}