"use client"

import { useEffect, useRef, useState } from "react"
import api from "@/api/axioInstance"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  MapPin,
  Flame,
  Waves,
  Zap,
  AlertTriangle,
  Clock,
  Activity,
  Globe,
  BarChart3,
  Calendar,
} from "lucide-react"

// OpenLayers imports
import Map from "ol/Map"
import View from "ol/View"
import TileLayer from "ol/layer/Tile"
import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import OSM from "ol/source/OSM"
import Feature from "ol/Feature"
import Point from "ol/geom/Point"
import { fromLonLat } from "ol/proj"
import { Style, Circle, Fill, Stroke, Text } from "ol/style"
import Overlay from "ol/Overlay"
import "ol/ol.css"

// TypeScript interface for disaster event
interface DisasterEvent {
  eventId: string
  eventType: "WF" | "FL" | "EQ"
  severity: "Green" | "Orange" | "Red"
  eventDate: string
  latitude: number
  longitude: number
  locationAddress?: string
  impact: string
}

// API Endpoints
const DISASTER_ALL_URL = "/GdacsDisasterEvent"
const DISASTER_TODAY_URL = "/GdacsDisasterEvent/today"
const DISASTER_WEEK_URL = "/GdacsDisasterEvent/week"

// Axios polling hook with type support
function useAxiosPolling<T>(url: string, intervalMs = 5000): T[] {
  const [data, setData] = useState<T[]>([])

  useEffect(() => {
    let active = true
    const fetchData = async () => {
      try {
        const res = await api.get<T[]>(url)
        if (active) setData(res.data)
      } catch {
        if (active) setData([])
      }
    }
    fetchData()
    const timer = setInterval(fetchData, intervalMs)
    return () => {
      active = false
      clearInterval(timer)
    }
  }, [url, intervalMs])

  return data
}

const eventTypeConfig = {
  WF: { name: "Wildfire", icon: Flame, color: "#f97316" },
  FL: { name: "Flood", icon: Waves, color: "#164e63" },
  EQ: { name: "Earthquake", icon: Zap, color: "#8b5cf6" },
}

const severityColors = {
  Green: "#68d391",
  Orange: "#f6ad55",
  Red: "#f687b3",
}

