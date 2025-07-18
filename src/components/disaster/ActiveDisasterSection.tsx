import {
  AlertTriangle,
  Info,
  Clock,
  Skull,
  Home,
  Landmark,
  Building,
  Users as UserGroup,
} from "lucide-react";
import { DisasterEvent, Impact } from "../../types/disaster";

interface ActiveDisastersSectionProps {
  activeDisasters: DisasterEvent[];
  currentDate: string;
}

function groupImpacts(impacts: Impact[] = []) {
  const grouped: Record<string, Impact[]> = {};
  for (const impact of impacts) {
    if (!grouped[impact.type]) grouped[impact.type] = [];
    grouped[impact.type].push(impact);
  }
  return grouped;
}

function renderImpactBadges(groupedImpacts: Record<string, Impact[]>) {
  return Object.entries(groupedImpacts).map(([type, impacts]) => {
    const aggregatedValue = impacts.map((imp) => imp.value).join(", ");

    // Default icon parameters
    let icon = <Building color="#0ea5e9" size={16} aria-label={type} />;
    let bgColor = "bg-sky-50";
    let textColor = "text-sky-800";
    let label = type;

    switch (type.toLowerCase()) {
      case "casualties":
      case "died":
        icon = <Skull color="#ef4444" size={16} aria-label="Deaths" />;
        bgColor = "bg-red-50";
        textColor = "text-red-800";
        label = "Died";
        break;

      case "families affected":
        icon = <UserGroup color="#4338ca" size={16} aria-label="Families affected" />;
        bgColor = "bg-indigo-50";
        textColor = "text-indigo-800";
        label = "Families Affected";
        break;

      case "houses destroyed":
        icon = <Home color="#b45309" size={16} aria-label="Houses destroyed" />;
        bgColor = "bg-yellow-50";
        textColor = "text-yellow-800";
        label = "Houses Destroyed";
        break;

      case "pagodas destroyed":
        icon = <Landmark color="#6b21a8" size={16} aria-label="Pagodas destroyed" />;
        bgColor = "bg-purple-50";
        textColor = "text-purple-800";
        label = "Pagodas Destroyed";
        break;

      default:
        // fallback for unknown type
        label = type;
        break;
    }

    return (
      <div
        key={type}
        tabIndex={0}
        className={`flex items-center gap-1 ${textColor} ${bgColor} px-3 py-1 rounded-full text-xs font-semibold`}
      >
        {icon}
        <span>{label}: </span>
        <span className="font-extrabold">{aggregatedValue}</span>
      </div>
    );
  });
}

export default function ActiveDisastersSection({
  activeDisasters,
  currentDate,
}: ActiveDisastersSectionProps) {
  return (
    <section
      className="max-w-6xl mx-auto px-4 pt-10 pb-5"
      aria-labelledby="active-disasters-heading"
      role="region"
      tabIndex={-1}
    >
      <h2
        id="active-disasters-heading"
        className="text-2xl font-bold text-red-800 mb-2 flex items-center gap-2"
      >
        <AlertTriangle color="#ef4444" size={24} aria-label="Current Emergencies" />
        Current Emergency Events
      </h2>
      <p className="mb-2 text-gray-700 text-base">
        These disasters are currently active and impacting communities. All statistics are recent and verified for effective relief planning.
      </p>
      <p className="mb-6 text-xs text-gray-400 font-medium">{currentDate}</p>
      <ul className="flex flex-col gap-6" role="list" aria-label="Active Disasters List">
        {activeDisasters.map((event) => {
          const groupedImpacts = groupImpacts(event.impacts);

          return (
            <li
              key={event.id}
              className="w-full bg-white border-l-4 border-red-500 rounded-xl shadow p-5 flex flex-col gap-1"
              aria-labelledby={`event-${event.id}-heading`}
              role="listitem"
            >
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <AlertTriangle color="#ef4444" size={20} aria-label="Disaster Icon" />
                <span
                  id={`event-${event.id}-heading`}
                  className="text-lg font-bold text-blue-900"
                >
                  {event.name}
                </span>
                <span
                  className="text-xs bg-red-100 text-red-700 rounded px-2 py-1 font-semibold"
                  aria-label="Type"
                >
                  {event.type || "N/A"}
                </span>
                <span
                  className="text-xs bg-orange-100 text-orange-800 rounded px-2 py-1"
                  aria-label="Region"
                >
                  {event.location?.region || event.region || "Unknown"}
                </span>
                <span
                  className="text-xs bg-yellow-100 text-yellow-800 rounded px-2 py-1 font-medium"
                  aria-label="Severity"
                >
                  {event.severity || "Unknown"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <Clock color="#6b7280" size={16} aria-label="Last Updated" />
                Updated: {new Date(event.updatedAt).toLocaleString()}
              </div>
              <div className="text-sm text-gray-800 flex items-start gap-1 mb-3">
                <Info color="#60a5fa" size={16} aria-label="Event Update Info" />
                <span>{event.lastUpdate || event.description || "No recent update available."}</span>
              </div>
              <div className="flex flex-wrap gap-4 mb-2" aria-label="Disaster Impact Stats">
                {renderImpactBadges(groupedImpacts)}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
