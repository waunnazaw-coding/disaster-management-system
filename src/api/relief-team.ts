import api from "@/api/axioInstance"
import type {
  ReliefTeam,
  CreateReliefTeamRequest,
  UpdateReliefTeamRequest,
  CreateInviteRequest,
  ApiResponse,
} from "@/types/relief-team"

export class ReliefTeamService {
  // Get all relief teams
  static async getAllTeams(): Promise<ReliefTeam[]> {
    try {
      console.log("[ReliefTeamService] Attempting API call to fetch all teams")
      const response = await api.get<ApiResponse<ReliefTeam[]>>("/reliefteams")

      if (response.data.isSuccess) {
        console.log("[ReliefTeamService] API call successful")
        return response.data.data
      } else {
        throw new Error(response.data.message || "Failed to fetch teams")
      }
    } catch (error) {
      console.error("Error fetching relief teams:", error)
      throw error
    }
  }

  // Get team by ID
  static async getTeamById(id: number): Promise<ReliefTeam> {
    try {
      console.log(`[ReliefTeamService] Attempting API call to fetch team ${id}`)
      const response = await api.get<ApiResponse<ReliefTeam>>(`/reliefteams/${id}`)

      if (response.data.isSuccess) {
        console.log(`[ReliefTeamService] API call successful for team ${id}`)
        return response.data.data
      } else if (response.data.isNotFoundError) {
        throw new Error(response.data.message || `Team with ID ${id} not found`)
      } else {
        throw new Error(response.data.message || "Failed to fetch team")
      }
    } catch (error) {
      console.error(`Error fetching team ${id}:`, error)
      throw error
    }
  }

  // Create new team
  static async createTeam(teamData: CreateReliefTeamRequest): Promise<ReliefTeam> {
    try {
      console.log("[ReliefTeamService] Attempting API call to create team")
      const response = await api.post<ApiResponse<ReliefTeam>>("/reliefteams/create-invite", teamData)

      if (response.data.isSuccess) {
        console.log("[ReliefTeamService] Team created successfully via API")
        return response.data.data
      } else if (response.data.isValidationError) {
        throw new Error(response.data.message || "Validation failed")
      } else {
        throw new Error(response.data.message || "Failed to create team")
      }
    } catch (error) {
      console.error("Error creating team:", error)
      throw error
    }
  }

  // Update team
  static async updateTeam(teamData: UpdateReliefTeamRequest): Promise<ReliefTeam> {
    try {
      console.log(`[ReliefTeamService] Attempting API call to update team ${teamData.id}`)
      const response = await api.put<ApiResponse<ReliefTeam>>(`/reliefteams/${teamData.id}`, teamData)

      if (response.data.isSuccess) {
        console.log(`[ReliefTeamService] Team ${teamData.id} updated successfully via API`)
        return response.data.data
      } else if (response.data.isValidationError) {
        throw new Error(response.data.message || "Validation failed")
      } else if (response.data.isNotFoundError) {
        throw new Error(response.data.message || `Team with ID ${teamData.id} not found`)
      } else {
        throw new Error(response.data.message || "Failed to update team")
      }
    } catch (error) {
      console.error(`Error updating team ${teamData.id}:`, error)
      throw error
    }
  }

  // Delete team
  static async deleteTeam(id: number): Promise<void> {
    try {
      console.log(`[ReliefTeamService] Attempting API call to delete team ${id}`)
      const response = await api.delete<ApiResponse<void>>(`/reliefteams/${id}`)

      if (response.data.isSuccess) {
        console.log(`[ReliefTeamService] Team ${id} deleted successfully via API`)
        return
      } else if (response.data.isNotFoundError) {
        throw new Error(response.data.message || `Team with ID ${id} not found`)
      } else {
        throw new Error(response.data.message || "Failed to delete team")
      }
    } catch (error) {
      console.error(`Error deleting team ${id}:`, error)
      throw error
    }
  }

  // Create invite
  static async createInvite(inviteData: CreateInviteRequest): Promise<void> {
    try {
      console.log("[ReliefTeamService] Attempting API call to create invite")
      const response = await api.post<ApiResponse<void>>("/reliefteams/create-invite", inviteData)

      if (response.data.isSuccess) {
        console.log("[ReliefTeamService] Invite created successfully via API")
        return
      } else if (response.data.isValidationError) {
        throw new Error(response.data.message || "Validation failed")
      } else {
        throw new Error(response.data.message || "Failed to create invite")
      }
    } catch (error) {
      console.error("Error creating invite:", error)
      throw error
    }
  }
}
