// import React, { useState, useEffect } from "react";
// import { useActivityStore } from "@/store/activityStore";
// import { Button } from "@/components/ui/button";
// import { PlusIcon } from "lucide-react";

// import { Skeleton } from "@/components/ui/skeleton";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { ACTIVITY_TYPES } from "@/types/activity";
// import { ActivityStatsCard } from "@/components/activity/ActivityStatsCard";
// import ActivityCard from "@/components/activity/ActivityCard";
// import { ActivityForm } from "@/components/activity/ActivityForm";
// import { ActivityDetails } from "@/components/activity/ActivityDetails";

// const ActivityPage = () => {
//   const {
//     activities,
//     currentActivity,
//     stats,
//     loading,
//     fetchActivities,
//     fetchActivity,
//     createNewActivity,
//     updateExistingActivity,
//     removeActivity,
//     fetchStats,
//   } = useActivityStore();

//   const [showForm, setShowForm] = useState(false);
//   const [showDetails, setShowDetails] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterType, setFilterType] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     fetchActivities();
//     fetchStats();
//   }, [fetchActivities, fetchStats]);

//   const handleCreate = () => {
//     setShowForm(true);
//   };

//   const handleEdit = (id: number) => {
//     fetchActivity(id);
//     setShowForm(true);
//   };

//   const handleView = (id: number) => {
//     fetchActivity(id);
//     setShowDetails(true);
//   };

//   const handleDelete = async (id: number) => {
//     if (window.confirm("Are you sure you want to delete this activity?")) {
//       await removeActivity(id);
//     }
//   };

//   const handleSubmit = async (data: any) => {
//     setIsSubmitting(true);
//     try {
//       if (data.id) {
//         await updateExistingActivity(data);
//       } else {
//         await createNewActivity(data);
//       }
//       setShowForm(false);
//     } catch (error) {
//       console.error("Error saving activity:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const filteredActivities = activities.filter((activity) => {
//     const matchesSearch =
//       activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       activity.description.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesType = filterType
//       ? activity.activityType === filterType
//       : true;
//     return matchesSearch && matchesType;
//   });

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">
//             Relief Team Activities
//           </h1>
//           <p className="text-gray-600 mt-2">
//             Track and manage all relief team activities in the system
//           </p>
//         </div>
//         <Button onClick={handleCreate}>
//           <PlusIcon className="h-5 w-5 mr-2" />
//           Create Activity
//         </Button>
//       </div>

//       {/* Stats Card */}
//       {stats && <ActivityStatsCard stats={stats} />}

//       {/* Filters */}
//       <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
//         <Input
//           placeholder="Search activities..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />

//         <Select value={filterType} onValueChange={setFilterType}>
//           <SelectTrigger>
//             <SelectValue placeholder="Filter by type" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Types</SelectItem>
//             {ACTIVITY_TYPES.map((type) => (
//               <SelectItem key={type} value={type}>
//                 {type}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>

//       {/* Activity List */}
//       <div className="mt-8">
//         {loading ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {[...Array(6)].map((_, i) => (
//               <div key={i} className="border rounded-xl p-4">
//                 <div className="animate-pulse space-y-4">
//                   <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//                   <div className="h-4 bg-gray-200 rounded"></div>
//                   <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : filteredActivities.length === 0 ? (
//           <div className="text-center py-12">
//             <div className="text-gray-500">No activities found</div>
//             <Button
//               className="mt-4"
//               onClick={() => {
//                 setSearchTerm("");
//                 setFilterType("");
//               }}
//             >
//               Clear filters
//             </Button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredActivities.map((activity) => (
//               <ActivityCard
//                 key={activity.id}
//                 activity={activity}
//                 onView={() => handleView(activity.id)}
//                 onEdit={() => handleEdit(activity.id)}
//                 onDelete={() => handleDelete(activity.id)}
//               />
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Activity Form Modal */}
//       {showForm && (
//         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
//             <div className="p-6">
//               <h2 className="text-2xl font-bold mb-6">
//                 {currentActivity ? "Edit Activity" : "Create New Activity"}
//               </h2>
//               <ActivityForm
//                 initialData={currentActivity ?? undefined}
//                 onSubmit={handleSubmit}
//                 onCancel={() => {
//                   setShowForm(false);
//                   useActivityStore.setState({ currentActivity: null });
//                 }}
//                 isSubmitting={isSubmitting}
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Activity Details Modal */}
//       {showDetails && currentActivity && (
//         <ActivityDetails
//           activity={currentActivity}
//           onClose={() => {
//             setShowDetails(false);
//             useActivityStore.setState({ currentActivity: null });
//           }}
//           onEdit={() => {
//             setShowDetails(false);
//             setShowForm(true);
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default ActivityPage;

