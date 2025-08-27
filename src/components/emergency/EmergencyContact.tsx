"use client"

import { useState, useMemo, useEffect } from "react"
import { Phone, Clock, MapPin, Search, Activity, Shield, Ambulance, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import EmergencyContactsData from "./EmergencyContacts"
import { EmergencyContact } from "./EmergencyContacts"

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

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05 } }),
}

export default function EmergencyContactsPage() {
  const [selectedRegion, setSelectedRegion] = useState<string>("All Regions")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  const nationalEmergencyContacts = useMemo<EmergencyContact[]>(() => {
    return EmergencyContactsData.filter((c) => c.region === "National")
  }, [])

  const regionalContacts = useMemo<EmergencyContact[]>(() => {
    return EmergencyContactsData.filter((c) => c.region !== "National")
  }, [])

  const filteredContacts = useMemo<EmergencyContact[]>(() => {
    return regionalContacts.filter((c) => {
      const matchesRegion = selectedRegion === "All Regions" || c.region === selectedRegion
      const matchesType = selectedType === "all" || c.type === selectedType
      const matchesSearch =
        searchQuery === "" ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.services.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesRegion && matchesType && matchesSearch
    })
  }, [regionalContacts, selectedRegion, selectedType, searchQuery])

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

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
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-xl"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Emergency Contacts</h1>
        <p className="text-gray-600">Find emergency services and healthcare facilities across Myanmar</p>
      </div>

      {/* National Contacts */}
      {nationalEmergencyContacts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
            <Ambulance className="h-6 w-6" /> National Emergency Hotlines
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {nationalEmergencyContacts.map((contact, index) => (
              <motion.div key={contact.id} custom={index} initial="hidden" animate="visible" variants={cardVariants}>
                <Card className="bg-white border border-red-100 shadow-sm hover:shadow-lg transition">
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
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by name, location, or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
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
        {(selectedRegion !== "All Regions" || selectedType !== "all" || searchQuery) && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 flex-wrap">
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

      {/* Regional Contacts */}
<div className="mt-8">
  <p className="text-gray-600 mb-4">
    {filteredContacts.length} {filteredContacts.length === 1 ? "contact" : "contacts"} found
  </p>

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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
      {filteredContacts.map((contact, index) => (
        <motion.div
          key={contact.id}
          custom={index}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <Card className="group transition-all duration-300 border-0 shadow-sm hover:shadow-xl hover:-translate-y-1">
            <CardContent className="p-6 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                {getIcon(contact.type)}<span className="sr-only">{contact.type}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {contact.name}
                    </h2>
                    <Badge className={`text-xs ${getTypeColor(contact.type)}`}>{contact.type}</Badge>
                  </div>
                  <Badge variant="outline" className="text-xs">{contact.region}</Badge>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" /> <p>{contact.address}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" /> <p>{contact.hours}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" /> <p>{contact.phone}</p>
                </div>
              </div>
              {contact.notes && <p className="text-sm text-gray-500 italic">{contact.notes}</p>}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )}
</div>

    </div>
  )
}
