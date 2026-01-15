import { ApiFactory, handleRequest, ApiResponse } from '@/api/factory/apiFactory';
import { API_CONFIG } from '@/api/config/api.config';
import { ContactData, PagedContacts } from './contacts.types';

const api = ApiFactory.getInstance(API_CONFIG.contacts.baseURL);

export const ContactService = {
  getContacts: async (): Promise<ApiResponse<PagedContacts | ContactData[]>> => {
    return handleRequest(api.get<PagedContacts | ContactData[]>('/contacts'));
  },

  createContact: async (contact: Partial<ContactData>): Promise<ApiResponse<ContactData>> => {
    return handleRequest(api.post<ContactData>('/contacts', contact));
  },

  updateContact: async (id: string, contact: Partial<ContactData>): Promise<ApiResponse<ContactData>> => {
    return handleRequest(api.put<ContactData>(`/contacts/${id}`, contact));
  },

  deleteContact: async (id: string): Promise<ApiResponse<void>> => {
    return handleRequest(api.delete(`/contacts/${id}`));
  }
};
