export interface ReliefTeamActivityDTO {
  id: number;
  reliefTeamId: number;
  postedBy: string;
  activityDate: string;
  title: string;
  description: string;
  detailedAddress?: string;
  createdAt: string;
  activityType: string;
  peopleHelped?: number;
  itemsDistributed?: string;
  expenseAmount?: number;
  media: ActivityMediaDTO[];
  reliefTeamName?: string;
  postedByUserName: string;
}

export interface ActivityMediaDTO {
  id: number;
  filePath: string;
  fileType: string;
  fileSize?: number;
  uploadedAt?: string;
  isVideo: boolean;
}

export interface CreateReliefTeamActivityDTO {
  reliefTeamId: number;
  activityDate: Date;
  title: string;
  description: string;
  detailedAddress?: string;
  activityType: string;
  peopleHelped?: number;
  itemsDistributed?: string;
  expenseAmount?: number;
  mediaFiles: File[];
}

export interface UpdateReliefTeamActivityDTO {
  id: number;
  reliefTeamId: number;
  activityDate: Date;
  title: string;
  description: string;
  detailedAddress?: string;
  activityType: string;
  peopleHelped?: number;
  itemsDistributed?: string;
  expenseAmount?: number;
  mediaIdsToDelete?: number[];
  newMediaFiles?: File[];
}

export interface ActivityStatsDTO {
  totalActivities: number;
  activitiesByType: { [key: string]: number };
  recentActivities: ReliefTeamActivityDTO[];
}

export const ACTIVITY_TYPES = [
  'Training', 
  'Community Outreach', 
  'Fundraising',
  'Team Building',
  'Public Demonstration',
  'Distribution',
  'Medical',
  'Shelter',
  'Rescue',
  'Water Supply'
];