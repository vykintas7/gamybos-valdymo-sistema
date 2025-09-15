import { useState, useEffect, useMemo } from 'react';
import { Material, MaterialFormData, SortField, SortDirection, FilterOptions } from '../types/material';

const STORAGE_KEY = 'materials_data';

// Generate unique ID
const generateUniqueId = () => {
  return Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9);
};

// Mock data for demonstration
const mockMaterials: Material[] = [
  {
    id: '1-mock-ha001',
    name: 'Hialurono rūgšties milteliai',
    sku: 'HA-001',
    description: 'Didelio molekulinio svorio hialurono rūgštis odos priežiūros produktams',
    category: 'Aktyvūs ingredientai',
    supplier: 'BioChem sprendimai',
    currentStock: 150,
    minStock: 50,
    maxStock: 500,
    unit: 'kg',
    unitPrice: 485.00,
    location: 'A-12-3',
    expiryDate: '2025-08-15',
    batchNumber: 'HA240215',
    inciName: 'Sodium Hyaluronate',
    casNumber: '9067-32-7',
    suitableForCosmetics: true,
    suitableForSupplements: false,
    certifications: ['ISO 9001', 'Cosmos patvirtinta', 'USP klasė'],
    notes: 'Laikyti vėsioje, sausoje vietoje. Higroskopinė medžiaga.',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-12-01T14:22:00Z',
    status: 'active'
  },
  {
    id: '2-mock-vc002',
    name: 'Vitaminas C (L-askorbo rūgštis)',
    sku: 'VC-002',
    description: 'Gryna L-askorbo rūgštis kosmetikos ir maisto papildų gamybai',
    category: 'Vitaminai',
    supplier: 'NutriChem pramonė',
    currentStock: 25,
    minStock: 30,
    maxStock: 200,
    unit: 'kg',
    unitPrice: 125.50,
    location: 'B-08-1',
    expiryDate: '2025-06-30',
    batchNumber: 'VC240118',
    inciName: 'Ascorbic Acid',
    casNumber: '50-81-7',
    suitableForCosmetics: true,
    suitableForSupplements: true,
    certifications: ['FDA patvirtinta', 'ISO 9001', 'GMP sertifikuota'],
    notes: 'Jautri šviesai. Saugoti nuo karščio ir drėgmės.',
    createdAt: '2024-01-18T09:15:00Z',
    updatedAt: '2024-12-01T16:45:00Z',
    status: 'active'
  },
  {
    id: '3-mock-col003',
    name: 'Kolageno peptidai',
    sku: 'COL-003',
    description: 'Jūrų kolageno peptidai maisto papildų gamybai',
    category: 'Baltymai',
    supplier: 'Jūrų biotechnologijos UAB',
    currentStock: 85,
    minStock: 40,
    maxStock: 300,
    unit: 'kg',
    unitPrice: 95.75,
    location: 'C-15-2',
    expiryDate: '2024-12-20',
    batchNumber: 'COL240201',
    suitableForCosmetics: false,
    suitableForSupplements: true,
    certifications: ['HACCP', 'Halal', 'Ne-GMO'],
    notes: 'Tik maisto klasės. Netinka išoriniam naudojimui.',
    createdAt: '2024-02-01T11:45:00Z',
    updatedAt: '2024-11-28T13:20:00Z',
    status: 'active'
  },
  {
    id: '4-mock-sb004',
    name: 'Ši sviesto (rafinuotas)',
    sku: 'SB-004',
    description: 'Aukščiausios kokybės rafinuotas ši sviestas kosmetikos formulėms',
    category: 'Natūralūs sviestai',
    supplier: 'Afrikos natūralūs produktai UAB',
    currentStock: 120,
    minStock: 60,
    maxStock: 400,
    unit: 'kg',
    unitPrice: 18.25,
    location: 'D-03-1',
    expiryDate: '2026-03-15',
    batchNumber: 'SB240110',
    inciName: 'Butyrospermum Parkii (Shea) Butter',
    casNumber: '194043-92-0',
    suitableForCosmetics: true,
    suitableForSupplements: false,
    certifications: ['Ekologiškas', 'Sąžininga prekyba', 'Cosmos patvirtinta'],
    notes: 'Natūralūs spalvos skirtumai yra normalūs. Laikyti žemiau 25°C.',
    createdAt: '2024-01-10T14:20:00Z',
    updatedAt: '2024-11-30T10:15:00Z',
    status: 'active'
  },
  {
    id: '5-mock-mg005',
    name: 'Magnio oksidas',
    sku: 'MG-005',
    description: 'Farmacijos klasės magnio oksidas',
    category: 'Mineralai',
    supplier: 'Farmacijos klasės mineralai',
    currentStock: 200,
    minStock: 100,
    maxStock: 600,
    unit: 'kg',
    unitPrice: 12.80,
    location: 'E-07-4',
    expiryDate: '2027-01-30',
    batchNumber: 'MG240305',
    suitableForCosmetics: false,
    suitableForSupplements: true,
    certifications: ['USP', 'Ph. Eur.', 'GMP sertifikuota'],
    notes: 'Aukšto grynumo klasė, tinkama farmacijos reikmėms.',
    createdAt: '2024-03-05T08:30:00Z',
    updatedAt: '2024-11-25T15:40:00Z',
    status: 'active'
  }
];

