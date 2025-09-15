export interface FormulaIngredient {
  id: string;
  materialId: string;
  materialName: string;
  materialSku: string;
  phase: string; // A, B, C, D, etc.
  percentage: number;
  weightGrams: number;
  additionStage: string;
  notes?: string;
}

export interface ProductionStep {
  id: string;
  stepNumber: number;
  phase: string;
  description: string;
  temperature?: number;
  mixingTime?: number; // minutes
  mixingSpeed?: string; // low, medium, high, or specific RPM
  equipment?: string;
  notes?: string;
}

export interface Formula {
  id: string;
  name: string;
  version: string;
  description: string;
  category: string;
  clientId?: string;
  clientName?: string;
  batchSize: number; // grams
  totalPercentage: number;
  ingredients: FormulaIngredient[];
  productionSteps: ProductionStep[];
  phases: string[];
  developedBy: string;
  developmentDate: string;
  lastModified: string;
  status: 'draft' | 'testing' | 'approved' | 'archived';
  notes: string;
  stability?: string;
  ph?: number;
  viscosity?: string;
  color?: string;
  odor?: string;
  comments: Comment[];
  lastCommentAt?: string;
}

export interface FormulaFormData {
  name: string;
  version: string;
  description: string;
  category: string;
  clientId?: string;
  batchSize: number;
  developedBy: string;
  status: 'draft' | 'testing' | 'approved' | 'archived';
  notes: string;
  stability?: string;
  ph?: number;
  viscosity?: string;
  color?: string;
  odor?: string;
}

export type FormulaSortField = 'name' | 'version' | 'category' | 'developmentDate' | 'lastModified';
export type FormulaSortDirection = 'asc' | 'desc';

export interface FormulaFilterOptions {
  category: string[];
  status: string[];
  developedBy: string[];
  clientId: string[];
}