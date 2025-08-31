// "use client";

// import React, { useEffect } from "react";
// import { useAdminStore } from "../../store/adminStore";
// import { useAuthStore } from "@/store/authStore";
// import { cn } from "../../lib/utils";
// import {
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
//   { id: "gdacs-events", name: "Global Disaster Dashboard", icon: Calendar, path: "gdacs-events" },
//   { id: "reports", name: "Reports", icon: AlertTriangle, path: "reports" },
//   { id: "requests", name: "Requests", icon: HelpCircle, path: "requests" },
//   { id: "activity", name: "Activity", icon: ActivityIcon, path: "activity" },
//   { id: "assignments", name: "Assignments", icon: ClipboardList, path: "assignments" },
//   { id: "donations", name: "Donations", icon: Heart, path: "donations" },
//   { id: "users", name: "Users", icon: Users, path: "users" },
//   { id: "teams", name: "Relief Teams", icon: Users, path: "relief-team-lists" },
//   { id: "financial-admin-invite", name: "Financial Admin Invite", icon: Users, path: "financial-admin-invite" },
//   { id: "disaster-admin-invite", name: "Disaster Admin Invite", icon: Users, path: "disaster-management-admin-invite" },
//   { id: "financial", name: "Financial Reports", icon: Users, path: "financial-reports" },
//   { id: "messages", name: "Messages", icon: MessageCircle, path: "contacts" },
//   { id: "partner", name: "Partners", icon: Users, path: "partners" }
// ];

// const roleNavigationMap: Record<string, string[]> = {
//   SysAdmin: allNavigation.map(item => item.id),
//   Admin: [
//     "events", "reports", "requests", "activity", "assignments",
//     "donations", "users", "teams", "admin-invite", "financial", "messages", "partner"
//   ],
//   DisasterManagementAdmin: [
//     "dashboard", "events", "gdacs-events", "reports", "requests",
//     "assignments", "teams"
//   ],
//   FinancialAdmin: [
//     "donations", "financial", "activity"
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
//                     {/* {badgeCount > 0 && (
//                       <span className="ml-auto bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full flex-shrink-0">
//                         {badgeCount}
//                       </span>
//                     )} */}
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



// "use client";

// import React, { useEffect } from "react";
// import { useAdminStore } from "../../store/adminStore";
// import { useAuthStore } from "@/store/authStore";
// import { cn } from "../../lib/utils";
// import {
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
//   Globe,
//   UserPlus,
//   Receipt,
//   Handshake,
//   Users2,
//   BanknoteIcon,
//   MapPin
// } from "lucide-react";
// import { Button } from "../ui/button";
// import { useNavigate } from "react-router-dom";

// const allNavigation = [
//   { id: "gdacs-events", name: "Global Dashboard", icon: Globe, path: "gdacs-events", color: "text-indigo-500" },
//   { id: "events", name: "Disaster Events", icon: MapPin, path: "events", color: "text-blue-500" },
//   { id: "reports", name: "Reports", icon: AlertTriangle, path: "reports", color: "text-amber-500" },
//   { id: "requests", name: "Requests", icon: HelpCircle, path: "requests", color: "text-rose-500" },
//   { id: "activity", name: "Activity", icon: ActivityIcon, path: "activity", color: "text-emerald-500" },
//   { id: "assignments", name: "Assignments", icon: ClipboardList, path: "assignments", color: "text-violet-500" },
//   { id: "donations", name: "Donations", icon: Heart, path: "donations", color: "text-pink-500" },
//   { id: "users", name: "Users", icon: Users, path: "users", color: "text-cyan-500" },
//   { id: "teams", name: "Relief Teams", icon: Users2, path: "relief-team-lists", color: "text-orange-500" },
//   { id: "financial-admin-invite", name: "Financial Admin Invite", icon: BanknoteIcon, path: "financial-admin-invite", color: "text-green-500" },
//   { id: "disaster-admin-invite", name: "Disaster Admin Invite", icon: UserPlus, path: "disaster-management-admin-invite", color: "text-teal-500" },
//   { id: "financial", name: "Financial Reports", icon: Receipt, path: "financial-reports", color: "text-lime-500" },
//   { id: "messages", name: "Messages", icon: MessageCircle, path: "contacts", color: "text-purple-500" },
//   { id: "partner", name: "Partners", icon: Handshake, path: "partners", color: "text-yellow-500" }
// ];

