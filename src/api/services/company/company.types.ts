export interface CompanyData {
  id?: string;
  _id?: string;
  name: string;
  type: string;
  logo: string;
  description: string;
  settings: any;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PagedCompanies {
  items: CompanyData[];
  total: number;
  page: number;
  limit: number;
}
