export type Role = 'User' | 'ReliefTeam' | 'Organization' | 'Admin';

export const rolePanelMap: Record<Role, string> = {
  User: '/public',
  ReliefTeam: '/relief',
  Organization: '/organization',
  Admin: '/admin',
};

// src/constants/roles.ts
export const Roles = {
  Admin: "Admin",
  SysAdmin: "SysAdmin",
  ReliefTeam: "ReliefTeam",
  User: "User",
} as const;




export interface User {
  id: string
  name: string
  email: string
  role: "User" | "Admin" | "Org" | "SysAdmin" | "ReliefTeam"
  status: "Active" | "Blacklisted"
  createdAt: string
  avatar?: string
}

export interface DisasterType {
  id: number
  name: string
  category: "Natural" | "Non-Natural"
  description: string
}

export interface Location {
  id: number
  name: string
  address: string
  country: string
  region: string
  latitude?: number
  longitude?: number
}

export interface DisasterEvent {
  id: number
  name: string
  disasterTypeId: number
  disasterType?: DisasterType
  startDate: string
  endDate?: string
  locationId: number
  location?: Location
  severity: "Low" | "Medium" | "High" | "Critical"
  status: "Active" | "Closed"
  description: string
  estimatedAffected?: number
  createdAt: string
  updatedAt: string
}

export interface DisasterReport {
  id: number
  disasterEventId?: number
  userId?: string
  user?: User
  locationId: number
  location?: Location
  addressDetail?: string
  type: string
  title?: string
  description: string
  severity?: string
  status: "Pending" | "Verified" | "Fake" | "Rejected"
  source?: string
  createdAt: string
}

export interface AssistanceRequest {
  id: number
  disasterEventId?: number
  disasterReportId?: number
  userId?: string
  user?: User
  locationId?: number
  location?: Location
  supportType: string
  quantity?: number
  unit?: string
  description: string
  priority: "Low" | "Medium" | "High" | "Critical"
  status: "Pending" | "Approved" | "InProgress" | "Fulfilled" | "Rejected"
  contactName?: string
  email?: string
  contactPhone?: string
  detailedAddress?: string
  createdAt: string
}

export interface ReliefTeam {
  id: number
  name: string
  contactInfo: string
  locationId?: number
  location?: Location
  status: "Active" | "Inactive"
  teamLeaderName?: string
  email?: string
  phone?: string
  numberOfMembers?: number
  specialization?: string
  createdAt: string
}

export interface Donation {
  id: number
  donorUserId?: string
  donor?: User
  name: string
  type: string
  description: string
  quantity?: number
  unit?: string
  amount?: number
  currency?: string
  dateReceived: string
  sourceType: "Personal" | "Organization" | "NGO" | "Anonymous" | "Company"
  status: "Pending" | "Verified" | "Distributed" | "Cancelled"
}

export interface DashboardStats {
  totalReports: number
  pendingReports: number
  activeEvents: number
  pendingRequests: number
  activeTeams: number
  totalDonations: number
  pendingDonations: number
  totalAffected: number
}

export interface CreateDisasterEventForm {
  name: string
  disasterTypeId: number
  startDate: string
  endDate?: string
  locationId: number
  severity: "Low" | "Medium" | "High" | "Critical"
  description: string
  estimatedAffected?: number
}
