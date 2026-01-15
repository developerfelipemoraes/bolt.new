// src/api/config/api.config.ts
import { ENV } from './environments';

export const API_CONFIG = {
  auth: {
    baseURL: ENV.AUTH_API_URL,
  },
  contacts: {
    baseURL: ENV.CONTACT_API_URL,
  },
  company: {
    baseURL: ENV.COMPANY_API_URL,
  },
  vehicle: {
    baseURL: ENV.VEHICLE_API_URL,
  },
  reports: {
    baseURL: ENV.VEHICLE_API_URL,
  },
} as const;
