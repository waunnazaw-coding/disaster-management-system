export interface Partner {
  id: number;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  notes: string;
  isPublic: boolean;
  status: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerFormData {
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  notes: string;
  isPublic: boolean;
  logoFile?: File;
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  isError: boolean;
  isValidationError: boolean;
  isNotFoundError: boolean;
  data: T;
  message: string;
}