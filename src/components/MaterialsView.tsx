import React, { useState } from 'react';
import { useMaterials } from '../hooks/useMaterials';
import { Material } from '../types/material';
import MaterialCard from './MaterialCard';
import MaterialForm from './MaterialForm';
import FilterPanel from './FilterPanel';
import MaterialsList from './MaterialsList';
import MaterialImport from './MaterialImport';
import { 
  Search, 
  Plus, 
  Filter, 
  Grid, 
  List, 
  SortAsc, 
  SortDesc, 
  Package,
  AlertTriangle,
  TrendingUp,
  Upload
} from 'lucide-react';

const MaterialsView: React.FC = () => {
  const {
    materials,
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
  } = useMaterials();

  const [showForm, setShowForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | undefined>();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showImport, setShowImport] = useState(false);

  const handleAddMaterial = () => {
    setEditingMaterial(undefined);
    setShowForm(true);
  };

  const handleEditMaterial = (material: Material) => {
    setEditingMaterial(material);
    setShowForm(true);
  };

  const handleSaveMaterial = (materialData: any) => {
    if (editingMaterial) {
      updateMaterial(editingMaterial.id, {
        ...materialData,
        updatedAt: new Date().toISOString()
      });
    } else {
      addMaterial(materialData);
    }
    setShowForm(false);
    setEditingMaterial(undefined);
  };

  const handleDeleteMaterial = (id: string) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      deleteMaterial(id);
    }
  };

  const handleImportMaterials = (materials: any[]) => {
    materials.forEach(materialData => {
      addMaterial(materialData);
    });
  };

  // Calculate total stats from all materials (unfiltered)
  const totalLowStockCount = allMaterials.filter(m => m.currentStock <= m.minStock).length;
  const totalExpiringCount = allMaterials.filter(m => {
    if (!m.expiryDate) return false;
    const expiryDate = new Date(m.expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  }).length;

  return (
    <>
      <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Medžiagų atsargos</h1>
            <p className="text-sm text-gray-500 mt-1">
              {materials.length} {(searchTerm || filters.category.length > 0 || filters.suitableForCosmetics !== null || filters.suitableForSupplements !== null || filters.lowStock || filters.expired) ? `iš ${allMaterials.length}` : ''} medžiagos atsargose
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowImport(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
            >
              <Upload className="w-4 h-4" />
              <span>Importuoti CSV</span>
            </button>
            <button
              onClick={handleAddMaterial}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Pridėti medžiagą</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Iš viso medžiagų</p>
                <p className="text-xl font-semibold text-gray-900">{allMaterials.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Mažų atsargų įspėjimai</p>
                <p className="text-xl font-semibold text-red-600">{totalLowStockCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Greitai baigsis</p>
                <p className="text-xl font-semibold text-orange-600">{totalExpiringCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Ieškoti medžiagų, SKU arba tiekėjo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Rūšiuoti pagal:</label>
                <select
                  value={sortField}
                  onChange={(e) => updateSort(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="name">Pavadinimas</option>
                  <option value="sku">SKU</option>
                  <option value="currentStock">Atsargos</option>
                  <option value="unitPrice">Kaina</option>
                  <option value="expiryDate">Galiojimo data</option>
                  <option value="createdAt">Sukurta</option>
                </select>
                <button
                  onClick={() => updateSort(sortField)}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  {sortDirection === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                </button>
              </div>

              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <Filter className="w-4 h-4" />
                <span>Filtrai</span>
              </button>
            </div>
          </div>
        </div>

        {/* Materials Grid/List */}
        <div className="flex gap-6">
          {/* Sidebar Filters (Desktop) */}
          <div className="hidden lg:block w-64 bg-white rounded-lg border border-gray-200 p-4 h-fit">
            <div className="flex items-center space-x-2 mb-4">
              <Filter className="w-5 h-5 text-gray-600" />
              <h2 className="font-semibold text-gray-900">Filtrai</h2>
            </div>
            
            <div className="space-y-6">
              {/* Category Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Kategorija</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {categories.map(category => (
                    <label key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.category.includes(category)}
                        onChange={() => {
                          const newCategories = filters.category.includes(category)
                            ? filters.category.filter(c => c !== category)
                            : [...filters.category, category];
                          setFilters({ ...filters, category: newCategories });
                        }}
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
                      onChange={(e) => setFilters({ 
                        ...filters, 
                        suitableForCosmetics: e.target.checked ? true : null 
                      })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Kosmetika</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.suitableForSupplements === true}
                      onChange={(e) => setFilters({ 
                        ...filters, 
                        suitableForSupplements: e.target.checked ? true : null 
                      })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Papildai</span>
                  </label>
                </div>
              </div>

              {/* Stock Alerts */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Įspėjimai</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.lowStock}
                      onChange={(e) => setFilters({ ...filters, lowStock: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Mažos atsargos</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.expired}
                      onChange={(e) => setFilters({ ...filters, expired: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Baigiasi galiojimas</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Materials Content */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : materials.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Medžiagų nerasta</h3>
                <p className="text-gray-500">Pabandykite pakeisti paieškos kriterijus arba filtrus</p>
              </div>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6'
                  : ''
              }>
                {viewMode === 'grid' ? (
                  materials.map(material => (
                    <MaterialCard
                      key={material.id}
                      material={material}
                      onEdit={handleEditMaterial}
                      onDelete={handleDeleteMaterial}
                    />
                  ))
                ) : (
                  <MaterialsList
                    materials={materials}
                    onEdit={handleEditMaterial}
                    onDelete={handleDeleteMaterial}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      </div>

      {/* Material Form Modal */}
      {showForm && (
        <MaterialForm
          material={editingMaterial}
          onSave={handleSaveMaterial}
          onCancel={() => {
            setShowForm(false);
            setEditingMaterial(undefined);
          }}
          categories={categories}
        />
      )}

      {/* Mobile Filter Panel */}
      <FilterPanel
        filters={filters}
        onFiltersChange={setFilters}
        categories={categories}
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
      />

      {/* Material Import Modal */}
      {showImport && (
        <MaterialImport
          onImport={handleImportMaterials}
          onCancel={() => setShowImport(false)}
          onClose={() => setShowImport(false)}
        />
      )}
    </>
  );
};

export default MaterialsView;