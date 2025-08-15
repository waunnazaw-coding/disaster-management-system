"use client"
import { useState, useMemo, useEffect } from "react"
import { Phone, Clock, MapPin, Search, Activity, Shield, Ambulance, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Complete mock data with 30+ entries covering all regions
const emergencyContactsData = [
  // Yangon Region
  {
    id: 1,
    name: "Yangon General Hospital",
    type: "hospital",
    phone: "01-256112",
    address: "Bogyoke Aung San Rd, Yangon",
    region: "Yangon",
    lat: 16.7806,
    lng: 96.1495,
    hours: "24/7 Emergency",
    services: ["Trauma", "ICU", "Ambulance", "Surgery"],
    notes: "Main public hospital with full emergency services",
  },
  {
    id: 2,
    name: "Pun Hlaing Hospital",
    type: "hospital",
    phone: "01-650766",
    address: "Hlaing Township, Yangon",
    region: "Yangon",
    lat: 16.8409,
    lng: 96.1735,
    hours: "24/7",
    services: ["Private Care", "ICU", "Emergency"],
    notes: "Premium private hospital",
  },
  {
    id: 3,
    name: "Yangon Fire Department",
    type: "rescue",
    phone: "01-395555",
    address: "Sule Pagoda Rd, Yangon",
    region: "Yangon",
    lat: 16.7794,
    lng: 96.148,
    hours: "24/7",
    services: ["Fire", "Rescue", "Emergency"],
    notes: "Main fire station",
  },
  // Mandalay Region
  {
    id: 4,
    name: "Mandalay General Hospital",
    type: "hospital",
    phone: "02-65391",
    address: "30th St, Mandalay",
    region: "Mandalay",
    lat: 21.9588,
    lng: 96.0891,
    hours: "24/7 Emergency",
    services: ["Trauma", "Surgery", "ICU"],
    notes: "Regional referral hospital",
  },
  {
    id: 5,
    name: "Mandalay Rescue Team",
    type: "rescue",
    phone: "02-654321",
    address: "78th St, Mandalay",
    region: "Mandalay",
    lat: 21.9688,
    lng: 96.0791,
    hours: "6:00 AM - 10:00 PM",
    services: ["Fire", "Flood", "First Aid"],
    notes: "Volunteer rescue team",
  },
  {
    id: 6,
    name: "Shwe Thanlwin Hospital",
    type: "hospital",
    phone: "02-61234",
    address: "35th St, Mandalay",
    region: "Mandalay",
    lat: 21.9747,
    lng: 96.0836,
    hours: "24/7",
    services: ["General", "Maternity", "Pediatrics"],
    notes: "Private hospital",
  },
  // Nay Pyi Taw
  {
    id: 7,
    name: "Nay Pyi Taw Emergency Center",
    type: "emergency",
    phone: "067-123456",
    address: "Ottara Thiri Township",
    region: "Nay Pyi Taw",
    lat: 19.7633,
    lng: 96.0785,
    hours: "24/7",
    services: ["Police", "Ambulance", "Fire"],
    notes: "Central emergency coordination",
  },
  {
    id: 8,
    name: "Nay Pyi Taw Hospital",
    type: "hospital",
    phone: "067-234567",
    address: "Zabuthiri Township",
    region: "Nay Pyi Taw",
    lat: 19.7455,
    lng: 96.1299,
    hours: "24/7",
    services: ["General", "Emergency", "ICU"],
    notes: "Government hospital",
  },
  // Shan State
  {
    id: 9,
    name: "Taunggyi General Hospital",
    type: "hospital",
    phone: "081-21234",
    address: "Taunggyi, Shan State",
    region: "Shan",
    lat: 20.7892,
    lng: 97.0377,
    hours: "24/7 Emergency",
    services: ["General", "Pediatrics", "Surgery"],
    notes: "Main hospital for Shan State",
  },
  {
    id: 10,
    name: "Lashio District Hospital",
    type: "hospital",
    phone: "082-22345",
    address: "Lashio, Shan State",
    region: "Shan",
    lat: 22.9359,
    lng: 97.7498,
    hours: "8:00 AM - 8:00 PM",
    services: ["General", "Emergency"],
    notes: "District level hospital",
  },
  // Kachin State
  {
    id: 11,
    name: "Myitkyina General Hospital",
    type: "hospital",
    phone: "074-23456",
    address: "Myitkyina, Kachin State",
    region: "Kachin",
    lat: 25.3837,
    lng: 97.3967,
    hours: "24/7",
    services: ["Trauma", "General", "Maternity"],
    notes: "State capital hospital",
  },
  {
    id: 12,
    name: "Kachin Rescue Service",
    type: "rescue",
    phone: "074-34567",
    address: "Myitkyina, Kachin State",
    region: "Kachin",
    lat: 25.39,
    lng: 97.4,
    hours: "24/7",
    services: ["Mountain Rescue", "Flood", "Emergency"],
    notes: "Specialized mountain rescue",
  },
  // Kayah State
  {
    id: 13,
    name: "Loikaw General Hospital",
    type: "hospital",
    phone: "083-21234",
    address: "Loikaw, Kayah State",
    region: "Kayah",
    lat: 19.6769,
    lng: 97.2093,
    hours: "24/7",
    services: ["General", "Emergency"],
    notes: "State hospital",
  },
  // Kayin State
  {
    id: 14,
    name: "Hpa-an General Hospital",
    type: "hospital",
    phone: "058-21234",
    address: "Hpa-an, Kayin State",
    region: "Kayin",
    lat: 16.8895,
    lng: 97.6348,
    hours: "24/7",
    services: ["General", "Maternity", "Emergency"],
    notes: "State capital hospital",
  },
  {
    id: 15,
    name: "Kayin Emergency Response",
    type: "emergency",
    phone: "058-23456",
    address: "Hpa-an, Kayin State",
    region: "Kayin",
    lat: 16.89,
    lng: 97.635,
    hours: "24/7",
    services: ["Police", "Fire", "Medical"],
    notes: "State emergency services",
  },
  // Chin State
  {
    id: 16,
    name: "Hakha General Hospital",
    type: "hospital",
    phone: "070-21234",
    address: "Hakha, Chin State",
    region: "Chin",
    lat: 22.6467,
    lng: 93.6108,
    hours: "8:00 AM - 6:00 PM",
    services: ["General", "Basic Emergency"],
    notes: "Remote area hospital",
  },
  // Mon State
  {
    id: 17,
    name: "Mawlamyine General Hospital",
    type: "hospital",
    phone: "057-21234",
    address: "Mawlamyine, Mon State",
    region: "Mon",
    lat: 16.4919,
    lng: 97.6278,
    hours: "24/7",
    services: ["General", "Surgery", "ICU"],
    notes: "Regional hospital",
  },
  {
    id: 18,
    name: "Mon State Fire Department",
    type: "rescue",
    phone: "057-23456",
    address: "Mawlamyine, Mon State",
    region: "Mon",
    lat: 16.495,
    lng: 97.63,
    hours: "24/7",
    services: ["Fire", "Rescue", "Emergency"],
    notes: "State fire services",
  },
  // Rakhine State
  {
    id: 19,
    name: "Sittwe General Hospital",
    type: "hospital",
    phone: "043-21234",
    address: "Sittwe, Rakhine State",
    region: "Rakhine",
    lat: 20.1484,
    lng: 92.8967,
    hours: "24/7",
    services: ["General", "Emergency", "Maternity"],
    notes: "Coastal region hospital",
  },
  {
    id: 20,
    name: "Rakhine Coast Guard",
    type: "rescue",
    phone: "043-23456",
    address: "Sittwe Port, Rakhine State",
    region: "Rakhine",
    lat: 20.15,
    lng: 92.9,
    hours: "24/7",
    services: ["Marine Rescue", "Emergency"],
    notes: "Maritime emergency services",
  },
  // Bago Region
  {
    id: 21,
    name: "Bago General Hospital",
    type: "hospital",
    phone: "052-21234",
    address: "Bago City, Bago Region",
    region: "Bago",
    lat: 17.3356,
    lng: 96.4807,
    hours: "24/7",
    services: ["General", "Surgery", "Emergency"],
    notes: "Regional referral center",
  },
  {
    id: 22,
    name: "Pyay District Hospital",
    type: "hospital",
    phone: "053-21234",
    address: "Pyay, Bago Region",
    region: "Bago",
    lat: 18.8243,
    lng: 95.2234,
    hours: "24/7",
    services: ["General", "Maternity"],
    notes: "District hospital",
  },
  // Magway Region
  {
    id: 23,
    name: "Magway General Hospital",
    type: "hospital",
    phone: "063-21234",
    address: "Magway City, Magway Region",
    region: "Magway",
    lat: 20.1506,
    lng: 94.939,
    hours: "24/7",
    services: ["General", "Emergency"],
    notes: "Regional hospital",
  },
  {
    id: 24,
    name: "Pakokku Hospital",
    type: "hospital",
    phone: "062-21234",
    address: "Pakokku, Magway Region",
    region: "Magway",
    lat: 21.3367,
    lng: 95.0851,
    hours: "8:00 AM - 8:00 PM",
    services: ["General", "Basic Emergency"],
    notes: "District hospital",
  },
  // Sagaing Region
  {
    id: 25,
    name: "Sagaing General Hospital",
    type: "hospital",
    phone: "071-21234",
    address: "Sagaing City, Sagaing Region",
    region: "Sagaing",
    lat: 21.8787,
    lng: 95.9807,
    hours: "24/7",
    services: ["General", "Surgery", "ICU"],
    notes: "Regional hospital",
  },
  {
    id: 26,
    name: "Monywa District Hospital",
    type: "hospital",
    phone: "071-23456",
    address: "Monywa, Sagaing Region",
    region: "Sagaing",
    lat: 22.1081,
    lng: 95.1348,
    hours: "24/7",
    services: ["General", "Emergency"],
    notes: "District level care",
  },
  // Tanintharyi Region
  {
    id: 27,
    name: "Myeik General Hospital",
    type: "hospital",
    phone: "059-21234",
    address: "Myeik, Tanintharyi Region",
    region: "Tanintharyi",
    lat: 12.4396,
    lng: 98.6004,
    hours: "24/7",
    services: ["General", "Surgery", "Maternity"],
    notes: "Southern region hospital",
  },
  {
    id: 28,
    name: "Dawei District Hospital",
    type: "hospital",
    phone: "059-23456",
    address: "Dawei, Tanintharyi Region",
    region: "Tanintharyi",
    lat: 14.0818,
    lng: 98.1895,
    hours: "24/7",
    services: ["General", "Emergency"],
    notes: "Coastal district hospital",
  },
  // Ayeyarwady Region
  {
    id: 29,
    name: "Pathein General Hospital",
    type: "hospital",
    phone: "042-21234",
    address: "Pathein, Ayeyarwady Region",
    region: "Ayeyarwady",
    lat: 16.7791,
    lng: 94.7319,
    hours: "24/7",
    services: ["General", "Surgery", "ICU"],
    notes: "Delta region hospital",
  },
  {
    id: 30,
    name: "Ayeyarwady River Rescue",
    type: "rescue",
    phone: "042-23456",
    address: "Pathein Port, Ayeyarwady Region",
    region: "Ayeyarwady",
    lat: 16.78,
    lng: 94.735,
    hours: "24/7",
    services: ["Water Rescue", "Flood Response"],
    notes: "River and flood emergency services",
  },
  // National emergency services
  {
    id: 31,
    name: "National Emergency Hotline",
    type: "emergency",
    phone: "999",
    address: "Nationwide Service",
    region: "National",
    lat: 19.7633,
    lng: 96.0785,
    hours: "24/7",
    services: ["Police", "Fire", "Medical", "Rescue"],
    notes: "National emergency coordination center",
  },
  {
    id: 32,
    name: "Myanmar Red Cross",
    type: "rescue",
    phone: "01-370153",
    address: "42 Strand Rd, Yangon",
    region: "National",
    lat: 16.7794,
    lng: 96.155,
    hours: "24/7",
    services: ["Disaster Relief", "First Aid", "Blood Bank"],
    notes: "International humanitarian organization",
  },
  {
    id: 33,
    name: "Police Hotline",
    type: "emergency",
    phone: "199",
    address: "Nationwide Service",
    region: "National",
    lat: 19.7633,
    lng: 96.0785,
    hours: "24/7",
    services: ["Police", "Crime Reporting"],
    notes: "National police emergency hotline",
  },
  {
    id: 34,
    name: "Ambulance Service",
    type: "emergency",
    phone: "192",
    address: "Nationwide Service",
    region: "National",
    lat: 19.7633,
    lng: 96.0785,
    hours: "24/7",
    services: ["Medical Emergency", "Ambulance Dispatch"],
    notes: "National ambulance emergency hotline",
  },
  {
    id: 35,
    name: "Fire Service",
    type: "emergency",
    phone: "191",
    address: "Nationwide Service",
    region: "National",
    lat: 19.7633,
    lng: 96.0785,
    hours: "24/7",
    services: ["Fire Emergency", "Rescue"],
    notes: "National fire emergency hotline",
  },
]

const regions = [
  "All Regions",
  "Yangon",
  "Mandalay",
  "Nay Pyi Taw",
  "Shan",
  "Kachin",
  "Kayah",
  "Kayin",
  "Chin",
  "Mon",
  "Rakhine",
  "Bago",
  "Magway",
  "Sagaing",
  "Tanintharyi",
  "Ayeyarwady",
  "National",
]

const contactTypes = [
  { value: "all", label: "All Types" },
  { value: "hospital", label: "Hospitals" },
  { value: "rescue", label: "Rescue Services" },
  { value: "emergency", label: "Emergency Services" },
]

const EmergencyContactsPage = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>("All Regions")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  // Separate national emergency contacts
  const nationalEmergencyContacts = useMemo(() => {
    return emergencyContactsData.filter((contact) => contact.region === "National")
  }, [])

  // Filter out national contacts from the main list
  const regionalContacts = useMemo(() => {
    return emergencyContactsData.filter((contact) => contact.region !== "National")
  }, [])

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const filteredContacts = useMemo(() => {
    return regionalContacts.filter((contact) => {
      const matchesRegion = selectedRegion === "All Regions" || contact.region === selectedRegion
      const matchesType = selectedType === "all" || contact.type === selectedType
      const matchesSearch =
        searchQuery === "" ||
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.services.some((service) => service.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesRegion && matchesType && matchesSearch
    })
  }, [selectedRegion, selectedType, searchQuery, regionalContacts])

  const getIcon = (type: string) => {
    switch (type) {
      case "hospital":
        return <Activity className="h-5 w-5 text-red-500" />
      case "rescue":
        return <Shield className="h-5 w-5 text-blue-500" />
      case "emergency":
        return <Ambulance className="h-5 w-5 text-orange-500" />
      default:
        return <MapPin className="h-5 w-5 text-green-500" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "hospital":
        return "bg-red-50 text-red-700 border-red-200"
      case "rescue":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "emergency":
        return "bg-orange-50 text-orange-700 border-orange-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const clearFilters = () => {
    setSelectedRegion("All Regions")
    setSelectedType("all")
    setSearchQuery("")
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
          <div className="grid gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-xl h-32"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Emergency Contacts</h1>
        <p className="text-gray-600">Find emergency services and healthcare facilities across Myanmar</p>
      </div>

      {/* National Emergency Numbers Section */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
          <Ambulance className="h-6 w-6" />
          National Emergency Hotlines
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {nationalEmergencyContacts.map((contact) => (
            <Card key={contact.id} className="bg-white border border-red-100 shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getIcon(contact.type)}
                  <div>
                    <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">
                        {contact.phone}
                      </a>
                    </p>
                  </div>
                </div>
                <Badge className={`text-xs ${getTypeColor(contact.type)}`}>{contact.type}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, location, or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
          </div>
          {/* Region Filter */}
          <div>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Type Filter */}
          <div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {contactTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* Active Filters */}
        {(selectedRegion !== "All Regions" || selectedType !== "all" || searchQuery) && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-500">Active filters:</span>
            {selectedRegion !== "All Regions" && (
              <Badge variant="secondary" className="gap-1">
                {selectedRegion}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedRegion("All Regions")} />
              </Badge>
            )}
            {selectedType !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {contactTypes.find((t) => t.value === selectedType)?.label}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedType("all")} />
              </Badge>
            )}
            {searchQuery && (
              <Badge variant="secondary" className="gap-1">
                "{searchQuery}"
                <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery("")} />
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={clearFilters} className="ml-2">
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">
          {filteredContacts.length} {filteredContacts.length === 1 ? "contact" : "contacts"} found
        </p>
      </div>

      {/* Contact Cards */}
      {filteredContacts.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search criteria or filters</p>
          <Button variant="outline" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredContacts.map((contact, index) => (
            <Card
              key={contact.id}
              className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm hover:shadow-xl hover:-translate-y-1"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Main Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="mt-1">{getIcon(contact.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {contact.name}
                          </h2>
                          <Badge className={`text-xs ${getTypeColor(contact.type)}`}>{contact.type}</Badge>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {contact.region}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 flex-shrink-0 text-gray-400" />
                        <p>{contact.address}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 flex-shrink-0 text-gray-400" />
                        <p>{contact.hours}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 flex-shrink-0 text-gray-400" />
                        <p>{contact.phone}</p>
                      </div>
                    </div>
                    {contact.notes && <p className="mt-3 text-sm text-gray-500 italic">{contact.notes}</p>}
                  </div>
                  
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default EmergencyContactsPage
