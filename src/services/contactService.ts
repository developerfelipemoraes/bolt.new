import { ApiResponse } from '@/types/api';
import { ContactData } from '@/types/contact';
import { BaseService } from './baseService';

type Paged<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

class ContactService extends BaseService {
  protected baseUrl = import.meta.env.VITE_API_CONTACT_URL || 'http://localhost:8081/api';

  async getContacts(): Promise<ContactData[]> {
    const response = await this.request<Paged<ContactData> | ContactData[]>('/contacts');

    if (!response.Success) return [];

    const data = response.Data;
    if (Array.isArray(data)) {
        return data;
    } else if (data && 'items' in data && Array.isArray(data.items)) {
        return data.items;
    }
    return [];
  }

  async createContact(contact: any): Promise<ContactData> {
    const response = await this.request<ContactData>('/contacts', {
      method: 'POST',
      body: JSON.stringify(contact),
    });
    return response.Data;
  }

  async updateContact(id: string, contact: ContactData): Promise<ContactData> {
    const response = await this.request<ContactData>(`/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(contact),
    });
    return response.Data;
  }

  async deleteContact(id: string): Promise<ApiResponse<void>> {
    return this.request(`/contacts/${id}`, {
      method: 'DELETE',
    });
  }
}

export const contactService = new ContactService();
export default contactService;
