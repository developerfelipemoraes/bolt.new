import { z } from "zod";

export interface ChassisSearchParams {
  chassisManufacturer?: string;
  model?: string;
  manufactureYear?: number | string;
  modelYear?: number | string;
  enginePosition?: string;
  drivetrain?: string;
  axleCount?: number | string;
  category?: string;
  subcategory?: string;
  page?: number | string;
  pageSize?: number | string;
}

export interface BodyworkSearchParams {
  bodyManufacturer?: string;
  model?: string;
  manufactureYear?: number | string;
  modelYear?: number | string;
  category?: string;
  subcategory?: string;
  page?: number | string;
  pageSize?: number | string;
}

export interface ChassisModel {
  id: string;
  chassisManufacturer: string;
  model: string;
  manufactureYear: number;
  modelYear: number;
  enginePosition?: string;
  drivetrain?: string;
  axleCount?: number;
  category?: string;
  subcategory?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChassisModelSummary {
  id: string;
  chassisManufacturer: string;
  model: string;
  manufactureYear: number;
  modelYear: number;
}

export interface BodyworkModel {
  id: string;
  bodyManufacturer: string;
  model: string;
  manufactureYear: number;
  modelYear: number;
  category: string;
  subcategory: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateChassisMinimal {
  chassisManufacturer: string;
  model: string;
  manufactureYear: number;
  modelYear: number;
  drivetrain?: string;
  enginePosition?: string;
  category?: string;
  subcategory?: string;
  axleCount?: number;
}

export interface CreateBodyworkMinimal {
  bodyManufacturer: string;
  model: string;
  manufactureYear: number;
  modelYear: number;
  category: string;
  subcategory: string;
}

export interface PagedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export const chassisSearchParamsSchema = z.object({
  chassisManufacturer: z.string().trim().optional(),
  model: z.string().trim().optional(),
  manufactureYear: z.coerce.number().int().positive().optional(),
  modelYear: z.coerce.number().int().positive().optional(),
  enginePosition: z.string().trim().optional(),
  drivetrain: z.string().trim().optional(),
  axleCount: z.coerce.number().int().positive().optional(),
  category: z.string().trim().optional(),
  subcategory: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(200).optional(),
});

export const bodyworkSearchParamsSchema = z.object({
  bodyManufacturer: z.string().trim().optional(),
  model: z.string().trim().optional(),
  manufactureYear: z.coerce.number().int().positive().optional(),
  modelYear: z.coerce.number().int().positive().optional(),
  category: z.string().trim().optional(),
  subcategory: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(200).optional(),
});

export const createChassisMinimalSchema = z.object({
  chassisManufacturer: z.string().min(1, "Fabricante é obrigatório"),
  model: z.string().min(1, "Modelo é obrigatório"),
  manufactureYear: z.coerce.number().int().positive().min(1900, "Ano de fabricação inválido"),
  modelYear: z.coerce.number().int().positive().min(1900, "Ano do modelo inválido"),
  drivetrain: z.string().optional(),
  enginePosition: z.string().optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  axleCount: z.coerce.number().int().positive().optional(),
});

export const createBodyworkMinimalSchema = z.object({
  bodyManufacturer: z.string().min(1, "Fabricante é obrigatório"),
  model: z.string().min(1, "Modelo é obrigatório"),
  manufactureYear: z.coerce.number().int().positive().min(1900, "Ano de fabricação inválido"),
  modelYear: z.coerce.number().int().positive().min(1900, "Ano do modelo inválido"),
  category: z.string().min(1, "Categoria é obrigatória"),
  subcategory: z.string().min(1, "Subcategoria é obrigatória"),
});

export const updateChassisSchema = createChassisMinimalSchema.partial();
export const updateBodyworkSchema = createBodyworkMinimalSchema.partial();
