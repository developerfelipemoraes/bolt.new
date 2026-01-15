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

export interface YearEntry {
  manufactureYear: number;
  modelYear: number;
}

export interface YearRange {
  start: number;
  end: number;
}

export interface YearRules {
  sources: string[];
  logic: string;
}

export interface ChassisModelComplete {
  _id?: { $oid: string };
  id?: { oid: string };
  chassisManufacturer: string;
  model: string;
  drivetrain: string | null;
  axleCount: number | null;
  type: string | null;
  segment: string | null;
  vehicleType: string | null;
  productionStart: number | null;
  manufactureYear: number;
  modelYear: number;
  productionEnd: number | null;
  enginePosition: string;
  emissionStandard: string;
  engineModel: string;
  engineType: string;
  maxPower: string;
  maxTorque: string;
  measurementStandard: string;
  fuel: string;
  emissionControl: string;
  crankshaftMainBearings: string;
  valveLocation: string;
  displacement: string;
  cylinderBore: string;
  pistonStroke: string;
  compressionRatio: string;
  specificConsumption: string;
  airCompressor: string;
  firingOrder: string;
  oilPumpType: string;
  airIntakeSystem: string;
  fuelSystem: string;
  lubricationSystem: string;
  coolingSystem: string;
  injectionPumpModel: string;
  injectorPumpType: string;
  injectionPumpGovernor: string;
  injectionSystem: string;
  injectionPressure: string;
  compressorModel: string;
  compressorCylinderBore: string;
  compressorPistonStroke: string;
  compressorDisplacement: string;
  compressorCylinderCount: string;
  compressorCooling: string;
  compressorDrive: string;
  compressorFlow: string;
  transmissionModel: string;
  transmissionActuation: string;
  synchronizedGears: string;
  transmissionSummary: string;
  gearRatiosDetailed: string;
  frontSuspensionType: string;
  frontShockAbsorbers: string;
  rearShockAbsorbersType: string;
  rearShockAbsorbers: string;
  intermediateSuspensionType: string;
  intermediateShockAbsorbers: string;
  intermediateStabilizerBar: string;
  kneelingSystem: string;
  wheelRims: string;
  optionalRims: string;
  tires: string;
  optionalTires: string;
  rearDualWheels: string;
  otherTires: string;
  frameType: string;
  frameRailsDimensions: string;
  sectionModulus: string;
  material: string;
  frameLubrication: string;
  frameArticulation: string;
  serviceBrakeType: string;
  serviceBrakeModel: string;
  totalFrictionArea: string;
  liningThickness: string;
  discDiameter: string;
  drumDiameter: string;
  frontLiningWidth: string;
  rearLiningWidth: string;
  brakeSystemPressure: string;
  parkingBrakeType: string;
  engineBrakeType: string;
  retarderType: string;
  additionalBrakeType: string;
  absType: string;
  yearEntries: YearEntry[];
  yearRanges: YearRange[];
  yearRules: YearRules;
  sourceCount: number;
  articulaoquadrochassi: string | null;
  categories: string | null;
  name: string | null;
}

export interface ChassisModel {
  id: string;
  manufacturer: string; // Changed from chassisManufacturer
  chassisModel: string; // Changed from model
  type?: string;
  // manufactureYear and modelYear are not in the root of the list item
  manufactureModelYearPairs?: {
    manufactureYear: number;
    modelYear: number;
    label: string;
  }[];
  yearEntries?: YearEntry[]; // Keeping this for backward compatibility if used elsewhere, but api returns manufactureModelYearPairs
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

export const updateChassisSchema = createChassisMinimalSchema.partial();
