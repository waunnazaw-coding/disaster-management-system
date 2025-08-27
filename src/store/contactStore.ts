import { create } from 'zustand';
import { contactService } from '../api/contactService';
import { ContactDto, ContactStats, ContactFormData } from '../types/contact';
import { toast } from 'sonner';

interface ContactState {
  contacts: ContactDto[];
  stats: ContactStats | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  createContact: (contactData: ContactFormData) => Promise<void>;
  fetchAllContacts: () => Promise<void>;
  fetchContactById: (id: number) => Promise<ContactDto | null>;
  updateContact: (id: number, contactData: ContactDto) => Promise<void>;
  deleteContact: (id: number) => Promise<void>;
  fetchContactStats: () => Promise<void>;

  // Selector
  getContactById: (id: number) => ContactDto | undefined;
}

export const useContactStore = create<ContactState>((set, get) => ({
  contacts: [],
  stats: null,
  isLoading: false,
  error: null,

  // ✅ Create new contact (public)
  createContact: async (contactData) => {
    set({ isLoading: true, error: null });
    try {
      const result = await contactService.createContact(contactData);
      set({ isLoading: false });

      toast.success('Your message has been sent successfully!');

      return result;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to send message';
      set({ error: errorMessage, isLoading: false });

      toast.error(errorMessage);

      throw error;
    }
  },

  // ✅ Get all contacts
  fetchAllContacts: async () => {
    set({ isLoading: true, error: null });
    try {
      const contacts = await contactService.getAllContacts();
      set({ contacts, isLoading: false });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to fetch contacts';
      set({ error: errorMessage, isLoading: false });

      toast.error(errorMessage);

      throw error;
    }
  },

  // ✅ Get contact by ID
  fetchContactById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const contact = await contactService.getContactById(id);
      set({ isLoading: false });
      return contact;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to fetch contact';
      set({ error: errorMessage, isLoading: false });

      toast.error(errorMessage);

      throw error;
    }
  },

  // ✅ Update contact
  updateContact: async (id: number, contactData: ContactDto) => {
    set({ isLoading: true, error: null });
    try {
      await contactService.updateContact(id, contactData);

      // update state
      const contacts = get().contacts.map((c) =>
        c.id === id ? { ...contactData } : c
      );
      set({ contacts, isLoading: false });

      toast.success('Contact updated successfully!');
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to update contact';
      set({ error: errorMessage, isLoading: false });

      toast.error(errorMessage);

      throw error;
    }
  },

  // ✅ Delete contact
  deleteContact: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await contactService.deleteContact(id);

      // update state
      const contacts = get().contacts.filter((c) => c.id !== id);
      set({ contacts, isLoading: false });

      toast.success('Contact deleted successfully!');
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to delete contact';
      set({ error: errorMessage, isLoading: false });

      toast.error(errorMessage);

      throw error;
    }
  },

  // ✅ Fetch statistics
  fetchContactStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const stats = await contactService.getContactStats();
      set({ stats, isLoading: false });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to fetch contact stats';
      set({ error: errorMessage, isLoading: false });

      toast.error(errorMessage);

      throw error;
    }
  },

  // ✅ Selector
  getContactById: (id: number) => {
    return get().contacts.find((c) => c.id === id);
  },
}));
