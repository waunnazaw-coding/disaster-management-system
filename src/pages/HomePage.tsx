import { useEffect } from "react";
import {
  AlertTriangle,
  Users,
  Building2,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";

import HeroSection from "../components/user-layout/HeroSection";
import DisasterEventList from "../components/disaster/DisasterEventLists";
import DisasterReportList from "../components/disaster/DisastetReportLists";
import ActiveDisastersSection from "../components/disaster/ActiveDisasterSection";
import { useActiveDisasterEventStore } from "../store/activeDisasterEventStore";
import { DisasterEvent } from "../types/disaster";
import QuickActionsSection from "../components/user-layout/QuickActionsSection";
import DonationToast from "@/components/donations/DonationToast";
import { useActivityStore } from "@/store/activityStore";
import ActivityCard from "@/components/activity/ActivityCard";
import { Button } from "@/components/ui/button";


const activeDisastersSample: DisasterEvent[] = [
  {
    id: 1,
    name: "Ayeyarwady River Flood",
    type: "Flood",
    disasterTypeId: 1,
    startDate: "2025-07-14",
    endDate: null,
    locationId: 1,
    region: "Magway",
    severity: "Severe",
    status: "Active",
    description: "Heavy monsoon flooding along the Ayeyarwady River.",
    createdAt: "2025-07-14T08:00:00",
    updatedAt: "2025-07-17T15:30:00",
    lastUpdate: "Water levels rising. Relief boats dispatched to Minbu. Families at risk.",
    location: { id: 1, name: "Magway", region: "Magway", country: "Myanmar" },
    impacts: [
      { id: 1, disasterEventId: 1, type: "Casualties", value: "36" },
      { id: 2, disasterEventId: 1, type: "Families Affected", value: "188" },
      { id: 3, disasterEventId: 1, type: "Houses Destroyed", value: "150" },
      { id: 4, disasterEventId: 1, type: "Pagodas Destroyed", value: "7" },
      { id: 5, disasterEventId: 1, type: "Schools Destroyed", value: "2" },
      { id: 6, disasterEventId: 1, type: "Bridges Destroyed", value: "1" },
    ],
  },
  {
    id: 2,
    name: "Yangon Tornado",
    type: "Tornado",
    disasterTypeId: 2,
    startDate: "2025-07-15",
    endDate: null,
    locationId: 2,
    region: "Yangon",
    severity: "Moderate",
    status: "Active",
    description: "A tornado touched down damaging homes in several Yangon townships.",
    createdAt: "2025-07-15T07:30:00",
    updatedAt: "2025-07-17T14:15:00",
    lastUpdate:
      "Winds subsiding, but many homes are without power. Families in temporary shelters.",
    location: { id: 2, name: "Yangon", region: "Yangon", country: "Myanmar" },
    impacts: [
      { id: 7, disasterEventId: 2, type: "Casualties", value: "5" },
      { id: 8, disasterEventId: 2, type: "Families Affected", value: "54" },
      { id: 9, disasterEventId: 2, type: "Houses Destroyed", value: "42" },
      { id: 10, disasterEventId: 2, type: "Markets Destroyed", value: "1" },
    ],
  },
];

const currentDate = new Date().toLocaleString();

export default function HomePage() {
  const { activeEvents, setActiveEvents } = useActiveDisasterEventStore();
  const { activities, loading } = useActivityStore();


  useEffect(() => {
    // In production, fetch from the server
    setActiveEvents(activeDisastersSample);
  }, [setActiveEvents]);

   useEffect(() => {
    // Fetch activities for home page
    if (activities.length === 0) {
      useActivityStore.getState().fetchActivities();
    }
  }, []);

  // Get 3 most recent activities
  const recentActivities = [...activities]
    .sort((a, b) => new Date(b.activityDate).getTime() - new Date(a.activityDate).getTime())
    .slice(0, 3);

  // Stats data array with icons and colors
  const stats = [
    {
      icon: AlertTriangle,
      value: "1,247",
      label: "Disasters Reported",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      icon: Users,
      value: "15,892",
      label: "People Helped",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Building2,
      value: "89",
      label: "Partner Relief Teams",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      icon: CheckCircle,
      value: "2,156",
      label: "Requests Completed",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />

      {/* ---- Quick Actions ---- */}
      <QuickActionsSection />


    {/* ---- Recent Activities ---- */}
      <section className="max-w-6xl mx-auto px-4 py-12 bg-gradient-to-b from-white to-blue-50">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-blue-900 mb-2">Recent Relief Activities</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            See how relief teams are actively helping communities affected by recent disasters
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : recentActivities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentActivities.map(activity => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onView={() => window.location.href = `/activities/${activity.id}`}
                isAdmin={false}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No recent activities found</p>
          </div>
        )}

        <div className="text-center mt-10">
          <Button asChild variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
            <Link to="/activities">View All Activities</Link>
          </Button>
        </div>
      </section>


      {/* ---- Active Disasters ---- */}
      <ActiveDisastersSection
        activeDisasters={activeEvents}
        currentDate={currentDate}
      />



      {/* Divider */}
      <div className="max-w-6xl mx-auto border-b border-gray-300 my-8"></div>

      {/* ---- Events & Reports ---- */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-10">
          <section>
            <h2 className="text-xl font-semibold text-blue-900 mb-2">
              All Disaster Events
            </h2>
            <p className="text-sm text-gray-600 mb-3">
              Browse the historical record and progression of all major disaster
              incidents on record.
            </p>
            <DisasterEventList />
            <Link
              to="/events"
              className="block mt-3 text-blue-600 hover:underline text-sm"
            >
              View all events &rarr;
            </Link>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-blue-900 mb-2">
              Verified Disaster Reports
            </h2>
            <p className="text-sm text-gray-600 mb-3">
              See trusted reports submitted by citizens, relief teams, and
              organizations, verified by our moderators.
            </p>
            <DisasterReportList />
            <Link
              to="/reports"
              className="block mt-3 text-blue-600 hover:underline text-sm"
            >
              View all reports &rarr;
            </Link>
          </section>
        </div>
      </section>

      {/* Divider */}
      {/* <div className="max-w-6xl mx-auto border-b border-gray-300 my-8"></div> */}

      {/* ---- Overall Disaster Events Map ---- */}
      {/* <DisasterEventsMap /> */}

      {/* Divider */}
      <div className="max-w-6xl mx-auto border-b border-gray-300 my-8"></div>

      {/* ---- Stats Summary ---- */}
      <div className="bg-white py-8">
        <div className="max-w-5xl mx-auto px-3 grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white/90 shadow-sm border-0 rounded-md hover:shadow-md transition"
              >
                <div className="p-3 flex items-center gap-3">
                  <div
                    className={`p-2 rounded bg-opacity-15 ${stat.bgColor}`}
                    aria-hidden="true"
                  >
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <span className="block text-xl font-semibold text-blue-900">
                      {stat.value}
                    </span>
                    <span className="text-xs text-blue-700">{stat.label}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <DonationToast/>
    </div>
  );
}
