export interface Material {
  id: string;
  name: string;
  sku: string;
  description: string;
  category: string;
  supplier: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  unitPrice: number;
  location: string;
  expiryDate?: string;
  batchNumber?: string;
  inciName?: string;
  casNumber?: string;
  suitableForCosmetics: boolean;
  suitableForSupplements: boolean;
  certifications: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'discontinued' | 'pending';
}

export interface MaterialFormData {
  name: string;
  sku: string;
  description: string;
  category: string;
  supplier: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  unitPrice: number;
  location: string;
  expiryDate?: string;
  batchNumber?: string;
  inciName?: string;
  casNumber?: string;
  suitableForCosmetics: boolean;
  suitableForSupplements: boolean;
  certifications: string[];
  notes: string;
  status: 'active' | 'discontinued' | 'pending';
}

export type SortField = 'name' | 'sku' | 'currentStock' | 'unitPrice' | 'expiryDate' | 'createdAt';
export type SortDirection = 'asc' | 'desc';

export interface FilterOptions {
  category: string[];
  suitableForCosmetics: boolean | null;
  suitableForSupplements: boolean | null;
  status: string[];
  lowStock: boolean;
  expired: boolean;
}