export interface ContactData {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  companyId?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PagedContacts {
  items: ContactData[];
  total: number;
  page: number;
  limit: number;
}
