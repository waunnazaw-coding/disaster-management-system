export interface CreateDonationDto {
  name: string
  type: "Money" | "Item"
  description?: string
  quantity?: number
  unit?: string
  amount?: number
  currency?: string
  sourceType: "Personal" | "Organization" | "NGO" | "Anonymous" | "Company"
  // Payment details for money donations
  paymentMethod?: "KPay" | "WavePay" | "BankTransfer"
  paymentAccountName?: string
  paymentPhoneNumber?: string
}

export interface DonationDto {
  id: number
  donorUserId?: string
  donorName?: string
  type: string
  name?: string
  description?: string
  quantity?: number
  unit?: string
  amount?: number
  currency?: string
  dateReceived?: string
  sourceType: string
  status: "Pending" | "Verified" | "Distributed" | "Cancelled"
  paymentMethod?: string
  paymentAccountName?: string
  paymentPhoneNumber?: string
}