"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { X, Phone, MapPin, Clock, Activity, Shield, Ambulance, ExternalLink, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface Contact {
  id: number
  name: string
  type: string
  phone: string
  address: string
  region: string
  lat: number
  lng: number
  hours: string
  services: string[]
  notes?: string
}

interface MapModalProps {
  contact: Contact
  onClose: () => void
}

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

const MapModal = ({ contact, onClose }: MapModalProps) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const getCustomIcon = (type: string) => {
    const iconColor = type === "hospital" ? "#ef4444" : type === "rescue" ? "#3b82f6" : "#f97316"

    return new L.DivIcon({
      html: `
        <div style="
          background-color: ${iconColor};
          width: 32px;
          height: 32px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            color: white;
            font-size: 14px;
            transform: rotate(45deg);
            font-weight: bold;
          ">
            ${type === "hospital" ? "🏥" : type === "rescue" ? "🚑" : "🚨"}
          </div>
        </div>
      `,
      className: "custom-marker",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    })
  }

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

  const openInMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${contact.lat},${contact.lng}`
    window.open(url, "_blank")
  }

  const getDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${contact.lat},${contact.lng}`
    window.open(url, "_blank")
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {getIcon(contact.type)}
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{contact.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={`text-xs ${getTypeColor(contact.type)}`}>{contact.type}</Badge>
                <Badge variant="outline" className="text-xs">
                  {contact.region}
                </Badge>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-gray-100">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Contact Details */}
          <div className="lg:w-2/5 p-6 space-y-6 overflow-y-auto">
            {/* Contact Info */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Address</p>
                    <p className="text-gray-600">{contact.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Hours</p>
                    <p className="text-gray-600">{contact.hours}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Phone</p>
                    <a
                      href={`tel:${contact.phone}`}
                      className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      {contact.phone}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            {contact.services && contact.services.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Available Services</h4>
                  <div className="flex flex-wrap gap-2">
                    {contact.services.map((service, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notes */}
            {contact.notes && (
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Additional Information</h4>
                  <p className="text-gray-600 text-sm">{contact.notes}</p>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button size="lg" className="w-full bg-green-600 hover:bg-green-700" asChild>
                <a href={`tel:${contact.phone}`}>
                  <Phone className="h-5 w-5 mr-2" />
                  Call Now
                </a>
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={getDirections}
                  className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 bg-transparent"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Directions
                </Button>
                <Button
                  variant="outline"
                  onClick={openInMaps}
                  className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 bg-transparent"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Maps
                </Button>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="lg:w-3/5 relative">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading map...</p>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[400px] lg:min-h-[500px]">
                <MapContainer
                  center={[contact.lat, contact.lng]}
                  zoom={15}
                  style={{ height: "100%", width: "100%" }}
                  className="rounded-br-2xl lg:rounded-br-2xl lg:rounded-tr-none"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[contact.lat, contact.lng]} icon={getCustomIcon(contact.type)}>
                    <Popup className="custom-popup" maxWidth={300}>
                      <div className="p-2 space-y-3">
                        <div className="flex items-center gap-2">
                          {getIcon(contact.type)}
                          <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                            <p className="text-gray-700">{contact.address}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500 flex-shrink-0" />
                            <p className="text-gray-700">{contact.hours}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                            <a href={`tel:${contact.phone}`} className="text-blue-600 hover:text-blue-700 font-medium">
                              {contact.phone}
                            </a>
                          </div>
                        </div>

                        {contact.services && contact.services.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-gray-600 mb-1">Services:</p>
                            <div className="flex flex-wrap gap-1">
                              {contact.services.slice(0, 3).map((service, index) => (
                                <span
                                  key={index}
                                  className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded border border-blue-200"
                                >
                                  {service}
                                </span>
                              ))}
                              {contact.services.length > 3 && (
                                <span className="text-xs text-gray-500">+{contact.services.length - 3} more</span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* <div className="pt-2 border-t border-gray-100">
                          <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white" asChild>
                            <a href={`tel:${contact.phone}`}>
                              <Phone className="h-3 w-3 mr-1" />
                              Call Now
                            </a>
                          </Button>
                        </div> */}
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MapModal
