export interface User {
  id: string;
  email: string;
  name: string;
  tenatyId: string;
  companyId: string;
  role: string;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
}

export interface Company {
  id: string;
  name: string;
  type: 'master' | 'client';
  logo: string;
  description: string;
  settings: any;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
    tenaty: string;
  };
  company: {
    _id: string;
    name: string;
    type: string;
    logo: string;
    description: string;
    settings: any;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  expiresIn: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
