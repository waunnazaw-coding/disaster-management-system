// import { create } from 'zustand';
// import { Partner } from '../types/partner';
// import { partnerService } from '../api/partnerService';
// import {toast} from 'sonner';

// interface PartnerState {
//   partners: Partner[];
//   currentPartner: Partner | null;
//   loading: boolean;
//   error: string | null;
//   fetchPartners: () => Promise<void>;
//   fetchPartner: (id: number) => Promise<void>;
//   createPartner: (formData: FormData) => Promise<void>;
//   updatePartner: (id: number, formData: FormData) => Promise<void>;
//   deletePartner: (id: number) => Promise<void>;
//   updatePartnerStatus: (id: number, status: string) => Promise<void>;
//   clearError: () => void;
//   clearCurrentPartner: () => void;
// }

// export const usePartnerStore = create<PartnerState>((set, get) => ({
//   partners: [],
//   currentPartner: null,
//   loading: false,
//   error: null,

//   fetchPartners: async () => {
//     set({ loading: true, error: null });
//     try {
//       const partners = await partnerService.getAll();
//       set({ partners, loading: false });
//     } catch (error: any) {
//       set({ 
//         error: error.response?.data?.message || 'Failed to fetch partners', 
//         loading: false 
//       });
//     }
//   },

//   fetchPartner: async (id: number) => {
//     set({ loading: true, error: null });
//     try {
//       const partner = await partnerService.getById(id);
//       set({ currentPartner: partner, loading: false });
//     } catch (error: any) {
//       set({ 
//         error: error.response?.data?.message || 'Failed to fetch partner', 
//         loading: false 
//       });
//     }
//   },

//   createPartner: async (formData: FormData) => {
//     set({ loading: true, error: null });
//     try {
//       const newPartner = await partnerService.create(formData);
//       set(state => ({ 
//         partners: [...state.partners, newPartner], 
//         loading: false 
//       }));
//       toast.success('Partner created successfully!');
//     } catch (error: any) {
//       set({ 
//         error: error.response?.data?.message || 'Failed to create partner', 
//         loading: false 
//       });
//       throw error;
//     }
//   },

//   // In the store, ensure proper error handling:
// updatePartner: async (id: number, formData: FormData) => {
//   set({ loading: true, error: null });
//   try {
//     const updatedPartner = await partnerService.update(id, formData);
//     set(state => ({
//       partners: state.partners.map(partner => 
//         partner.id === id ? updatedPartner : partner
//       ),
//       currentPartner: updatedPartner,
//       loading: false
//     }));
//     toast.success('Partner updated successfully!');
//   } catch (error: any) {
//     const errorMsg = error.response?.data?.message || 'Failed to update partner';
//     set({ error: errorMsg, loading: false });
//     toast.error(errorMsg);
//     throw error;
//   }
// },

// deletePartner: async (id) => {
//   set({ loading: true, error: null });
//   try {
//     await partnerService.delete(id);
//     await get().fetchPartners(); // Refresh list
//     toast.success('Partner deleted successfully!');
//   } catch (error: any) {
//     set({ error: error.response?.data?.message || 'Failed to delete partner', loading: false });
//     throw error;
//   }
// },
//   updatePartnerStatus: async (id, status) => {
//   set({ loading: true, error: null });
//   try {
//     await partnerService.updateStatus(id, status);
//     await get().fetchPartners(); // Refresh list
//     toast.success('Partner status updated successfully!');
//   } catch (error: any) {
//     set({ error: error.response?.data?.message || 'Failed to update status', loading: false });
//     throw error;
//   }
// },

//   clearError: () => set({ error: null }),
//   clearCurrentPartner: () => set({ currentPartner: null }),
// }));


import { create } from 'zustand';
import { Partner } from '../types/partner';
import { partnerService } from '../api/partnerService';
import { toast } from 'sonner';

interface PartnerState {
  partners: Partner[];
  currentPartner: Partner | null;
  loading: boolean;
  error: string | null;
  fetchPartners: () => Promise<void>;
  fetchPartner: (id: number) => Promise<void>;
  createPartner: (formData: FormData) => Promise<void>;
  updatePartner: (id: number, formData: FormData) => Promise<void>;
  deletePartner: (id: number) => Promise<void>;
  updatePartnerStatus: (id: number, status: string) => Promise<void>;
  clearError: () => void;
  clearCurrentPartner: () => void;
}

export const usePartnerStore = create<PartnerState>((set, get) => ({
  partners: [],
  currentPartner: null,
  loading: false,
  error: null,

  fetchPartners: async () => {
    set({ loading: true, error: null });
    try {
      const partners = await partnerService.getAll();
      set({ partners, loading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch partners';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  fetchPartner: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const partner = await partnerService.getById(id);
      set({ currentPartner: partner, loading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch partner';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  createPartner: async (formData: FormData) => {
    set({ loading: true, error: null });
    try {
      const newPartner = await partnerService.create(formData);
      set(state => ({ 
        partners: [...state.partners, newPartner], 
        loading: false 
      }));
      toast.success('Partner created successfully!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create partner';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  updatePartner: async (id: number, formData: FormData) => {
    set({ loading: true, error: null });
    try {
      const updatedPartner = await partnerService.update(id, formData);
      set(state => ({
        partners: state.partners.map(partner => 
          partner.id === id ? updatedPartner : partner
        ),
        currentPartner: state.currentPartner?.id === id ? updatedPartner : state.currentPartner,
        loading: false
      }));
      toast.success('Partner updated successfully!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update partner';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  deletePartner: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await partnerService.delete(id);
      set(state => ({
        partners: state.partners.filter(partner => partner.id !== id),
        currentPartner: state.currentPartner?.id === id ? null : state.currentPartner,
        loading: false
      }));
      toast.success('Partner deleted successfully!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete partner';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  updatePartnerStatus: async (id: number, status: string) => {
    set({ loading: true, error: null });
    try {
      await partnerService.updateStatus(id, status);
      set(state => ({
        partners: state.partners.map(partner => 
          partner.id === id ? { ...partner, status } : partner
        ),
        currentPartner: state.currentPartner?.id === id 
          ? { ...state.currentPartner, status } 
          : state.currentPartner,
        loading: false
      }));
      toast.success('Partner status updated successfully!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update status';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  clearError: () => set({ error: null }),
  clearCurrentPartner: () => set({ currentPartner: null }),
}));