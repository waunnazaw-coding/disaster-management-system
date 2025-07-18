import { AlertTriangle, Info, CheckCircle2, CircleHelp, MapPin } from "lucide-react";

const typeMap = {
  Damage: { icon: AlertTriangle, color: "#dc2626", bgColor: "bg-red-50 text-red-700" },
  Situation: { icon: Info, color: "#3b82f6", bgColor: "bg-blue-50 text-blue-700" },
  Request: { icon: CheckCircle2, color: "#10b981", bgColor: "bg-emerald-50 text-emerald-700" },
};

const severityStyle = {
  High: "bg-red-500 text-white",
  Medium: "bg-yellow-300 text-yellow-900",
  Low: "bg-emerald-200 text-emerald-800",
};

export default function DisasterReportList() {
  const reports = [
    {
      Id: 1,
      DisasterEventId: 3,
      UserId: null,
      Location: { Name: "Sagaing", Region: "Sagaing", Country: "Myanmar" },
      AddressDetail: "Myo Thit Street, Ward 4",
      Type: "Damage",
      Title: "Bridge Collapse in Sagaing",
      Description: "Verified report: bridge near Kalay collapsed, urgent repair needed.",
      Severity: "High",
      Status: "Verified",
      Source: "Citizen",
      CreatedAt: "2025-07-12T14:10:00",
    },
    {
      Id: 2,
      DisasterEventId: null,
      UserId: null,
      Location: { Name: "Hakha", Region: "Chin", Country: "Myanmar" },
      AddressDetail: null,
      Type: "Situation",
      Title: "Landslide in Chin State",
      Description: "Several homes buried, relief teams dispatched.",
      Severity: "Medium",
      Status: "Pending",
      Source: "Media",
      CreatedAt: "2025-07-14T09:35:00",
    },
  ];

  return (
    <div className="flex flex-col gap-4 max-h-[350px] overflow-y-auto pr-1">
      {reports.map((report) => {
        const TypeIcon = typeMap[report.Type as keyof typeof typeMap]?.icon || CircleHelp;
        const iconColor = typeMap[report.Type as keyof typeof typeMap]?.color || "#6b7280"; // gray-500 fallback

        return (
          <div
            key={report.Id}
            className="rounded-xl border shadow-md bg-white/95 p-5 flex flex-col gap-2"
          >
            {/* Top: type + title + status + severity */}
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 font-medium px-2 py-1 rounded-lg text-sm ${
                  typeMap[report.Type as keyof typeof typeMap]?.bgColor || "bg-gray-100 text-gray-600"
                }`}
              >
                <TypeIcon size={20} color={iconColor} />
                {report.Type}
              </span>

              <span className="text-blue-900 font-semibold text-base mr-1">
                {report.Title || "Untitled"}
              </span>

              {/* Status rendered as simple text, no special background or color */}
              <span className="text-xs font-normal px-2 py-1 rounded text-gray-700">
                {report.Status}
              </span>

              {report.Severity && (
                <span
                  className={`text-xs font-semibold px-2 py-1 ml-1 rounded ${
                    severityStyle[report.Severity as keyof typeof severityStyle] || "bg-gray-100 text-gray-600"
                  }`}
                >
                  {report.Severity}
                </span>
              )}
            </div>

            {/* Secondary info */}
            <div className="flex flex-wrap gap-4 items-center text-xs text-gray-700">
              <span className="flex items-center gap-1">
                <MapPin size={16} color="#f97316" />
                {report.Location?.Name}
                {report.Location?.Region && <span className="ml-1">({report.Location.Region})</span>}
                {report.Location?.Country && <span className="ml-1">, {report.Location.Country}</span>}
              </span>

              {report.AddressDetail && <span className="ml-2 text-gray-500">{report.AddressDetail}</span>}

              {report.Source && (
                <span className="ml-4 px-2 py-1 bg-gray-50 text-gray-600 rounded">{report.Source}</span>
              )}

              {report.CreatedAt && (
                <span className="ml-2 text-gray-400">{new Date(report.CreatedAt).toLocaleDateString()}</span>
              )}
            </div>

            {/* Description */}
            {report.Description && (
              <div className="text-[15px] text-gray-800 mt-1 line-clamp-3">{report.Description}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
