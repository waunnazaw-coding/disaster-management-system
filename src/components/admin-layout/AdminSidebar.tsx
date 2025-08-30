// "use client";

// import React, { useEffect } from "react";
// import { useAdminStore } from "../../store/adminStore";
// import { useAuthStore } from "@/store/authStore";
// import { cn } from "../../lib/utils";
// import {
//   LayoutDashboard,
//   AlertTriangle,
//   HelpCircle,
//   Users,
//   Heart,
//   Calendar,
//   ChevronLeft,
//   ChevronRight,
//   Shield,
//   ClipboardList,
//   ActivityIcon,
//   MessageCircle,
// } from "lucide-react";
// import { Button } from "../ui/button";
// import { useNavigate } from "react-router-dom";

// const allNavigation = [
//   // { id: "dashboard", name: "Overview", icon: LayoutDashboard, path: "dashboard" },
//   { id: "events", name: "Disaster Events", icon: Calendar, path: "events" },
//   { id: "gdacs-events", name: "Global Disaster Management Dashboard", icon: Calendar, path: "gdacs-events" },
//   { id: "reports", name: "Reports", icon: AlertTriangle, path: "reports" },
//   { id: "requests", name: "Requests", icon: HelpCircle, path: "requests" },
//   { id: "activity", name: "Activity", icon: ActivityIcon, path: "activity" }, 
//   { id: "assignments", name: "AssignmentsHistory", icon: ClipboardList, path: "assignments" },
//   { id: "donations", name: "Donations", icon: Heart, path: "donations" },
//   { id: "users", name: "Users", icon: Users, path: "users" },
//   { id: "teams", name: "Relief Teams", icon: Users, path: "relief-team-lists" },
//   { id: "admin-invite", name: "Admin Invite", icon: Users, path: "admin-invite" },
//   { id: "admin-invite", name: "Admin Invite", icon: Users, path: "admin-invite" },
//   { id: "financial", name: "Financial Reports", icon: Users, path: "financial-reports" },
//   {id:"messages",name:"Messages",icon:MessageCircle,path:"contacts"},
//   {id:"partner",name:"Partners",icon:Users,path:"partners"}
// ];

// const roleNavigationMap: Record<string, string[]> = {
//   SysAdmin: allNavigation.map(item => item.id),
//   Admin: [
//     "dashboard", "events", "reports", "requests", "activity", "assignments", 
//     "donations", "users", "teams", "admin-invite", "financial"
//   ],
//   DisasterManagementAdmin: [
//     "dashboard", "events", "gdacs-events", "reports", "requests", 
//     "assignments", "teams"
//   ],
//   FinancialAdmin: [
//     "dashboard", "donations", "financial", "activity"
//   ],
// };

// interface AdminSidebarProps {
//   isMobile: boolean;
//   sidebarOpen: boolean;
//   setSidebarOpen: (open: boolean) => void;
// }

// export function AdminSidebar({
//   isMobile,
//   sidebarOpen,
//   setSidebarOpen,
// }: AdminSidebarProps) {
//   // Get user role from auth store
//   const user = useAuthStore(state => state.user);
//   const userRole = user?.role ?? "Admin"; // default to Admin if no user

//   const dashboardStats = useAdminStore(state => state.dashboardStats);
//   const sidebarCollapsed = useAdminStore(state => state.sidebarCollapsed);
//   const toggleSidebar = useAdminStore(state => state.toggleSidebar);
//   const activeTab = useAdminStore(state => state.activeTab);
//   const setActiveTab = useAdminStore(state => state.setActiveTab);
//   const initializeData = useAdminStore(state => state.initializeData);

//   const navigate = useNavigate();

//   useEffect(() => {
//     initializeData(); // load stats on mount
//   }, [initializeData]);

//   const handleNavigation = (path: string, tabId: string) => {
//     setActiveTab(tabId);
//     navigate(`/admin/${path}`);
//     if (isMobile) {
//       setSidebarOpen(false);
//     }
//   };

//   const getBadgeCount = (tabId: string) => {
//     switch (tabId) {
//       case "reports":
//         return dashboardStats.pendingReports;
//       case "requests":
//         return dashboardStats.pendingRequests;
//       case "donations":
//         return dashboardStats.pendingDonations;
//       default:
//         return 0;
//     }
//   };

//   // Filter navigation items based on user role
//   const allowedNavIds = roleNavigationMap[userRole] ?? roleNavigationMap["Admin"];
//   const navigation = allNavigation.filter(item => allowedNavIds.includes(item.id));

