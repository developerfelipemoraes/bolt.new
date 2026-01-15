import { ApiFactory, handleRequest, ApiResponse } from '@/api/factory/apiFactory';
import { API_CONFIG } from '@/api/config/api.config';
import { LoginRequest, LoginResponse, User, Company } from './auth.types';

const api = ApiFactory.getInstance(API_CONFIG.auth.baseURL);

export const AuthService = {
  login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    return handleRequest(api.post<LoginResponse>('/login', credentials));
  },

  logout: (): void => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('company');
  },

  refreshToken: async (): Promise<ApiResponse<void>> => {
    // Placeholder for refresh token logic usually endpoints like /refresh-token
    return handleRequest(api.post('/refresh-token'));
  },

  // User CRUD usually resides in Auth/User Service
  getAllUsers: async (): Promise<ApiResponse<User[]>> => {
    return handleRequest(api.get<User[]>('/users'));
  },

  getUserById: async (id: string): Promise<ApiResponse<User>> => {
    return handleRequest(api.get<User>(`/users/${id}`));
  },

  createUser: async (userData: Partial<User>): Promise<ApiResponse<User>> => {
    return handleRequest(api.post<User>('/users', userData));
  },

  updateUser: async (id: string, updates: Partial<User>): Promise<ApiResponse<User>> => {
    return handleRequest(api.put<User>(`/users/${id}`, updates));
  },

  deleteUser: async (id: string): Promise<ApiResponse<void>> => {
    return handleRequest(api.delete(`/users/${id}`));
  }
};
