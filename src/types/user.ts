// src/types/user.ts

type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  status?: string;
  createdAt?: string;
};
export type UserResponseDto = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  profile?: string | null; // Changed from 'profile' to 'profilePhoto' to match your frontend
  role?: string;
  status?: string;
  createdAt?: string;
};

export interface DisasterReport {
  id: number
  title: string
  type: string
  severity: "High" | "Medium" | "Low"
  status: "Pending" | "Verified" | "Fake" | "Rejected"
  createdAt: string
  description: string
}

export interface AssistanceRequest {
  id: number
  supportType: string
  quantity: number
  unit: string
  priority: "Low" | "Medium" | "High" | "Critical"
  status: "Pending" | "Approved" | "InProgress" | "Fulfilled" | "Rejected"
  createdAt: string
  description: string
}

export interface Donation {
  id: number
  type: string
  quantity: number
  unit: string
  amount?: number
  currency?: string
  status: "Pending" | "Verified" | "Distributed" | "Cancelled"
  dateReceived: string
  description: string
}

export interface Notification {
  id: number
  message: string
  type: string
  isRead: boolean
  createdAt: string
  relatedEntityId?: number
  status?: string
}