//   return (
//     <div
//       className={cn(
//         "fixed left-0 top-0 h-full z-50 transition-all duration-300",
//         "border-r border-gray-200 bg-white",
//         isMobile ? "w-64" : sidebarCollapsed ? "w-20" : "w-64",
//         isMobile
//           ? sidebarOpen
//             ? "translate-x-0 shadow-xl"
//             : "-translate-x-full"
//           : ""
//       )}
//     >
//       <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-slate-800 text-white">
//         {(!sidebarCollapsed || isMobile) && (
//           <div className="flex items-center space-x-2">
//             <Shield className="w-6 h-6 text-white" />
//             <span className="font-semibold">Admin Menu</span>
//           </div>
//         )}
//         {!isMobile && (
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={toggleSidebar}
//             className="text-white hover:bg-slate-700"
//           >
//             {sidebarCollapsed ? (
//               <ChevronRight className="w-4 h-4" />
//             ) : (
//               <ChevronLeft className="w-4 h-4" />
//             )}
//           </Button>
//         )}
//       </div>

//       <nav className="mt-4 px-2">
//         {navigation.map((item) => {
//           const active = item.id === activeTab;
//           const badgeCount = getBadgeCount(item.id);

//           return (
//             <div
//               key={item.id}
//               onClick={() => handleNavigation(item.path, item.id)}
//               className={cn(
//                 "flex items-center px-3 py-3 mb-1 rounded-lg cursor-pointer",
//                 "text-sm font-medium transition-all",
//                 active
//                   ? "bg-slate-100 text-slate-800 font-semibold"
//                   : "text-slate-600 hover:bg-gray-50"
//               )}
//             >
//               <item.icon
//                 className={cn(
//                   "w-5 h-5",
//                   active ? "text-slate-800" : "text-slate-500"
//                 )}
//               />
//               {(!sidebarCollapsed || isMobile) && (
//                 <div className="flex items-center w-full">
//                   <span className="ml-3 flex-grow">{item.name}</span>
//                   {badgeCount > 0 && (
//                     <span className="ml-auto bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full">
//                       {badgeCount}
//                     </span>
//                   )}
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </nav>
//     </div>
//   );
// }


// "use client";

// import React, { useEffect } from "react";
// import { useAdminStore } from "../../store/adminStore";
// import { useAuthStore } from "@/store/authStore";
// import { cn } from "../../lib/utils";
// import {
//   LayoutDashboard,
//   AlertTriangle,
//   HelpCircle,
//   Users,
//   Heart,
//   Calendar,
//   ChevronLeft,
//   ChevronRight,
//   Shield,
//   ClipboardList,
//   ActivityIcon,
//   MessageCircle,
// } from "lucide-react";
// import { Button } from "../ui/button";
// import { useNavigate } from "react-router-dom";

// const allNavigation = [
//   { id: "events", name: "Disaster Events", icon: Calendar, path: "events" },
//   { id: "gdacs-events", name: "Global Disaster Management Dashboard", icon: Calendar, path: "gdacs-events" },
//   { id: "reports", name: "Reports", icon: AlertTriangle, path: "reports" },
//   { id: "requests", name: "Requests", icon: HelpCircle, path: "requests" },
//   { id: "activity", name: "Activity", icon: ActivityIcon, path: "activity" }, 
//   { id: "assignments", name: "AssignmentsHistory", icon: ClipboardList, path: "assignments" },
//   { id: "donations", name: "Donations", icon: Heart, path: "donations" },
//   { id: "users", name: "Users", icon: Users, path: "users" },
//   { id: "teams", name: "Relief Teams", icon: Users, path: "relief-team-lists" },
//   { id: "admin-invite", name: "Admin Invite", icon: Users, path: "admin-invite" },
//   { id: "financial", name: "Financial Reports", icon: Users, path: "financial-reports" },
//   { id: "messages", name: "Messages", icon: MessageCircle, path: "contacts" },
//   { id: "partner", name: "Partners", icon: Users, path: "partners" }
// ];

// const roleNavigationMap: Record<string, string[]> = {
//   SysAdmin: allNavigation.map(item => item.id),
//   Admin: [
//     "dashboard", "events", "reports", "requests", "activity", "assignments", 
//     "donations", "users", "teams", "admin-invite", "financial"
//   ],
//   DisasterManagementAdmin: [
//     "dashboard", "events", "gdacs-events", "reports", "requests", 
//     "assignments", "teams"
//   ],
//   FinancialAdmin: [
//  "donations", "financial", "activity"
//   ],
// };

