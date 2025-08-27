import { ContactDto, ContactStats } from '@/types/contact';
import api from './axioInstance';

export const contactService = {
  // Create a new contact (public)
  createContact: async (contactData: Omit<ContactDto, 'id' | 'submissionDate'>) => {
    const response = await api.post('/contact', contactData);
    return response.data.data;
  },

  // Get all contacts (admin only)
  getAllContacts: async () => {
    const response = await api.get('/contact');
    return response.data.data;
  },

  // Get contact by ID (admin only)
  getContactById: async (id: number) => {
    const response = await api.get(`/contact/${id}`);
    return response.data.data;
  },

  // Update contact (admin only)
  updateContact: async (id: number, contactData: ContactDto) => {
    const response = await api.put(`/contact/${id}`, contactData);
    return response.data;
  },

  // Delete contact (admin only)
  deleteContact: async (id: number) => {
    const response = await api.delete(`/contact/${id}`);
    return response.data.data;
  },

  // Get contact statistics (admin only)
  getContactStats: async () => {
    const response = await api.get('/contact/stats');
    return response.data.data;
  },
};
