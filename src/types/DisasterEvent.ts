export interface DisasterEvent {
  id: number;
  name: string;
  disasterTypeId: number;
  startDate: string;  // ISO date string
  endDate: string;    // ISO date string
  locationId: number;
  severity: string;   // e.g., "High"
  status: string;     // e.g., "Active"
  description: string;
  createdAt: string;  // ISO date string
  updatedAt: string;  // ISO date string
  
}