// import React, { useState, useEffect, useMemo } from "react";
// import { useActivityStore } from "@/store/activityStore";
// import { Button } from "@/components/ui/button";
// import { PlusIcon, Loader2 } from "lucide-react";

// import { Skeleton } from "@/components/ui/skeleton";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { ACTIVITY_TYPES } from "@/types/activity";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { ActivityStatsCard } from "@/components/activity/ActivityStatsCard";
// import ActivityCard from "@/components/activity/ActivityCard";
// import { ActivityForm } from "@/components/activity/ActivityForm";
// import { ActivityDetails } from "@/components/activity/ActivityDetails";
// import { LoadMoreButton } from "@/components/activity/LoadMoreButton";

// const ActivityPage = () => {
//   const {
//     activities,
//     currentActivity,
//     stats,
//     loading,
//     fetchActivities,
//     fetchActivity,
//     createNewActivity,
//     updateExistingActivity,
//     removeActivity,
//     reliefTeams, // Add this
//     fetchStats,
//   } = useActivityStore();

//   const [showForm, setShowForm] = useState(false);
//   const [showDetails, setShowDetails] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterType, setFilterType] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
//   const [activityToDelete, setActivityToDelete] = useState<number | null>(null);
//   const [deletingId, setDeletingId] = useState<number | null>(null);
//   const [pageSize, setPageSize] = useState(6);
//   const [visibleCount, setVisibleCount] = useState(pageSize);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [reliefTeamFilter, setReliefTeamFilter] = useState(""); // Add this state
//   const filteredActivities = activities.filter((activity) => {
//     const matchesSearch =
//       activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       activity.description.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesType = filterType
//       ? activity.activityType === filterType
//       : true;
//     return matchesSearch && matchesType;
//   });
//   // Sort activities by date (newest first)
//   const sortedActivities = useMemo(() => {
//     return [...filteredActivities].sort(
//       (a, b) =>
//         new Date(b.activityDate).getTime() - new Date(a.activityDate).getTime()
//     );
//   }, [filteredActivities]);

//   // Slice activities to visible count
//   const visibleActivities = useMemo(() => {
//     return sortedActivities.slice(0, visibleCount);
//   }, [sortedActivities, visibleCount]);

//   // Check if there are more activities to load
//   const hasMore = useMemo(() => {
//     return visibleCount < sortedActivities.length;
//   }, [visibleCount, sortedActivities.length]);

//   const handleLoadMore = () => {
//     setLoadingMore(true);
//     // Simulate network delay
//     setTimeout(() => {
//       setVisibleCount((prev) => prev + pageSize);
//       setLoadingMore(false);
//     }, 300);
//   };

//   // Reset visible count when filters change
//   useEffect(() => {
//     setVisibleCount(pageSize);
//   }, [searchTerm, filterType, pageSize]);

//   useEffect(() => {
//     fetchActivities();
//     fetchStats();
//   }, [fetchActivities, fetchStats]);

//   const handleCreate = () => {
//     useActivityStore.setState({ currentActivity: null }); // clear edit form data
//     setShowForm(true);
//   };

//   const handleEdit = (id: number) => {
//     fetchActivity(id);
//     setShowForm(true);
//   };

//   const handleView = (id: number) => {
//     fetchActivity(id);
//     setShowDetails(true);
//   };

//   const handleDeleteClick = (id: number) => {
//     setActivityToDelete(id);
//     setDeleteConfirmOpen(true);
//   };

//   const confirmDelete = async () => {
//     if (activityToDelete) {
//       setDeletingId(activityToDelete);
//       await removeActivity(activityToDelete);
//       setDeleteConfirmOpen(false);
//       setActivityToDelete(null);
//       setDeletingId(null);
//     }
//   };

//   const handleSubmit = async (data: any) => {
//     setIsSubmitting(true);
//     try {
//       if (data.id) {
//         await updateExistingActivity(data);
//       } else {
//         await createNewActivity(data);
//       }
//       setShowForm(false);
//     } catch (error) {
//       console.error("Error saving activity:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">
//             Relief Team Activities
//           </h1>
//           <p className="text-gray-600 mt-2">
//             Track and manage all relief team activities in the system
//           </p>
//         </div>
//         <Button onClick={handleCreate} disabled={loading}>
//           <PlusIcon className="h-5 w-5 mr-2" />
//           Create Activity
//         </Button>
//       </div>

//       {/* Stats Card */}
//       {loading ? (
//         <div className="h-64 flex items-center justify-center">
//           <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
//         </div>
//       ) : stats ? (
//         <ActivityStatsCard stats={stats} />
//       ) : (
//         <div className="bg-gray-100 rounded-lg p-8 text-center">
//           <p className="text-gray-500">No statistics available</p>
//         </div>
//       )}

