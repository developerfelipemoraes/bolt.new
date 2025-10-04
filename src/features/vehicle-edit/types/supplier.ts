export type SupplierType = "company" | "individual";

export interface SupplierLink {
  supplierId: string;
  type: SupplierType;
  name: string;
  document: string;
  email?: string;
  phone?: string;
}

export interface Supplier {
  id: string;
  type: SupplierType;
  name: string;
  document: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
