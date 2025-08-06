export interface ReliefTeam {
  id: number
  name: string
  contactInfo: string
  locationId?: number
  address: string
  status: string
  teamLeaderName: string
  socialMediaURL: string
  email: string
  phone: string
  numberOfMembers?: number
  specialization: string
  equipmentDetails: string
  establishedDate?: string // DateOnly from C# becomes string in TypeScript
  createdAt?: string
  updatedAt?: string
}

export interface CreateReliefTeamRequest {
  name: string
  contactInfo: string
  locationId?: number
  address: string
  status?: string // Default "Active" in backend
  teamLeaderName: string
  socialMediaURL: string
  email: string
  phone: string
  numberOfMembers?: number
  specialization: string
  equipmentDetails: string
  establishedDate?: string // DateOnly format: YYYY-MM-DD
}

export interface UpdateReliefTeamRequest {
  id: number
  name: string
  contactInfo: string
  locationId?: number
  address: string
  status: string
  teamLeaderName: string
  socialMediaURL: string
  email: string
  phone: string
  numberOfMembers?: number
  specialization: string
  equipmentDetails: string
  establishedDate?: string
}

export interface CreateInviteRequest {
  teamId: number
  email: string
  role: string
}

export interface ApiResponse<T> {
  isSuccess: boolean
  isError: boolean
  isValidationError: boolean
  isNotFoundError: boolean
  data: T
  message: string
}
