"use client"

import { useState } from "react"
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import {
  MapPin,
  Calendar,
  Users,
  AlertTriangle,
  Heart,
  Building2,
  Clock,
  CheckCircle,
  User,
  Camera,
  Shield,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useDisasterStore } from "../../store/disasterStore"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { RequestHelpForm } from "../forms/RequestHelpForm"

interface DisasterEventDetailsProps {
  eventId: string
}

export function DisasterEventDetails({ eventId }: DisasterEventDetailsProps) {
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [allPhotos, setAllPhotos] = useState<string[]>([])

  const { events, getReportsByEvent, getHelpRequestsByEvent } = useDisasterStore()

  const event = events.find((e) => e.id === eventId)
  const reports = getReportsByEvent(eventId)
  const helpRequests = getHelpRequestsByEvent(eventId)

  if (!event) {
    return (
      <div className="text-center py-16">
        <AlertTriangle className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-600 mb-2">Event Not Found</h2>
        <p className="text-gray-500">The disaster event you're looking for doesn't exist.</p>
      </div>
    )
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-500"
      case "High":
        return "bg-orange-500"
      case "Medium":
        return "bg-yellow-500"
      default:
        return "bg-green-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-red-100 text-red-800 border-red-200"
      case "Warning":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Recovery":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Resolved":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getHelpStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "assigned":
        return "bg-purple-100 text-purple-800"
      case "pending":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Mock help requests for demonstration
  const mockHelpRequests = [
    {
      id: "1",
      type: "Food",
      description: "Need 50 food packs for 10 families",
      status: "completed",
      requestedBy: "Kyaw Kyaw",
      assignedTo: "Myanmar Red Cross Society",
      completedAt: "2025-01-16T14:00:00Z",
      priority: "High",
    },
    {
      id: "2",
      type: "Medical",
      description: "Emergency medical supplies needed",
      status: "in-progress",
      requestedBy: "Ma Ma Aye",
      assignedTo: "World Vision Myanmar",
      priority: "Critical",
    },
    {
      id: "3",
      type: "Shelter",
      description: "Temporary shelter for displaced families",
      status: "pending",
      requestedBy: "Thant Zin",
      priority: "High",
    },
  ]

  const openPhotoModal = (photo: string, reportPhotos: string[]) => {
    setAllPhotos(reportPhotos)
    setCurrentPhotoIndex(reportPhotos.indexOf(photo))
    setSelectedPhoto(photo)
  }

  const closePhotoModal = () => {
    setSelectedPhoto(null)
    setAllPhotos([])
    setCurrentPhotoIndex(0)
  }

  const nextPhoto = () => {
    if (currentPhotoIndex < allPhotos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1)
      setSelectedPhoto(allPhotos[currentPhotoIndex + 1])
    }
  }

  const prevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1)
      setSelectedPhoto(allPhotos[currentPhotoIndex - 1])
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Event Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-emerald-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className={`w-4 h-4 rounded-full ${getSeverityColor(event.severity)}`}></div>
              <Badge
                variant="outline"
                className={`${getStatusColor(event.status)} border-white/30 text-white bg-white/10`}
              >
                {event.status}
              </Badge>
            </div>
            <div className="flex items-center space-x-2 text-white/80">
              <Shield className="h-5 w-5" />
              <span className="text-sm">Admin Verified</span>
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl">{event.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center space-x-3">
              <MapPin className="h-6 w-6 text-green-300" />
              <div>
                <p className="font-semibold">Location</p>
                <p className="text-blue-100">{event.location}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-6 w-6 text-blue-300" />
              <div>
                <p className="font-semibold">Date</p>
                <p className="text-blue-100">{new Date(event.date).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="h-6 w-6 text-purple-300" />
              <div>
                <p className="font-semibold">Affected People</p>
                <p className="text-blue-100">{event.affectedPeople.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Dialog open={showRequestForm} onOpenChange={setShowRequestForm}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold shadow-xl">
                  <Heart className="mr-2 h-5 w-5" />
                  Request Help
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Request Help for {event.title}</DialogTitle>
                  <DialogDescription>
                    Submit a help request for this disaster event. Our team will review and assign it to an appropriate
                    organization.
                  </DialogDescription>
                </DialogHeader>
                <RequestHelpForm eventId={event.id} onSuccess={() => setShowRequestForm(false)} />
              </DialogContent>
            </Dialog>

            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
            >
              <MapPin className="mr-2 h-5 w-5" />
              View on Map
            </Button>
          </div>
        </div>
      </div>

      {/* Admin Summary */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-800">
            <Shield className="mr-2 h-6 w-6" />
            Official Summary
          </CardTitle>
          <CardDescription>Admin-verified information about this disaster event</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">{event.adminSummary}</p>
        </CardContent>
      </Card>

      {/* Call to Action */}
     {/* <Card className="border-0 bg-gradient-to-r from-blue-600 to-green-600 text-white">
      <CardHeader>
        <CardTitle className="text-lg">Help This Community</CardTitle>
        <CardDescription className="text-blue-100">Your support can make a real difference</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button asChild className="w-full bg-white text-blue-600 hover:bg-blue-50">
          <Link to="/donate" className="flex items-center">
            <Heart className="h-4 w-4 mr-2" />
            Donate Now
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="w-full border-white/30 text-white hover:bg-white/20 bg-transparent"
        >
          <Link to="/report" className="flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Report Similar Issue
          </Link>
        </Button>
      </CardContent>
    </Card> */}
      {/* Main Content Tabs */}
      <Tabs defaultValue="reports" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100">
          <TabsTrigger value="reports" className="data-[state=active]:bg-white">
            Community Reports ({reports.length})
          </TabsTrigger>
          <TabsTrigger value="requests" className="data-[state=active]:bg-white">
            Help Requests ({mockHelpRequests.length})
          </TabsTrigger>
          <TabsTrigger value="support" className="data-[state=active]:bg-white">
            Support Organizations
          </TabsTrigger>
        </TabsList>

        {/* Community Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5 text-blue-600" />
                Community Reports
              </CardTitle>
              <CardDescription>
                Reports from community members that were verified and merged into this disaster event
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {reports.map((report) => (
                  <div key={report.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {report.submittedBy.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-gray-900">{report.submittedBy}</p>
                          <p className="text-sm text-gray-500">
                            Reported on {new Date(report.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Verified
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">{report.title}</h4>
                        <p className="text-gray-700">{report.description}</p>
                      </div>

                      {report.impact && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <AlertTriangle className="h-4 w-4 text-orange-600" />
                            <span className="font-semibold text-orange-800">Impact Observed</span>
                          </div>
                          <p className="text-orange-700">{report.impact}</p>
                          <p className="text-xs text-orange-600 mt-2">
                            Added on {new Date(report.impactAddedAt!).toLocaleDateString()}
                          </p>
                        </div>
                      )}

                      {/* Photo Gallery */}
                      {report.photos.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Camera className="h-4 w-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">Photos ({report.photos.length})</span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {report.photos.map((photo, index) => (
                              <div
                                key={index}
                                className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => openPhotoModal(photo, report.photos)}
                              >
                                <img
                                  src={photo || "/placeholder.svg"}
                                  alt={`Report photo ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
                                  <Camera className="h-6 w-6 text-white opacity-0 hover:opacity-100 transition-opacity" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span>📍 {report.location}</span>
                          {report.photos.length > 0 && (
                            <div className="flex items-center space-x-1">
                              <Camera className="h-4 w-4" />
                              <span>{report.photos.length} photos</span>
                            </div>
                          )}
                        </div>
                        <Badge variant="outline">{report.severity} Severity</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Help Requests Tab */}
        <TabsContent value="requests" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="mr-2 h-5 w-5 text-red-600" />
                Help Requests
              </CardTitle>
              <CardDescription>Current help requests for this disaster event and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockHelpRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {request.type}
                        </Badge>
                        <Badge variant="outline" className={getHelpStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={
                            request.priority === "Critical"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-orange-50 text-orange-700 border-orange-200"
                          }
                        >
                          {request.priority}
                        </Badge>
                      </div>
                      <p className="font-medium mb-1">{request.description}</p>
                      <p className="text-sm text-gray-500">Requested by {request.requestedBy}</p>
                      {request.assignedTo && (
                        <div className="flex items-center space-x-2 mt-2">
                          <Building2 className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium text-blue-600">Assigned to: {request.assignedTo}</span>
                        </div>
                      )}
                      {request.completedAt && (
                        <div className="flex items-center space-x-2 mt-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-green-600">
                            Completed: {new Date(request.completedAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {request.status === "completed" && <CheckCircle className="h-6 w-6 text-green-500" />}
                      {request.status === "in-progress" && <Clock className="h-6 w-6 text-blue-500" />}
                      {request.status === "pending" && <AlertTriangle className="h-6 w-6 text-orange-500" />}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Support Organizations Tab */}
        <TabsContent value="support" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="mr-2 h-5 w-5 text-green-600" />
                Supporting Organizations
              </CardTitle>
              <CardDescription>Organizations currently providing support for this disaster event</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["Myanmar Red Cross Society", "World Vision Myanmar"].map((org, index) => (
                  <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <Building2 className="h-6 w-6 text-green-600" />
                      <span className="font-semibold text-green-800">{org}</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-green-700">Active Requests:</span>
                        <span className="font-medium text-green-800">
                          {mockHelpRequests.filter((r) => r.assignedTo === org).length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Completed:</span>
                        <span className="font-medium text-green-800">
                          {mockHelpRequests.filter((r) => r.assignedTo === org && r.status === "completed").length}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closePhotoModal}
              className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {allPhotos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  disabled={currentPhotoIndex === 0}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>

                <button
                  onClick={nextPhoto}
                  disabled={currentPhotoIndex === allPhotos.length - 1}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            <img
              src={selectedPhoto || "/placeholder.svg"}
              alt="Disaster report photo"
              className="max-w-full max-h-full object-contain rounded-lg"
            />

            {allPhotos.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentPhotoIndex + 1} / {allPhotos.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}