// interface AdminSidebarProps {
//   isMobile: boolean;
//   sidebarOpen: boolean;
//   setSidebarOpen: (open: boolean) => void;
// }

// export function AdminSidebar({
//   isMobile,
//   sidebarOpen,
//   setSidebarOpen,
// }: AdminSidebarProps) {
//   const user = useAuthStore(state => state.user);
//   const userRole = user?.role ?? "Admin";

//   const dashboardStats = useAdminStore(state => state.dashboardStats);
//   const sidebarCollapsed = useAdminStore(state => state.sidebarCollapsed);
//   const toggleSidebar = useAdminStore(state => state.toggleSidebar);
//   const activeTab = useAdminStore(state => state.activeTab);
//   const setActiveTab = useAdminStore(state => state.setActiveTab);
//   const initializeData = useAdminStore(state => state.initializeData);

//   const navigate = useNavigate();

//   useEffect(() => {
//     initializeData();
//   }, [initializeData]);

//   const handleNavigation = (path: string, tabId: string) => {
//     setActiveTab(tabId);
//     navigate(`/admin/${path}`);
//     if (isMobile) {
//       setSidebarOpen(false);
//     }
//   };

//   const getBadgeCount = (tabId: string) => {
//     switch (tabId) {
//       case "reports":
//         return dashboardStats.pendingReports;
//       case "requests":
//         return dashboardStats.pendingRequests;
//       case "donations":
//         return dashboardStats.pendingDonations;
//       default:
//         return 0;
//     }
//   };

//   const allowedNavIds = roleNavigationMap[userRole] ?? roleNavigationMap["Admin"];
//   const navigation = allNavigation.filter(item => allowedNavIds.includes(item.id));

//   return (
//     <div
//       className={cn(
//         "fixed left-0 top-0 h-full z-50 transition-all duration-300",
//         "border-r border-gray-200 bg-white",
//         isMobile ? "w-64" : sidebarCollapsed ? "w-20" : "w-64",
//         isMobile
//           ? sidebarOpen
//             ? "translate-x-0 shadow-xl"
//             : "-translate-x-full"
//           : ""
//       )}
//     >
//       <div className="flex flex-col h-full">
//         <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-slate-800 text-white">
//           {(!sidebarCollapsed || isMobile) && (
//             <div className="flex items-center space-x-2">
//               <Shield className="w-6 h-6 text-white" />
//               <span className="font-semibold">Admin Menu</span>
//             </div>
//           )}
//           {!isMobile && (
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={toggleSidebar}
//               className="text-white hover:bg-slate-700"
//             >
//               {sidebarCollapsed ? (
//                 <ChevronRight className="w-4 h-4" />
//               ) : (
//                 <ChevronLeft className="w-4 h-4" />
//               )}
//             </Button>
//           )}
//         </div>

//         <nav className="flex-1 px-2 overflow-y-auto">
//           {navigation.map((item) => {
//             const active = item.id === activeTab;
//             const badgeCount = getBadgeCount(item.id);

//             return (
//               <div
//                 key={item.id}
//                 onClick={() => handleNavigation(item.path, item.id)}
//                 className={cn(
//                   "flex items-center px-3 py-3 mb-1 rounded-lg cursor-pointer",
//                   "text-sm font-medium transition-all",
//                   active
//                     ? "bg-slate-100 text-slate-800 font-semibold"
//                     : "text-slate-600 hover:bg-gray-50"
//                 )}
//               >
//                 <item.icon
//                   className={cn(
//                     "w-5 h-5 flex-shrink-0",
//                     active ? "text-slate-800" : "text-slate-500"
//                   )}
//                 />
//                 {(!sidebarCollapsed || isMobile) && (
//                   <div className="flex items-center w-full min-w-0">
//                     <span className="ml-3 flex-grow truncate">{item.name}</span>
//                     {badgeCount > 0 && (
//                       <span className="ml-auto bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full flex-shrink-0">
//                         {badgeCount}
//                       </span>
//                     )}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </nav>
//       </div>
//     </div>
//   );
// }


// AdminSidebar.tsx
"use client";

import React, { useEffect } from "react";
import { useAdminStore } from "../../store/adminStore";
import { useAuthStore } from "@/store/authStore";
import { cn } from "../../lib/utils";
import {
  AlertTriangle,
  HelpCircle,
  Users,
  Heart,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Shield,
  ClipboardList,
  ActivityIcon,
  MessageCircle,
} from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

