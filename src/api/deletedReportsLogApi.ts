import axios from "axios";
import api from "./axioInstance";

export interface DeletedReportLog {
  id: number;
  reportId: number;
  reportName: string;
  status: string;
  deletedAt: string;
  deletedBy: string;
  extraInfo?: string; // JSON string, can parse if needed
}

export interface ReportReminder {
  id: number;
  reportName: string;
  willDeleteAt?: string;
  status?: string;
  deletedAt?: string;
}

// Fetch recently deleted logs within N days (default 7)
export const getRecentDeletedLogs = async (days: number = 7): Promise<DeletedReportLog[]> => {
  const res = await api.get(`/DeletedReportLogs/recent?days=${days}`);
  return res.data;
};

// Fetch all logs
export const getAllDeletedLogs = async (): Promise<DeletedReportLog[]> => {
  const res = await api.get(`/DeletedReportLogs/all`);
  return res.data;
};

export const getDeletionReminders = async (): Promise<{
  willDelete: ReportReminder[];
  recentlyDeleted: ReportReminder[];
}> => {
  const res = await api.get("/DeletedReportLogs/deletion-reminders");
  return res.data;
};
