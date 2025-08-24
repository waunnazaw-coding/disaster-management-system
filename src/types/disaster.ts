// types/disaster.ts

export interface Impact {
  id: number
  disasterEventId?: number | null
  disasterReportId?: number | null
  type: string           // E.g. 'Casualties', 'Damage'
  value: string          // Can be string to allow e.g. "150 houses"
  objectName?: string    // Optional e.g. "Main Pagoda"
}

export interface Filters {
  disasterType: string;
  startDate: Date | null;
  status: string;
}


export interface Location {
  id: number
  name: string
  address?: string
  country?: string
  region?: string
}

export interface DisasterEvent {
  lastUpdate: string | undefined
  region: string | undefined
  type: string
  id: number
  name: string
  disasterTypeId: number
  startDate: string
  endDate?: string | null
  locationId: number
  severity: string
  status: 'Active' | 'Closed'
  description?: string
  createdAt: string
  updatedAt: string
  location?: Location
  impacts?: Impact[]
}
