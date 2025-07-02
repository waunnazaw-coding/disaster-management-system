"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Input } from "../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { MapPin, Phone, Clock, Navigation, Search } from "lucide-react"
import { useState } from "react"

export function HelpCenterPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")

  const helpCenters = [
    {
      id: "1",
      name: "Yangon Emergency Relief Center",
      type: "Emergency Shelter",
      address: "123 Pyay Road, Kamayut Township, Yangon",
      phone: "+95 9 123 456 789",
      hours: "24/7",
      capacity: "500 people",
      services: ["Emergency Shelter", "Food Distribution", "Medical Aid"],
      status: "Open",
      distance: "2.5 km",
    },
    {
      id: "2",
      name: "Mandalay Red Cross Center",
      type: "Medical Center",
      address: "456 26th Street, Mandalay",
      phone: "+95 9 987 654 321",
      hours: "6:00 AM - 10:00 PM",
      capacity: "200 patients",
      services: ["Emergency Medical", "First Aid", "Ambulance"],
      status: "Open",
      distance: "1.8 km",
    },
    {
      id: "3",
      name: "Community Food Bank",
      type: "Food Distribution",
      address: "789 Strand Road, Downtown Yangon",
      phone: "+95 9 555 123 456",
      hours: "8:00 AM - 6:00 PM",
      capacity: "1000 meals/day",
      services: ["Food Packages", "Hot Meals", "Water Supply"],
      status: "Open",
      distance: "3.2 km",
    },
    {
      id: "4",
      name: "Temporary Housing Facility",
      type: "Temporary Housing",
      address: "321 University Avenue, Bahan Township",
      phone: "+95 9 777 888 999",
      hours: "24/7",
      capacity: "150 families",
      services: ["Temporary Housing", "Basic Utilities", "Security"],
      status: "Limited Capacity",
      distance: "4.1 km",
    },
  ]

  const centerTypes = ["all", "Emergency Shelter", "Medical Center", "Food Distribution", "Temporary Housing"]

  const filteredCenters = helpCenters.filter((center) => {
    const matchesSearch =
      center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || center.type === selectedType
    return matchesSearch && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-green-100 text-green-800"
      case "Limited Capacity":
        return "bg-yellow-100 text-yellow-800"
      case "Closed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Emergency Shelter":
        return "bg-red-100 text-red-800"
      case "Medical Center":
        return "bg-blue-100 text-blue-800"
      case "Food Distribution":
        return "bg-green-100 text-green-800"
      case "Temporary Housing":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (

    <div className="space-y-6 container mx-auto">
      {/* Search and Filter */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                {centerTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type === "all" ? "All Types" : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Help Centers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCenters.map((center) => (
          <Card
            key={center.id}
            className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{center.name}</CardTitle>
                  <CardDescription className="mt-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {center.address}
                  </CardDescription>
                </div>
                <Badge variant="outline" className={getStatusColor(center.status)}>
                  {center.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className={getTypeColor(center.type)}>
                  {center.type}
                </Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Navigation className="h-4 w-4 mr-1" />
                  {center.distance}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-green-500" />
                  <span>{center.phone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-blue-500" />
                  <span>{center.hours}</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Capacity:</span> {center.capacity}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Services:</p>
                <div className="flex flex-wrap gap-1">
                  {center.services.map((service, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-600 to-emerald-600">
                  <Navigation className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCenters.length === 0 && (
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="text-center py-12">
            <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-600">No help centers found</p>
            <p className="text-muted-foreground">Try adjusting your search criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default HelpCenterPage