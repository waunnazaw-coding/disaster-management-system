export interface ReliefTeamDto {
  id: number
  name: string
  contactInfo: string
  locationId?: number
  locationName?: string
  address?: string
  status: string
  teamLeaderName?: string
  email?: string
  phone?: string
  numberOfMembers?: number
  specialization?: string
  establishedDate: string
  // Added for consistency with CreateAssignmentDialog
  leaderName?: string
  contactPhone?: string
  location?: string
  memberCount?: number
}
export interface CreateReliefTeamDto {
  name: string;
  contactInfo: string;
  locationId?: number;
  address?: string;
  teamLeaderName?: string;
  email?: string;
  phone?: string;
  numberOfMembers?: number;
  specialization?: string;
}

export interface UpdateReliefTeamDto {
  name: string;
  contactInfo: string;
  locationId?: number;
  address?: string;
  status: string;
  teamLeaderName?: string;
  email?: string;
  phone?: string;
  numberOfMembers?: number;
  specialization?: string;
}