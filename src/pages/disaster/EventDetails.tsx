// No changes to imports except removing unused ones if any
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardTitle } from "../../components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "../../components/ui/badge";
import {
  MapPin,
  Calendar,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import api from "../../api/axioInstance";
import { Button } from "../../components/ui/button";
import DisasterMap from "@/components/locaiton/Map/DisasterMap";
import { Skull, Hospital, Home, Landmark, Store, Wheat, School, Info, Shield, SquarePen } from "lucide-react";

interface EventDetails {
  id: number;
  name: string;
  description?: string;
  locationName: string;
  startDate: string;
  severity: string;
  status: string;
  disasterTypeName: string;
  region?: string;
  country?: string;
  locationGeoJson?: any;
  address?: string;
  impactSummaries?: {
    type: string;
    objectName: string;
    totalValue: number;
    descriptions?: string[];
  }[];
  reportPhotos?: {
    description: string;
    filePath: string;
    id: number;
  }[];
  createdUserName: string;
  updatedUserName?: string;
  createdAt: string;
  updatedAt?: string;
  source?: string;
}

const EventDetailsPageForAdmin: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);

  // Map similar names into unified categories
  function normalizeObjectName(name: string): string {
    const lower = name.trim().toLowerCase();
    if (["die", "died", "dead"].includes(lower)) return "Died";
    if (["injured", "hurt", "wounded"].includes(lower)) return "Injured";
    if (["house", "houses"].includes(lower)) return "Houses";
    if (["building", "buildings"].includes(lower)) return "Buildings";
    if (["pagoda", "pagodas"].includes(lower)) return "Pagodas";
    if (["bridge", "bridges"].includes(lower)) return "Bridges";
    if (["school", "schools"].includes(lower)) return "Schools";
    if (["market", "markets"].includes(lower)) return "Markets";
    if (["rice field", "rice fields", "crop damage", "crop", "crops"].includes(lower)) return "Crop Damage";

    return name; // fallback: keep original
  }

  // Aggregate impact data by normalized name
  const normalizedImpactSummaries = event?.impactSummaries
    ? Object.values(
      event.impactSummaries.reduce((acc, cur) => {
        const normName = normalizeObjectName(cur.objectName);
        const key = `${cur.type}|${normName}`;

        if (!acc[key]) {
          acc[key] = {
            type: cur.type,
            objectName: normName,
            totalValue: 0,
            descriptions: [],
          };
        }
        acc[key].totalValue += cur.totalValue;
        if (cur.descriptions && cur.descriptions.length > 0) {
          acc[key].descriptions.push(...cur.descriptions);
        }
        return acc;
      }, {} as Record<string, { type: string; objectName: string; totalValue: number; descriptions: string[] }>)
    )
    : [];

  // Grouped impact data
  const groupedImpactSummaries = normalizedImpactSummaries.reduce((acc, cur) => {
    if (!acc[cur.type]) acc[cur.type] = [];
    acc[cur.type].push(cur);
    return acc;
  }, {} as Record<string, typeof normalizedImpactSummaries>);

  // Define impactIcons with a string index signature to avoid TS error
  const impactIcons: Record<string, React.ReactNode> = {
    Died: <Skull className="inline-block w-5 h-5 text-red-600 mr-2" />,
    Injured: <Hospital className="inline-block w-5 h-5 text-orange-500 mr-2" />,
    Houses: <Home className="inline-block w-5 h-5 text-blue-600 mr-2" />,
    Buildings: <Home className="inline-block w-5 h-5 text-gray-600 mr-2" />,
    Pagodas: <Landmark className="inline-block w-5 h-5 text-purple-600 mr-2" />,
    Bridges: <Landmark className="inline-block w-5 h-5 text-blue-600 mr-2" />,
    Markets: <Store className="inline-block w-5 h-5 text-green-600 mr-2" />,
    Schools: <School className="inline-block w-5 h-5 text-yellow-600 mr-2" />,
    "Crop Damage": <Wheat className="inline-block w-5 h-5 text-amber-600 mr-2" />,
  };

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await api.get(`/DisasterEvent/withlocation/${id}`);
        const data = response.data?.data || response.data;
        setEvent(data);
        console.log("Fetched event details:", data);
      } catch (err) {
        console.error("Error fetching event details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEventDetails();
  }, [id]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "text-red-600 animate-pulse font-bold";
      case "High":
        return "text-orange-500 animate-pulse font-bold";
      case "Medium":
        return "text-yellow-500 animate-pulse font-bold";
      default:
        return "text-green-500 animate-pulse font-bold";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg";
      case "Closed":
        return "bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-lg";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0 shadow-lg";
    }
  };

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg";
      case "High":
        return "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg";
      case "Medium":
        return "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg";
      default:
        return "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-600 font-semibold text-lg animate-pulse">
            Loading event details...
          </p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-center bg-white p-8 rounded-2xl shadow-2xl">
          <AlertTriangle className="text-red-500 w-16 h-16 mb-4 mx-auto animate-bounce" />
          <p className="text-gray-700 text-xl font-medium mb-4">Event not found</p>
          <Button 
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg"
            onClick={() => navigate("/admin/events")}
          >
            Return to Events
          </Button>
        </div>
      </div>
    );
  }

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header with navigation */}
        <div className="flex justify-between items-center mb-8">
          <Button
            variant="outline"
            className="flex items-center space-x-2 bg-white hover:bg-gray-50 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all duration-200"
            onClick={() => navigate("/admin/events")}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium">Back to Events</span>
          </Button>
        </div>

        {/* Main card */}
        <Card className="shadow-2xl rounded-3xl border-0 bg-white overflow-hidden">
          {/* Map section */}
          <div className="relative h-90 overflow-hidden">
            <DisasterMap
              geojsonData={event.locationGeoJson ? JSON.parse(event.locationGeoJson) : null}
              viewOnly
            />
            {/* Status badge overlay */}
            <div className="absolute top-6 right-6 flex items-center space-x-3 z-10">
              <Badge className={`${getStatusColor(event.status)} font-semibold px-4 py-2 text-sm`}>
                {event.status}
              </Badge>
              <Badge className={`${getSeverityBadgeColor(event.severity)} font-semibold px-4 py-2 text-sm`}>
                {event.severity}
              </Badge>
            </div>
            {/* Severity indicator */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="absolute bottom-6 left-6 p-3 shadow-xl">
                    <AlertTriangle className={`h-8 w-8 ${getSeverityColor(event.severity)}`} />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-medium">Severity: {event.severity}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Content section */}
          <CardContent className="p-8">
            {/* Title and disaster type */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-4">
              <CardTitle className="text-4xl font-bold text-gray-900 leading-tight">
                {event.name}
              </CardTitle>
              <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 text-sm font-semibold shadow-lg w-fit">
                {event.disasterTypeName || "N/A"}
              </Badge>
            </div>

            {/* Description */}
            <div className="mb-8 p-6 bg-gray-50 rounded-2xl border-l-4 border-blue-500">
              <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
                {event.description || "No description provided."}
              </p>
            </div>

            {/* Location and date info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="bg-green-500 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-green-800 text-sm">Location</p>
                  <p className="text-gray-700 font-medium">
                    {event.address} {event.locationName || ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="bg-blue-500 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-blue-800 text-sm">Occurrence Date</p>
                  <p className="text-gray-700 font-medium">
                    {new Date(event.startDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Impact Summary */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 mr-4 rounded-full"></div>
                Impact Summary
              </h3>
              {normalizedImpactSummaries.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-2xl">
                  <Info className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No impact data available</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupedImpactSummaries).map(([type, items]) => (
                    <div key={type} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                      <h4 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                        {type}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {items.map(({ objectName, totalValue, descriptions }) => (
                          <div key={objectName} className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                            {impactIcons[objectName] || <Info className="inline-block w-5 h-5 text-blue-500 mr-2" />}
                            <div className="flex-1">
                              <p className="font-semibold text-gray-800 text-sm">{objectName}</p>
                              <p className="text-gray-600 text-sm">
                                {totalValue > 0
                                  ? totalValue.toLocaleString()
                                  : descriptions?.length
                                    ? descriptions.join(", ")
                                    : "No data"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Report Photos */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-purple-600 mr-4 rounded-full"></div>
                Report Photos
              </h3>
              {event.reportPhotos && event.reportPhotos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {event.reportPhotos.map((photo) => (
                    <div key={photo.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                      <img
                        src={photo.filePath}
                        alt={photo.description || "Report Photo"}
                        className="w-full h-56 object-cover"
                      />
                      {photo.description && (
                        <div className="p-4 bg-gray-50">
                          <p className="text-gray-700 text-sm font-medium">
                            {photo.description}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-2xl">
                  <Info className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No report photos available</p>
                </div>
              )}
            </div>

            {/* User information */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Event Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Publisher */}
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-full shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-800">{event.createdUserName || "Unknown"}</span>
                      <Badge className="bg-green-500 text-white text-xs px-2 py-1">Publisher</Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      {event.createdAt
                        ? new Date(event.createdAt).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>
                </div>

                {/* Editor */}
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-full shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-800">{event.updatedUserName || "None"}</span>
                      <Badge className="bg-purple-500 text-white text-xs px-2 py-1">Editor</Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      {event.updatedAt
                        ? new Date(event.updatedAt).toLocaleString()
                        : "Not updated"}
                    </p>
                  </div>
                </div>

                {/* Source */}
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-full shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-800">{event.source || "Unknown"}</span>
                      <Badge className="bg-orange-500 text-white text-xs px-2 py-1">Source</Badge>
                    </div>
                    <p className="text-xs text-gray-500">Data source</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default EventDetailsPageForAdmin;

