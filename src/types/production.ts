export interface ProductionBatch {
  id: string;
  batchNumber: string;
  formulaId: string;
  formulaName: string;
  formulaVersion: string;
  clientId?: string;
  clientName?: string;
  unitsToProduct: number;
  volumePerUnit: number; // ml
  totalVolume: number; // ml
  totalWeight: number; // g
  productionDate: string;
  plannedDate?: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  ingredients: ProductionIngredient[];
  totalCost: number;
  costPerUnit: number;
  producedBy: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
}

export interface ProductionIngredient {
  id: string;
  materialId: string;
  materialName: string;
  materialSku: string;
  requiredAmount: number; // g
  unitPrice: number;
  totalCost: number;
  phase: string;
  notes?: string;
}

export interface ProductionFormData {
  formulaId: string;
  clientId?: string;
  unitsToProduct: number;
  volumePerUnit: number;
  productionDate: string;
  plannedDate?: string;
  notes: string;
}

export type ProductionSortField = 'batchNumber' | 'formulaName' | 'productionDate' | 'status' | 'totalCost';
export type ProductionSortDirection = 'asc' | 'desc';

export interface ProductionFilterOptions {
  status: string[];
  formulaId: string[];
  clientId: string[];
  dateRange: {
    start?: string;
    end?: string;
  };
}