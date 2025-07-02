"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { MapPin, Calendar, Users, AlertTriangle, Building2, Heart } from "lucide-react"
import { useDisasterStore } from "../../store/disasterStore"
import { useNavigate } from "react-router-dom" // Added for navigation

export function DisasterEvents() {
  const { events } = useDisasterStore()
  const navigate = useNavigate() // Initialize navigate function

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

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8"> {/* Added horizontal padding */}
      <div className="max-w-[1500px] mx-auto"> {/* Added container with max-width */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Active Disaster Events</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Current verified disasters requiring attention and support. Each event is created from community reports and
            verified by our admin team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <Card
              key={event.id}
              className="group border-0 shadow-lg bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              {/* Event image placeholder */}
              <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-4 left-4 flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getSeverityColor(event.severity)}`}></div>
                  <Badge variant="outline" className={`${getStatusColor(event.status)} font-medium`}>
                    {event.status}
                  </Badge>
                </div>
                <div className="absolute bottom-4 right-4">
                  <AlertTriangle className="h-8 w-8 text-white/80" />
                </div>
              </div>

              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {event.title}
                </CardTitle>
                <CardDescription className="text-gray-600 line-clamp-2">{event.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Event details */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Calendar className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Users className="h-4 w-4 text-purple-500 flex-shrink-0" />
                    <span>{event.affectedPeople.toLocaleString()} people affected</span>
                  </div>
                </div>

                {/* Support stats */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Heart className="h-3 w-3 text-red-400" />
                    <span>{event.helpRequestsCount} help requests</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Building2 className="h-3 w-3 text-blue-400" />
                    <span>{event.supportingOrgsCount} organizations helping</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex space-x-2 pt-4">
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md"
                    onClick={() => navigate(`/events/${event.id}`)} // Changed to use navigate
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Request Help
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-gray-300 hover:bg-gray-50 bg-transparent"
                    onClick={() => navigate(`/events/${event.id}`)} // Changed to use navigate
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-16">
            <AlertTriangle className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Active Events</h3>
            <p className="text-gray-500">There are currently no active disaster events requiring assistance.</p>
          </div>
        )}
      </div>
    </section>
  )
}