const allNavigation = [
  { id: "events", name: "Disaster Events", icon: Calendar, path: "events" },
  { id: "gdacs-events", name: "Global Disaster Dashboard", icon: Calendar, path: "gdacs-events" },
  { id: "reports", name: "Reports", icon: AlertTriangle, path: "reports" },
  { id: "requests", name: "Requests", icon: HelpCircle, path: "requests" },
  { id: "activity", name: "Activity", icon: ActivityIcon, path: "activity" },
  { id: "assignments", name: "Assignments", icon: ClipboardList, path: "assignments" },
  { id: "donations", name: "Donations", icon: Heart, path: "donations" },
  { id: "users", name: "Users", icon: Users, path: "users" },
  { id: "teams", name: "Relief Teams", icon: Users, path: "relief-team-lists" },
  { id: "financial-admin-invite", name: "Financial Admin Invite", icon: Users, path: "financial-admin-invite" },
  { id: "financial", name: "Financial Reports", icon: Users, path: "financial-reports" },
  { id: "messages", name: "Messages", icon: MessageCircle, path: "contacts" },
  { id: "partner", name: "Partners", icon: Users, path: "partners" }
];

const roleNavigationMap: Record<string, string[]> = {
  SysAdmin: allNavigation.map(item => item.id),
  Admin: [
    "events", "reports", "requests", "activity", "assignments",
    "donations", "users", "teams", "admin-invite", "financial", "messages", "partner"
  ],
  DisasterManagementAdmin: [
    "dashboard", "events", "gdacs-events", "reports", "requests",
    "assignments", "teams"
  ],
  FinancialAdmin: [
    "donations", "financial", "activity"
  ],
};

interface AdminSidebarProps {
  isMobile: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function AdminSidebar({
  isMobile,
  sidebarOpen,
  setSidebarOpen,
}: AdminSidebarProps) {
  const user = useAuthStore(state => state.user);
  const userRole = user?.role ?? "Admin";

  const dashboardStats = useAdminStore(state => state.dashboardStats);
  const sidebarCollapsed = useAdminStore(state => state.sidebarCollapsed);
  const toggleSidebar = useAdminStore(state => state.toggleSidebar);
  const activeTab = useAdminStore(state => state.activeTab);
  const setActiveTab = useAdminStore(state => state.setActiveTab);
  const initializeData = useAdminStore(state => state.initializeData);

  const navigate = useNavigate();

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const handleNavigation = (path: string, tabId: string) => {
    setActiveTab(tabId);
    navigate(`/admin/${path}`);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const getBadgeCount = (tabId: string) => {
    switch (tabId) {
      case "reports":
        return dashboardStats.pendingReports;
      case "requests":
        return dashboardStats.pendingRequests;
      case "donations":
        return dashboardStats.pendingDonations;
      default:
        return 0;
    }
  };

  const allowedNavIds = roleNavigationMap[userRole] ?? roleNavigationMap["Admin"];
  const navigation = allNavigation.filter(item => allowedNavIds.includes(item.id));

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-full z-50 transition-all duration-300",
        "border-r border-gray-200 bg-white",
        isMobile ? "w-64" : sidebarCollapsed ? "w-20" : "w-64",
        isMobile
          ? sidebarOpen
            ? "translate-x-0 shadow-xl"
            : "-translate-x-full"
          : ""
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-slate-800 text-white">
          {(!sidebarCollapsed || isMobile) && (
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-white" />
              <span className="font-semibold">Admin Menu</span>
            </div>
          )}
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="text-white hover:bg-slate-700"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>

        <nav className="flex-1 px-2 overflow-y-auto">
          {navigation.map((item) => {
            const active = item.id === activeTab;
            const badgeCount = getBadgeCount(item.id);

            return (
              <div
                key={item.id}
                onClick={() => handleNavigation(item.path, item.id)}
                className={cn(
                  "flex items-center px-3 py-3 mb-1 rounded-lg cursor-pointer",
                  "text-sm font-medium transition-all",
                  active
                    ? "bg-slate-100 text-slate-800 font-semibold"
                    : "text-slate-600 hover:bg-gray-50"
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 flex-shrink-0",
                    active ? "text-slate-800" : "text-slate-500"
                  )}
                />
                {(!sidebarCollapsed || isMobile) && (
                  <div className="flex items-center w-full min-w-0">
                    <span className="ml-3 flex-grow truncate">{item.name}</span>
                    {/* {badgeCount > 0 && (
                      <span className="ml-auto bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full flex-shrink-0">
                        {badgeCount}
                      </span>
                    )} */}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}