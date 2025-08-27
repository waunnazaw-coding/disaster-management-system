export interface ContactDto {
  id: number;
  name: string;
  phone: string;
  email: string;
  message: string;
  submissionDate: string;
}

export interface ContactStats {
  totalContacts: number;
  last30Days: number;
  last7Days: number;
  today: number;
}

export interface ContactFormData {
  name: string;
  phone?: string;
  email: string;
  message: string;
}