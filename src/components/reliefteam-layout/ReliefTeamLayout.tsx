// import { useEffect } from "react";
// import { Outlet, useLocation } from "react-router-dom";
// import { useAdminStore } from "../../store/adminStore";
// import { cn } from "../../lib/utils";
// import { ReliefTeamSidebar } from "./Sidebar";
// import { ReliefTeamNavbarExtras } from "./Navbar";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { Toaster } from "sonner";

// function ReliefTeamLayout() {
//   const initializeData = useAdminStore((s) => s.initializeData);
//   const sidebarCollapsed = useAdminStore((s) => s.sidebarCollapsed);
//   const toggleSidebar = useAdminStore((s) => s.toggleSidebar);
//   const activeTab = useAdminStore((s) => s.activeTab);
//   const setActiveTab = useAdminStore((s) => s.setActiveTab);

//   const location = useLocation();

//   useEffect(() => {
//     initializeData();

//     const pathParts = location.pathname.split("/");
//     const currentPath = pathParts[pathParts.length - 1];

//     const tabMap: Record<string, string> = {
//       dashboard: "dashboard",
//       members: "members",
//       requests: "requests",
//       donations: "donations",
//       "": "dashboard",
//     };

//     const newActiveTab = tabMap[currentPath] || "assignments";
//     if (activeTab !== newActiveTab) setActiveTab(newActiveTab);
//   }, [location.pathname, initializeData, setActiveTab, activeTab]);

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Sidebar */}
//       <aside
//         className={cn(
//           "fixed top-0 left-0 h-full bg-white border-r border-gray-200 shadow transition-width duration-300 z-50",
//           sidebarCollapsed ? "w-16" : "w-64"
//         )}
//       >
//         {/* Sidebar Header */}
//         <div className="flex items-center justify-between p-4 border-b border-gray-200">
//           {!sidebarCollapsed && (
//             <div className="text-lg font-semibold text-gray-700">
//               DisasterGuard
//             </div>
//           )}
//           <button
//             onClick={toggleSidebar}
//             aria-label="Toggle sidebar"
//             className="text-gray-700 hover:text-gray-800 focus:outline-none"
//           >
//             {sidebarCollapsed ? (
//               <ChevronRight className="w-5 h-5" />
//             ) : (
//               <ChevronLeft className="w-5 h-5" />
//             )}
//           </button>
//         </div>

//         {/* Nav - put links here */}
//         <ReliefTeamSidebar />
//       </aside>

//       {/* Main content */}
//       <div
//         className={cn(
//           "flex-1 flex flex-col transition-margin duration-300",
//           sidebarCollapsed ? "ml-16" : "ml-64"
//         )}
//       >
//         <nav className="h-14 bg-gray-600 flex items-center px-4 text-white shadow">
//           <h1 className="text-xl font-semibold">Relief Team Dashboard</h1>
//           <ReliefTeamNavbarExtras />
//         </nav>
//         <main className="flex-1 overflow-auto p-6">
//           <Outlet />
//         </main>
//       </div>
//        <Toaster position="top-right" richColors closeButton />
//     </div>
//   );
// }

// export default ReliefTeamLayout;


// ReliefTeamLayout.tsx
// import { useEffect } from "react";
// import { Outlet, useLocation, useNavigate } from "react-router-dom";
// import { useAdminStore } from "../../store/adminStore";
// import { cn } from "../../lib/utils";
// import { ReliefTeamSidebar } from "./Sidebar";
// import { ReliefTeamNavbarExtras } from "./Navbar";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { Toaster } from "sonner";

// function ReliefTeamLayout() {
//   const initializeData = useAdminStore((s) => s.initializeData);
//   const sidebarCollapsed = useAdminStore((s) => s.sidebarCollapsed);
//   const toggleSidebar = useAdminStore((s) => s.toggleSidebar);
//   const activeTab = useAdminStore((s) => s.activeTab);
//   const setActiveTab = useAdminStore((s) => s.setActiveTab);

//   const location = useLocation();
//   const navigate = useNavigate();

//   useEffect(() => {
//     initializeData();

//     // Set active tab based on current path
//     const pathParts = location.pathname.split("/");
//     const currentPath = pathParts[pathParts.length - 1];
    
//     // If we're at the root of relief, redirect to assignments
//     if (currentPath === "relief" || currentPath === "") {
//       navigate("assignments", { replace: true });
//       setActiveTab("assignments");
//       return;
//     }

//     const tabMap: Record<string, string> = {
//       dashboard: "dashboard",
//       assignments: "assignments",
//       activities: "activities",
//     };

