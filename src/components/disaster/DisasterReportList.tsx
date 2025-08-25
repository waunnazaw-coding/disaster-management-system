"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CalendarDays, MapPin, Info, Circle, ArrowLeft, Shield, Eye, CheckCircle, XCircle, Clock, Flag, RotateCcw } from "lucide-react";
import { getAllDisasterReports, DisasterReport, approveDisapproveReport, unrejectReport, markReportChecked, markReportFake } from "@/api/disasterReportApi";
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

const severityConfig = {
  Critical: {
    cardBg: "bg-gradient-to-r from-red-50 to-red-100 border-red-200",
    badge: "bg-red-500 text-white shadow-lg",
    accent: "border-l-red-500"
  },
  High: {
    cardBg: "bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200",
    badge: "bg-orange-500 text-white shadow-lg",
    accent: "border-l-orange-500"
  },
  Low: {
    cardBg: "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200",
    badge: "bg-yellow-500 text-white shadow-lg",
    accent: "border-l-yellow-500"
  },
  default: {
    cardBg: "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200",
    badge: "bg-gray-500 text-white shadow-lg",
    accent: "border-l-gray-500"
  }
};

const statusConfig = {
  Pending: { 
    bg: "bg-amber-100 text-amber-800 border-amber-200", 
    icon: Clock,
    description: "Awaiting Review"
  },
  Checked: { 
    bg: "bg-blue-100 text-blue-800 border-blue-200", 
    icon: CheckCircle,
    description: "Under Review"
  },
  Verified: { 
    bg: "bg-emerald-100 text-emerald-800 border-emerald-200", 
    icon: CheckCircle,
    description: "Confirmed"
  },
  Fake: { 
    bg: "bg-gray-100 text-gray-800 border-gray-200", 
    icon: Flag,
    description: "Flagged as False"
  },
  Rejected: { 
    bg: "bg-red-100 text-red-800 border-red-200", 
    icon: XCircle,
    description: "Declined"
  },
};

