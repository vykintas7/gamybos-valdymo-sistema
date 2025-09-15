import React from 'react';
import { FilterOptions } from '../types/material';
import { Filter, X } from 'lucide-react';

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  categories: string[];
  isOpen: boolean;
  onClose: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  filters, 
  onFiltersChange, 
  categories, 
  isOpen, 
  onClose 
}) => {
  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleCategory = (category: string) => {
    const newCategories = filters.category.includes(category)
      ? filters.category.filter(c => c !== category)
      : [...filters.category, category];
    updateFilter('category', newCategories);
  };

  const toggleStatus = (status: string) => {
    const newStatuses = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    updateFilter('status', newStatuses);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      category: [],
      suitableForCosmetics: null,
      suitableForSupplements: null,
      status: [],
      lowStock: false,
      expired: false
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose}>
      <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Filtrai</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Category Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Kategorija</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <label key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.category.includes(category)}
                      onChange={() => toggleCategory(category)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Suitability Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Tinkamumas</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.suitableForCosmetics === true}
                    onChange={(e) => updateFilter('suitableForCosmetics', e.target.checked ? true : null)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Tinka kosmetikai</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.suitableForSupplements === true}
                    onChange={(e) => updateFilter('suitableForSupplements', e.target.checked ? true : null)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Tinka papildams</span>
                </label>
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Būsena</h3>
              <div className="space-y-2">
                {[
                  { value: 'aktyvus', label: 'Aktyvus' },
                  { value: 'nutrauktas', label: 'Nutrauktas' },
                  { value: 'laukiantis', label: 'Laukiantis' }
                ].map(status => (
                  <label key={status.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.status.includes(status.value)}
                      onChange={() => toggleStatus(status.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{status.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Stock Alerts */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Atsargų įspėjimai</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.lowStock}
                    onChange={(e) => updateFilter('lowStock', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Mažos atsargos</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.expired}
                    onChange={(e) => updateFilter('expired', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Pasibaigę produktai</span>
                </label>
              </div>
            </div>

            <button
              onClick={clearAllFilters}
              className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Išvalyti visus filtrus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;