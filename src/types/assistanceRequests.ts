export interface AssistanceRequest {
  id: number;
  disasterEventId?: number | null;
  disasterEventName?: string | null;
  disasterReportId?: number | null;
  userId?: string | null;
  userName?: string | null;
  locationId?: number | null;
  locationName?: string | null;
  supportType: string;
  quantity?: number | null;
  unit?: string | null;
  description?: string | null;
  priority: string;
  status: string;
  contactName?: string | null;
  email?: string | null;
  contactPhone?: string | null;
  detailedAddress?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  fulfilledAt?: string | null;
  assignments: {
    id: number;
    reliefTeamId: number;
    reliefTeamName: string;
    assignedById: string;
    assignedByName: string;
    assignedAt: string;
    status: 'Assigned' | 'InProgress' | 'Done' | 'Cancelled';
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    notes?: string;
    completedAt?: string;
  }[];
}

 


export interface CreateAssistanceRequestDto {
  disasterEventId?: number
  disasterReportId?: number
  locationId?: number
  supportType: string
  quantity?: number
  unit?: string
  description?: string
  priority?: string
  contactName?: string
  email?: string
  contactPhone?: string
  detailedAddress?: string
}

export interface UpdateAssistanceRequestDto {
  disasterEventId?: number | null
  disasterReportId?: number | null
  locationId?: number | null
  supportType?: string
  quantity?: number | null
  unit?: string | null
  description?: string | null
  priority?: string
  contactName?: string | null
  email?: string | null
  contactPhone?: string | null
  detailedAddress?: string | null
}

export interface UpdateRequestStatusDto {
  status: string
}



// In your types/assistanceRequests.ts
export interface RequestStats {
  totalCount: number;
  pendingCount: number;
  approvedCount: number;
  inProgressCount: number;
  fulfilledCount: number;
  rejectedCount: number;
}