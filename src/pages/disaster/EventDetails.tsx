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
    Died: <Skull className="inline-block w-4 h-4 text-red-600 mr-1" />,
    Injured: <Hospital className="inline-block w-4 h-4 text-yellow-600 mr-1" />,
    Houses: <Home className="inline-block w-4 h-4 text-gray-700 mr-1" />,
    Pagodas: <Landmark className="inline-block w-4 h-4 text-orange-600 mr-1" />,
    Bridges: <Landmark className="inline-block w-4 h-4 text-blue-600 mr-1" />,
    Markets: <Store className="inline-block w-4 h-4 text-green-600 mr-1" />,
    Schools: <School className="inline-block w-4 h-4 text-yellow-600 mr-1" />,
    "Crop Damage": <Wheat className="inline-block w-4 h-4 text-amber-600 mr-1" />,
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
        return "text-light-green-500 animate-pulse font-bold";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-300 text-green-800 border-green-200";
      case "Closed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-blue-600 font-semibold text-lg">
          Loading event details...
        </p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <AlertTriangle className="text-red-500 w-10 h-10 mb-3" />
        <p className="text-gray-600 text-lg">Event not found.</p>
        <Button className="mt-4" onClick={() => navigate("/disasters")}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <section className="py-10 px-4 p-10 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto flex flex-col space-y-4">
        {/* Top buttons */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            className="flex items-center space-x-2"
            onClick={() => navigate("/disasters")}
          >
            <ArrowLeft className="h-4 w-4" /> <span>Back</span>
          </Button>
        </div>

        {/* Card */}
        <Card className="shadow-lg rounded-xl border-0 bg-white p-5">
          {/* Map */}
          <div className="relative h-90 rounded-t-xl overflow-hidden">
            <DisasterMap
              geojsonData={event.locationGeoJson ? JSON.parse(event.locationGeoJson) : null}
              viewOnly
            />
            <div className="absolute top-4 right-4 flex items-center space-x-2 z-10">
              <Badge
                variant="outline"
                className={`${getStatusColor(event.status)} font-medium`}
              >
                {event.status}
              </Badge>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="absolute bottom-4 left-4">
                    <AlertTriangle
                      className={`h-8 w-8 ${getSeverityColor(event.severity)}`}
                      style={{ filter: "drop-shadow(0 0 5px white)" }}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Severity: {event.severity}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Title + Type */}
          <div className="flex justify-between">
            <CardTitle className="ml-5 text-3xl font-bold text-blue-900">
              {event.name}
            </CardTitle>
            <span className="text-xs bg-red-100 text-red-700 rounded h-6 py-1 mt-2 px-4 font-semibold mr-5">
              {event.disasterTypeName || "N/A"}
            </span>
          </div>

          {/* Details */}
          <CardContent className="space-y-6">
            <p className="break-words whitespace-pre-line indent-4 text-sm text-gray-500">
              {event.description || "No description provided."}
            </p>

            <div className="flex space-x-3 text-sm text-blue-600">
              <MapPin className="h-5 w-5 text-green-500" />
              <span className="h-5 text-gray-500">
                {event.address} {event.locationName || ""}
              </span>
            </div>


            <div className="flex items-center space-x-3 text-sm text-blue-600">
              <Calendar className="h-5 w-5 text-blue-500" />
              <span>
                Occurred Date: {new Date(event.startDate).toLocaleDateString()}
              </span>
            </div>

            {/* Impact Summary */}
            <div className="col-span-full mt-3">
              <h3 className="text-xl text-blue-900 font-bold mb-2">Impact Summary</h3>
              {normalizedImpactSummaries.length === 0 ? (
                <p className="text-sm text-gray-500">No impact data available.</p>
              ) : (
                <div>
                  {Object.entries(groupedImpactSummaries).map(([type, items]) => (
                    <div key={type} className="mb-3 ml-3">
                      <strong className="text-gray-500">{type}:</strong>
                      <div className="ml-4 space-y-1">
                        {items.map(({ objectName, totalValue, descriptions }) => (
                          <div key={objectName} className="flex items-center space-x-2">
                            {impactIcons[objectName] || <Info className="inline-block w-4 h-4 text-blue-400 mr-1" />}
                            <span className="text-sm text-gray-700">
                              {objectName} : {""}
                              {totalValue > 0
                                ? totalValue.toLocaleString()
                                : descriptions?.length
                                  ? descriptions.join(", ")
                                  : "No data"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl text-blue-900 font-extrabold mb-2">Report Photos</h3>
              <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4">
                {event.reportPhotos && event.reportPhotos.length > 0 ? (
                  event.reportPhotos.map((photo) => (
                    <div key={photo.id} className="relative group">
                      <img
                        src={photo.filePath}
                        alt={photo.description || "Report Photo"}
                        className="w-full h-40 object-cover rounded-lg shadow"
                      />
                      {photo.description && (
                        <div
                          className="absolute bottom-0 left-0 w-full rounded-b-lg p-1 text-white text-sm opacity-100 group-hover:opacity-0 transition-opacity duration-300"
                          style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
                        >
                          {photo.description}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No report photos available.</p>
                )}
              </div>

            </div>

            <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-1">
              <div className="flex items-center justify-between text-xs text-blue-500">
                <div className="flex gap-1">
                  <div className="w-8 h-9 bg-blue-600 rounded-b-full flex items-center justify-center shadow ml-1 mr-0.5">
                    <Shield className="w-5 h-6 text-white" />
                  </div>
                  <div className="font-semibold">
                    <div className="text-sm h-6 text-blue-800">
                      {event.createdUserName || "Unknown"}
                      <span
                        className="text-xs bg-green-400 text-white rounded px-1 py-0.5 font-semibold ml-1"
                        aria-label="Type"
                      >
                        publisher
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">
                        {event.createdAt
                          ? new Date(event.createdAt).toLocaleString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-blue-500">
                <div className="flex gap-1">
                  <div className="w-8 h-9 bg-blue-600 rounded-b-full flex items-center justify-center shadow ml-1 mr-0.5">
                    <Shield className="w-5 h-6 text-white" />
                  </div>
                  <div className="font-semibold">
                    <div className="text-sm h-6 text-blue-800">
                      {event.updatedUserName || "Unknown"}
                      <span
                        className="text-xs bg-green-400 text-white rounded px-1 py-0.5 font-semibold ml-1"
                        aria-label="Type"
                      >
                        Editer
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">
                        {event.updatedAt
                          ? new Date(event.createdAt).toLocaleString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
               <div className="flex items-center justify-between text-xs text-blue-500">
                <div className="flex gap-1">
                  <div className="w-8 h-9 bg-blue-600 rounded-b-full flex items-center justify-center shadow ml-1 mr-0.5">
                    <Shield className="w-5 h-6 text-white" />
                  </div>
                  <div className="font-semibold">
                    <div className="text-sm h-6 text-blue-800">
                      {event.source || "Unknown"}
                      <span
                        className="text-xs bg-green-400 text-white rounded px-1 py-0.5 font-semibold ml-1"
                        aria-label="Type"
                      >
                        Source
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">
                        {event.updatedAt
                          ? new Date(event.createdAt).toLocaleString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                          : "N/A"}
                      </span>
                    </div>
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