export default function DisasterDashboard() {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const popupRef = useRef<HTMLDivElement | null>(null)
  const [map, setMap] = useState<Map | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<DisasterEvent | null>(null)
  const [currentRotatingIndex, setCurrentRotatingIndex] = useState(0)

  const [filters, setFilters] = useState<{
    eventType: "all" | "WF" | "FL" | "EQ"
    severity: "all" | "Green" | "Orange" | "Red"
  }>({
    eventType: "all",
    severity: "all",
  })

  // Fetch disaster events from APIs with type casting
  const allEvents = useAxiosPolling<DisasterEvent>(DISASTER_ALL_URL)
  const todaysEvents = useAxiosPolling<DisasterEvent>(DISASTER_TODAY_URL)
  const weekEvents = useAxiosPolling<DisasterEvent>(DISASTER_WEEK_URL)

  // Apply filters
  const filteredEvents = allEvents.filter(event => {
    const typeMatch = filters.eventType === "all" || event.eventType === filters.eventType
    const severityMatch = filters.severity === "all" || event.severity === filters.severity
    return typeMatch && severityMatch
  })

  // Stats calculation from filteredEvents
  const stats = {
    total: filteredEvents.length,
    WF: filteredEvents.filter(e => e.eventType === "WF").length,
    FL: filteredEvents.filter(e => e.eventType === "FL").length,
    EQ: filteredEvents.filter(e => e.eventType === "EQ").length,
    Red: filteredEvents.filter(e => e.severity === "Red").length,
    Orange: filteredEvents.filter(e => e.severity === "Orange").length,
    Green: filteredEvents.filter(e => e.severity === "Green").length,
    todayCount: todaysEvents.length,
    sevenDayCount: weekEvents.length,
  }

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return
    const initialMap = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([0, 20]),
        zoom: 2,
      }),
    })
    if (popupRef.current) {
      const popup = new Overlay({
        element: popupRef.current,
        positioning: "bottom-center",
        stopEvent: false,
        offset: [0, -10],
      })
      initialMap.addOverlay(popup)
    }
    setMap(initialMap)
    return () => {
      initialMap.setTarget(undefined)
    }
  }, [])

  // Update map markers whenever filteredEvents change
  useEffect(() => {
    if (!map) return
    // Remove previous vector layers
    map.getLayers().getArray().forEach(layer => {
      if (layer instanceof VectorLayer) {
        map.removeLayer(layer)
      }
    })
    if (filteredEvents.length === 0) return

    // Add new event markers
    const features = filteredEvents.map(event => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([event.longitude, event.latitude])),
        event: event,
      })
      const style = new Style({
        image: new Circle({
          radius: event.severity === "Red" ? 8 : event.severity === "Orange" ? 6 : 4,
          fill: new Fill({
            color: severityColors[event.severity],
          }),
          stroke: new Stroke({
            color: "#ffffff",
            width: 2,
          }),
        }),
        text: new Text({
          text: event.eventType,
          font: "10px sans-serif",
          fill: new Fill({ color: "#ffffff" }),
          offsetY: -20,
          backgroundFill: new Fill({ color: eventTypeConfig[event.eventType]?.color || "#333" }),
          padding: [2, 4, 2, 4],
        }),
      })
      feature.setStyle(style)
      return feature
    })

    const vectorSource = new VectorSource({
      features: features,
    })

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    })

    map.addLayer(vectorLayer)

    map.on("click", evt => {
      const feature = map.forEachFeatureAtPixel(evt.pixel, feature => feature)
      if (feature) {
        const event = feature.get("event") as DisasterEvent
        setSelectedEvent(event)
        if (popupRef.current) {
          const popup = map.getOverlays().getArray()[0]
          popup.setPosition(evt.coordinate)
        }
      } else {
        setSelectedEvent(null)
      }
    })
  }, [map, filteredEvents])

  // Rotating today's events bar
  useEffect(() => {
    if (todaysEvents.length === 0) return
    const interval = setInterval(() => {
      setCurrentRotatingIndex(prev => (prev + 1) % Math.max(todaysEvents.length, 1))
    }, 3000)
    return () => clearInterval(interval)
  }, [todaysEvents.length])

  // Animate to event on live bar click
  const handleLiveDataClick = (event: DisasterEvent) => {
    setSelectedEvent(event)
    if (map) {
      const coordinate = fromLonLat([event.longitude, event.latitude])
      map.getView().animate({
        center: coordinate,
        zoom: 8,
        duration: 1000,
      })
      if (popupRef.current) {
        const popup = map.getOverlays().getArray()[0]
        popup.setPosition(coordinate)
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="px-6 py-4">
          <div className="bg-primary/5 rounded-lg px-4 py-3 mb-4 border border-primary/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary pulse-animation" />
                  <span className="text-sm font-semibold text-primary">Live Today</span>
                </div>
                {todaysEvents.length > 0 ? (
                  <div
                    key={currentRotatingIndex}
                    className="slide-in flex items-center gap-3 cursor-pointer hover:bg-primary/10 rounded-md px-2 py-1 transition-colors"
                    onClick={() => handleLiveDataClick(todaysEvents[currentRotatingIndex])}
                  >
                    <Badge variant="secondary" className="text-xs font-medium">
                      {todaysEvents[currentRotatingIndex]?.eventType}
                    </Badge>
                    <span className="text-sm text-card-foreground font-medium truncate max-w-md">
                      {todaysEvents[currentRotatingIndex]?.impact}
                    </span>
                    <Badge
                      className="text-xs"
                      style={{
                        backgroundColor: severityColors[todaysEvents[currentRotatingIndex]?.severity ],
                        color: "white",
                      }}
                    >
                      {todaysEvents[currentRotatingIndex]?.severity}
                    </Badge>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">No active events today</span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Activity className="h-3 w-3" />
                <span className="font-medium">{todaysEvents.length} active</span>
              </div>
            </div>
          </div>

          

          {/* Main header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-card-foreground">Global Disaster Monitor</h1>
                  <p className="text-sm text-muted-foreground">Real-time tracking and analytics</p>
                </div>
              </div>
              <Badge variant="outline" className="text-sm font-medium">
                {stats.total} Events (Filtered)
              </Badge>
            </div>
          </div>

          <div className="flex">
            <div className="flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Statistics Cards */}
                <Card className="fade-in">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-primary" />
                      Event Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-card-foreground">{stats.WF}</div>
                        <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                          <Flame className="h-3 w-3" />
                          Wildfires
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-card-foreground">{stats.FL}</div>
                        <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                          <Waves className="h-3 w-3" />
                          Floods
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-card-foreground">{stats.EQ}</div>
                        <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                          <Zap className="h-3 w-3" />
                          Earthquakes
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="fade-in">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-secondary" />
                      Severity Levels
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-400"></div>
                          <span className="text-sm text-card-foreground">Critical</span>
                        </div>
                        <span className="text-sm font-semibold text-card-foreground">{stats.Red}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                          <span className="text-sm text-card-foreground">High</span>
                        </div>
                        <span className="text-sm font-semibold text-card-foreground">{stats.Orange}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-400"></div>
                          <span className="text-sm text-card-foreground">Low</span>
                        </div>
                        <span className="text-sm font-semibold text-card-foreground">{stats.Green}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="fade-in">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-accent" />
                      Today's Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-card-foreground mb-2">{todaysEvents.length}</div>
                      <div className="text-sm text-muted-foreground">Active Events</div>
                      <div className="mt-3 flex justify-center gap-2">
                        {todaysEvents.map(event => (
                          <div
                            key={event.eventId}
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: severityColors[event.severity] }}
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters */}
          <div className="flex gap-6 mb-6 flex-wrap">
            <div>
              <span className="font-semibold mr-2 text-card-foreground">Event Type:</span>
              {["all", "WF", "FL", "EQ"].map(type => (
                <Button
                  key={type}
                  variant={filters.eventType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, eventType: type as any }))}
                  className="mr-2 mb-2"
                >
                  {type === "all" ? "All" : type}
                </Button>
              ))}
            </div>
            <div>
              <span className="font-semibold mr-2 text-card-foreground">Severity:</span>
              {["all", "Green", "Orange", "Red"].map(sev => (
                <Button
                  key={sev}
                  variant={filters.severity === sev ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, severity: sev as any }))}
                  className="mr-2 mb-2"
                >
                  {sev === "all" ? "All" : sev}
                </Button>
              ))}
            </div>
              </div>
              
              {/* Map Card */}
              <Card className="fade-in">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Global Event Map
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative">
                    <div ref={mapRef} className="w-full h-96 rounded-b-lg overflow-hidden" />
                    {/* Map popup */}
                    <div ref={popupRef} className="absolute pointer-events-none z-10">
                      {selectedEvent && (
                        <div className="w-72 pointer-events-auto bg-card/95 backdrop-blur-md rounded-lg shadow-xl border border-border p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              {(() => {
                                const IconComponent = eventTypeConfig[selectedEvent.eventType]?.icon || MapPin
                                return <IconComponent className="h-4 w-4 text-primary" />
                              })()}
                              <span className="font-semibold text-sm text-card-foreground">
                                {eventTypeConfig[selectedEvent.eventType]?.name || selectedEvent.eventType}
                              </span>
                            </div>
                            <Badge
                              className="text-xs"
                              style={{
                                backgroundColor: severityColors[selectedEvent.severity],
                                color: "white",
                              }}
                            >
                              {selectedEvent.severity}
                            </Badge>
                          </div>
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">ID:</span>
                              <span className="font-mono text-card-foreground">{selectedEvent.eventId}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Date:</span>
                              <span className="text-card-foreground">
                                {new Date(selectedEvent.eventDate).toLocaleDateString()}
                              </span>
                            </div>
                            {selectedEvent.locationAddress && (
                              <div>
                                <span className="text-muted-foreground">Location:</span>
                                <p className="text-card-foreground mt-1 text-xs leading-relaxed">{selectedEvent.locationAddress}</p>
                              </div>
                            )}
                            <div>
                              <span className="text-muted-foreground">Impact:</span>
                              <p className="text-card-foreground mt-1 text-xs leading-relaxed">{selectedEvent.impact}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
