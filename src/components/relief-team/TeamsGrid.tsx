// "use client";

// import React, { useState, useMemo, useEffect } from "react";
// import { TeamCard } from "./TeamCard";
// import { ReliefTeam } from "@/types/relief-team";
// import { Loader2 } from "lucide-react";
// import { Button } from "../ui/button";

// interface TeamsGridProps {
//   teams: ReliefTeam[];
//   loading: boolean;
//   onViewDetails: (team: ReliefTeam) => void;
//   onEdit: (team: ReliefTeam) => void;
//   onDelete: (team: ReliefTeam) => void;
//   itemsPerPage?: number;
//   sortKey?: "name" | "numberOfMembers";
//   sortOrder?: "asc" | "desc";
//   onSortChange: (sortKey: "name" | "numberOfMembers", sortOrder: "asc" | "desc") => void;
// }

// export const TeamsGrid: React.FC<TeamsGridProps> = ({
//   teams,
//   loading,
//   onViewDetails,
//   onEdit,
//   onDelete,
//   itemsPerPage = 9,
//   sortKey = "name",
//   sortOrder = "asc",
//   onSortChange,
// }) => {
//   const [currentPage, setCurrentPage] = useState(1);

//   // Reset page when teams list changes
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [teams]);

//   // Sort teams
//   const sortedTeams = useMemo(() => {
//     if (!teams) return [];
//     const sorted = [...teams];
//     sorted.sort((a, b) => {
//       let valA, valB;
//       if (sortKey === "name") {
//         valA = a.name?.toLowerCase() || "";
//         valB = b.name?.toLowerCase() || "";
//         if (valA < valB) return sortOrder === "asc" ? -1 : 1;
//         if (valA > valB) return sortOrder === "asc" ? 1 : -1;
//         return 0;
//       } else {
//         valA = a.numberOfMembers ?? 0;
//         valB = b.numberOfMembers ?? 0;
//         return sortOrder === "asc" ? valA - valB : valB - valA;
//       }
//     });
//     return sorted;
//   }, [teams, sortKey, sortOrder]);

//   // Pagination
//   const totalPages = Math.ceil(sortedTeams.length / itemsPerPage);
//   const paginatedTeams = useMemo(() => {
//     const start = (currentPage - 1) * itemsPerPage;
//     return sortedTeams.slice(start, start + itemsPerPage);
//   }, [sortedTeams, currentPage, itemsPerPage]);

//   // Handlers
//   const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
//   const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

//   // Loading skeleton component
//   const SkeletonCard = () => (
//     <div className="animate-pulse p-4 border rounded bg-gray-100 h-60" />
//   );

//   return (
//     <>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]">
//         {loading
//           ? Array.from({ length: itemsPerPage }).map((_, idx) => <SkeletonCard key={idx} />)
//           : paginatedTeams.map((team) => (
//               <TeamCard
//                 key={team.id}
//                 team={team}
//                 onViewDetails={onViewDetails}
//                 onEdit={onEdit}
//                 onDelete={onDelete}
//               />
//             ))}
//       </div>

//       {!loading && totalPages > 1 && (
//         <div className="flex justify-center items-center gap-4 mt-4">
//           <Button disabled={currentPage === 1} onClick={handlePrev}>
//             Previous
//           </Button>
//           <span>
//             Page {currentPage} of {totalPages}
//           </span>
//           <Button disabled={currentPage === totalPages} onClick={handleNext}>
//             Next
//           </Button>
//         </div>
//       )}

//       {!loading && teams.length === 0 && (
//         <div className="text-center text-gray-500 mt-20 text-lg">No teams found.</div>
//       )}
//     </>
//   );
// };


"use client"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
import { TeamCard } from "./TeamCard"
import type { ReliefTeam } from "@/types/relief-team"
import { Grid3X3, Users } from "lucide-react"
import { Button } from "../ui/button"

interface TeamsGridProps {
  teams: ReliefTeam[]
  loading: boolean
  onViewDetails: (team: ReliefTeam) => void
  onEdit: (team: ReliefTeam) => void
  onDelete: (team: ReliefTeam) => void
  itemsPerPage?: number
  sortKey?: "name" | "numberOfMembers"
  sortOrder?: "asc" | "desc"
  onSortChange: (sortKey: "name" | "numberOfMembers", sortOrder: "asc" | "desc") => void
}

export const TeamsGrid: React.FC<TeamsGridProps> = ({
  teams,
  loading,
  onViewDetails,
  onEdit,
  onDelete,
  itemsPerPage = 9,
  sortKey = "name",
  sortOrder = "asc",
  onSortChange,
}) => {
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setCurrentPage(1)
  }, [teams])

  const sortedTeams = useMemo(() => {
    if (!teams) return []
    const sorted = [...teams]
    sorted.sort((a, b) => {
      let valA, valB
      if (sortKey === "name") {
        valA = a.name?.toLowerCase() || ""
        valB = b.name?.toLowerCase() || ""
        if (valA < valB) return sortOrder === "asc" ? -1 : 1
        if (valA > valB) return sortOrder === "asc" ? 1 : -1
        return 0
      } else {
        valA = a.numberOfMembers ?? 0
        valB = b.numberOfMembers ?? 0
        return sortOrder === "asc" ? valA - valB : valB - valA
      }
    })
    return sorted
  }, [teams, sortKey, sortOrder])

  const totalPages = Math.ceil(sortedTeams.length / itemsPerPage)
  const paginatedTeams = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return sortedTeams.slice(start, start + itemsPerPage)
  }, [sortedTeams, currentPage, itemsPerPage])

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1))
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1))

  const SkeletonCard = () => (
    <div className="animate-pulse rounded-2xl border border-gray-100 bg-white p-6 h-80">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
      </div>
      <div className="h-12 bg-gray-200 rounded-lg mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="flex gap-2 mt-6">
        <div className="h-10 bg-gray-200 rounded-lg flex-1"></div>
        <div className="h-10 bg-gray-200 rounded-lg flex-1"></div>
        <div className="h-10 bg-gray-200 rounded-lg w-12"></div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Results Header */}
      {!loading && (
        <div className="flex items-center justify-between bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <Grid3X3 className="h-5 w-5 text-gray-400" />
            <span className="text-gray-600">
              Showing {paginatedTeams.length} of {sortedTeams.length} teams
            </span>
          </div>
          {totalPages > 1 && (
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
          )}
        </div>
      )}

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]">
        {loading
          ? Array.from({ length: itemsPerPage }).map((_, idx) => <SkeletonCard key={idx} />)
          : paginatedTeams.map((team) => (
              <TeamCard key={team.id} team={team} onViewDetails={onViewDetails} onEdit={onEdit} onDelete={onDelete} />
            ))}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 bg-white rounded-xl p-4 border border-gray-100">
          <Button
            disabled={currentPage === 1}
            onClick={handlePrev}
            variant="outline"
            className="rounded-lg px-6 bg-transparent"
          >
            Previous
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className="w-10 h-10 rounded-lg"
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>
          <Button
            disabled={currentPage === totalPages}
            onClick={handleNext}
            variant="outline"
            className="rounded-lg px-6 bg-transparent"
          >
            Next
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!loading && teams.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="p-4 bg-gray-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Users className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No teams found</h3>
          <p className="text-gray-600 mb-6">Get started by creating your first relief team.</p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">Create Team</Button>
        </div>
      )}
    </div>
  )
}
