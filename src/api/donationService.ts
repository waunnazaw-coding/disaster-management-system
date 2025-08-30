import api from "./axioInstance"


export interface CreateDonationDto {
  name?: string
  description?: string
  amount?: number
  currency?: string
  sourceType: string
  paymentMethod?: string
  donorPhoneNumber?: string
  category? : string
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
  category? : string
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
        throw new Error( "Failed to create donation")
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

    // Get total people by phone
  async getTotalPeopleByPhone(): Promise<number> {
    const response = await api.get<{ totalPeopleByPhone: number }>(
      "/donation/total-people"
    );
    return response.data.totalPeopleByPhone ?? 0;
  },

  // Get total amount last year 
  async getTotalAmountLastYear(): Promise<number> {
    const response = await api.get<{ totalAmountLastYear: number }>("/donation/total-amount");
    console.log(response.data); 
    return response.data.totalAmountLastYear ?? 0;
  },


  // Get total amount for current year
  async getTotalAmountNowYear(): Promise<number> {
    const response = await api.get<{ totalAmountNowYear: number }>("/donation/total-amount-now-year");
    return response.data.totalAmountNowYear ?? 0;
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
},

async getMonthlyDonations(year: number): Promise<{ month: string; amount: number }[]> {
  try {
    const response = await api.get<ApiResult<Record<string, number>>>(`/donation/monthly/${year}`);
    
    if (!response.data.isSuccess) {
      throw new Error(response.data.message || 'Failed to fetch monthly donations');
    }
    
    const data = response.data.data || {};
    return Object.entries(data).map(([month, amount]) => ({ month, amount }));
  } catch (error: any) {
    console.error('Error fetching monthly donations:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch monthly donations');
  }
},

async getYearlyDonations(startYear: number, endYear: number): Promise<{ year: number; amount: number }[]> {
  try {
    const response = await api.get<ApiResult<Record<number, number>>>(`/donation/yearly/${startYear}/${endYear}`);
    
    if (!response.data.isSuccess) {
      throw new Error(response.data.message || 'Failed to fetch yearly donations');
    }
    
    const data = response.data.data || {};
    return Object.entries(data).map(([year, amount]) => ({ 
      year: parseInt(year), 
      amount 
    }));
  } catch (error: any) {
    console.error('Error fetching yearly donations:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch yearly donations');
  }
},

async getDonationsByCategory(): Promise<{ category: string; amount: number }[]> {
  try {
    const response = await api.get<ApiResult<Record<string, number>>>(`/donation/by-category`);
    
    if (!response.data.isSuccess) {
      throw new Error(response.data.message || 'Failed to fetch category donations');
    }
    
    const data = response.data.data || {};
    return Object.entries(data).map(([category, amount]) => ({ 
      category, 
      amount 
    }));
  } catch (error: any) {
    console.error('Error fetching category donations:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch category donations');
  }
}

}