// const roleNavigationMap: Record<string, string[]> = {
//   SysAdmin: allNavigation.map(item => item.id),
//   Admin: [
//     "events", "reports", "requests", "activity", "assignments",
//     "donations", "users", "teams", "financial-admin-invite", "disaster-admin-invite", 
//     "financial", "messages", "partner"
//   ],
//   DisasterManagementAdmin: [
//     "events", "gdacs-events", "reports", "requests", "assignments", "teams"
//   ],
//   FinancialAdmin: [
//     "donations", "financial", "activity"
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
//       // case "messages":
//       //   return dashboardStats.unreadMessages;
//       // default:
//         return 0;
//     }
//   };

//   const allowedNavIds = roleNavigationMap[userRole] ?? roleNavigationMap["Admin"];
//   const navigation = allNavigation.filter(item => allowedNavIds.includes(item.id));

//   return (
//     <div
//       className={cn(
//         "fixed left-0 top-0 h-full z-50 transition-all duration-300",
//         "border-r border-gray-200 bg-gradient-to-b from-slate-900 to-slate-800",
//         isMobile ? "w-64" : sidebarCollapsed ? "w-20" : "w-64",
//         isMobile
//           ? sidebarOpen
//             ? "translate-x-0 shadow-xl"
//             : "-translate-x-full"
//           : ""
//       )}
//     >
//       <div className="flex flex-col h-full">
//         {/* Header */}
//         <div className="flex items-center justify-between p-3 border-b border-slate-700 bg-slate-900">
//           {(!sidebarCollapsed || isMobile) && (
//             <div className="flex items-center space-x-2">
//               <div className="p-2 bg-blue-600 rounded-lg">
//                 <Shield className="w-5 h-5 text-white" />
//               </div>
//               <div>
//                 <span className="font-bold text-white">Admin Panel</span>
//                 <p className="text-xs text-slate-300 capitalize">{userRole.toLowerCase().replace('admin', 'admin ')}</p>
//               </div>
//             </div>
//           )}
//           {!isMobile && (
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={toggleSidebar}
//               className="text-slate-300 hover:bg-slate-800 hover:text-white rounded-full"
//             >
//               {sidebarCollapsed ? (
//                 <ChevronRight className="w-4 h-4" />
//               ) : (
//                 <ChevronLeft className="w-4 h-4" />
//               )}
//             </Button>
//           )}
//         </div>

//         {/* Navigation Items */}
//         <nav className="flex-1 px-3 py-4 overflow-y-auto">
//           {navigation.map((item) => {
//             const active = item.id === activeTab;
//             const badgeCount = getBadgeCount(item.id);

//             return (
//               <div
//                 key={item.id}
//                 onClick={() => handleNavigation(item.path, item.id)}
//                 className={cn(
//                   "flex items-center px-3 py-3 mb-2 rounded-lg cursor-pointer transition-all group",
//                   "text-sm font-medium",
//                   active
//                     ? "bg-blue-600 text-white shadow-lg"
//                     : "text-slate-300 hover:bg-slate-700 hover:text-white"
//                 )}
//               >
//                 <div className={cn(
//                   "p-2 rounded-lg transition-all",
//                   active 
//                     ? "bg-blue-700" 
//                     : "bg-slate-800 group-hover:bg-slate-600"
//                 )}>
//                   <item.icon
//                     className={cn(
//                       "w-4 h-4 flex-shrink-0",
//                       active ? "text-white" : item.color
//                     )}
//                   />
//                 </div>
                
//                 {(!sidebarCollapsed || isMobile) && (
//                   <div className="flex items-center w-full min-w-0 ml-3">
//                     <span className="flex-grow truncate">{item.name}</span>
//                     {/* {badgeCount > 0 && (
//                       <span className="ml-2 bg-rose-500 text-white text-xs px-2 py-1 rounded-full flex-shrink-0 min-w-[1.25rem] text-center">
//                         {badgeCount > 99 ? "99+" : badgeCount}
//                       </span>
//                     )} */}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </nav>

//         {/* User Footer */}
//         {(!sidebarCollapsed || isMobile) && user && (
//           <div className="p-4 border-t border-slate-700">
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
//                 <span className="font-semibold text-white">
//                   {user.name ? user.name.charAt(0).toUpperCase() : "U"}
//                 </span>
//               </div>
//               <div className="overflow-hidden">
//                 <p className="font-medium truncate text-white">{user.name || "User"}</p>
//                 <p className="text-xs text-slate-300 truncate">{user.email || ""}</p>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// AdminSidebar.tsx (updated with correct active state handling)
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
  Globe,
  UserPlus,
  Receipt,
  Handshake,
  Users2,
  BanknoteIcon,
  MapPin
} from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate, useLocation } from "react-router-dom";

