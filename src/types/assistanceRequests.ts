export interface AssistanceRequest {
  id: number
  disasterEventId?: number | null
  disasterEventName?: string | null
  disasterReportId?: number | null
  userId?: string | null
  userName?: string | null
  locationId?: number | null
  locationName?: string | null
  supportType: string
  quantity?: number | null
  unit?: string | null
  description?: string | null
  priority: string
  status: string
  contactName?: string | null
  email?: string | null
  contactPhone?: string | null
  detailedAddress?: string | null
  createdAt: string
  updatedAt?: string | null
  fulfilledAt?: string | null
}

export interface CreateAssistanceRequestDto {
  disasterEventId?: number
  disasterReportId?: number
  locationId?: number
  supportType: string
  quantity?: number
  unit?: string
  description?: string
  priority?: string
  contactName?: string
  email?: string
  contactPhone?: string
  detailedAddress?: string
}

export interface UpdateAssistanceRequestDto {
  disasterEventId?: number
  disasterReportId?: number
  locationId?: number
  supportType?: string
  quantity?: number
  unit?: string
  description?: string
  priority?: string
  contactName?: string
  email?: string
  contactPhone?: string
  detailedAddress?: string
}

export interface UpdateRequestStatusDto {
  status: string
}