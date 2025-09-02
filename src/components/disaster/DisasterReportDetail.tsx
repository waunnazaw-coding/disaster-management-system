"use client";

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
  Shield,
  RadioReceiver,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import DisasterMap from "@/components/locaiton/Map/DisasterMap";
import { toast } from "sonner";
import { approveDisapproveReport } from "@/api/disasterReportApi";
import api from "../../api/axioInstance";

interface Impact {
  id: number;
  type: string;
  objectName?: string;
  value?: string;
  status?: string;
}

interface EventDetails {
  id: number;
  title: string;
  description?: string;
  locationName: string;
  locationGeoJson?: any;
  addressDetail?: string;
  severity: string;
  status: string;
  type: string;
  reportPhotos?: {
    description: string;
    filePath: string;
    id: number;
  }[];
  impacts?: Impact[];
  createdAt: string;
  updatedAt?: string;
  source?: string;
  startDate?: string;
}

const DisasterReportDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchEventDetails = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await api.get(`/DisasterReport/${id}`);
      const data = response.data?.data || response.data;
      setEvent(data);
    } catch (err) {
      console.error("Error fetching event details:", err);
      toast.error("Failed to load event details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const handleApproveDisapprove = async (approve: boolean) => {
    if (!event) return;
    setActionLoading(true);
    try {
      const result = await approveDisapproveReport(event.id, approve);
      if (result.isSuccess) {
        toast.success(approve ? "Report approved" : "Report disapproved");
        setEvent(prev =>
          prev ? { ...prev, status: approve ? "Confirmed" : "Rejected" } : prev
        );
      } else {
        toast.error(result.message || "Action failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "text-red-600 animate-pulse font-bold";
      case "High":
        return "text-orange-500 animate-pulse font-bold";
      case "Medium":
        return "text-yellow-500 animate-pulse font-bold";
      case "Low":
        return "text-blue-500 animate-pulse font-bold";
      default:
        return "text-light-green-500 animate-pulse font-bold";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-400 text-green-800 border-green-200";
      case "Rejected":
        return "bg-red-500 text-red-800 border-red-200";
      default:
        return "bg-yellow-300 text-gray-800 border-gray-200";
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
        <p className="text-gray-600 text-lg">Disaster not found.</p>
        <Button className="mt-4" onClick={() => navigate("/disasters")}>
          Go Back
        </Button>
      </div>
    );
  }

  // If report is Verified, show only green check + message
  if (event.status === "Verified") {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center px-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Shield className="w-10 h-10 text-green-600" />
        </div>
        <p className="text-green-600 font-bold text-lg mb-2">
          This report has been approved.
        </p>
        <p className="text-gray-500 mb-4">
          You can see it in the Events section.
        </p>
        <Button className="bg-blue-500" onClick={() => navigate("/admin/events")}>
          Go to Events
        </Button>
      </div>
    );
  }

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto flex flex-col space-y-4">
        {/* Top buttons */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            className="flex items-center space-x-2"
            onClick={() => navigate("/admin/reports")}
          >
            <ArrowLeft className="h-4 w-4" /> <span>Back</span>
          </Button>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="hover:bg-green-100 hover:text-green-600 text-green-500"
              onClick={() => handleApproveDisapprove(true)}
              disabled={
                actionLoading ||
                event.status === "Confirmed" ||
                event.status === "Rejected"
              }
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="hover:bg-red-100 hover:text-red-600 text-red-500"
              onClick={() => handleApproveDisapprove(false)}
              disabled={
                actionLoading ||
                event.status === "Confirmed" ||
                event.status === "Rejected"
              }
            >
              Reject
            </Button>
          </div>
        </div>

        {/* Card */}
        <Card className="shadow-xl rounded-2xl border bg-white p-6 space-y-6">
          {/* Map or fallback */}
          {event.locationGeoJson &&
            (() => {
              try {
                const geo = JSON.parse(event.locationGeoJson);
                // Check if it's a Point at [0,0] → no map data
                if (
                  geo.type === "Point" &&
                  Array.isArray(geo.coordinates) &&
                  geo.coordinates.length === 2 &&
                  geo.coordinates[0] === 0.0 &&
                  geo.coordinates[1] === 0.0
                ) {
                  return (
                    <div className="w-full h-64 flex items-center justify-center text-gray-500 border rounded-lg bg-gray-100">
                      No map area provided.
                    </div>
                  );
                }
                return <DisasterMap geojsonData={geo} viewOnly />;
              } catch {
                return (
                  <div className="w-full h-64 flex items-center justify-center text-gray-500 border rounded-lg bg-gray-100">
                    Invalid map data.
                  </div>
                );
              }
            })()}

          {/* Title + Status + Type */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {event.title}
              </CardTitle>
              <p className="text-gray-600 text-sm mt-1">
                {event.description || "No description provided."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
              <Badge className={`${getStatusColor(event.status)} font-medium`}>
                {event.status}
              </Badge>
              <Badge variant="outline" className="bg-blue-100 text-blue-700">
                {event.type || "N/A"}
              </Badge>
              <Badge className={`${getSeverityColor(event.severity)} px-3 py-1`}>
                {event.severity}
              </Badge>
            </div>
          </div>

          {/* Details Section */}
          <div className="grid md:grid-cols-2 gap-4 text-lg">
            <div className="flex items-center gap-2 h-full text-gray-700">
              <MapPin className="h-5 w-5 text-green-500" />
              <span>
                <span className="font-semibold w-full">Map Address:</span>
                <div className="text-wrap">{event.locationName}</div>
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <RadioReceiver className="h-5 w-5 text-indigo-500" />
              <span>
                <span className="font-semibold">Source from:</span>{" "}
                {event.source || "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span>
                <span className="font-semibold">Occurred:</span>{" "}
                {event.startDate
                  ? new Date(event.startDate).toISOString().split("T")[0]
                  : "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span>
                <span className="font-semibold">Reported:</span>{" "}
                {new Date(event.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Impacts */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Impacts</h3>
            {event.impacts?.length ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {event.impacts.map((impact) => (
                  <Card
                    key={impact.id}
                    className="border rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <CardContent className="p-4 space-y-2">
                      {/* Icon + Type */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-blue-700 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-blue-500" />
                          {impact.type}
                        </span>
                        <Badge
                          className={`text-xs ${impact.status === "Resolved"
                            ? "bg-green-100 text-green-700"
                            : impact.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                            }`}
                        >
                          {impact.status || "Pending"}
                        </Badge>
                      </div>

                      {/* Object + Value */}
                      <div className="text-sm text-gray-700">
                        <p>
                          <span className="font-medium">Object:</span>{" "}
                          {impact.objectName || "N/A"}
                        </p>
                        <p>
                          <span className="font-medium">Value:</span>{" "}
                          {impact.value || "N/A"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No impacts reported.</p>
            )}
          </div>


          {/* Photos */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Report Photos</h3>
            {event.reportPhotos?.length ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {event.reportPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative overflow-hidden rounded-lg shadow group"
                  >
                    <img
                      src={photo.filePath}
                      alt={photo.description || "Report Photo"}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {photo.description && (
                      <div className="absolute bottom-0 w-full bg-black/60 text-white text-xs px-2 py-1">
                        {photo.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No report photos available.</p>
            )}
          </div>
        </Card>

      </div>
    </section>
  );
};

export default DisasterReportDetail;
