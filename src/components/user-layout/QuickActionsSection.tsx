import { LifeBuoy, AlertTriangle, Heart, Users } from "lucide-react";
import { Link } from "react-router-dom";

const actions = [
  {
    icon: AlertTriangle,
    title: "Report a Disaster",
    description: "Share details if you witness or are affected by a new incident.",
    btn: "File Report",
    color: "text-red-600",
    to: "/disasters/report",
    bg: "hover:bg-red-50"
  },
  {
    icon: LifeBuoy,
    title: "Request Assistance",
    description: "Need urgent help? Let relief teams and volunteers know what you need.",
    btn: "Ask for Help",
    color: "text-blue-600",
    to: "/requests/assistant/new",
    bg: "hover:bg-blue-50"
  },
  {
    icon: Heart,
    title: "Donate",
    description: "Support trusted causes and emergency campaigns working in affected areas.",
    btn: "Donate Now",
    color: "text-pink-600",
    to: "/donations/new",
    bg: "hover:bg-pink-50"
  },
  {
    icon: Users,
    title: "Volunteer",
    description: "Register as a relief volunteer to join search, rescue, or humanitarian ops.",
    btn: "Join Team",
    color: "text-purple-600",
    to: "/volunteers/apply",
    bg: "hover:bg-purple-50"
  }
];

export default function QuickActionsSection() {
  return (
    <section className="py-7 border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-2">
        <h2 className="text-lg md:text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
          What would you like to do?
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {actions.map(({ icon: Icon, title, description, btn, to, color, bg }) => (
            <li
              key={title}
              className={`flex flex-col items-start gap-2 rounded-lg px-3 py-4 transition shadow border bg-white ${bg}`}
              style={{ minHeight: 0 }}
            >
              <div className={`rounded-full p-2 ${color} bg-gray-100`}>
                <Icon className="h-6 w-6" aria-label={title} />
              </div>
              <h3 className="text-base font-semibold text-blue-900 leading-snug truncate w-full">{title}</h3>
              <p className="text-xs text-slate-600 leading-tight line-clamp-2">{description}</p>
              <Link
                to={to}
                className={`inline-block mt-1 px-3 py-1.5 rounded text-xs text-white font-medium bg-gradient-to-r from-blue-600 to-blue-700 shadow hover:from-blue-700 hover:to-blue-800 transition ${color}`}
              >
                {btn}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
