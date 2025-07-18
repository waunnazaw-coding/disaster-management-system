import { AlertTriangle, CalendarDays, MapPin, Info, Circle } from "lucide-react";

const disasterTypeMap = {
  1: "Flood",
  2: "Cyclone",
  3: "Earthquake",
  4: "Fire",
  // add more types if needed
};

const severityColor = {
  Severe: "bg-red-500 text-white",
  Moderate: "bg-yellow-400 text-gray-900",
  Low: "bg-green-300 text-green-900",
};

export default function DisasterEventList() {
  const events = [
    {
      Id: 1,
      Name: "Cyclone Nargis",
      DisasterTypeId: 2,
      StartDate: "2023-04-02",
      EndDate: null,
      Location: { Name: "Yangon", Region: "Yangon", Country: "Myanmar" },
      Severity: "Severe",
      Status: "Active",
      Description: "Severe flooding and damage in Yangon area.",
    },
    {
      Id: 2,
      Name: "Mawlamyine Floods",
      DisasterTypeId: 1,
      StartDate: "2023-09-10",
      EndDate: "2023-09-28",
      Location: { Name: "Mawlamyine", Region: "Mon", Country: "Myanmar" },
      Severity: "Moderate",
      Status: "Closed",
      Description: "Intense monsoon floods impacted large areas.",
    },
  ];

  return (
    <div className="flex flex-col gap-5 max-h-[340px] overflow-y-auto pr-1">
      {events.map((ev) => {
        const disasterTypeName =
          disasterTypeMap[ev.DisasterTypeId as keyof typeof disasterTypeMap] || "Other";

        return (
          <div
            key={ev.Id}
            className="rounded-xl border shadow bg-white/95 p-5 flex flex-col gap-2 relative"
          >
            {/* Top row: Name, Type, Severity, Status */}
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="text-lg font-bold text-blue-900">{ev.Name}</span>

              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded bg-blue-50 text-blue-600">
                <AlertTriangle size={16} color="#2563EB" />
                {disasterTypeName}
              </span>

              {ev.Severity && (
                <span
                  className={`inline-flex items-center px-2 py-0.5 text-xs rounded font-bold ${
                    severityColor[ev.Severity as keyof typeof severityColor] ||
                    "bg-gray-200 text-gray-800"
                  }`}
                >
                  <Circle size={12} className="mr-1" color="currentColor" />
                  {ev.Severity}
                </span>
              )}

              <span
                className={`inline-flex items-center px-2 py-0.5 ml-2 text-xs rounded font-bold ${
                  ev.Status === "Active"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-800"
                }`}
              >
                {ev.Status}
              </span>
            </div>

            {/* Dates and Location */}
            <div className="flex flex-wrap gap-4 items-center text-[13px] text-gray-600">
              <span className="inline-flex items-center gap-1">
                <CalendarDays size={16} color="#60A5FA" />
                {ev.StartDate}
                {ev.EndDate && <> &ndash; {ev.EndDate}</>}
              </span>

              <span className="inline-flex items-center gap-1">
                <MapPin size={16} color="#FB923C" />
                {ev.Location?.Name}
                {ev.Location?.Region && (
                  <span className="ml-1 text-gray-400">({ev.Location.Region})</span>
                )}
                {ev.Location?.Country && (
                  <span className="ml-1 text-gray-400">, {ev.Location.Country}</span>
                )}
              </span>
            </div>

            {/* Description */}
            {ev.Description && (
              <div className="text-sm text-gray-700 mt-2 flex items-start gap-1">
                <Info size={16} color="#93C5FD" className="mt-[2px]" />
                <span className="line-clamp-3">{ev.Description}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
