"use client";

import React, { useState, useEffect } from "react";
import { useReliefTeamStore } from "@/store/relief-team-store";
import toast, { Toaster } from "react-hot-toast";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FiltersPanel } from "./FiltersPanel";
import { TeamsGrid } from "./TeamsGrid";
import { ReliefTeamFormModal } from "@/components/relief-team/ReliefTeamFormModal";
import { ReliefTeamDetailsModal } from "@/components/relief-team/ReliefTeamDetailsModal";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import type { ReliefTeam } from "@/types/relief-team";

export function ReliefTeamList() {
  const {
    teams,
    loading,
    error,
    fetchTeams,
    deleteTeam,
    clearError,
  } = useReliefTeamStore();

  // Filter states with persistence in localStorage
  const [searchTerm, setSearchTerm] = useState(() => localStorage.getItem("rt_searchTerm") || "");
  const [statusFilter, setStatusFilter] = useState<string>(() => localStorage.getItem("rt_statusFilter") || "all");
  const [locationFilter, setLocationFilter] = useState<string>(() => localStorage.getItem("rt_locationFilter") || "all");
  const [specializationFilter, setSpecializationFilter] = useState<string>(() => localStorage.getItem("rt_specializationFilter") || "all");
  const [teamSizeFilter, setTeamSizeFilter] = useState<string>(() => localStorage.getItem("rt_teamSizeFilter") || "all");

  // Sorting
  const [sortKey, setSortKey] = useState<"name" | "numberOfMembers">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Pagination handled by TeamsGrid

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<ReliefTeam | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<ReliefTeam | null>(null);
  const [deletingTeam, setDeletingTeam] = useState<ReliefTeam | null>(null);

  // Persist filters to localStorage
  useEffect(() => localStorage.setItem("rt_searchTerm", searchTerm), [searchTerm]);
  useEffect(() => localStorage.setItem("rt_statusFilter", statusFilter), [statusFilter]);
  useEffect(() => localStorage.setItem("rt_locationFilter", locationFilter), [locationFilter]);
  useEffect(() => localStorage.setItem("rt_specializationFilter", specializationFilter), [specializationFilter]);
  useEffect(() => localStorage.setItem("rt_teamSizeFilter", teamSizeFilter), [teamSizeFilter]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  // Filtering logic
  const filteredTeams = teams.filter((team) => {
    const searchTermLower = searchTerm.toLowerCase();

    const matchesSearch =
      (team.name?.toLowerCase().includes(searchTermLower) ?? false) ||
      (team.contactInfo?.toLowerCase().includes(searchTermLower) ?? false) ||
      (team.address?.toLowerCase().includes(searchTermLower) ?? false) ||
      (team.specialization?.toLowerCase().includes(searchTermLower) ?? false) ||
      (team.teamLeaderName?.toLowerCase().includes(searchTermLower) ?? false);

    const matchesStatus = statusFilter === "all" || team.status === statusFilter;

    const matchesLocation =
      locationFilter === "all" ||
      (team.address?.toLowerCase().includes(locationFilter.toLowerCase()) ?? false);

    const matchesSpecialization =
      specializationFilter === "all" || team.specialization === specializationFilter;

    const membersCount = team.numberOfMembers ?? 0;
    const matchesTeamSize =
      teamSizeFilter === "all" ||
      (teamSizeFilter === "small" && membersCount <= 5) ||
      (teamSizeFilter === "medium" && membersCount >= 6 && membersCount <= 15) ||
      (teamSizeFilter === "large" && membersCount >= 16);

    return (
      matchesSearch &&
      matchesStatus &&
      matchesLocation &&
      matchesSpecialization &&
      matchesTeamSize
    );
  });

  const handleDelete = async () => {
    if (!deletingTeam) return;
    try {
      await deleteTeam(deletingTeam.id);
      toast.success(`Team "${deletingTeam.name}" deleted successfully`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete team"
      );
    } finally {
      setDeletingTeam(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* <Toaster position="top-right" /> */}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Relief Teams</h1>
          <p className="text-muted-foreground">Manage your emergency response teams</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Team
        </Button>
      </div>

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
          setSearchTerm("");
          setStatusFilter("all");
          setLocationFilter("all");
          setSpecializationFilter("all");
          setTeamSizeFilter("all");
        }}
        hasActiveFilters={
          searchTerm !== "" ||
          statusFilter !== "all" ||
          locationFilter !== "all" ||
          specializationFilter !== "all" ||
          teamSizeFilter !== "all"
        }
      />

      <TeamsGrid
        teams={filteredTeams}
        loading={loading}
        onViewDetails={(team) => {
          setSelectedTeam(team);
          setShowDetailsModal(true);
        }}
        onEdit={(team) => {
          setEditingTeam(team);
          setShowEditModal(true);
        }}
        onDelete={(team) => {
          setDeletingTeam(team);
        }}
        // sortKey={"name"} // Manage these in React state if you want sorting UI in TeamsGrid
        // sortOrder={"asc"}
        onSortChange={() => {}}
      />

      {showCreateModal && (
        <ReliefTeamFormModal
          open={showCreateModal}
          onOpenChange={setShowCreateModal}
          onSuccess={() => {
            setShowCreateModal(false);
            toast.success("Team created successfully");
            fetchTeams();
          }}
        />
      )}

      {showEditModal && (
        <ReliefTeamFormModal
          open={showEditModal}
          onOpenChange={setShowEditModal}
          team={editingTeam}
          onSuccess={() => {
            setShowEditModal(false);
            setEditingTeam(null);
            toast.success("Team updated successfully");
            fetchTeams();
          }}
        />
      )}

      {showDetailsModal && selectedTeam && (
        <ReliefTeamDetailsModal
          open={showDetailsModal}
          onOpenChange={setShowDetailsModal}
          team={selectedTeam}
        />
      )}

      <AlertDialog open={!!deletingTeam} onOpenChange={() => setDeletingTeam(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the team "
              {deletingTeam?.name}" and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await handleDelete();
                fetchTeams();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
