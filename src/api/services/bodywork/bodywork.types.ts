import { z } from "zod";

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

export interface YearEntry {
  manufactureYear: number;
  modelYear: number;
}

export interface YearRange {
  start: number;
  end: number;
}

export interface BodyworkModel {
  id: string;
  bodyManufacturer: string;
  model: string;
  manufactureYear: number | null;
  modelYear: number | null;
  category: string;
  subcategory: string;
  categories: string[] | null;
  productionStart: number;
  productionEnd: number;
  application: string | null;
  engine: string | null;
  bodyType: string | null;
  yearEntries: YearEntry[];
  yearRanges: YearRange[];
  yearRules_logic?: any | null;
  yearRules_sources?: any | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBodyworkMinimal {
  bodyManufacturer: string;
  model: string;
  manufactureYear: number | null;
  modelYear: number | null;
  category: string;
  subcategory: string;
  categories: string[] | null;
  productionStart: number;
  productionEnd: number;
  application: string | null;
  engine: string | null;
  bodyType: string | null;
  yearEntries: YearEntry[];
  yearRanges: YearRange[];
  yearRules_logic?: any | null;
  yearRules_sources?: any | null;
}

export interface PagedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

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

const baseBodyworkSchema = z.object({
  bodyManufacturer: z.string().min(1, "Fabricante é obrigatório"),
  model: z.string().min(1, "Modelo é obrigatório"),
  manufactureYear: z.coerce.number().int().positive().nullable(),
  modelYear: z.coerce.number().int().positive().nullable(),
  category: z.string().min(1, "Categoria é obrigatória"),
  subcategory: z.string().min(1, "Subcategoria é obrigatória"),
  categories: z.array(z.string()).nullable(),
  productionStart: z.coerce.number().int().positive().min(1900, "Ano inicial inválido"),
  productionEnd: z.coerce.number().int().positive().min(1900, "Ano final inválido"),
  application: z.string().nullable(),
  engine: z.string().nullable(),
  bodyType: z.string().nullable(),
  yearEntries: z.array(z.object({
    manufactureYear: z.number().int().positive(),
    modelYear: z.number().int().positive()
  })),
  yearRanges: z.array(z.object({
    start: z.number().int().positive(),
    end: z.number().int().positive()
  })),
  yearRules_logic: z.any().nullable().optional(),
  yearRules_sources: z.any().nullable().optional(),
});

export const createBodyworkMinimalSchema = baseBodyworkSchema.refine(data => data.productionStart <= data.productionEnd, {
  message: "Ano final deve ser maior ou igual ao ano inicial",
  path: ["productionEnd"]
});

export const updateBodyworkSchema = baseBodyworkSchema.partial();
