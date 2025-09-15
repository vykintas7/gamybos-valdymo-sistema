import { useState, useEffect, useMemo } from 'react';
import { Formula, FormulaFormData, FormulaSortField, FormulaSortDirection, FormulaFilterOptions } from '../types/formula';
import { useClients } from './useClients';
import { useComments } from './useComments';
import { useAuth } from '../contexts/AuthContext';

const FORMULAS_STORAGE_KEY = 'formulas_data';

// Mock data for demonstration
const getInitialFormulas = (): Formula[] => {
  try {
    const saved = localStorage.getItem(FORMULAS_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading formulas from localStorage:', error);
  }
  
  return [
  {
    id: '1',
    name: 'Drėkinamasis veido kremas',
    version: '1.2',
    description: 'Lengvas drėkinamasis kremas normaliai ir sausai odai',
    category: 'Veido priežiūra',
    batchSize: 1000,
    totalPercentage: 100,
    clientId: '1',
    clientName: 'UAB "Grožio namai"',
    ingredients: [
      {
        id: '1',
        materialId: '1',
        materialName: 'Hialurono rūgšties milteliai',
        materialSku: 'HA-001',
        phase: 'A',
        percentage: 0.5,
        weightGrams: 5,
        additionStage: 'Vandens fazės paruošimas',
        notes: 'Ištirpinti šiltame vandenyje'
      },
      {
        id: '2',
        materialId: '4',
        materialName: 'Ši sviesto (rafinuotas)',
        materialSku: 'SB-004',
        phase: 'B',
        percentage: 5.0,
        weightGrams: 50,
        additionStage: 'Riebalų fazės paruošimas',
        notes: 'Ištirpinti 70°C temperatūroje'
      }
    ],
    productionSteps: [
      {
        id: '1',
        stepNumber: 1,
        phase: 'A',
        description: 'Paruošti vandens fazę',
        temperature: 70,
        mixingTime: 10,
        mixingSpeed: 'vidutinis',
        equipment: 'Maišytuvas su šildymu',
        notes: 'Maišyti iki visiško ištirpimo'
      },
      {
        id: '2',
        stepNumber: 2,
        phase: 'B',
        description: 'Paruošti riebalų fazę',
        temperature: 70,
        mixingTime: 15,
        mixingSpeed: 'lėtas',
        equipment: 'Maišytuvas su šildymu',
        notes: 'Maišyti iki homogeniškos masės'
      }
    ],
    phases: ['A', 'B', 'C'],
    developedBy: 'Jonas Jonaitis',
    developmentDate: '2024-01-15T10:30:00Z',
    lastModified: '2024-12-01T14:22:00Z',
    status: 'approved',
    notes: 'Stabili formulė, tinka masinei gamybai',
    stability: '24 mėnesiai',
    ph: 5.5,
    viscosity: 'Vidutinė',
    color: 'Balta',
    odor: 'Neutralus',
    comments: [],
    lastCommentAt: '2024-12-02T09:20:00Z'
  },
  {
    id: '2',
    name: 'Apsauginis saulės kremas SPF30',
    version: '2.0',
    description: 'Apsauginis saulės kremas su mineraliniais filtrais',
    category: 'Saulės apsauga',
    batchSize: 500,
    totalPercentage: 100,
    clientId: '2',
    clientName: 'SPA centras "Harmonija"',
    ingredients: [],
    productionSteps: [],
    phases: ['A', 'B'],
    developedBy: 'Marija Petraitienė',
    developmentDate: '2024-02-20T09:15:00Z',
    lastModified: '2024-11-28T16:45:00Z',
    status: 'testing',
    notes: 'Testuojama stabilumo analizė',
    stability: 'Testuojama',
    ph: 6.0,
    viscosity: 'Tiršta',
    color: 'Šviesiai geltona',
    odor: 'Lengvas',
    comments: []
  }
  ];
};

export const useFormulas = () => {
  const { allClients } = useClients();
  const { allUsers } = useAuth();
  const [formulas, setFormulas] = useState<Formula[]>(getInitialFormulas);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<FormulaSortField>('name');
  const [sortDirection, setSortDirection] = useState<FormulaSortDirection>('asc');
  const [filters, setFilters] = useState<FormulaFilterOptions>({
    category: [],
    status: [],
    developedBy: [],
    clientId: []
  });

  // Save formulas to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(FORMULAS_STORAGE_KEY, JSON.stringify(formulas));
    } catch (error) {
      console.error('Error saving formulas to localStorage:', error);
    }
  }, [formulas]);

  const filteredAndSortedFormulas = useMemo(() => {
    let filtered = formulas.filter(formula => {
      const matchesSearch = searchTerm === '' || 
        formula.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formula.version.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formula.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = filters.category.length === 0 || filters.category.includes(formula.category);
      const matchesStatus = filters.status.length === 0 || filters.status.includes(formula.status);
      const matchesDeveloper = filters.developedBy.length === 0 || filters.developedBy.includes(formula.developedBy);
      const matchesClient = filters.clientId.length === 0 || (formula.clientId && filters.clientId.includes(formula.clientId));

      return matchesSearch && matchesCategory && matchesStatus && matchesDeveloper && matchesClient;
    });

    // Sort formulas
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'developmentDate' || sortField === 'lastModified') {
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
  }, [formulas, searchTerm, sortField, sortDirection, filters]);

  const addFormula = (formulaData: FormulaFormData) => {
    const client = formulaData.clientId ? allClients.find(c => c.id === formulaData.clientId) : undefined;
    const newFormula: Formula = {
      id: Date.now().toString(),
      ...formulaData,
      clientName: client?.name,
      totalPercentage: 0,
      ingredients: [],
      productionSteps: [],
      phases: ['A'],
      developmentDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      comments: []
    };
    setFormulas(prev => [...prev, newFormula]);
    return newFormula.id;
  };

  const updateFormula = (id: string, formulaData: Partial<Formula>) => {
    const client = formulaData.clientId ? allClients.find(c => c.id === formulaData.clientId) : undefined;
    setFormulas(prev => prev.map(formula => 
      formula.id === id 
        ? { 
            ...formula, 
            ...formulaData, 
            clientName: formulaData.clientId ? client?.name : undefined,
            lastModified: new Date().toISOString() 
          }
        : formula
    ));
  };

  const deleteFormula = (id: string) => {
    setFormulas(prev => prev.filter(formula => formula.id !== id));
  };

  const duplicateFormula = (id: string) => {
    const formula = formulas.find(f => f.id === id);
    if (formula) {
      const newFormula: Formula = {
        ...formula,
        id: Date.now().toString(),
        name: `${formula.name} (kopija)`,
        version: '1.0',
        status: 'draft',
        developmentDate: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };
      setFormulas(prev => [...prev, newFormula]);
      return newFormula.id;
    }
  };

  const categories = useMemo(() => {
    return Array.from(new Set(formulas.map(f => f.category))).sort();
  }, [formulas]);

  const developers = useMemo(() => {
    // Get developers from existing formulas
    const formulaDevelopers = Array.from(new Set(formulas.map(f => f.developedBy)));
    
    // Get R&D users from the system
    const rdUsers = allUsers
      .filter(user => user.role === 'R&D' && user.isActive)
      .map(user => `${user.firstName} ${user.lastName}`);
    
    // Combine and deduplicate
    const allDevelopers = Array.from(new Set([...formulaDevelopers, ...rdUsers]));
    
    return allDevelopers.sort();
  }, [formulas, allUsers]);

  const updateSort = (field: FormulaSortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return {
    formulas: filteredAndSortedFormulas,
    loading,
    searchTerm,
    setSearchTerm,
    sortField,
    sortDirection,
    updateSort,
    filters,
    setFilters,
    categories,
    developers,
    allClients,
    addFormula,
    updateFormula,
    deleteFormula,
    duplicateFormula
  };
};