//       {/* FILTER SECTION - FIXED TO FULL WIDTH */}
//       <div className="mt-8 w-full">
//         <div className="flex flex-col md:flex-row gap-4 w-full">
//           {/* Search Input */}
//           <div className="w-full md:w-2/3">
//             <Input
//               placeholder="Search activities..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               disabled={loading}
//               className="w-full"
//             />
//           </div>

//           {/* Filter Select */}
//           <div className="w-full md:w-1/3">
//             <Select value={filterType} onValueChange={setFilterType}>
//               <SelectTrigger className="w-full">
//                 <SelectValue placeholder="Filter by type" />
//               </SelectTrigger>
//               <SelectContent>
//                 {/* Changed value to "all" */}
//                 <SelectItem value="all">All Types</SelectItem>
//                 {ACTIVITY_TYPES.map((type) => (
//                   <SelectItem key={type} value={type}>
//                     {type}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         </div>
//       </div>

//       {/* Activity List */}
//       <div className="mt-8">
//         {loading ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {[...Array(6)].map((_, index) => (
//               <Skeleton key={index} className="h-64 rounded-xl" />
//             ))}
//           </div>
//         ) : filteredActivities.length === 0 ? (
//           <div className="text-center py-12">
//             <div className="text-gray-500">No activities found</div>
//             <Button
//               className="mt-4"
//               onClick={() => {
//                 setSearchTerm("");
//                 setFilterType("");
//               }}
//             >
//               Clear filters
//             </Button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {visibleActivities.map((activity) => (
//               <ActivityCard
//                 key={activity.id}
//                 activity={activity}
//                 onView={() => handleView(activity.id)}
//                 onEdit={() => handleEdit(activity.id)}
//                 isAdmin={true}
//                 onDelete={() => handleDeleteClick(activity.id)}
//                 isDeleting={deletingId === activity.id}
//               />
//             ))}
//           </div>
//         )}

//         {/* Load More Button */}
//         <LoadMoreButton
//           onClick={handleLoadMore}
//           isLoading={loadingMore}
//           hasMore={hasMore && !loading}
//         />
//       </div>

//       {/* Activity Form Modal */}
//       {showForm && (
//         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
//             <div className="p-6">
//               {/* <h2 className="text-2xl font-bold mb-6">
//                 {currentActivity ? 'Edit Activity' : 'Create New Activity'}
//               </h2> */}
//               <ActivityForm
//                 initialData={currentActivity}
//                 onSubmit={handleSubmit}
//                 onCancel={() => {
//                   setShowForm(false);
//                   useActivityStore.setState({ currentActivity: null });
//                 }}
//                 isSubmitting={isSubmitting || loading}
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Activity Details Modal */}
//       {showDetails && currentActivity && (
//         <ActivityDetails
//           activity={currentActivity}
//           onClose={() => {
//             setShowDetails(false);
//             useActivityStore.setState({ currentActivity: null });
//           }}
//           onEdit={() => {
//             setShowDetails(false);
//             setShowForm(true);
//           }}
//         />
//       )}

//       {/* Delete Confirmation Dialog */}
//       <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Confirm Deletion</DialogTitle>
//           </DialogHeader>
//           <div className="py-4">
//             <p>
//               Are you sure you want to delete this activity? This action cannot
//               be undone.
//             </p>
//           </div>
//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => setDeleteConfirmOpen(false)}
//               disabled={loading}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="destructive"
//               onClick={confirmDelete}
//               disabled={loading}
//             >
//               {loading ? (
//                 <Loader2 className="h-4 w-4 animate-spin" />
//               ) : (
//                 "Delete Activity"
//               )}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default ActivityPage;

import React, { useState, useEffect, useMemo } from "react";
import { useActivityStore } from "@/store/activityStore";
import { Button } from "@/components/ui/button";
import { PlusIcon, Loader2 } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ACTIVITY_TYPES } from "@/types/activity";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ActivityStatsCard } from "@/components/activity/ActivityStatsCard";
import ActivityCard from "@/components/activity/ActivityCard";
import { ActivityForm } from "@/components/activity/ActivityForm";
import { ActivityDetails } from "@/components/activity/ActivityDetails";
import { LoadMoreButton } from "@/components/activity/LoadMoreButton";

