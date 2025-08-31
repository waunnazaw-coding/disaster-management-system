// import { useAdminStore } from "../../store/adminStore"
// import { cn } from "../../lib/utils"
// import {
//   Users,
//   HelpCircle,
//   Heart,
//   LayoutDashboard,
//   ClipboardList
// } from "lucide-react"
// import { useNavigate } from "react-router-dom"

// const navigation = [
//   { id: "dashboard", name: "Dashboard", icon: LayoutDashboard, path: "dashboard" },
//   // { id: "members", name: "Team Members", icon: Users, path: "members" },
//   { id: "assignments", name: "requests-assignments", icon: HelpCircle, path: "assignments" },
//   // { id: "donations", name: "Donations", icon: Heart, path: "donations" },
//   // { id: "activity", name: "Activity Log", icon: ClipboardList, path: "actvities" },
// ]

// export function ReliefTeamSidebar() {
//   const activeTab = useAdminStore((s) => s.activeTab)
//   const setActiveTab = useAdminStore((s) => s.setActiveTab)
//   const navigate = useNavigate()
//   const sidebarCollapsed = useAdminStore((s) => s.sidebarCollapsed)

//   const handleNavigation = (path: string, tabId: string) => {
//     setActiveTab(tabId)
//     navigate(`/relief/${path}`)
//   }

//   return (
//     <nav className="mt-4 flex flex-col space-y-1">
//       {navigation.map(({ id, name, icon: Icon, path }) => {
//         const active = activeTab === id
//         return (
//           <button
//             key={id}
//             onClick={() => handleNavigation(path, id)}
//             className={cn(
//               "flex items-center px-4 py-3 w-full text-left rounded-md transition-colors",
//               active ? "bg-gray-100 text-gray-900 font-semibold" : "text-gray-700 hover:bg-gray-50"
//             )}
//           >
//             <Icon className="w-5 h-5 mr-3" />
//             {!sidebarCollapsed && <span>{name}</span>}
//           </button>
//         )
//       })}
//     </nav>
//   )
// }


// // Sidebar.tsx
// import { useAdminStore } from "../../store/adminStore";
// import { cn } from "../../lib/utils";
// import {
//   LayoutDashboard,
//   ClipboardList,
//   ActivityIcon
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const navigation = [
//   { id: "assignments", name: "Assignments", icon: ClipboardList, path: "assignments" },
//   { id: "dashboard", name: "Dashboard", icon: LayoutDashboard, path: "dashboard" },

//   // { id: "activities", name: "Activity Log", icon: ActivityIcon, path: "activities" },
// ];

// export function ReliefTeamSidebar() {
//   const activeTab = useAdminStore((s) => s.activeTab);
//   const setActiveTab = useAdminStore((s) => s.setActiveTab);
//   const navigate = useNavigate();
//   const sidebarCollapsed = useAdminStore((s) => s.sidebarCollapsed);

//   const handleNavigation = (path: string, tabId: string) => {
//     setActiveTab(tabId);
//     navigate(`/relief/${path}`);
//   };

//   return (
//     <nav className="mt-4 flex flex-col space-y-1">
//       {navigation.map(({ id, name, icon: Icon, path }) => {
//         const active = activeTab === id;
//         return (
//           <button
//             key={id}
//             onClick={() => handleNavigation(path, id)}
//             className={cn(
//               "flex items-center px-4 py-3 w-full text-left rounded-md transition-colors",
//               active ? "bg-gray-100 text-gray-900 font-semibold" : "text-gray-700 hover:bg-gray-50"
//             )}
//           >
//             <Icon className="w-5 h-5 mr-3" />
//             {!sidebarCollapsed && <span>{name}</span>}
//           </button>
//         );
//       })}
//     </nav>
//   );
// }


// Sidebar.tsx
import { useAdminStore } from "../../store/adminStore";
import { cn } from "../../lib/utils";
import {
  LayoutDashboard,
  ClipboardList,
  Activity,
  MapPin,
  Users,
  BarChart3
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const navigation = [
  { id: "dashboard", name: "Dashboard", icon: LayoutDashboard, path: "dashboard" },
  { id: "assignments", name: "Assignments", icon: MapPin, path: "assignments" },
  // { id: "team", name: "Team Members", icon: Users, path: "team" },
  // { id: "reports", name: "Reports", icon: BarChart3, path: "reports" },
  // { id: "activities", name: "Activity Log", icon: Activity, path: "activities" },
];

export function ReliefTeamSidebar() {
  const activeTab = useAdminStore((s) => s.activeTab);
  const setActiveTab = useAdminStore((s) => s.setActiveTab);
  const navigate = useNavigate();
  const sidebarCollapsed = useAdminStore((s) => s.sidebarCollapsed);

  const handleNavigation = (path: string, tabId: string) => {
    setActiveTab(tabId);
    navigate(`/relief/${path}`);
  };

  return (
    <nav className="mt-6 flex flex-col space-y-2 px-3">
      {navigation.map(({ id, name, icon: Icon, path }) => {
        const active = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => handleNavigation(path, id)}
            className={cn(
              "flex items-center px-3 py-3 w-full text-left rounded-lg transition-all duration-200 group",
              active 
                ? "bg-blue-500 text-white shadow-md" 
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            )}
          >
            <Icon className={cn(
              "w-5 h-5 transition-all duration-200",
              sidebarCollapsed ? "mx-auto" : "mr-3",
              active ? "text-white" : "text-slate-400 group-hover:text-white"
            )} />
            {!sidebarCollapsed && <span className="font-medium">{name}</span>}
            
            {/* Tooltip for collapsed sidebar */}
            {sidebarCollapsed && (
              <div className="absolute left-full ml-3 px-2 py-1 bg-slate-900 rounded-md shadow-lg 
                            text-xs font-medium text-white opacity-0 group-hover:opacity-100 
                            transition-opacity duration-200 pointer-events-none">
                {name}
              </div>
            )}
          </button>
        );
      })}
    </nav>
  );
}