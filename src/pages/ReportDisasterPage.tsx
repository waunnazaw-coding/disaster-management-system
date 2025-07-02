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
import { Badge } from "../components/ui/badge"
import { Label } from "../components/ui/label"
import { MapPin, Upload, AlertTriangle, Camera } from "lucide-react"
import { toast } from "sonner"
import { useDisasterStore } from "../store/disasterStore"

const disasterTypes = ["Earthquake", "Flood", "Cyclone", "Landslide", "Fire", "Drought", "Tsunami", "Other"]
const impactTypes = ["Infrastructure Damage", "Casualties", "Property Loss", "Environmental Impact", "Economic Loss"]

const formSchema = z.object({
  disasterType: z.string().min(1, "Please select a disaster type"),
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  location: z.string().min(5, "Please provide a detailed location"),
  impactTypes: z.array(z.string()).min(1, "Select at least one impact type"),
  severity: z.string().min(1, "Please select severity level"),
  affectedPeople: z.string().optional(),
  contactInfo: z.string().optional(),
})

export function ReportDisasterPage() {
  const [selectedImpacts, setSelectedImpacts] = useState<string[]>([])
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addReport } = useDisasterStore()

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
      disasterType: "",
      title: "",
      description: "",
      location: "",
      impactTypes: [],
      severity: "",
      affectedPeople: "",
      contactInfo: "",
    },
  })

  const watchedValues = watch()

  const handleImpactToggle = (impact: string) => {
    const updated = selectedImpacts.includes(impact)
      ? selectedImpacts.filter((i) => i !== impact)
      : [...selectedImpacts, impact]
    setSelectedImpacts(updated)
    setValue("impactTypes", updated)
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedPhotos((prev) => [...prev, ...files].slice(0, 6))
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

    //   addReport({
    //     id: Date.now().toString(),
    //     ...values,
    //     photos: uploadedPhotos.map((f) => f.name),
    //     status: "pending",
    //     createdAt: new Date().toISOString(),
    //   })

     // Success toast - simple version
    toast.success("Your disaster report has been submitted for review.")
    
    // OR with title - if using newer version of sonner
    toast("Report Submitted Successfully", {
      description: "Your disaster report has been submitted for review.",
    })

    reset()
    setSelectedImpacts([])
    setUploadedPhotos([])
  } catch (error) {
    // Error toast - simple version
    toast.error("There was an error submitting your report.")
    
    // OR with title
    toast.error("Submission Failed", {
      description: "There was an error submitting your report.",
    })
  } finally {
    setIsSubmitting(false)
  }
}

  return (
    <div className="w-full mx-auto py-8 max-w-4xl bg-white shadow-md px-8 rounded-lg mt-5">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
          Report a Disaster
        </h1>
        <p className="text-xl text-gray-600">
          Help us respond quickly by providing detailed information about the disaster
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Disaster Type */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">Type of Disaster</h2>
            <p className="text-gray-600">Select disaster type</p>
          </div>
          {/* Disaster Type Select */}
            <Select onValueChange={(value) => setValue("disasterType", value)} value={watchedValues.disasterType}>
            <SelectTrigger className="w-full h-12">  {/* Added w-full */}
                <SelectValue placeholder="Select disaster type" />
            </SelectTrigger>
            <SelectContent className="w-full">  {/* Added w-full */}
                {disasterTypes.map((type) => (
                <SelectItem key={type} value={type}>
                    {type}
                </SelectItem>
                ))}
            </SelectContent>
            </Select>
          {formErrors.disasterType && <p className="text-sm text-red-600">{formErrors.disasterType.message}</p>}
        </div>

        {/* Title */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">Disaster Title</h2>
            <p className="text-gray-600">Provide a clear, descriptive title for the disaster</p>
          </div>
          <Input
            id="title"
            placeholder="e.g., Severe flooding in downtown area"
            className="h-12"
            {...register("title")}
          />
          {formErrors.title && <p className="text-sm text-red-600">{formErrors.title.message}</p>}
        </div>

        {/* Description */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">Detail of the Disaster</h2>
            <p className="text-gray-600">
              Describe what happened, when it started, current situation, and any immediate dangers...
            </p>
          </div>
          <Textarea
            id="description"
            placeholder="Provide detailed information about the disaster..."
            className="min-h-32"
            {...register("description")}
          />
          {formErrors.description && <p className="text-sm text-red-600">{formErrors.description.message}</p>}
        </div>

        {/* Location */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">Location of Impact</h2>
            <p className="text-gray-600">Enter detailed address or coordinates</p>
          </div>
          <Input
            id="location"
            placeholder="Street, City, State or GPS coordinates"
            className="h-12"
            {...register("location")}
          />
          {formErrors.location && <p className="text-sm text-red-600">{formErrors.location.message}</p>}
        </div>

        {/* Impact Types */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">Type of Impact Reporting</h2>
            <p className="text-gray-600">Select all types of impact observed</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {impactTypes.map((impact) => (
              <Badge
                key={impact}
                variant={selectedImpacts.includes(impact) ? "default" : "outline"}
                className="cursor-pointer px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground"
                onClick={() => handleImpactToggle(impact)}
              >
                {impact}
              </Badge>
            ))}
          </div>
          {formErrors.impactTypes && <p className="text-sm text-red-600">{formErrors.impactTypes.message}</p>}
        </div>

        {/* Severity */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">Severity Level</h2>
            <p className="text-gray-600">Select the severity of the disaster</p>
          </div>
         <Select onValueChange={(value) => setValue("severity", value)} value={watchedValues.severity}>
  <SelectTrigger className="w-full h-12">  {/* Added w-full */}
    <SelectValue placeholder="Select severity level" />
  </SelectTrigger>
  <SelectContent className="w-full">  {/* Added w-full */}
    <SelectItem value="Low">Low - Minor damage, no casualties</SelectItem>
    <SelectItem value="Medium">Medium - Moderate damage, some injuries</SelectItem>
    <SelectItem value="High">High - Significant damage, casualties reported</SelectItem>
    <SelectItem value="Critical">Critical - Severe damage, multiple casualties</SelectItem>
  </SelectContent>
</Select>
          {formErrors.severity && <p className="text-sm text-red-600">{formErrors.severity.message}</p>}
        </div>

        {/* Photo Upload */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">Multiple Photos of Impact</h2>
            <p className="text-gray-600">Upload up to 6 photos (JPG, PNG)</p>
          </div>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
              id="photo-upload"
            />
            <label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center">
              <Upload className="h-10 w-10 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-700">Click to upload photos</p>
              <p className="text-sm text-gray-500">or drag and drop files here</p>
            </label>
          </div>
          {uploadedPhotos.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {uploadedPhotos.map((photo, index) => (
                <div key={index} className="bg-gray-100 p-3 rounded-lg text-center">
                  <p className="text-sm font-medium truncate">{photo.name}</p>
                  <p className="text-xs text-gray-500">{(photo.size / 1024).toFixed(1)} KB</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="affectedPeople">Estimated Affected People</Label>
            <Input
              id="affectedPeople"
              placeholder="e.g., 50 families, 200 people"
              className="h-12"
              {...register("affectedPeople")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactInfo">Your Contact Information</Label>
            <Input
              id="contactInfo"
              placeholder="Phone number or email (optional)"
              className="h-12"
              {...register("contactInfo")}
            />
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full h-14 text-lg bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting Report..." : "Submit Disaster Report"}
        </Button>
      </form>
    </div>
  )
}