export default function DisasterReportList() {
  const [events, setEvents] = useState<DisasterReport[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
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

  const filteredEvents = events
    .filter(ev => statusFilter === "All" || ev.status === statusFilter)
    .sort((a, b) => {
      // Priority sorting: Critical > High > Low > others
      const severityOrder = { Critical: 0, High: 1, Low: 2 };
      const aSeverity = severityOrder[a.severity as keyof typeof severityOrder] ?? 99;
      const bSeverity = severityOrder[b.severity as keyof typeof severityOrder] ?? 99;

      if (aSeverity !== bSeverity) {
        return aSeverity - bSeverity;
      }

      // If same severity, sort by creation date (newest first)
      const aDate = new Date(a.createdAt || 0).getTime();
      const bDate = new Date(b.createdAt || 0).getTime();
      return bDate - aDate;
    });

  const handleApproveDisapprove = async (reportId: number, approve: boolean) => {
    setActionLoading(reportId);
    try {
      const result = await approveDisapproveReport(reportId, approve);
      if (result.isSuccess) {
        toast.success(`Report ${approve ? "approved" : "disapproved"} successfully`);
        fetchReports();
      } else {
        toast.error(result.message || "Action failed");
      }
    } catch (error) {
      toast.error("Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkStatus = async (reportId: number, status: "Checked" | "Fake") => {
    setActionLoading(reportId);
    try {
      let result;
      if (status === "Checked") {
        result = await markReportChecked(reportId);
      } else {
        result = await markReportFake(reportId);
      }

      if (result.isSuccess) {
        toast.success(`Report marked as ${status} successfully`);
        fetchReports();
      } else {
        toast.error(result.message || "Action failed");
      }
    } catch (error) {
      toast.error("Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnreject = async (reportId: number) => {
    setActionLoading(reportId);
    try {
      const result = await unrejectReport(reportId);
      if (result.isSuccess) {
        toast.success("Report status reset to Pending successfully");
        fetchReports();
      } else {
        toast.error(result.message || "Action failed");
      }
    } catch (error) {
      toast.error("Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex justify-center items-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-blue-400 rounded-full animate-ping"></div>
          </div>
          <div className="text-center">
            <p className="text-gray-700 font-semibold text-lg">Loading Disaster Reports</p>
            <p className="text-gray-500 text-sm">Fetching latest emergency data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Header */}
      <div className="bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-lg sticky top-0 z-20">
        <div className="px-6 py-5">
          <div className="flex justify-between">
            <div className="flex space-x-6"> 
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-700 to-indigo-600 bg-clip-text text-transparent">
                  Emergency Reports Dashboard
                </h1>
                <p className="text-sm text-gray-600 mt-1 flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-blue-500" />
                  <span>Manage and review critical disaster reports</span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-white/80 backdrop-blur rounded-xl p-2 shadow-md">
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
                  <SelectTrigger className="w-[200px] border-gray-300 bg-white/90 shadow-sm hover:shadow-md transition-all">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-sm">
                    <SelectGroup>
                      <SelectLabel className="font-semibold text-gray-700">Status Filter</SelectLabel>
                      <SelectItem value="All" className="font-medium">📋 All Status</SelectItem>
                      <SelectItem value="Pending" className="font-medium">⏳ Pending</SelectItem>
                      <SelectItem value="Checked" className="font-medium">👀 Checked</SelectItem>
                      <SelectItem value="Verified" className="font-medium">✅ Verified</SelectItem>
                      <SelectItem value="Fake" className="font-medium">🚫 Fake</SelectItem>
                      <SelectItem value="Rejected" className="font-medium">❌ Rejected</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-200">
                <span className="text-sm font-semibold text-blue-700">
                  {filteredEvents.length} Report{filteredEvents.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-12 max-w-lg mx-auto border border-gray-200">
              <div className="relative mb-6">
                <AlertTriangle className="mx-auto h-20 w-20 text-gray-400" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-lg">📋</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Reports Found</h3>
              <p className="text-gray-600 text-lg">No disaster reports match your current filter selection.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map((ev) => {
              const severityInfo = severityConfig[ev.severity as keyof typeof severityConfig] || severityConfig.default;
              const statusInfo = statusConfig[ev.status as keyof typeof statusConfig] || statusConfig.Pending;
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={ev.id}
                  className={`group rounded-2xl border-2 ${severityInfo.cardBg} ${severityInfo.accent} border-l-6 hover:shadow-xl hover:scale-[1.005] transition-all duration-300 overflow-hidden`}
                >
                  {/* Critical Alert Banner */}
                  {ev.severity === "Critical" && (
                    <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 text-sm font-bold flex items-center justify-center space-x-3 shadow-lg">
                      <AlertTriangle className="h-5 w-5 animate-pulse" />
                      <span className="text-lg">🚨 CRITICAL EMERGENCY - IMMEDIATE ACTION REQUIRED 🚨</span>
                      <AlertTriangle className="h-5 w-5 animate-pulse" />
                    </div>
                  )}

                  <div className="p-5">
                    {/* Compact Header */}
                    <div className="flex items-start justify-between mb-4 min-w-0 w-full">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center space-x-3 flex-wrap">
                          <h2 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-blue-700 transition-colors break-words min-w-0">
                            {ev.title}
                          </h2>
                          
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex-shrink-0">
                            <AlertTriangle size={12} />
                            <span className="truncate max-w-24">{ev.type || "Unknown Type"}</span>
                          </span>

                          {ev.severity && (
                            <span className={`inline-flex items-center px-2 py-1 text-xs rounded-lg font-bold ${severityInfo.badge} flex-shrink-0`}>
                              <Circle size={6} className="mr-1 animate-pulse" />
                              {ev.severity}
                            </span>
                          )}
                        </div>

                        {/* Compact Metadata */}
                        <div className="flex items-center flex-wrap gap-2 text-xs">
                          <div className="flex items-center space-x-2 bg-white/80 px-2 py-1 rounded-lg shadow-sm border border-white/50 max-w-fit">
                            <Shield className="h-4 w-4 text-blue-600 flex-shrink-0" />
                            <span className="font-medium text-gray-700 truncate max-w-32">{ev.source || "Unknown Source"}</span>
                            <span className="text-xs bg-green-500 text-white rounded-full px-2 py-0.5 font-bold flex-shrink-0">
                              SOURCE
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-1 text-gray-600">
                            <CalendarDays className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                            <span className="font-medium whitespace-nowrap">
                              {ev.createdAt ? new Date(ev.createdAt).toLocaleDateString() : "Unknown Date"}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-1 text-gray-600 min-w-0">
                            <MapPin className="h-4 w-4 text-orange-500 flex-shrink-0" />
                            <span className="font-medium truncate max-w-40">{ev.location?.name || "Unknown Location"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Compact Status Badge */}
                      <div className="ml-4 flex flex-col items-end space-y-1 flex-shrink-0">
                        <span className={`inline-flex items-center px-3 py-2 rounded-xl text-xs font-bold ${statusInfo.bg} whitespace-nowrap`}>
                          <StatusIcon className="w-4 h-4 mr-1 flex-shrink-0" />
                          {ev.status}
                        </span>
                        
                        <div className="text-xs text-gray-500 whitespace-nowrap">
                          #{ev.id}
                        </div>
                      </div>
                    </div>

                    {/* Compact Description */}
                    {ev.description && (
                      <div className="mb-4 p-3 bg-white/80 rounded-xl border border-white/60">
                        <div className="flex items-start space-x-3">
                          <Info size={14} className="text-blue-600 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700 text-sm leading-relaxed line-clamp-3 overflow-hidden break-words">
                            {ev.description}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Compact Action Buttons */}
                    <div className="flex items-center justify-end space-x-2 pt-3 border-t border-white/60">
                      <div className="flex flex-wrap gap-2">
                        {/* Pending Status Actions */}
                        {ev.status === "Pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300 hover:border-blue-400 font-medium text-xs px-2 py-1 h-7"
                              disabled={actionLoading === ev.id}
                              onClick={() => handleMarkStatus(ev.id, "Checked")}
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {actionLoading === ev.id ? "..." : "Checked"}
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-300 hover:border-gray-400 font-medium text-xs px-2 py-1 h-7"
                              disabled={actionLoading === ev.id}
                              onClick={() => handleMarkStatus(ev.id, "Fake")}
                            >
                              <Flag className="w-3 h-3 mr-1" />
                              {actionLoading === ev.id ? "..." : "Fake"}
                            </Button>
                          </>
                        )}

                        {/* Checked/Pending Status Actions */}
                        {(ev.status === "Pending" || ev.status === "Checked") && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-300 hover:border-emerald-400 font-medium text-xs px-2 py-1 h-7"
                              disabled={actionLoading === ev.id}
                              onClick={() => handleApproveDisapprove(ev.id, true)}
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {actionLoading === ev.id ? "..." : "Approve"}
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-red-50 hover:bg-red-100 text-red-700 border-red-300 hover:border-red-400 font-medium text-xs px-2 py-1 h-7"
                              disabled={actionLoading === ev.id}
                              onClick={() => handleApproveDisapprove(ev.id, false)}
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              {actionLoading === ev.id ? "..." : "Reject"}
                            </Button>
                          </>
                        )}

                        {/* Rejected Status Actions */}
                        {ev.status === "Rejected" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-300 hover:border-amber-400 font-medium text-xs px-2 py-1 h-7"
                            disabled={actionLoading === ev.id}
                            onClick={() => handleUnreject(ev.id)}
                          >
                            <RotateCcw className="w-3 h-3 mr-1" />
                            {actionLoading === ev.id ? "..." : "Un-reject"}
                          </Button>
                        )}

                        {/* View Details - Available for all except Fake */}
                        {ev.status !== "Fake" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/admin/reports/${ev.id}`)}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300 hover:border-blue-400 font-medium text-xs px-2 py-1 h-7"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}