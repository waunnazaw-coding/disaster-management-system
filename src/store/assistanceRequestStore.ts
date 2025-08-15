import { create } from "zustand";
import { devtools } from "zustand/middleware";
import * as api from "@/api/assistanceRequests";
import type {
  AssistanceRequest,
  CreateAssistanceRequestDto,
  UpdateAssistanceRequestDto,
} from "@/types/assistanceRequests";
import { toast } from "sonner";

interface RequestStats {
  totalCount: number;
  pendingCount: number;
  approvedCount: number;
  inProgressCount: number;
  fulfilledCount: number;
  rejectedCount: number;
}
interface AssistanceRequestsState {
  requests: AssistanceRequest[];
  stats: RequestStats;
  currentRequest: AssistanceRequest | null;
  loading: boolean;
  error: string | null;
  fetchAllRequests: () => Promise<void>;
  fetchUserRequests: () => Promise<void>;
  fetchRequestStats: () => Promise<void>;
  fetchRequestById: (id: number) => Promise<void>;
  createRequest: (
    data: CreateAssistanceRequestDto
  ) => Promise<AssistanceRequest>;
  updateRequest: (
    id: number,
    data: UpdateAssistanceRequestDto
  ) => Promise<void>;
  updateStatus: (id: number, status: string) => Promise<void>;
  deleteRequest: (id: number) => Promise<void>;
  resetCurrentRequest: () => void;
  updateRequestAssignment: (assignment: any) => void;
}

export const useAssistanceRequestsStore = create<AssistanceRequestsState>()(
  devtools(
    (set, get) => ({
      requests: [],
      stats: {
        totalCount: 0,
        pendingCount: 0,
        approvedCount: 0,
        // inProgressCount: 0,
        fulfilledCount: 0,
        rejectedCount: 0,
      },
      currentRequest: null,
      loading: false,
      error: null,

      fetchAllRequests: async () => {
        set({ loading: true, error: null });
        try {
          const requests = await api.getAssistanceRequests();
          set({ requests, loading: false });
        } catch (error) {
          let errorMessage = "Failed to fetch requests";
          if (error instanceof Error) {
            errorMessage = error.message;
          }
          set({ error: errorMessage, loading: false });
        }
      },

      fetchUserRequests: async () => {
        set({ loading: true, error: null });
        try {
          const requests = await api.getUserAssistanceRequests();
          set({ requests, loading: false });
        } catch (error) {
          let errorMessage = "Failed to fetch user requests";
          if (error instanceof Error) {
            errorMessage = error.message;
          }
          set({ error: errorMessage, loading: false });
        }
      },

      fetchRequestById: async (id) => {
        set({ loading: true, error: null });
        try {
          const request = await api.getRequestById(id);
          // Ensure assignments are properly initialized
          if (!request.assignments) {
            request.assignments = [];
          }
          set({ currentRequest: request, loading: false });
        } catch (error) {
          let errorMessage = "Failed to fetch request";
          if (error instanceof Error) {
            errorMessage = error.message;
          }
          set({ error: errorMessage, loading: false });
        }
      },

      createRequest: async (data) => {
        set({ loading: true, error: null });
        try {
          const request = await api.createAssistanceRequest(data);
          set((state) => ({
            requests: [...state.requests, request],
            loading: false,
          }));
          return request;
        } catch (error) {
          let errorMessage = "Failed to create request";
          if (error instanceof Error) {
            errorMessage = error.message;
          }
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      updateRequest: async (id: number, data: any) => {
        set({ loading: true, error: null });
        try {
          await api.updateAssistanceRequest(id, data);
          set({ loading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to update request",
            loading: false,
          });
          throw error;
        }
      },

      // store/assistanceRequestStore.ts
      updateStatus: async (id, status) => {
        set({ loading: true, error: null });
        try {
          const request = await api.updateRequestStatus(id, { status });
          set((state) => ({
            requests: state.requests.map((r) =>
              r.id === id ? { ...r, status: request.status } : r
            ),
            currentRequest:
              state.currentRequest?.id === id
                ? { ...state.currentRequest, status: request.status }
                : state.currentRequest,
            loading: false,
          }));
          return request;
        } catch (error) {
          let errorMessage = "Failed to update status";
          if (error instanceof Error) {
            errorMessage = error.message;
          }
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },
      deleteRequest: async (id) => {
        set({ loading: true });
        try {
          await api.deleteAssistanceRequest(id);
          set((state) => ({
            requests: state.requests.filter((r) => r.id !== id),
            loading: false,
          }));
        } catch (error) {
          let errorMessage = "Failed to delete request";
          if (error instanceof Error) {
            errorMessage = error.message;
          }
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      fetchRequestStats: async () => {
        set({ loading: true, error: null });
        try {
          const stats = await api.getRequestStats();
          set({ stats, loading: false });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to fetch stats";
          set({ error: errorMessage, loading: false });
          throw new Error(errorMessage);
        }
      },

      // In store/assistanceRequestStore.ts
updateRequestAssignment: (assignment) => {
  set((state) => {
    const updatedRequests = state.requests.map((request) =>
      request.id === assignment.assistanceRequestId
        ? {
            ...request,
            status: "InProgress",
            assignments: [
              ...(request.assignments || []).filter(
                (a) => a.id !== assignment.id
              ),
              {
                id: assignment.id,
                reliefTeamId: assignment.reliefTeamId,
                reliefTeamName: assignment.reliefTeamName,
                assignedById: assignment.assignedById,
                assignedByName: assignment.assignedByName,
                assignedAt: assignment.assignedAt,
                status: assignment.status,
                priority: assignment.priority,
                notes: assignment.notes,
                completedAt: assignment.completedAt,
              },
            ],
          }
        : request
    );
    
    // Find the updated request
    const updatedRequest = updatedRequests.find(
      r => r.id === assignment.assistanceRequestId
    );
    
    if (updatedRequest) {
      toast.success("Team assigned", {
        description: `Request #${updatedRequest.id} assigned to ${assignment.reliefTeamName}`,
      });
    }
    
    return { requests: updatedRequests };
  });
},

      resetCurrentRequest: () => set({ currentRequest: null }),
    }),
    { name: "AssistanceRequestsStore" }
  )
);
