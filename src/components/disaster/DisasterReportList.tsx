"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CalendarDays, MapPin, Info, Circle, ArrowLeft, Shield, View } from "lucide-react";
import { getAllDisasterReports, DisasterReport, approveDisapproveReport } from "@/api/disasterReportApi";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const severityColor = {
  Critical: "bg-red-500 text-white",
  High: "bg-orange-400 text-white",
  Low: "bg-yellow-500 text-white",
};

export default function DisasterReportList() {
  const [events, setEvents] = useState<DisasterReport[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null); // store report id being updated
  const navigate = useNavigate();

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await getAllDisasterReports();
      setEvents(data);
    } catch {
      toast.error("Failed to load disaster reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const filteredEvents = statusFilter === "All"
    ? events
    : events.filter(ev =>
      ev.status === statusFilter ||
      (ev.status === "Verified" && statusFilter === "Confirmed")
    );

  const handleApproveDisapprove = async (reportId: number, approve: boolean) => {
    setActionLoading(reportId);
    const result = await approveDisapproveReport(reportId, approve);
    if (result.isSuccess) {
      toast.success(`Report ${approve ? "approved" : "disapproved"} successfully`);
      fetchReports(); // refresh list
    } else {
      toast.error(result.message || "Action failed");
    }
    setActionLoading(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 overflow-y-auto pr-1 max-w-300">
      {/* Status Filter Dropdown and Back Button */}
      <div className="mb-3 flex justify-between">
        <Button
          variant="outline"
          className="flex items-center space-x-2 hover:bg-black hover:text-white"
          onClick={() => navigate("/admin/events")}
        >
          <ArrowLeft className="h-4 w-4" /> <span>Back</span>
        </Button>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value)}
        >
          <SelectTrigger className="w-[180px] border-gray-400">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Confirmed">Confirmed</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-gray-500">No disaster reports found.</div>
      ) : (
        filteredEvents.map((ev) => (
          <div
            key={ev.id}
            className="rounded-xl border shadow bg-white/95 p-5 flex flex-col gap-2 relative"
          >
            {/* Top row */}
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="text-2xl font-bold text-blue-900">{ev.title}</span>

              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded bg-blue-50 text-blue-600">
                <AlertTriangle size={16} color="#2563EB" />
                {ev.type || "Unknown Type"}
              </span>

              {ev.severity && (
                <span
                  className={`inline-flex items-center px-2 py-0.5 text-xs rounded font-bold ${severityColor[ev.severity as keyof typeof severityColor] || "bg-gray-200 text-gray-800"}`}
                >
                  <Circle size={12} className="mr-1" color="currentColor" />
                  {ev.severity}
                </span>
              )}

              <span
                className={`inline-flex items-center px-2 py-0.5 ml-2 text-xs rounded font-bold ${ev.status === "Verified" || ev.status === "Confirmed"
                    ? "bg-blue-500 text-white"
                    : ev.status === "Pending"
                      ? "bg-yellow-300 text-gray-900"
                      : ev.status === "Rejected"
                        ? "bg-red-500 text-white"
                        : "bg-gray-300 text-gray-800"
                  }`}
              >
                {ev.status === "Verified" ? "Confirmed" : ev.status}
              </span>
            </div>

            {/* Source and Description */}
            <div className="flex items-center justify-between text-xs text-blue-500">
              <div className="flex gap-2">
                <div className="w-9 h-12 bg-blue-600 rounded-b-full flex items-center justify-center shadow ml-1 mr-0.5">
                  <Shield className="w-6 h-7 text-white" />
                </div>
                <div className="font-semibold">
                  <div className="text-lg h-6 text-blue-800">
                    {ev.source || "Unknown"}
                    <span className="text-xs bg-green-400 text-white rounded px-1 py-0.5 font-semibold ml-2" aria-label="Type">
                      Source
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">
                      {ev.createdAt ? new Date(ev.createdAt).toLocaleString() : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {ev.description && (
              <div className="flex items-start gap-1 mt-2">
                <Info size={16} color="#93C5FD" className="mt-[2px]" />
                <p className="text-sm text-gray-700 line-clamp-3 break-words">
                  {ev.description}
                </p>
              </div>
            )}

            {/* Dates and Location */}
            <div className="flex justify-between items-center">
              <div className="flex flex-wrap gap-4 items-center text-[13px] text-gray-600 mb-2">
                <span className="inline-flex items-center gap-1">
                  <CalendarDays size={16} color="#60A5FA" />
                  {ev.createdAt ? new Date(ev.createdAt).toLocaleDateString() : "Unknown Date"}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin size={16} color="#FB923C" />
                  {ev.location?.name || "Unknown Location"}
                </span>
              </div>

              <div className="flex gap-2">
                {/* Approve/Disapprove only if Pending */}
                {ev.status !== "Verified" && ev.status !== "Rejected" && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      className="hover:bg-green-100 hover:text-green-600 text-green-500"
                      disabled={actionLoading === ev.id}
                      onClick={() => handleApproveDisapprove(ev.id, true)}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="hover:bg-red-100 hover:text-red-600 text-red-500"
                      disabled={actionLoading === ev.id}
                      onClick={() => handleApproveDisapprove(ev.id, false)}
                    >
                      Disapprove
                    </Button>
                  </>
                )}

                {/* Always show View */}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/admin/reports/${ev.id}`)}
                  className="hover:bg-blue-100 hover:text-blue-600 text-blue-500"
                >
                  <View className="w-4 h-4 mr-1" />
                  View
                </Button>
              </div>

            </div>
          </div>
        ))
      )}
    </div>
  );
}