export const useMaterials = () => {
  const [allMaterials, setAllMaterials] = useState<Material[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure all materials have unique IDs
        const materialsWithUniqueIds = parsed.map((material: Material, index: number) => ({
          ...material,
          id: material.id || generateUniqueId()
        }));
        return materialsWithUniqueIds;
      }
    } catch (error) {
      console.error('Error loading materials from localStorage:', error);
    }
    return mockMaterials;
  });
  
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filters, setFilters] = useState<FilterOptions>({
    category: [],
    suitableForCosmetics: null,
    suitableForSupplements: null,
    status: [],
    lowStock: false,
    expired: false
  });

  // Save to localStorage whenever materials change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allMaterials));
    } catch (error) {
      console.error('Error saving materials to localStorage:', error);
    }
  }, [allMaterials]);

  const filteredAndSortedMaterials = useMemo(() => {
    let filtered = allMaterials.filter(material => {
      const matchesSearch = searchTerm === '' || 
        material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.supplier.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = filters.category.length === 0 || filters.category.includes(material.category);
      
      const matchesCosmetics = filters.suitableForCosmetics === null || 
        material.suitableForCosmetics === filters.suitableForCosmetics;
      
      const matchesSupplements = filters.suitableForSupplements === null || 
        material.suitableForSupplements === filters.suitableForSupplements;
      
      const matchesStatus = filters.status.length === 0 || filters.status.includes(material.status);
      
      const matchesLowStock = !filters.lowStock || material.currentStock <= material.minStock;
      
      const matchesExpired = !filters.expired || (material.expiryDate && new Date(material.expiryDate) < new Date());

      return matchesSearch && matchesCategory && matchesCosmetics && 
             matchesSupplements && matchesStatus && matchesLowStock && matchesExpired;
    });

    // Sort materials
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'createdAt' || sortField === 'expiryDate') {
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
  }, [allMaterials, searchTerm, sortField, sortDirection, filters]);

  const addMaterial = (materialData: MaterialFormData) => {
    const newMaterial: Material = {
      id: generateUniqueId(),
      ...materialData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setAllMaterials(prev => [...prev, newMaterial]);
    return newMaterial.id;
  };

  const updateMaterial = (id: string, materialData: Partial<MaterialFormData>) => {
    setAllMaterials(prev => prev.map(material => 
      material.id === id 
        ? { 
            ...material, 
            ...materialData, 
            updatedAt: new Date().toISOString() 
          }
        : material
    ));
  };

  const deleteMaterial = (id: string) => {
    setAllMaterials(prev => prev.filter(material => material.id !== id));
  };

  const categories = useMemo(() => {
    return Array.from(new Set(allMaterials.map(m => m.category))).sort();
  }, [allMaterials]);

  const updateSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return {
    materials: filteredAndSortedMaterials,
    allMaterials,
    loading,
    searchTerm,
    setSearchTerm,
    sortField,
    sortDirection,
    updateSort,
    filters,
    setFilters,
    categories,
    addMaterial,
    updateMaterial,
    deleteMaterial
  };
};