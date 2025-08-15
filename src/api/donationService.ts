import api from "./axioInstance"


export interface CreateDonationDto {
  type: "Money" | "Item"
  name?: string
  description?: string
  quantity?: number
  unit?: string
  amount?: number
  currency?: string
  sourceType: "Personal" | "Organization" | "NGO" | "Anonymous" | "Company"
  paymentMethod?: "KPay" | "WavePay" | "BankTransfer"
  donorPhoneNumber?: string
}

export interface UpdateDonationDto {
  name: string
  type: "Money" | "Item"
  description?: string
  quantity?: number
  unit?: string
  amount?: number
  currency?: string
  sourceType: "Personal" | "Organization" | "NGO" | "Anonymous" | "Company"
  paymentMethod?: "KPay" | "WavePay" | "BankTransfer"
  donorPhoneNumber?: string
}

export interface DonationDto {
  id: number
  donorUserId?: string
  donarEmail?: string
  donorName?: string
  type: string
  name?: string
  description?: string
  donarAvator?: string
  quantity?: number
  unit?: string
  amount?: number
  currency?: string
  dateReceived?: string
  sourceType: string
  status: "Pending" | "Verified" | "Distributed" | "Cancelled"
  paymentMethod?: string
  donorPhoneNumber?: string
}

interface ApiResult<T> {
  isSuccess: boolean
  data: T | null
  message: string | null
  isError: boolean
  isNotFoundError: boolean
  isValidationError: boolean
}

export const donationService = {
  // Create a new donation
  async createDonation(donationData: CreateDonationDto): Promise<DonationDto> {
    try {
      console.log("Making API call to create donation:", donationData)

      const response = await api.post<ApiResult<DonationDto>>("/donation", donationData)

      console.log("API response:", response.data)

      if (!response.data.isSuccess) {
        throw new Error(response.data.message || "Failed to create donation")
      }

      if (!response.data.data) {
        throw new Error("No data returned from server")
      }

      return response.data.data
    } catch (error: any) {
      console.error("API Error:", error)

      // Handle different error types
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      } else if (error.response?.data?.isValidationError) {
        throw new Error("Validation failed. Please check your input.")
      } else if (error.message) {
        throw new Error(error.message)
      } else {
        throw new Error("Network error. Please try again.")
      }
    }
  },

  // Get current user's donations
  async getUserDonations(): Promise<DonationDto[]> {
    try {
      const response = await api.get<ApiResult<DonationDto[]>>("/donation/my-donations")

      if (!response.data.isSuccess) {
        throw new Error(response.data.message || "Failed to fetch donations")
      }

      return response.data.data || []
    } catch (error: any) {
      console.error("Error fetching user donations:", error)
      throw new Error(error.response?.data?.message || error.message || "Failed to fetch donations")
    }
  },

  // Get all donations (Admin only)
  async getAllDonations(): Promise<DonationDto[]> {
    try {
      const response = await api.get<ApiResult<DonationDto[]>>("/donation")

      if (!response.data.isSuccess) {
        throw new Error(response.data.message || "Failed to fetch all donations")
      }

      return response.data.data || []
    } catch (error: any) {
      console.error("Error fetching all donations:", error)
      throw new Error(error.response?.data?.message || error.message || "Failed to fetch donations")
    }
  },

  // Get donation by ID
  async getDonationById(id: number): Promise<DonationDto> {
    try {
      const response = await api.get<ApiResult<DonationDto>>(`/donation/${id}`)

      if (!response.data.isSuccess) {
        throw new Error(response.data.message || "Failed to fetch donation")
      }

      if (!response.data.data) {
        throw new Error("Donation not found")
      }

      return response.data.data
    } catch (error: any) {
      console.error("Error fetching donation by ID:", error)
      throw new Error(error.response?.data?.message || error.message || "Failed to fetch donation")
    }
  },

  // Update donation status (Admin only)
  async updateDonationStatus(id: number, status: string): Promise<DonationDto> {
    try {
      const response = await api.put<ApiResult<DonationDto>>(`/donation/${id}/status`, { status })

      if (!response.data.isSuccess) {
        throw new Error(response.data.message || "Failed to update donation status")
      }

      if (!response.data.data) {
        throw new Error("No data returned from server")
      }

      return response.data.data
    } catch (error: any) {
      console.error("Error updating donation status:", error)
      throw new Error(error.response?.data?.message || error.message || "Failed to update donation status")
    }
  },

  // Update donation (User only - for their own donations)
  async updateDonation(id: number, donationData: UpdateDonationDto): Promise<DonationDto> {
    try {
      console.log("Making API call to update donation:", { id, donationData })

      const response = await api.put<ApiResult<DonationDto>>(`/donation/${id}`, donationData)

      console.log("API response:", response.data)

      if (!response.data.isSuccess) {
        throw new Error(response.data.message || "Failed to update donation")
      }

      if (!response.data.data) {
        throw new Error("No data returned from server")
      }

      return response.data.data
    } catch (error: any) {
      console.error("API Error:", error)

      // Handle different error types
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      } else if (error.response?.data?.isValidationError) {
        throw new Error("Validation failed. Please check your input.")
      } else if (error.message) {
        throw new Error(error.message)
      } else {
        throw new Error("Network error. Please try again.")
      }
    }
  },

  // Delete donation (User only - for their own donations)
  async deleteDonation(id: number): Promise<boolean> {
    try {
      console.log("Making API call to delete donation:", id)

      const response = await api.delete<ApiResult<boolean>>(`/donation/${id}`)

      console.log("API response:", response.data)

      if (!response.data.isSuccess) {
        throw new Error(response.data.message || "Failed to delete donation")
      }

      return true
    } catch (error: any) {
      console.error("API Error:", error)

      // Handle different error types
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      } else if (error.response?.data?.isValidationError) {
        throw new Error("Validation failed. Please check your input.")
      } else if (error.message) {
        throw new Error(error.message)
      } else {
        throw new Error("Network error. Please try again.")
      }
    }
  },
async getRecentDonations(): Promise<DonationDto[]> {
  try {
    const response = await api.get<ApiResult<DonationDto[]>>("/donation/recent");
    
    if (!response.data.isSuccess) {
      throw new Error(response.data.message || "Failed to fetch recent donations");
    }

    return response.data.data || [];
  } catch (error: any) {
    console.error("Error fetching recent donations:", error);
    throw new Error(error.response?.data?.message || error.message || "Failed to fetch donations");
  }
}

}
