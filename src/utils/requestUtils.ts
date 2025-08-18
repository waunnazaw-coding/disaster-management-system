// src/utils/requestUtils.ts
import type { AssistanceRequest } from "@/types/assistanceRequests";

export const filterRequests = (
  requests: AssistanceRequest[],
  filters: {
    status: string;
    priority: string;
    search: string;
  }
): AssistanceRequest[] => {
  return requests.filter((request) => {
    // Status filter
    if (filters.status !== "all" && request.status !== filters.status) {
      return false;
    }

    // Priority filter
    if (filters.priority !== "all" && request.priority !== filters.priority) {
      return false;
    }

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matches =
        (request.userName?.toLowerCase().includes(searchTerm) ?? false) ||
        (request.supportType?.toLowerCase().includes(searchTerm) ?? false) ||
        (request.description?.toLowerCase().includes(searchTerm) ?? false) ||
        (request.contactName?.toLowerCase().includes(searchTerm) ?? false) ||
        (request.contactPhone?.toLowerCase().includes(searchTerm) ?? false) ||
        (request.detailedAddress?.toLowerCase().includes(searchTerm) ?? false);

      if (!matches) {
        return false;
      }
    }

    return true;
  });
};

export const sortRequests = (
  requests: AssistanceRequest[],
  sortConfig: {
    field: keyof AssistanceRequest;
    direction: "asc" | "desc";
  }
): AssistanceRequest[] => {
  if (!sortConfig.field) return requests;

  return [...requests].sort((a, b) => {
    const aValue = a[sortConfig.field];
    const bValue = b[sortConfig.field];

    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    if (aValue < bValue) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });
};

export const paginateRequests = (
  requests: AssistanceRequest[],
  currentPage: number,
  itemsPerPage: number
): AssistanceRequest[] => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  return requests.slice(startIndex, startIndex + itemsPerPage);
};