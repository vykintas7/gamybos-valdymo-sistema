import { useState, useEffect, useMemo } from 'react';
import { Material, MaterialFormData, SortField, SortDirection, FilterOptions } from '../types/material';
import { supabase } from '../lib/supabase';

// Generate unique ID
const generateUniqueId = () => {
  return Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9);
};

export const useMaterials = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load materials from Supabase
  const loadMaterials = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading materials:', error);
        setError('Nepavyko įkelti medžiagų');
        return;
      }

      // Transform Supabase data to match our Material type
      const transformedMaterials: Material[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        sku: item.sku,
        description: item.description || '',
        category: item.category,
        supplier: item.supplier || '',
        currentStock: parseFloat(item.current_stock || '0'),
        minStock: parseFloat(item.reorder_level || '0'),
        maxStock: parseFloat(item.current_stock || '0') * 2, // Default max stock
        unit: item.unit,
        unitPrice: parseFloat(item.cost_per_unit || '0'),
        location: item.storage_location || '',
        expiryDate: item.expiry_date || '',
        batchNumber: '', // Not in current schema
        inciName: '', // Not in current schema
        casNumber: '', // Not in current schema
        suitableForCosmetics: true, // Default
        suitableForSupplements: false, // Default
        certifications: [], // Not in current schema
        notes: '',
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        status: 'active'
      }));

      setMaterials(transformedMaterials);
      setError(null);
    } catch (err) {
      console.error('Error loading materials:', err);
      setError('Nepavyko įkelti medžiagų');
    } finally {
      setLoading(false);
    }
  };

  // Load materials on component mount
  useEffect(() => {
    loadMaterials();
  }, []);

  // Add new material
  const addMaterial = async (materialData: MaterialFormData): Promise<string | null> => {
    try {
      const newMaterial = {
        name: materialData.name,
        sku: materialData.sku,
        description: materialData.description,
        category: materialData.category,
        supplier: materialData.supplier,
        current_stock: materialData.currentStock,
        unit: materialData.unit,
        cost_per_unit: materialData.unitPrice,
        reorder_level: materialData.minStock,
        storage_location: materialData.location,
        expiry_date: materialData.expiryDate || null,
      };

      const { data, error } = await supabase
        .from('materials')
        .insert([newMaterial])
        .select()
        .single();

      if (error) {
        console.error('Error adding material:', error);
        setError('Nepavyko pridėti medžiagos');
        return error.message;
      }

      // Reload materials to get updated list
      await loadMaterials();
      return null;
    } catch (err) {
      console.error('Error adding material:', err);
      setError('Nepavyko pridėti medžiagos');
      return 'Nepavyko pridėti medžiagos';
    }
  };

  // Update material
  const updateMaterial = async (id: string, updates: Partial<MaterialFormData>): Promise<boolean> => {
    try {
      const updateData: any = {};
      
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.sku !== undefined) updateData.sku = updates.sku;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.supplier !== undefined) updateData.supplier = updates.supplier;
      if (updates.currentStock !== undefined) updateData.current_stock = updates.currentStock;
      if (updates.unit !== undefined) updateData.unit = updates.unit;
      if (updates.unitPrice !== undefined) updateData.cost_per_unit = updates.unitPrice;
      if (updates.minStock !== undefined) updateData.reorder_level = updates.minStock;
      if (updates.location !== undefined) updateData.storage_location = updates.location;
      if (updates.expiryDate !== undefined) updateData.expiry_date = updates.expiryDate || null;

      const { error } = await supabase
        .from('materials')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Error updating material:', error);
        setError('Nepavyko atnaujinti medžiagos');
        return false;
      }

      // Reload materials to get updated list
      await loadMaterials();
      return true;
    } catch (err) {
      console.error('Error updating material:', err);
      setError('Nepavyko atnaujinti medžiagos');
      return false;
    }
  };

  // Delete material
  const deleteMaterial = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('materials')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting material:', error);
        setError('Nepavyko ištrinti medžiagos');
        return false;
      }

      // Reload materials to get updated list
      await loadMaterials();
      return true;
    } catch (err) {
      console.error('Error deleting material:', err);
      setError('Nepavyko ištrinti medžiagos');
      return false;
    }
  };

  // Import materials from CSV
  const importMaterials = async (csvData: string): Promise<{ success: number; errors: string[] }> => {
    const results = { success: 0, errors: [] as string[] };
    
    try {
      const lines = csvData.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      for (let i = 1; i < lines.length; i++) {
        try {
          const values = lines[i].split(',').map(v => v.trim());
          const materialData: MaterialFormData = {
            name: values[headers.indexOf('name')] || '',
            sku: values[headers.indexOf('sku')] || generateUniqueId(),
            description: values[headers.indexOf('description')] || '',
            category: values[headers.indexOf('category')] || 'Kita',
            supplier: values[headers.indexOf('supplier')] || '',
            currentStock: parseFloat(values[headers.indexOf('currentStock')] || '0'),
            minStock: parseFloat(values[headers.indexOf('minStock')] || '0'),
            maxStock: parseFloat(values[headers.indexOf('maxStock')] || '100'),
            unit: values[headers.indexOf('unit')] || 'vnt',
            unitPrice: parseFloat(values[headers.indexOf('unitPrice')] || '0'),
            location: values[headers.indexOf('location')] || '',
            expiryDate: values[headers.indexOf('expiryDate')] || '',
            batchNumber: values[headers.indexOf('batchNumber')] || '',
            inciName: values[headers.indexOf('inciName')] || '',
            casNumber: values[headers.indexOf('casNumber')] || '',
            suitableForCosmetics: values[headers.indexOf('suitableForCosmetics')] === 'true',
            suitableForSupplements: values[headers.indexOf('suitableForSupplements')] === 'true',
            certifications: values[headers.indexOf('certifications')] ? values[headers.indexOf('certifications')].split(';') : [],
            notes: values[headers.indexOf('notes')] || ''
          };

          const error = await addMaterial(materialData);
          if (error) {
            results.errors.push(`Eilutė ${i + 1}: ${error}`);
          } else {
            results.success++;
          }
        } catch (err) {
          results.errors.push(`Eilutė ${i + 1}: Nepavyko apdoroti duomenų`);
        }
      }
    } catch (err) {
      results.errors.push('Nepavyko apdoroti CSV failo');
    }

    return results;
  };

  // State for filtering and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'name' | 'sku' | 'category' | 'currentStock' | 'createdAt'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<any>({
    categories: [],
    suppliers: [],
    lowStock: false
  });

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(materials.map(m => m.category))];
    return uniqueCategories.sort();
  }, [materials]);

  // Filtering and sorting logic
  const filteredAndSortedMaterials = useMemo(() => {
    let filtered = materials.filter(material => {
      const matchesSearch = searchTerm === '' || 
        material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.supplier.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = filters.categories.length === 0 || filters.categories.includes(material.category);
      const matchesSupplier = filters.suppliers.length === 0 || filters.suppliers.includes(material.supplier);
      const matchesLowStock = !filters.lowStock || material.currentStock <= material.minStock;

      return matchesSearch && matchesCategory && matchesSupplier && matchesLowStock;
    });

    // Sort materials
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'createdAt') {
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
  }, [materials, searchTerm, sortField, sortDirection, filters]);

  const updateSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Clear error
  const clearError = () => setError(null);

  return {
    materials: filteredAndSortedMaterials,
    allMaterials: materials,
    loading,
    error,
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
    deleteMaterial,
    importMaterials,
    clearError,
    refreshMaterials: loadMaterials
  };
};

