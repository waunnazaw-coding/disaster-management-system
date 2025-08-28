// src/store/RequestAssignmentStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import * as api from "@/api/requestAssignments";
import type {
  RequestAssignment,
  CreateAssignmentData,
  UpdateAssignmentStatusData,
} from "@/types/requestAssignments";
import { toast } from "sonner";
import { useAssistanceRequestsStore } from "./assistanceRequestStore";
import { useReliefStore } from "./reliefStore";
import { useRecentTeamsStore } from "./RecentTeamsStore";

interface AssignmentState {
  assignments: RequestAssignment[];
  currentAssignment: RequestAssignment | null;
  loading: boolean;
  error: string | null;
  fetchAssignmentsbyReliefTeam: () => Promise<void>;
  fetchAssignments: () => Promise<void>;
  fetchTeamAssignments: (teamId: number) => Promise<void>;
  createAssignment: (data: CreateAssignmentData) => Promise<void>;
  updateStatus: (id: number, data: UpdateAssignmentStatusData) => Promise<void>;
  setCurrentAssignment: (assignment: RequestAssignment | null) => void;
}

export const useAssignmentStore = create<AssignmentState>()(
  devtools(
    (set) => ({
      assignments: [],
      currentAssignment: null,
      loading: false,
      error: null,

      fetchAssignmentsbyReliefTeam: async () => {
        set({ loading: true, error: null });
        try {
          const user = useReliefStore.getState().currentUser;
          if (!user) return;

          const assignments = await api.getAssignmentsByUser(user.id);
          set({ assignments, loading: false });
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to fetch assignments";
          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
        }
      },

      fetchAssignments: async () => {
        set({ loading: true, error: null });
        try {
          const assignments = await api.getAssignments();
          set({ assignments, loading: false });
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to fetch assignments";
          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
        }
      },

      fetchTeamAssignments: async (teamId: number) => {
        set({ loading: true, error: null });
        try {
          const assignments = await api.getAssignmentsByTeam(teamId);
          set({ assignments, loading: false });
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to fetch team assignments";
          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
        }
      },

      createAssignment: async (data: CreateAssignmentData) => {
        set({ loading: true, error: null });
        try {
          const assignment = await api.createAssignment(data);
          set((state) => ({
            assignments: [...state.assignments, assignment],
            loading: false,
          }));

          // Update the corresponding request
          useAssistanceRequestsStore
            .getState()
            .updateRequestAssignment(assignment);

          toast.success("Request assigned successfully");
          const team=useRecentTeamsStore.getState().addRecentTeam({id:assignment.reliefTeamId,name:assignment.reliefTeamName});
          return assignment;
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to create assignment";
          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      updateStatus: async (id: number, data: UpdateAssignmentStatusData) => {
        set({ loading: true, error: null });
        try {
          const updatedAssignment = await api.updateAssignmentStatus(id, data);
          set((state) => ({
            assignments: state.assignments.map((a) =>
              a.id === id ? updatedAssignment : a
            ),
            loading: false,
          }));
          toast.success("Assignment status updated successfully");
          return updatedAssignment;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to update status";
          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      setCurrentAssignment: (assignment: RequestAssignment | null) =>
        set({ currentAssignment: assignment }),
    }),
    { name: "AssignmentStore" }
  )
);
