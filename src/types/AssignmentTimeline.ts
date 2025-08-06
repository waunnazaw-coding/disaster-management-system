import { RequestAssignmentDto } from "./requestAssignments"

export interface AssignmentTimelineEvent {
  id: string
  type: "created" | "status_changed" | "note_added" | "team_changed" | "priority_changed"
  title: string
  description: string
  timestamp: string
  userId?: string
  userName?: string
  oldValue?: string
  oldValueName?: string // For displaying user-friendly names
  newValue?: string
  newValueName?: string // For displaying user-friendly names
  metadata?: Record<string, any>
}

export interface AssignmentDetails extends RequestAssignmentDto {
  timeline: AssignmentTimelineEvent[]
  totalDuration?: number // in minutes (from assigned to done)
  responseTime?: number // time from assigned to in-progress (in minutes)
  completionTime?: number // time from in-progress to done (in minutes)
}
