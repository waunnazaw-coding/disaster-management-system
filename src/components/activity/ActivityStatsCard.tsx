// import React from 'react';
// import { ActivityStatsDTO } from '@/types/activity';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// interface ActivityStatsCardProps {
//   stats: ActivityStatsDTO;
// }

// export const ActivityStatsCard: React.FC<ActivityStatsCardProps> = ({ stats }) => {
//   // Prepare data for chart
//   const chartData = Object.entries(stats.activitiesByType).map(([type, count]) => ({
//     name: type,
//     count
//   }));

//   return (
//     <Card className="w-full">
//       <CardHeader>
//         <CardTitle>Activity Statistics</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//           <div className="bg-blue-50 p-4 rounded-lg">
//             <h3 className="text-lg font-semibold text-blue-800">Total Activities</h3>
//             <p className="text-3xl font-bold text-blue-600">{stats.totalActivities}</p>
//           </div>
          
//           <div className="bg-green-50 p-4 rounded-lg">
//             <h3 className="text-lg font-semibold text-green-800">Activity Types</h3>
//             <p className="text-3xl font-bold text-green-600">
//               {Object.keys(stats.activitiesByType).length}
//             </p>
//           </div>
          
//           <div className="bg-purple-50 p-4 rounded-lg">
//             <h3 className="text-lg font-semibold text-purple-800">Recent Activities</h3>
//             <p className="text-3xl font-bold text-purple-600">
//               {stats.recentActivities.length}
//             </p>
//           </div>
//         </div>

//         <div className="h-64">
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart data={chartData}>
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };


import React from "react";
import { ActivityStatsDTO } from "@/types/activity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Users, ClipboardList, Clock } from "lucide-react";

interface ActivityStatsCardProps {
  stats: ActivityStatsDTO;
}

const StatTile: React.FC<{
  title: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  gradient: string;
}> = ({ title, value, icon, gradient }) => (
  <div className={`p-5 rounded-2xl ${gradient} text-white shadow-sm`}>
    <div className="flex items-center justify-between">
      <h3 className="text-sm/6 opacity-90">{title}</h3>
      <div className="opacity-90">{icon}</div>
    </div>
    <div className="mt-2 text-3xl font-semibold">{value}</div>
  </div>
);

export const ActivityStatsCard: React.FC<ActivityStatsCardProps> = ({ stats }) => {
  const chartData = Object.entries(stats.activitiesByType).map(([type, count]) => ({
    name: type,
    count,
  }));

  return (
    <Card className="w-full border-0 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-gray-900">Activity Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatTile
            title="Total Activities"
            value={stats.totalActivities}
            icon={<ClipboardList className="h-5 w-5" />}
            gradient="bg-gradient-to-br from-indigo-500 to-indigo-600"
          />
          <StatTile
            title="Activity Types"
            value={Object.keys(stats.activitiesByType).length}
            icon={<Users className="h-5 w-5" />}
            gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
          />
          <StatTile
            title="Recent Activities"
            value={stats.recentActivities.length}
            icon={<Clock className="h-5 w-5" />}
            gradient="bg-gradient-to-br from-fuchsia-500 to-fuchsia-600"
          />
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: "rgba(99,102,241,0.08)" }}
                contentStyle={{ borderRadius: 12, border: "0", boxShadow: "0 10px 20px rgba(0,0,0,0.08)" }}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]} fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityStatsCard;
