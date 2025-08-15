// Types based on your API interfaces
export interface AllocationTypeSummary {
  allocationTypeName: string
  totalAmount: number
  percentageOfYear: number
}

export interface FinancialAllocationRequestDto {
//   donationId?: number | null
  allocationTypeName: string
  amount: number
  allocationDate: string
  createdBy?: string | null
  notes?: string | null
  detailName: string
  detailDescription?: string | null
}

export interface FinancialAllocationResponseDto extends FinancialAllocationRequestDto {
  id: number
  createdAt: string
  updatedAt: string
}

export interface Result<T> {
  success: boolean
  data: T
  message?: string
  errors?: string[]
}