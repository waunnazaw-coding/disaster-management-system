import { create } from 'zustand';
import { Partner } from '../types/partner';
import { partnerService } from '../api/partnerService';
import { toast } from 'sonner';

interface PublicPartnerState {
  partners: Partner[];
  loading: boolean;
  error: string | null;
  fetchPublicPartners: () => Promise<void>;
  clearError: () => void;
}

export const usePublicPartnerStore = create<PublicPartnerState>((set) => ({
  partners: [],
  loading: false,
  error: null,

  fetchPublicPartners: async () => {
    set({ loading: true, error: null });
    try {
      const partners = await partnerService.getPublic();
      set({ partners, loading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch partners';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  clearError: () => set({ error: null }),
}));