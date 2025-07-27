"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CalendarDays, MapPin, Info, Circle } from "lucide-react";
import { getAllDisasterEvents, DisasterEvent } from "@/api/disasterEventApi";
import { toast } from "sonner";

const severityColor = {
  Severe: "bg-red-500 text-white",
  Moderate: "bg-yellow-400 text-gray-900",
  Low: "bg-green-300 text-green-900",
};

export default function DisasterEventList() {
  const [events, setEvents] = useState<DisasterEvent[]>([]);

  useEffect(() => {
    getAllDisasterEvents()
      .then((data) => setEvents(data))
      .catch(() => toast.error("Failed to load disaster events"));
  }, []);

  return (
    <div className="flex flex-col gap-5 max-h-[340px] overflow-y-auto pr-1">
      {events.map((ev) => (
        <div
          key={ev.id}
          className="rounded-xl border shadow bg-white/95 p-5 flex flex-col gap-2 relative"
        >
          {/* Top row: Name, Type, Severity, Status */}
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className="text-lg font-bold text-blue-900">{ev.name}</span>

            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded bg-blue-50 text-blue-600">
              <AlertTriangle size={16} color="#2563EB" />
              {ev.disasterTypeName}
            </span>

            {ev.severity && (
              <span
                className={`inline-flex items-center px-2 py-0.5 text-xs rounded font-bold ${
                  severityColor[ev.severity as keyof typeof severityColor] ||
                  "bg-gray-200 text-gray-800"
                }`}
              >
                <Circle size={12} className="mr-1" color="currentColor" />
                {ev.severity}
              </span>
            )}

            <span
              className={`inline-flex items-center px-2 py-0.5 ml-2 text-xs rounded font-bold ${
                ev.status === "Active" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-800"
              }`}
            >
              {ev.status}
            </span>
          </div>

          {/* Dates and Location */}
          <div className="flex flex-wrap gap-4 items-center text-[13px] text-gray-600">
            <span className="inline-flex items-center gap-1">
              <CalendarDays size={16} color="#60A5FA" />
              {ev.startDate}
              {ev.endDate && <> &ndash; {ev.endDate}</>}
            </span>

            <span className="inline-flex items-center gap-1">
              <MapPin size={16} color="#FB923C" />
              {ev.locationName}
              {ev.region && <span className="ml-1 text-gray-400">({ev.region})</span>}
              {ev.country && <span className="ml-1 text-gray-400">, {ev.country}</span>}
            </span>
          </div>

          {/* Description */}
          {ev.description && (
            <div className="text-sm text-gray-700 mt-2 flex items-start gap-1">
              <Info size={16} color="#93C5FD" className="mt-[2px]" />
              <span className="line-clamp-3">{ev.description}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
