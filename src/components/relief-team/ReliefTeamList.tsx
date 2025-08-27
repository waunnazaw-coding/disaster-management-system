// "use client";

// import React, { useState, useEffect } from "react";
// import { useReliefTeamStore } from "@/store/relief-team-store";
// import{toast} from 'sonner';
// import { Plus } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { FiltersPanel } from "./FiltersPanel";
// import { TeamsGrid } from "./TeamsGrid";
// import { ReliefTeamFormModal } from "@/components/relief-team/ReliefTeamFormModal";
// import { ReliefTeamDetailsModal } from "@/components/relief-team/ReliefTeamDetailsModal";
// import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
// import type { ReliefTeam } from "@/types/relief-team";

// export function ReliefTeamList() {
//   const {
//     teams,
//     loading,
//     error,
//     fetchTeams,
//     deleteTeam,
//     clearError,
//   } = useReliefTeamStore();

//   // Filter states with persistence in localStorage
//   const [searchTerm, setSearchTerm] = useState(() => localStorage.getItem("rt_searchTerm") || "");
//   const [statusFilter, setStatusFilter] = useState<string>(() => localStorage.getItem("rt_statusFilter") || "all");
//   const [locationFilter, setLocationFilter] = useState<string>(() => localStorage.getItem("rt_locationFilter") || "all");
//   const [specializationFilter, setSpecializationFilter] = useState<string>(() => localStorage.getItem("rt_specializationFilter") || "all");
//   const [teamSizeFilter, setTeamSizeFilter] = useState<string>(() => localStorage.getItem("rt_teamSizeFilter") || "all");

//   // Sorting
//   const [sortKey, setSortKey] = useState<"name" | "numberOfMembers">("name");
//   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

//   // Pagination handled by TeamsGrid

//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editingTeam, setEditingTeam] = useState<ReliefTeam | null>(null);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [selectedTeam, setSelectedTeam] = useState<ReliefTeam | null>(null);
//   const [deletingTeam, setDeletingTeam] = useState<ReliefTeam | null>(null);

//   // Persist filters to localStorage
//   useEffect(() => localStorage.setItem("rt_searchTerm", searchTerm), [searchTerm]);
//   useEffect(() => localStorage.setItem("rt_statusFilter", statusFilter), [statusFilter]);
//   useEffect(() => localStorage.setItem("rt_locationFilter", locationFilter), [locationFilter]);
//   useEffect(() => localStorage.setItem("rt_specializationFilter", specializationFilter), [specializationFilter]);
//   useEffect(() => localStorage.setItem("rt_teamSizeFilter", teamSizeFilter), [teamSizeFilter]);

//   useEffect(() => {
//     fetchTeams();
//   }, [fetchTeams]);

//   useEffect(() => {
//     if (error) {
//       toast.error(error);
//       clearError();
//     }
//   }, [error, clearError]);

//   // Filtering logic
//   const filteredTeams = teams.filter((team) => {
//     const searchTermLower = searchTerm.toLowerCase();

//     const matchesSearch =
//       (team.name?.toLowerCase().includes(searchTermLower) ?? false) ||
//       (team.contactInfo?.toLowerCase().includes(searchTermLower) ?? false) ||
//       (team.address?.toLowerCase().includes(searchTermLower) ?? false) ||
//       (team.specialization?.toLowerCase().includes(searchTermLower) ?? false) ||
//       (team.teamLeaderName?.toLowerCase().includes(searchTermLower) ?? false);

//     const matchesStatus = statusFilter === "all" || team.status === statusFilter;

//     const matchesLocation =
//       locationFilter === "all" ||
//       (team.address?.toLowerCase().includes(locationFilter.toLowerCase()) ?? false);

//     const matchesSpecialization =
//       specializationFilter === "all" || team.specialization === specializationFilter;

//     const membersCount = team.numberOfMembers ?? 0;
//     const matchesTeamSize =
//       teamSizeFilter === "all" ||
//       (teamSizeFilter === "small" && membersCount <= 5) ||
//       (teamSizeFilter === "medium" && membersCount >= 6 && membersCount <= 15) ||
//       (teamSizeFilter === "large" && membersCount >= 16);

