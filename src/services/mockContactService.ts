export interface ContactCreatePayload {
  full_name: string;
  email?: string;
  phone_number?: string;
}

export interface ContactCreateResponse {
  status: string;
  contact_id: string;
  message?: string;
}

export interface ContactSearchResult {
  contact_id: string;
  full_name: string;
  email?: string;
  phone_number?: string;
  company?: string;
  created_at: string;
}

const MOCK_CONTACTS: ContactSearchResult[] = [
  {
    contact_id: 'CNT-00456',
    full_name: 'Carlos Mendes',
    email: 'carlos@empresa.com',
    phone_number: '+55 (11) 98765-4321',
    company: 'Transportes Silva',
    created_at: '2025-10-15T10:00:00Z'
  },
  {
    contact_id: 'CNT-00789',
    full_name: 'Maria Silva',
    email: 'maria@transportes.com',
    phone_number: '+55 (21) 99876-5432',
    company: 'Viação Central',
    created_at: '2025-11-01T14:30:00Z'
  }
];

export const mockContactService = {
  async search(query: string): Promise<ContactSearchResult[]> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const lowerQuery = query.toLowerCase().trim();

    if (!lowerQuery) {
      return [...MOCK_CONTACTS];
    }

    return MOCK_CONTACTS.filter(contact => {
      const searchText = `${contact.full_name} ${contact.email} ${contact.phone_number} ${contact.company}`.toLowerCase();
      return searchText.includes(lowerQuery);
    });
  },

  async create(payload: ContactCreatePayload): Promise<ContactCreateResponse> {
    await new Promise(resolve => setTimeout(resolve, 400));

    const newContactId = `CNT-${String(MOCK_CONTACTS.length + 1).padStart(5, '0')}`;

    const newContact: ContactSearchResult = {
      contact_id: newContactId,
      full_name: payload.full_name,
      email: payload.email,
      phone_number: payload.phone_number,
      created_at: new Date().toISOString()
    };

    MOCK_CONTACTS.push(newContact);

    return {
      status: 'success',
      contact_id: newContactId,
      message: 'Contato criado com sucesso'
    };
  },

  async getById(contactId: string): Promise<ContactSearchResult | null> {
    await new Promise(resolve => setTimeout(resolve, 200));

    const contact = MOCK_CONTACTS.find(c => c.contact_id === contactId);
    return contact ? { ...contact } : null;
  }
};