const ActivityPage = () => {
  const {
    activities,
    currentActivity,
    stats,
    loading,
    fetchActivities,
    fetchActivity,
    createNewActivity,
    updateExistingActivity,
    removeActivity,
    reliefTeams,
    fetchStats,
    fetchReliefTeams, // Add this
  } = useActivityStore();

  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [reliefTeamFilter, setReliefTeamFilter] = useState("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [pageSize] = useState(6);
  const [visibleCount, setVisibleCount] = useState(6);
  const [loadingMore, setLoadingMore] = useState(false);
  console.log(reliefTeams, "relief teams");

  // Filter logic
  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      filterType === "all" ? true : activity.activityType === filterType;

    const matchesTeam =
      reliefTeamFilter === "all"
        ? true
        : activity.reliefTeamId === parseInt(reliefTeamFilter);

    return matchesSearch && matchesType && matchesTeam;
  });

  // Sort newest first
  const sortedActivities = useMemo(() => {
    return [...filteredActivities].sort(
      (a, b) =>
        new Date(b.activityDate).getTime() - new Date(a.activityDate).getTime()
    );
  }, [filteredActivities]);

  const visibleActivities = useMemo(() => {
    return sortedActivities.slice(0, visibleCount);
  }, [sortedActivities, visibleCount]);

  const hasMore = visibleCount < sortedActivities.length;

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + pageSize);
      setLoadingMore(false);
    }, 300);
  };

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [searchTerm, filterType, reliefTeamFilter, pageSize]);

  useEffect(() => {
    fetchActivities();
    fetchStats();
    fetchReliefTeams(); // Fetch relief teams
  }, [fetchActivities, fetchStats, fetchReliefTeams]);
  const handleCreate = () => {
    useActivityStore.setState({ currentActivity: null });
    setShowForm(true);
  };

  const handleEdit = (id: number) => {
    fetchActivity(id);
    setShowForm(true);
  };

  const handleView = (id: number) => {
    fetchActivity(id);
    setShowDetails(true);
  };

  const handleDeleteClick = (id: number) => {
    setActivityToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (activityToDelete) {
      setDeletingId(activityToDelete);
      await removeActivity(activityToDelete);
      setDeleteConfirmOpen(false);
      setActivityToDelete(null);
      setDeletingId(null);
    }
  };

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (data.id) {
        await updateExistingActivity(data);
      } else {
        await createNewActivity(data);
      }
      setShowForm(false);
    } catch (error) {
      console.error("Error saving activity:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Relief Team Activities
          </h1>
          <p className="text-gray-600 mt-2">
            Track and manage all relief team activities in the system
          </p>
        </div>
        <Button onClick={handleCreate} disabled={loading}>
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Activity
        </Button>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        </div>
      ) : stats ? (
        <ActivityStatsCard stats={stats} />
      ) : (
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <p className="text-gray-500">No statistics available</p>
        </div>
      )}

      {/* Filters */}
      {/* Filters */}
      <div className="mt-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
          {/* Search */}
          <div>
            <Input
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
              className="w-full h-11 rounded-lg"
            />
          </div>

          {/* Type Filter */}
          <div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full h-11 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="w-[var(--radix-select-trigger-width)]">
                <SelectItem value="all">All Types</SelectItem>
                {ACTIVITY_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Team Filter */}
          <div>
            <Select
              value={reliefTeamFilter}
              onValueChange={setReliefTeamFilter}
            >
              <SelectTrigger className="w-full h-11 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500">
                <SelectValue placeholder="Team" />
              </SelectTrigger>
              <SelectContent className="w-[var(--radix-select-trigger-width)]">
                <SelectItem value="all">All Teams</SelectItem>
                {reliefTeams.map((team) => (
                  <SelectItem key={team.id} value={team.id.toString()}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters */}
          <div>
            <Button
              variant="outline"
              className="w-full h-11"
              onClick={() => {
                setSearchTerm("");
                setFilterType("all");
                setReliefTeamFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className="mt-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Skeleton key={index} className="h-64 rounded-xl" />
            ))}
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500">No activities found</div>
            <Button
              className="mt-4"
              onClick={() => {
                setSearchTerm("");
                setFilterType("all");
                setReliefTeamFilter("all");
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onView={() => handleView(activity.id)}
                onEdit={() => handleEdit(activity.id)}
                isAdmin={true}
                onDelete={() => handleDeleteClick(activity.id)}
                isDeleting={deletingId === activity.id}
              />
            ))}
          </div>
        )}

        <LoadMoreButton
          onClick={handleLoadMore}
          isLoading={loadingMore}
          hasMore={hasMore && !loading}
        />
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <ActivityForm
                initialData={currentActivity}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false);
                  useActivityStore.setState({ currentActivity: null });
                }}
                isSubmitting={isSubmitting || loading}
              />
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetails && currentActivity && (
        <ActivityDetails
          activity={currentActivity}
          onClose={() => {
            setShowDetails(false);
            useActivityStore.setState({ currentActivity: null });
          }}
          onEdit={() => {
            setShowDetails(false);
            setShowForm(true);
          }}
        />
      )}

      {/* Delete Confirmation */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete this activity? This action cannot
              be undone.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete Activity"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActivityPage;
