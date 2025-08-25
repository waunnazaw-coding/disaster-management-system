"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Send,
  MapPin,
  AlertTriangle,
  Users,
  Home,
  Camera,
  CheckCircle,
  Upload,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react"
import toast from "react-hot-toast"
import { disasterReportSchema, type DisasterReportFormData } from "@/schemas/disasterReportSchema"
import type { ReportImpactCreateDto, ImpactCreateDto } from "@/types/impact-report"
import axiosInstance from "@/api/axioInstance"

const disasterTypes = [
  { value: "Cyclone", category: "Weather", description: "Tropical cyclone, hurricane, typhoon", icon: "🌪️" },
  { value: "Flood", category: "Weather", description: "River flood, flash flood, coastal flood", icon: "🌊" },
  { value: "Earthquake", category: "Geological", description: "Seismic activity, tremors", icon: "🏔️" },
  { value: "Landslide", category: "Geological", description: "Landslide, mudslide, rockfall", icon: "⛰️" },
  { value: "Drought", category: "Weather", description: "Extended dry period, water shortage", icon: "🌵" },
  { value: "Fire", category: "Human-caused", description: "Wildfire, building fire, industrial fire", icon: "🔥" },
]

const severityLevels = [
  {
    value: "Minor",
    color: "bg-green-100 text-green-800 border-green-200",
    description: "Limited impact, minimal damage",
    icon: "🟢",
  },
  {
    value: "Moderate",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    description: "Significant impact, moderate damage",
    icon: "🟡",
  },
  {
    value: "Major",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    description: "Severe impact, extensive damage",
    icon: "🟠",
  },
  {
    value: "Catastrophic",
    color: "bg-red-100 text-red-800 border-red-200",
    description: "Devastating impact, widespread destruction",
    icon: "🔴",
  },
]

const sources = ["Citizen", "Media", "Government", "NGO", "International Organization", "Other"]

const myanmarRegions = [
  "Yangon Region",
  "Mandalay Region",
  "Naypyidaw Union Territory",
  "Shan State",
  "Rakhine State",
  "Kachin State",
  "Chin State",
  "Kayah State",
  "Kayin State",
  "Mon State",
  "Ayeyarwady Region",
  "Bago Region",
  "Magway Region",
  "Sagaing Region",
  "Tanintharyi Region",
]