//     const newActiveTab = tabMap[currentPath] || "assignments";
//     if (activeTab !== newActiveTab) setActiveTab(newActiveTab);
//   }, [location.pathname, initializeData, setActiveTab, activeTab, navigate]);

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Sidebar */}
//       <aside
//         className={cn(
//           "fixed top-0 left-0 h-full bg-white border-r border-gray-200 shadow transition-width duration-300 z-50",
//           sidebarCollapsed ? "w-16" : "w-64"
//         )}
//       >
//         {/* Sidebar Header */}
//         <div className="flex items-center justify-between p-4 border-b border-gray-200">
//           {!sidebarCollapsed && (
//             <div className="text-lg font-semibold text-gray-700">
//               DisasterGuard
//             </div>
//           )}
//           <button
//             onClick={toggleSidebar}
//             aria-label="Toggle sidebar"
//             className="text-gray-700 hover:text-gray-800 focus:outline-none"
//           >
//             {sidebarCollapsed ? (
//               <ChevronRight className="w-5 h-5" />
//             ) : (
//               <ChevronLeft className="w-5 h-5" />
//             )}
//           </button>
//         </div>

//         {/* Navigation */}
//         <ReliefTeamSidebar />
//       </aside>

//       {/* Main content */}
//       <div
//         className={cn(
//           "flex-1 flex flex-col transition-margin duration-300",
//           sidebarCollapsed ? "ml-16" : "ml-64"
//         )}
//       >
//         <nav className="h-14 bg-gray-600 flex items-center px-4 text-white shadow">
//           <h1 className="text-xl font-semibold">Relief Team Dashboard</h1>
//           <ReliefTeamNavbarExtras />
//         </nav>
//         <main className="flex-1 overflow-auto p-6">
//           <Outlet />
//         </main>
//       </div>
//       <Toaster position="top-right" richColors closeButton />
//     </div>
//   );
// }

// export default ReliefTeamLayout;


// ReliefTeamLayout.tsx
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAdminStore } from "../../store/adminStore";
import { cn } from "../../lib/utils";
import { ReliefTeamSidebar } from "./Sidebar";
import { ReliefTeamNavbarExtras } from "./Navbar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Toaster } from "sonner";

function ReliefTeamLayout() {
  const initializeData = useAdminStore((s) => s.initializeData);
  const sidebarCollapsed = useAdminStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useAdminStore((s) => s.toggleSidebar);
  const activeTab = useAdminStore((s) => s.activeTab);
  const setActiveTab = useAdminStore((s) => s.setActiveTab);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    initializeData();

    // Set active tab based on current path
    const pathParts = location.pathname.split("/");
    const currentPath = pathParts[pathParts.length - 1];
    
    // If we're at the root of relief, redirect to assignments
    if (currentPath === "relief" || currentPath === "") {
      navigate("assignments", { replace: true });
      setActiveTab("assignments");
      return;
    }

    const tabMap: Record<string, string> = {
      dashboard: "dashboard",
      assignments: "assignments",
      activities: "activities",
    };

    const newActiveTab = tabMap[currentPath] || "assignments";
    if (activeTab !== newActiveTab) setActiveTab(newActiveTab);
  }, [location.pathname, initializeData, setActiveTab, activeTab, navigate]);

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full bg-slate-900 border-r border-slate-700 shadow-lg transition-all duration-300 z-50",
          sidebarCollapsed ? "w-20" : "w-64"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          {!sidebarCollapsed && (
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-md bg-blue-500 flex items-center justify-center mr-2">
                <span className="text-white font-bold">DG</span>
              </div>
              <div className="text-lg font-semibold text-white">
                DisasterGuard
              </div>
            </div>
          )}
          {sidebarCollapsed && (
            <div className="w-8 h-8 rounded-md bg-blue-500 flex items-center justify-center mx-auto">
              <span className="text-white font-bold">DG</span>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            className="text-slate-400 hover:text-white hover:bg-slate-800 p-1 rounded-md transition-colors"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <ReliefTeamSidebar />
        
        {/* Sidebar Footer */}
        {!sidebarCollapsed && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
            <div className="text-xs text-slate-400 text-center">
              DisasterGuard v1.0
            </div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          sidebarCollapsed ? "ml-20" : "ml-64"
        )}
      >
        <nav className="h-16 bg-white border-b border-slate-200 flex items-center px-6 text-slate-800 shadow-sm">
          <h1 className="text-xl font-semibold">Relief Team Dashboard</h1>
          <ReliefTeamNavbarExtras />
        </nav>
        <main className="flex-1 overflow-auto p-6 bg-slate-50">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <Outlet />
          </div>
        </main>
      </div>
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}

export default ReliefTeamLayout;