const allNavigation = [
  { id: "gdacs-events", name: "Global Dashboard", icon: Globe, path: "gdacs-events", color: "text-indigo-500" },
  { id: "events", name: "Disaster Events", icon: MapPin, path: "events", color: "text-blue-500" },
  { id: "reports", name: "Reports", icon: AlertTriangle, path: "reports", color: "text-amber-500" },
  { id: "requests", name: "Requests", icon: HelpCircle, path: "requests", color: "text-rose-500" },
  { id: "activity", name: "Activity", icon: ActivityIcon, path: "activity", color: "text-emerald-500" },
  { id: "assignments", name: "Assignments", icon: ClipboardList, path: "assignments", color: "text-violet-500" },
  { id: "donations", name: "Donations", icon: Heart, path: "donations", color: "text-pink-500" },
  { id: "users", name: "Users", icon: Users, path: "users", color: "text-cyan-500" },
  { id: "teams", name: "Relief Teams", icon: Users2, path: "relief-team-lists", color: "text-orange-500" },
  { id: "financial-admin-invite", name: "Financial Admin Invite", icon: BanknoteIcon, path: "financial-admin-invite", color: "text-green-500" },
  { id: "disaster-admin-invite", name: "Disaster Admin Invite", icon: UserPlus, path: "disaster-management-admin-invite", color: "text-teal-500" },
  { id: "financial", name: "Financial Reports", icon: Receipt, path: "financial-reports", color: "text-lime-500" },
  { id: "messages", name: "Messages", icon: MessageCircle, path: "contacts", color: "text-purple-500" },
  { id: "partner", name: "Partners", icon: Handshake, path: "partners", color: "text-yellow-500" }
];

const roleNavigationMap: Record<string, string[]> = {
  SysAdmin: allNavigation.map(item => item.id),
  Admin: [
    "events", "reports", "requests", "activity", "assignments",
    "donations", "users", "teams", "financial-admin-invite", "disaster-admin-invite", 
    "financial", "messages", "partner"
  ],
  DisasterManagementAdmin: [
    "events", "gdacs-events", "reports", "requests", "assignments", "teams"
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
  const location = useLocation();

  useEffect(() => {
    initializeData();
    
    // Set active tab based on current path
    const pathParts = location.pathname.split("/");
    const currentPath = pathParts[pathParts.length - 1];
    
    // Find the navigation item that matches the current path
    const currentNavItem = allNavigation.find(item => item.path === currentPath);
    if (currentNavItem && activeTab !== currentNavItem.id) {
      setActiveTab(currentNavItem.id);
    }
  }, [initializeData, location.pathname, activeTab, setActiveTab]);

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
        "border-r border-gray-200 bg-gradient-to-b from-slate-900 to-slate-800",
        isMobile ? "w-64" : sidebarCollapsed ? "w-20" : "w-64",
        isMobile
          ? sidebarOpen
            ? "translate-x-0 shadow-xl"
            : "-translate-x-full"
          : ""
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-slate-700 bg-slate-900">
          {(!sidebarCollapsed || isMobile) && (
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-white">Admin Panel</span>
                <p className="text-xs text-slate-300 capitalize">{userRole.toLowerCase().replace('admin', 'admin ')}</p>
              </div>
            </div>
          )}
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="text-slate-300 hover:bg-slate-800 hover:text-white rounded-full"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {navigation.map((item) => {
            const active = activeTab === item.id;
            const badgeCount = getBadgeCount(item.id);

            return (
              <div
                key={item.id}
                onClick={() => handleNavigation(item.path, item.id)}
                className={cn(
                  "flex items-center px-3 py-3 mb-2 rounded-lg cursor-pointer transition-all group",
                  "text-sm font-medium",
                  active
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                )}
              >
                <div className={cn(
                  "p-2 rounded-lg transition-all",
                  active 
                    ? "bg-blue-700" 
                    : "bg-slate-800 group-hover:bg-slate-600"
                )}>
                  <item.icon
                    className={cn(
                      "w-4 h-4 flex-shrink-0",
                      active ? "text-white" : item.color
                    )}
                  />
                </div>
                
                {(!sidebarCollapsed || isMobile) && (
                  <div className="flex items-center w-full min-w-0 ml-3">
                    <span className="flex-grow truncate">{item.name}</span>
                    {badgeCount > 0 && (
                      <span className="ml-2 bg-rose-500 text-white text-xs px-2 py-1 rounded-full flex-shrink-0 min-w-[1.25rem] text-center">
                        {badgeCount > 99 ? "99+" : badgeCount}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Footer */}
        {(!sidebarCollapsed || isMobile) && user && (
          <div className="p-4 border-t border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="font-semibold text-white">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </span>
              </div>
              <div className="overflow-hidden">
                <p className="font-medium truncate text-white">{user.name || "User"}</p>
                <p className="text-xs text-slate-300 truncate">{user.email || ""}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}