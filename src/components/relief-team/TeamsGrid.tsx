"use client";

import React, { useState, useMemo, useEffect } from "react";
import { TeamCard } from "./TeamCard";
import { ReliefTeam } from "@/types/relief-team";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";

interface TeamsGridProps {
  teams: ReliefTeam[];
  loading: boolean;
  onViewDetails: (team: ReliefTeam) => void;
  onEdit: (team: ReliefTeam) => void;
  onDelete: (team: ReliefTeam) => void;
  itemsPerPage?: number;
  sortKey?: "name" | "numberOfMembers";
  sortOrder?: "asc" | "desc";
  onSortChange: (sortKey: "name" | "numberOfMembers", sortOrder: "asc" | "desc") => void;
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
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when teams list changes
  useEffect(() => {
    setCurrentPage(1);
  }, [teams]);

  // Sort teams
  const sortedTeams = useMemo(() => {
    if (!teams) return [];
    const sorted = [...teams];
    sorted.sort((a, b) => {
      let valA, valB;
      if (sortKey === "name") {
        valA = a.name?.toLowerCase() || "";
        valB = b.name?.toLowerCase() || "";
        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      } else {
        valA = a.numberOfMembers ?? 0;
        valB = b.numberOfMembers ?? 0;
        return sortOrder === "asc" ? valA - valB : valB - valA;
      }
    });
    return sorted;
  }, [teams, sortKey, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedTeams.length / itemsPerPage);
  const paginatedTeams = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedTeams.slice(start, start + itemsPerPage);
  }, [sortedTeams, currentPage, itemsPerPage]);

  // Handlers
  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  // Loading skeleton component
  const SkeletonCard = () => (
    <div className="animate-pulse p-4 border rounded bg-gray-100 h-60" />
  );

  return (
    <>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]">
        {loading
          ? Array.from({ length: itemsPerPage }).map((_, idx) => <SkeletonCard key={idx} />)
          : paginatedTeams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                onViewDetails={onViewDetails}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
      </div>

      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <Button disabled={currentPage === 1} onClick={handlePrev}>
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button disabled={currentPage === totalPages} onClick={handleNext}>
            Next
          </Button>
        </div>
      )}

      {!loading && teams.length === 0 && (
        <div className="text-center text-gray-500 mt-20 text-lg">No teams found.</div>
      )}
    </>
  );
};
