// utils/requestUtils.ts
import type { AssistanceRequest } from '@/types/assistanceRequests';

export const filterRequests = (
  requests: AssistanceRequest[],
  filters: {
    status?: string;
    priority?: string;
    search?: string;
  }
) => {
  return requests.filter((request) => {
    const statusMatch = filters.status === 'all' || request.status === filters.status;
    const priorityMatch = filters.priority === 'all' || request.priority === filters.priority;
    const searchMatch =
      !filters.search ||
      request.supportType.toLowerCase().includes(filters.search.toLowerCase()) ||
      request.userName?.toLowerCase().includes(filters.search.toLowerCase()) ||
      request.contactPhone?.toLowerCase().includes(filters.search.toLowerCase()) ||
      request.detailedAddress?.toLowerCase().includes(filters.search.toLowerCase()) ||
      request.disasterEventName?.toLowerCase().includes(filters.search.toLowerCase());

    return statusMatch && priorityMatch && searchMatch;
  });
};

export const sortRequests = (
  requests: AssistanceRequest[],
  sort: { field: keyof AssistanceRequest; direction: 'asc' | 'desc' }
) => {
  return [...requests].sort((a, b) => {
    let comparison = 0;
    
    if (sort.field === 'createdAt') {
      comparison = new Date(a[sort.field]).getTime() - new Date(b[sort.field]).getTime();
    } else {
      const aValue = a[sort.field]?.toString().toLowerCase() || '';
      const bValue = b[sort.field]?.toString().toLowerCase() || '';
      comparison = aValue.localeCompare(bValue);
    }

    return sort.direction === 'asc' ? comparison : -comparison;
  });
};

export const paginateRequests = (
  requests: AssistanceRequest[],
  page: number,
  itemsPerPage: number
) => {
  const startIndex = (page - 1) * itemsPerPage;
  return requests.slice(startIndex, startIndex + itemsPerPage);
};