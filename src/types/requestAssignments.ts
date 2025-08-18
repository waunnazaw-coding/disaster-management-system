// src/types/requestAssignments.ts
export interface RequestAssignment {
  id: number;
  assistanceRequestId: number;
  requestDetails: {
    id: number;
    disasterEventName: string;
    supportType: string;
    quantity: number;
    unit: string;
    description: string;
    priority: string;
    status: string;
    contactName: string;
    contactPhone: string;
    detailedAddress: string;
    email?: string;
  };
  reliefTeamId: number;
  reliefTeamName: string;
  assignedById: string;
  assignedByName: string;
  assignedAt: string;
  status: 'Assigned' | 'InProgress' | 'Done' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  notes?: string;
  completedAt: string | null;
  lastUpdatedById?: string;
  updatedAt: string;
}

export interface CreateAssignmentData {
  assistanceRequestId: number;
  reliefTeamId: number;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  notes?: string;
}

export interface UpdateAssignmentStatusData {
  status: 'Assigned' | 'InProgress' | 'Done' | 'Cancelled';
  notes?: string;
}