export default function ImpactSurveyPage() {
  const [activeTab, setActiveTab] = useState("disaster-info")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    reset,
    trigger,
  } = useForm<DisasterReportFormData>({
    resolver: zodResolver(disasterReportSchema),
    defaultValues: {
      country: "Myanmar",
      geoJson: '{"type":"Point","coordinates":[0,0]}',
      source: "Citizen",
      status: "Active",
      reportPhotos: [],
      newPhotoDescription: [],
      impactsJson: "[]",
    },
    mode: "onChange",
  })

  const watchedPhotos = watch("reportPhotos")
  const watchedSeverity = watch("severity")

  function handleFileUpload(files: FileList | null) {
    if (files) {
      const fileArray = Array.from(files)

      const maxSize = 10 * 1024 * 1024 // 10MB
      const validFiles = fileArray.filter((file) => {
        if (file.size > maxSize) {
          toast.error(`File ${file.name} is too large. Maximum size is 10MB.`)
          return false
        }
        return true
      })

      if (validFiles.length === 0) return

      const currentPhotos = watchedPhotos || []
      const newPhotos = [...currentPhotos, ...validFiles]
      const newDescriptions = [...(watch("newPhotoDescription") || []), ...validFiles.map((f) => f.name)]

      setValue("reportPhotos", newPhotos)
      setValue("newPhotoDescription", newDescriptions)
      toast.success(`${validFiles.length} file(s) uploaded successfully`)
    }
  }

  function removePhoto(index: number) {
    const currentPhotos = watchedPhotos || []
    const currentDescriptions = watch("newPhotoDescription") || []

    setValue(
      "reportPhotos",
      currentPhotos.filter((_, i) => i !== index),
    )
    setValue(
      "newPhotoDescription",
      currentDescriptions.filter((_, i) => i !== index),
    )
    toast.success("File removed")
  }

  async function onSubmit(data: DisasterReportFormData) {
    setIsSubmitting(true)

    try {
      const impacts: ImpactCreateDto[] = []

      // Build impacts array from form data
      if (data.casualties) impacts.push({ Type: "Casualties", Value: data.casualties })
      if (data.injuries) impacts.push({ Type: "Injuries", Value: data.injuries })
      if (data.peopleDisplaced) impacts.push({ Type: "People Displaced", Value: data.peopleDisplaced })
      if (data.peopleAffected) impacts.push({ Type: "People Affected", Value: data.peopleAffected })
      if (data.housesDestroyed) impacts.push({ Type: "Houses Destroyed", Value: data.housesDestroyed })
      if (data.housesPartiallyDamaged)
        impacts.push({ Type: "Houses Partially Damaged", Value: data.housesPartiallyDamaged })
      if (data.infrastructureDamage) impacts.push({ Type: "Infrastructure Damage", Value: data.infrastructureDamage })
      if (data.economicLoss) impacts.push({ Type: "Economic Loss", Value: data.economicLoss })

      const submitFormData = new FormData()

      const reportData: ReportImpactCreateDto = {
        locationName: data.locationName,
        address: data.address || null,
        region: data.region || null,
        country: data.country || "Myanmar",
        geoJson: data.geoJson,
        addressDetail: data.additionalInfo || null,
        type: data.type,
        title: data.title || null,
        description: data.description || null,
        severity: data.severity || null,
        source: data.source || "Citizen",
        status: data.status || "Active",
        reportPhotos: data.reportPhotos || [],
        newPhotoDescription: data.newPhotoDescription || [],
        impactsJson: JSON.stringify(impacts),
      }

      // Add all fields to FormData
      Object.entries(reportData).forEach(([key, value]) => {
        if (key === "reportPhotos" && Array.isArray(value)) {
          value.forEach((photo) => submitFormData.append("reportPhotos", photo))
        } else if (key === "newPhotoDescription" && Array.isArray(value)) {
          value.forEach((desc) => submitFormData.append("newPhotoDescription", desc))
        } else if (value !== null && value !== undefined) {
          submitFormData.append(key, String(value))
        }
      })

      const response = await axiosInstance.post("/DisasterReport/survey", submitFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      toast.success("Survey submitted successfully! Thank you for your report.")
      setSubmitted(true)
    } catch (error) {
      console.error("Submission error:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to submit survey. Please try again."
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const navigateTab = async (direction: "next" | "prev") => {
    const tabs = ["disaster-info", "location", "human-impact", "infrastructure"]
    const currentIndex = tabs.indexOf(activeTab)

    if (direction === "next" && currentIndex < tabs.length - 1) {
      // Validate current tab before moving
      const fieldsToValidate = getFieldsForTab(activeTab)
      const isTabValid = await trigger(fieldsToValidate)

      if (isTabValid) {
        setActiveTab(tabs[currentIndex + 1])
      } else {
        toast.error("Please fill in all required fields before continuing")
      }
    } else if (direction === "prev" && currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1])
    }
  }

  const getFieldsForTab = (tab: string): (keyof DisasterReportFormData)[] => {
    switch (tab) {
      case "disaster-info":
        return ["type", "disasterDate", "severity", "title", "description", "source"]
      case "location":
        return ["locationName", "address", "region"]
      default:
        return []
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
            <CardContent className="p-12 text-center">
              <div className="mx-auto h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Survey Submitted Successfully!</h1>
              <p className="text-lg text-gray-600 mb-8">
                Your disaster impact report has been received and will help improve emergency response in your area.
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => {
                    setSubmitted(false)
                    reset()
                    setActiveTab("disaster-info")
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Submit Another Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-8">
          <h1 className="text-4xl text-left font-bold text-gray-900 mb-4">Disaster Impact Survey</h1>
          <p className=" text-left text-lg text-gray-600 max-w-3xl mx-auto">
            Help improve disaster response by reporting the impact of disasters in your area. Your information helps
            authorities better understand and prepare for future events.
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6 mb-8 shadow-lg">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-semibold mb-2">Why Your Report Matters</h2>
              <p className="text-blue-100">
                Your reports help emergency services understand disaster patterns, improve response times, and better
                prepare communities for future disasters.
              </p>
            </div>
          </div>
        </div>

        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
            <CardTitle className="text-2xl">Impact Survey Form</CardTitle>
            <CardDescription className="text-base">
              Please provide detailed information about the disaster impact. All required fields are marked with *.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 rounded-lg">
                  <TabsTrigger value="disaster-info" className="text-xs font-medium">
                    📋 Disaster Info
                  </TabsTrigger>
                  <TabsTrigger value="location" className="text-xs font-medium">
                    📍 Location
                  </TabsTrigger>
                  <TabsTrigger value="human-impact" className="text-xs font-medium">
                    👥 Human Impact
                  </TabsTrigger>
                  <TabsTrigger value="infrastructure" className="text-xs font-medium">
                    🏠 Infrastructure
                  </TabsTrigger>
                </TabsList>

                {/* Disaster Information Tab */}
                <TabsContent value="disaster-info" className="space-y-6">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Disaster Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="type" className="text-sm font-medium">
                          Disaster Type *
                        </Label>
                        <Select onValueChange={(value) => setValue("type", value)}>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select disaster type" />
                          </SelectTrigger>
                          <SelectContent>
                            {disasterTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex items-center gap-3">
                                  <span className="text-lg">{type.icon}</span>
                                  <div>
                                    <div className="font-medium">{type.value}</div>
                                    <div className="text-xs text-gray-500">{type.description}</div>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.type && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{errors.type.message}</AlertDescription>
                          </Alert>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="disasterDate" className="text-sm font-medium">
                          Date of Disaster *
                        </Label>
                        <Input {...register("disasterDate")} type="date" className="h-12" />
                        {errors.disasterDate && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{errors.disasterDate.message}</AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-sm font-medium">Severity Level *</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {severityLevels.map((level) => (
                          <Card
                            key={level.value}
                            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                              watchedSeverity === level.value
                                ? `ring-2 ring-blue-500 ${level.color} border-blue-300`
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => setValue("severity", level.value)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{level.icon}</span>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-semibold text-gray-900">{level.value}</h4>
                                    {watchedSeverity === level.value && (
                                      <CheckCircle className="h-4 w-4 text-blue-600" />
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600">{level.description}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      {errors.severity && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{errors.severity.message}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm font-medium">
                        Report Title *
                      </Label>
                      <Input
                        {...register("title")}
                        placeholder="Brief title describing the disaster impact"
                        className="h-12"
                      />
                      {errors.title && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{errors.title.message}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-sm font-medium">
                        Detailed Description *
                      </Label>
                      <Textarea
                        {...register("description")}
                        placeholder="Provide detailed description of the disaster and its immediate impact..."
                        rows={4}
                        className="resize-none"
                      />
                      {errors.description && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{errors.description.message}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="source" className="text-sm font-medium">
                        Information Source *
                      </Label>
                      <Select onValueChange={(value) => setValue("source", value)} defaultValue="Citizen">
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select information source" />
                        </SelectTrigger>
                        <SelectContent>
                          {sources.map((source) => (
                            <SelectItem key={source} value={source}>
                              {source}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                {/* Location Tab */}
                <TabsContent value="location" className="space-y-6">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <MapPin className="h-5 w-5 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Location Information</h3>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="locationName" className="text-sm font-medium">
                        Location Name *
                      </Label>
                      <Input {...register("locationName")} placeholder="Village, town, or area name" className="h-12" />
                      {errors.locationName && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{errors.locationName.message}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm font-medium">
                        Detailed Address *
                      </Label>
                      <Textarea
                        {...register("address")}
                        placeholder="Complete address including street, township, and landmarks"
                        rows={3}
                        className="resize-none"
                      />
                      {errors.address && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{errors.address.message}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="region" className="text-sm font-medium">
                          Region/State *
                        </Label>
                        <Select onValueChange={(value) => setValue("region", value)}>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select region/state" />
                          </SelectTrigger>
                          <SelectContent>
                            {myanmarRegions.map((region) => (
                              <SelectItem key={region} value={region}>
                                {region}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.region && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{errors.region.message}</AlertDescription>
                          </Alert>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country" className="text-sm font-medium">
                          Country
                        </Label>
                        <Input {...register("country")} disabled className="h-12 bg-gray-50" />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Human Impact Tab */}
                <TabsContent value="human-impact" className="space-y-6">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Users className="h-5 w-5 text-orange-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Human Impact Assessment</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="casualties" className="text-sm font-medium">
                          Casualties (Deaths)
                        </Label>
                        <Input
                          {...register("casualties")}
                          type="number"
                          min="0"
                          placeholder="Number of deaths"
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="injuries" className="text-sm font-medium">
                          Injuries
                        </Label>
                        <Input
                          {...register("injuries")}
                          type="number"
                          min="0"
                          placeholder="Number of injured people"
                          className="h-12"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="peopleDisplaced" className="text-sm font-medium">
                          People Displaced
                        </Label>
                        <Input
                          {...register("peopleDisplaced")}
                          type="number"
                          min="0"
                          placeholder="Number of displaced people"
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="peopleAffected" className="text-sm font-medium">
                          Total People Affected
                        </Label>
                        <Input
                          {...register("peopleAffected")}
                          type="number"
                          min="0"
                          placeholder="Total number of affected people"
                          className="h-12"
                        />
                      </div>
                    </div>

                    <Alert className="border-amber-200 bg-amber-50">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-amber-800">
                        <strong>Note:</strong> Please provide accurate numbers if known. If exact numbers are not
                        available, provide your best estimate and mention this in the additional information section.
                      </AlertDescription>
                    </Alert>
                  </div>
                </TabsContent>

                {/* Infrastructure Impact Tab */}
                <TabsContent value="infrastructure" className="space-y-6">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Home className="h-5 w-5 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Infrastructure & Economic Impact</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="housesDestroyed" className="text-sm font-medium">
                          Houses Completely Destroyed
                        </Label>
                        <Input
                          {...register("housesDestroyed")}
                          type="number"
                          min="0"
                          placeholder="Number of houses destroyed"
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="housesPartiallyDamaged" className="text-sm font-medium">
                          Houses Partially Damaged
                        </Label>
                        <Input
                          {...register("housesPartiallyDamaged")}
                          type="number"
                          min="0"
                          placeholder="Number of houses partially damaged"
                          className="h-12"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="infrastructureDamage" className="text-sm font-medium">
                        Infrastructure Damage Description
                      </Label>
                      <Textarea
                        {...register("infrastructureDamage")}
                        placeholder="Describe damage to roads, bridges, schools, hospitals, utilities, etc."
                        rows={4}
                        className="resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="economicLoss" className="text-sm font-medium">
                        Estimated Economic Loss (MMK)
                      </Label>
                      <Input
                        {...register("economicLoss")}
                        placeholder="Estimated total economic loss in Myanmar Kyat"
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-4">
                      <Label className="text-sm font-medium">Upload Photos/Videos</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-blue-400 transition-colors">
                        <div className="text-center">
                          <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                          <div>
                            <input
                              ref={(el) => {
                                if (el) {
                                  ;(window as any).fileInput = el
                                }
                              }}
                              type="file"
                              multiple
                              accept="image/jpeg,image/jpg,image/png,image/gif,video/mp4,video/mov,video/avi"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e.target.files)}
                            />
                            <div className="cursor-pointer" onClick={() => (window as any).fileInput?.click()}>
                              <span className="text-lg font-medium text-gray-900 block mb-2">
                                Upload photos or videos of the damage
                              </span>
                              <p className="text-sm text-gray-500 mb-4">PNG, JPG, GIF, MP4, MOV, AVI up to 10MB each</p>
                              <Button type="button" variant="outline" className="bg-white hover:bg-gray-50">
                                <Upload className="mr-2 h-4 w-4" />
                                Choose Files
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Display uploaded files */}
                      {watchedPhotos && watchedPhotos.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium text-gray-900">
                            Uploaded Files ({watchedPhotos.length}):
                          </h4>
                          <div className="grid gap-3">
                            {watchedPhotos.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                              >
                                <div className="flex items-center gap-3">
                                  <Camera className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm text-gray-700 font-medium">{file.name}</span>
                                  <span className="text-xs text-gray-500">
                                    ({(file.size / 1024 / 1024).toFixed(1)} MB)
                                  </span>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removePhoto(index)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  Remove
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <div className="flex justify-between items-center pt-6 border-t bg-gray-50 -mx-6 px-6 py-4 rounded-b-lg">
                  <div className="flex gap-3">
                    {activeTab !== "disaster-info" && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigateTab("prev")}
                        className="flex items-center gap-2"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Previous
                      </Button>
                    )}
                  </div>

                  <div className="flex gap-3">
                    {activeTab !== "infrastructure" ? (
                      <Button
                        type="button"
                        onClick={() => navigateTab("next")}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                      >
                        Next
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 flex items-center gap-2 px-8"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Submit Survey
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </Tabs>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Why Your Report Matters
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h4 className="font-semibold mb-3 text-green-800">Immediate Benefits:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                  Helps coordinate emergency response
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                  Identifies areas needing urgent assistance
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                  Improves resource allocation
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                  Supports damage assessment
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-blue-800">Long-term Impact:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  Improves disaster preparedness planning
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  Helps build community resilience
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  Supports policy development
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  Contributes to research and education
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
