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
} from "lucide-react";
import { Button } from "../../components/ui/button";
import DisasterMap from "@/components/locaiton/Map/DisasterMap";
import { toast } from "sonner";
import { approveDisapproveReport } from "@/api/disasterReportApi";
import api from "../../api/axioInstance";

interface EventDetails {
  id: number;
  title: string;
  description?: string;
  locationName: string;
  addressDetail?: string;
  severity: string;
  status: string;
  type: string;
  locationGeoJson?: any;
  reportPhotos?: {
    description: string;
    filePath: string;
    id: number;
  }[];
  createdAt: string;
  updatedAt?: string;
  source?: string;
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
        setEvent(prev => prev ? { ...prev, status: approve ? "Confirmed" : "Rejected" } : prev);
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
      case "Critical": return "text-red-600 animate-pulse font-bold";
      case "High": return "text-orange-500 animate-pulse font-bold";
      case "Medium": return "text-yellow-500 animate-pulse font-bold";
      default: return "text-light-green-500 animate-pulse font-bold";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed": return "bg-green-400 text-green-800 border-green-200";
      case "Rejected": return "bg-red-500 text-red-800 border-red-200";
      default: return "bg-yellow-300 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-blue-600 font-semibold text-lg">Loading event details...</p>
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
        <Button className="bg-blue-500" onClick={() => navigate("/admin/events")}>Go to Events</Button>
      </div>
    );
  }

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto flex flex-col space-y-4">

        {/* Top buttons: Back + Approve/Disapprove */}
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
              disabled={actionLoading || event.status === "Confirmed" || event.status === "Rejected"}
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="hover:bg-red-100 hover:text-red-600 text-red-500"
              onClick={() => handleApproveDisapprove(false)}
              disabled={actionLoading || event.status === "Confirmed" || event.status === "Rejected"}
            >
              Disapprove
            </Button>
          </div>
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
              {event.title}
            </CardTitle>
            <span className="text-xs bg-red-100 text-red-700 rounded h-6 py-1 mt-2 px-4 font-semibold mr-5">
              {event.type || "N/A"}
            </span>
          </div>

          {/* Details */}
          <CardContent className="space-y-6">
            <p className="break-words whitespace-pre-line indent-4 text-sm text-gray-500">
              {event.description || "No description provided."}
            </p>

            {/* Location */}
            <div className="flex space-x-3 text-sm text-blue-600">
              <MapPin className="h-5 w-5 text-green-500" />
              <span className="h-5 text-gray-500">
                <span className="text-black">Map address detail: </span> {event.locationName || ""}
              </span>
            </div>
            <div className="flex space-x-3 text-sm text-blue-600">
              <MapPin className="h-5 w-5 text-green-500" />
              <span className="h-5 text-gray-500">
                <span className="text-black">User Provided Address detail: </span> {event.addressDetail || ""}
              </span>
            </div>

            {/* Reported Date */}
            <div className="flex items-center space-x-3 text-sm text-blue-600">
              <Calendar className="h-5 w-5 text-blue-700" />
              <span>Reported Date: {new Date(event.createdAt).toLocaleDateString()}</span>
            </div>

            {/* Photos */}
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

            {/* Source */}
            <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-1">
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

export default DisasterReportDetail;