//     return (
//       matchesSearch &&
//       matchesStatus &&
//       matchesLocation &&
//       matchesSpecialization &&
//       matchesTeamSize
//     );
//   });

//   const handleDelete = async () => {
//     if (!deletingTeam) return;
//     try {
//       await deleteTeam(deletingTeam.id);
//       toast.success(`Team "${deletingTeam.name}" deleted successfully`);
//     } catch (error) {
//       toast.error(
//         error instanceof Error ? error.message : "Failed to delete team"
//       );
//     } finally {
//       setDeletingTeam(null);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* <Toaster position="top-right" /> */}

//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold">Relief Teams</h1>
//           <p className="text-muted-foreground">Manage your emergency response teams</p>
//         </div>
//         <Button onClick={() => setShowCreateModal(true)}>
//           <Plus className="h-4 w-4 mr-2" /> Add Team
//         </Button>
//       </div>

//       <FiltersPanel
//         searchTerm={searchTerm}
//         onSearchChange={setSearchTerm}
//         statusFilter={statusFilter}
//         onStatusChange={setStatusFilter}
//         locationFilter={locationFilter}
//         onLocationChange={setLocationFilter}
//         specializationFilter={specializationFilter}
//         onSpecializationChange={setSpecializationFilter}
//         teamSizeFilter={teamSizeFilter}
//         onTeamSizeChange={setTeamSizeFilter}
//         onClearFilters={() => {
//           setSearchTerm("");
//           setStatusFilter("all");
//           setLocationFilter("all");
//           setSpecializationFilter("all");
//           setTeamSizeFilter("all");
//         }}
//         hasActiveFilters={
//           searchTerm !== "" ||
//           statusFilter !== "all" ||
//           locationFilter !== "all" ||
//           specializationFilter !== "all" ||
//           teamSizeFilter !== "all"
//         }
//       />

//       <TeamsGrid
//         teams={filteredTeams}
//         loading={loading}
//         onViewDetails={(team) => {
//           setSelectedTeam(team);
//           setShowDetailsModal(true);
//         }}
//         onEdit={(team) => {
//           setEditingTeam(team);
//           setShowEditModal(true);
//         }}
//         onDelete={(team) => {
//           setDeletingTeam(team);
//         }}
//         // sortKey={"name"} // Manage these in React state if you want sorting UI in TeamsGrid
//         // sortOrder={"asc"}
//         onSortChange={() => {}}
//       />

//       {showCreateModal && (
//         <ReliefTeamFormModal
//           open={showCreateModal}
//           onOpenChange={setShowCreateModal}
//           onSuccess={() => {
//             setShowCreateModal(false);
//             toast.success("Team created successfully");
//             fetchTeams();
//           }}
//         />
//       )}

//       {showEditModal && (
//         <ReliefTeamFormModal
//           open={showEditModal}
//           onOpenChange={setShowEditModal}
//           team={editingTeam}
//           onSuccess={() => {
//             setShowEditModal(false);
//             setEditingTeam(null);
//             toast.success("Team updated successfully");
//             fetchTeams();
//           }}
//         />
//       )}

//       {showDetailsModal && selectedTeam && (
//         <ReliefTeamDetailsModal
//           open={showDetailsModal}
//           onOpenChange={setShowDetailsModal}
//           team={selectedTeam}
//         />
//       )}

//       <AlertDialog open={!!deletingTeam} onOpenChange={() => setDeletingTeam(null)}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//             <AlertDialogDescription>
//               This action cannot be undone. This will permanently delete the team "
//               {deletingTeam?.name}" and remove all associated data.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={async () => {
//                 await handleDelete();
//                 fetchTeams();
//               }}
//               className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
//             >
//               Delete
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }
"use client"

