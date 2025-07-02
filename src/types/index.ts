export type Role = 'User' | 'ReliefTeam' | 'Organization' | 'Admin';

export const rolePanelMap: Record<Role, string> = {
  User: '/public',
  ReliefTeam: '/relief',
  Organization: '/organization',
  Admin: '/admin',
};

export interface User {
  id: string
  name: string
  email: string
  role: "user" | "admin" | "organization"
  avatar?: string
}

export interface DisasterReport {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  disasterType: "flood" | "earthquake" | "fire" | "storm" | "drought" | "other"
  title: string
  description: string
  location: string
  coordinates?: { lat: number; lng: number }
  photos: string[]
  impact?: string
  status: "pending" | "approved" | "rejected" | "merged"
  eventId?: string
  createdAt: string
  updatedAt: string
}

export interface DisasterEvent {
  id: string
  title: string
  date: string
  location: string
  summary: string
  photos: string[]
  reportIds: string[]
  reporters: Array<{
    id: string
    name: string
    avatar?: string
  }>
  impacts: string[]
  helpRequests: HelpRequest[]
  createdAt: string
  updatedAt: string
}

export interface HelpRequest {
  id: string
  userId: string
  userName: string
  eventId: string
  type: string
  description: string
  status: "requested" | "assigned" | "supported"
  organizationId?: string
  organizationName?: string
  supportDetails?: string
  supportPhotos?: string[]
  createdAt: string
}

export interface Donation {
  id: string
  donorName: string
  donorEmail: string
  organizationId: string
  organizationName: string
  amount: number
  type: "money" | "goods" | "services"
  description: string
  createdAt: string
}
