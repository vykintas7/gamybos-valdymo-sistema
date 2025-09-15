import { useState, useEffect, useMemo } from 'react';
import { ProductionBatch, ProductionFormData, ProductionIngredient, ProductionSortField, ProductionSortDirection, ProductionFilterOptions } from '../types/production';
import { useFormulas } from './useFormulas';
import { useMaterials } from './useMaterials';
import { useClients } from './useClients';
import { useAuth } from '../contexts/AuthContext';

const PRODUCTION_STORAGE_KEY = 'production_batches';

const getInitialBatches = (): ProductionBatch[] => {
  try {
    const saved = localStorage.getItem(PRODUCTION_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading production batches from localStorage:', error);
  }
  return [];
};

export const useProduction = () => {
  const { currentUser } = useAuth();
  const { formulas } = useFormulas();
  const { materials, updateMaterial } = useMaterials();
  const { allClients } = useClients();
  
  const [batches, setBatches] = useState<ProductionBatch[]>(getInitialBatches);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<ProductionSortField>('productionDate');
  const [sortDirection, setSortDirection] = useState<ProductionSortDirection>('desc');
  const [filters, setFilters] = useState<ProductionFilterOptions>({
    status: [],
    formulaId: [],
    clientId: [],
    dateRange: {}
  });

  // Save batches to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTION_STORAGE_KEY, JSON.stringify(batches));
    } catch (error) {
      console.error('Error saving production batches to localStorage:', error);
    }
  }, [batches]);

  const filteredAndSortedBatches = useMemo(() => {
    let filtered = batches.filter(batch => {
      const matchesSearch = searchTerm === '' || 
        batch.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        batch.formulaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (batch.clientName && batch.clientName.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = filters.status.length === 0 || filters.status.includes(batch.status);
      const matchesFormula = filters.formulaId.length === 0 || filters.formulaId.includes(batch.formulaId);
      const matchesClient = filters.clientId.length === 0 || (batch.clientId && filters.clientId.includes(batch.clientId));

      let matchesDateRange = true;
      if (filters.dateRange.start || filters.dateRange.end) {
        const batchDate = new Date(batch.productionDate);
        if (filters.dateRange.start) {
          matchesDateRange = matchesDateRange && batchDate >= new Date(filters.dateRange.start);
        }
        if (filters.dateRange.end) {
          matchesDateRange = matchesDateRange && batchDate <= new Date(filters.dateRange.end);
        }
      }

      return matchesSearch && matchesStatus && matchesFormula && matchesClient && matchesDateRange;
    });

    // Sort batches
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'productionDate') {
        aValue = new Date(aValue || 0).getTime();
        bValue = new Date(bValue || 0).getTime();
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [batches, searchTerm, sortField, sortDirection, filters]);

  const generateBatchNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const time = Date.now().toString().slice(-4);
    return `P${year}${month}${day}-${time}`;
  };

  const calculateProductionCost = (formula: any, scaleFactor: number): { ingredients: ProductionIngredient[], totalCost: number } => {
    const productionIngredients: ProductionIngredient[] = [];
    let totalCost = 0;

    formula.ingredients.forEach((ingredient: any) => {
      const material = materials.find(m => m.id === ingredient.materialId);
      if (material) {
        const requiredAmount = ingredient.weightGrams * scaleFactor;
        const ingredientCost = (requiredAmount / 1000) * material.unitPrice; // Convert g to kg for cost calculation
        
        productionIngredients.push({
          id: ingredient.id,
          materialId: material.id,
          materialName: material.name,
          materialSku: material.sku,
          requiredAmount,
          unitPrice: material.unitPrice,
          totalCost: ingredientCost,
          phase: ingredient.phase,
          notes: ingredient.notes
        });

        totalCost += ingredientCost;
      }
    });

    return { ingredients: productionIngredients, totalCost };
  };

  const createProductionBatch = (data: ProductionFormData): string | null => {
    if (!currentUser) return null;

    const formula = formulas.find(f => f.id === data.formulaId);
    if (!formula) return null;

    const client = data.clientId ? allClients.find(c => c.id === data.clientId) : undefined;
    const totalVolume = data.unitsToProduct * data.volumePerUnit;
    const scaleFactor = totalVolume / formula.batchSize; // Scale factor based on volume

    const { ingredients, totalCost } = calculateProductionCost(formula, scaleFactor);
    const costPerUnit = totalCost / data.unitsToProduct;

    const newBatch: ProductionBatch = {
      id: Date.now().toString(),
      batchNumber: generateBatchNumber(),
      formulaId: formula.id,
      formulaName: formula.name,
      formulaVersion: formula.version,
      clientId: data.clientId,
      clientName: client?.name,
      unitsToProduct: data.unitsToProduct,
      volumePerUnit: data.volumePerUnit,
      totalVolume,
      totalWeight: formula.batchSize * scaleFactor,
      productionDate: data.productionDate,
      plannedDate: data.plannedDate,
      status: data.plannedDate ? 'planned' : 'in_progress',
      ingredients,
      totalCost,
      costPerUnit,
      producedBy: `${currentUser.firstName} ${currentUser.lastName}`,
      notes: data.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setBatches(prev => [...prev, newBatch]);
    return newBatch.id;
  };

  const startProduction = (batchId: string): boolean => {
    const batch = batches.find(b => b.id === batchId);
    if (!batch || batch.status !== 'planned') return false;

    // Check if we have enough materials
    for (const ingredient of batch.ingredients) {
      const material = materials.find(m => m.id === ingredient.materialId);
      if (!material) return false;
      
      const requiredAmountKg = ingredient.requiredAmount / 1000;
      if (material.currentStock < requiredAmountKg) {
        alert(`Nepakanka žaliavos: ${material.name}. Reikia: ${requiredAmountKg}kg, turima: ${material.currentStock}kg`);
        return false;
      }
    }

    // Deduct materials from inventory
    batch.ingredients.forEach(ingredient => {
      const requiredAmountKg = ingredient.requiredAmount / 1000;
      updateMaterial(ingredient.materialId, {
        currentStock: materials.find(m => m.id === ingredient.materialId)!.currentStock - requiredAmountKg
      });
    });

    // Update batch status
    setBatches(prev => prev.map(b => 
      b.id === batchId 
        ? { 
            ...b, 
            status: 'in_progress', 
            startedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        : b
    ));

    return true;
  };

  const completeProduction = (batchId: string) => {
    setBatches(prev => prev.map(batch => 
      batch.id === batchId 
        ? { 
            ...batch, 
            status: 'completed', 
            completedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        : batch
    ));
  };

  const cancelProduction = (batchId: string) => {
    setBatches(prev => prev.map(batch => 
      batch.id === batchId 
        ? { 
            ...batch, 
            status: 'cancelled',
            updatedAt: new Date().toISOString()
          }
        : batch
    ));
  };

  const deleteBatch = (batchId: string) => {
    setBatches(prev => prev.filter(batch => batch.id !== batchId));
  };

  const updateSort = (field: ProductionSortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return {
    batches: filteredAndSortedBatches,
    allBatches: batches,
    loading,
    searchTerm,
    setSearchTerm,
    sortField,
    sortDirection,
    updateSort,
    filters,
    setFilters,
    createProductionBatch,
    startProduction,
    completeProduction,
    cancelProduction,
    deleteBatch,
    calculateProductionCost
  };
};