import { useState, useEffect } from "react"
import { useReliefTeamStore } from "@/store/relief-team-store"
import toast, { Toaster } from "react-hot-toast"
import { Plus, Users, TrendingUp, Activity } from "lucide-react"

import { Button } from "@/components/ui/button"
import { FiltersPanel } from "./FiltersPanel"
import { TeamsGrid } from "./TeamsGrid"
import { ReliefTeamFormModal } from "@/components/relief-team/ReliefTeamFormModal"
import { ReliefTeamDetailsModal } from "@/components/relief-team/ReliefTeamDetailsModal"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Card, CardContent } from "@/components/ui/card"
import type { ReliefTeam } from "@/types/relief-team"

export function ReliefTeamList() {
  const { teams, loading, error, fetchTeams, deleteTeam, clearError } = useReliefTeamStore()

  // Filter states with persistence in localStorage
  const [searchTerm, setSearchTerm] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("rt_searchTerm") || ""
    }
    return ""
  })
  const [statusFilter, setStatusFilter] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("rt_statusFilter") || "all"
    }
    return "all"
  })
  const [locationFilter, setLocationFilter] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("rt_locationFilter") || "all"
    }
    return "all"
  })
  const [specializationFilter, setSpecializationFilter] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("rt_specializationFilter") || "all"
    }
    return "all"
  })
  const [teamSizeFilter, setTeamSizeFilter] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("rt_teamSizeFilter") || "all"
    }
    return "all"
  })

  // Sorting
  const [sortKey, setSortKey] = useState<"name" | "numberOfMembers">("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  // Pagination handled by TeamsGrid

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingTeam, setEditingTeam] = useState<ReliefTeam | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<ReliefTeam | null>(null)
  const [deletingTeam, setDeletingTeam] = useState<ReliefTeam | null>(null)

  // Persist filters to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("rt_searchTerm", searchTerm)
    }
  }, [searchTerm])
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("rt_statusFilter", statusFilter)
    }
  }, [statusFilter])
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("rt_locationFilter", locationFilter)
    }
  }, [locationFilter])
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("rt_specializationFilter", specializationFilter)
    }
  }, [specializationFilter])
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("rt_teamSizeFilter", teamSizeFilter)
    }
  }, [teamSizeFilter])

  useEffect(() => {
    fetchTeams()
  }, [fetchTeams])

  useEffect(() => {
    if (error) {
      toast.error(error)
      clearError()
    }
  }, [error, clearError])

  // Filtering logic - FIXED: Added proper null checks
  const filteredTeams = teams.filter((team) => {
    const searchTermLower = (searchTerm || '').toLowerCase()

    // Safe property access with null checks
    const teamName = team.name || ''
    const contactInfo = team.contactInfo || ''
    const address = team.address || ''
    const specialization = team.specialization || ''
    const teamLeaderName = team.teamLeaderName || ''

    const matchesSearch =
      teamName.toLowerCase().includes(searchTermLower) ||
      contactInfo.toLowerCase().includes(searchTermLower) ||
      address.toLowerCase().includes(searchTermLower) ||
      specialization.toLowerCase().includes(searchTermLower) ||
      teamLeaderName.toLowerCase().includes(searchTermLower)

    const matchesStatus = statusFilter === "all" || team.status === statusFilter

    const locationFilterLower = (locationFilter || '').toLowerCase()
    const matchesLocation =
      locationFilter === "all" ||
      (address.toLowerCase().includes(locationFilterLower))

    const matchesSpecialization = specializationFilter === "all" || team.specialization === specializationFilter

    const membersCount = team.numberOfMembers ?? 0
    const matchesTeamSize =
      teamSizeFilter === "all" ||
      (teamSizeFilter === "small" && membersCount <= 5) ||
      (teamSizeFilter === "medium" && membersCount >= 6 && membersCount <= 15) ||
      (teamSizeFilter === "large" && membersCount >= 16)

    return matchesSearch && matchesStatus && matchesLocation && matchesSpecialization && matchesTeamSize
  })

  const handleDelete = async () => {
    if (!deletingTeam) return
    try {
      await deleteTeam(deletingTeam.id)
      toast.success(`Team "${deletingTeam.name}" deleted successfully`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete team")
    } finally {
      setDeletingTeam(null)
    }
  }

  // Calculate stats
  const activeTeams = teams.filter((team) => team.status === "Active").length
  const deployedTeams = teams.filter((team) => team.status === "Deployed").length
  const totalMembers = teams.reduce((sum, team) => sum + (team.numberOfMembers ?? 0), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Relief Teams</h1>
              <p className="text-lg text-gray-600">Manage and coordinate your emergency response teams</p>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-gray-900 hover:bg-gray-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 text-base font-semibold"
            >
              <Plus className="h-5 w-5" />
              Add New Team
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 font-medium">Total Teams</p>
                    <p className="text-3xl font-bold text-blue-900">{teams.length}</p>
                  </div>
                  <div className="p-3 bg-blue-200 rounded-xl">
                    <Users className="h-8 w-8 text-blue-700" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 font-medium">Active Teams</p>
                    <p className="text-3xl font-bold text-green-900">{activeTeams}</p>
                  </div>
                  <div className="p-3 bg-green-200 rounded-xl">
                    <Activity className="h-8 w-8 text-green-700" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 font-medium">Total Members</p>
                    <p className="text-3xl font-bold text-purple-900">{totalMembers}</p>
                  </div>
                  <div className="p-3 bg-purple-200 rounded-xl">
                    <TrendingUp className="h-8 w-8 text-purple-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters Panel */}
        <FiltersPanel
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          locationFilter={locationFilter}
          onLocationChange={setLocationFilter}
          specializationFilter={specializationFilter}
          onSpecializationChange={setSpecializationFilter}
          teamSizeFilter={teamSizeFilter}
          onTeamSizeChange={setTeamSizeFilter}
          onClearFilters={() => {
            setSearchTerm("")
            setStatusFilter("all")
            setLocationFilter("all")
            setSpecializationFilter("all")
            setTeamSizeFilter("all")
          }}
          hasActiveFilters={
            searchTerm !== "" ||
            statusFilter !== "all" ||
            locationFilter !== "all" ||
            specializationFilter !== "all" ||
            teamSizeFilter !== "all"
          }
        />

        {/* Teams Grid */}
        <TeamsGrid
          teams={filteredTeams}
          loading={loading}
          onViewDetails={(team) => {
            setSelectedTeam(team)
            setShowDetailsModal(true)
          }}
          onEdit={(team) => {
            setEditingTeam(team)
            setShowEditModal(true)
          }}
          onDelete={(team) => {
            setDeletingTeam(team)
          }}
          onSortChange={() => {}}
        />

        {/* Modals */}
        {showCreateModal && (
          <ReliefTeamFormModal
            open={showCreateModal}
            onOpenChange={setShowCreateModal}
            onSuccess={() => {
              setShowCreateModal(false)
              toast.success("Team created successfully")
              fetchTeams()
            }}
          />
        )}

        {showEditModal && (
          <ReliefTeamFormModal
            open={showEditModal}
            onOpenChange={setShowEditModal}
            team={editingTeam}
            onSuccess={() => {
              setShowEditModal(false)
              setEditingTeam(null)
              toast.success("Team updated successfully")
              fetchTeams()
            }}
          />
        )}

        {showDetailsModal && selectedTeam && (
          <ReliefTeamDetailsModal open={showDetailsModal} onOpenChange={setShowDetailsModal} team={selectedTeam} />
        )}

        <AlertDialog open={!!deletingTeam} onOpenChange={() => setDeletingTeam(null)}>
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-bold">Delete Team</AlertDialogTitle>
              <AlertDialogDescription className="text-base">
                Are you sure you want to delete "{deletingTeam?.name}"? This action cannot be undone and will
                permanently remove all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  await handleDelete()
                  fetchTeams()
                }}
                className="bg-red-600 hover:bg-red-700 rounded-lg"
              >
                Delete Team
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}