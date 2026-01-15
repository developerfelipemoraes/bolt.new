// src/api/config/environments.ts

// Configuration for environment variables mapping
export const ENV = {
  AUTH_API_URL: import.meta.env.VITE_API_AUTH_URL || 'http://localhost:8081/api/auth',
  CONTACT_API_URL: import.meta.env.VITE_API_CONTACT_URL || 'http://localhost:8081/api',
  COMPANY_API_URL: import.meta.env.VITE_API_COMPANY_URL || 'http://localhost:8081/api',
  VEHICLE_API_URL: import.meta.env.VITE_API_VEHICLE_URL || 'http://localhost:8084/api',
} as const;

export type ApiDomain = keyof typeof ENV;
