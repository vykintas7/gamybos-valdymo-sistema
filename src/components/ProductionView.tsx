import React, { useState } from 'react';
import { useProduction } from '../hooks/useProduction';
import { useFormulas } from '../hooks/useFormulas';
import { useClients } from '../hooks/useClients';
import { ProductionBatch } from '../types/production';
import ProductionForm from './ProductionForm';
import ProductionBatchCard from './ProductionBatchCard';
import ProductionBatchList from './ProductionBatchList';
import { 
  Search, 
  Plus, 
  Filter, 
  Grid, 
  List, 
  SortAsc, 
  SortDesc, 
  Factory,
  Clock,
  CheckCircle,
  Play,
  Calendar
} from 'lucide-react';

const ProductionView: React.FC = () => {
  const {
    batches,
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
    deleteBatch
  } = useProduction();

  const { formulas } = useFormulas();
  const { allClients } = useClients();

  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleCreateBatch = (data: any) => {
    const batchId = createProductionBatch(data);
    if (batchId) {
      setShowForm(false);
    }
  };

  const handleStartProduction = (batchId: string) => {
    if (window.confirm('Ar tikrai norite pradėti gamybą? Žaliavos bus nurašytos iš atsargų.')) {
      const success = startProduction(batchId);
      if (!success) {
        alert('Nepavyko pradėti gamybos. Patikrinkite žaliavų atsargas.');
      }
    }
  };

  const handleCompleteProduction = (batchId: string) => {
    if (window.confirm('Ar tikrai norite užbaigti gamybą?')) {
      completeProduction(batchId);
    }
  };

  const handleCancelProduction = (batchId: string) => {
    if (window.confirm('Ar tikrai norite atšaukti gamybą?')) {
      cancelProduction(batchId);
    }
  };

  const handleDeleteBatch = (batchId: string) => {
    if (window.confirm('Ar tikrai norite ištrinti šią partiją?')) {
      deleteBatch(batchId);
    }
  };

  const plannedCount = batches.filter(b => b.status === 'planned').length;
  const inProgressCount = batches.filter(b => b.status === 'in_progress').length;
  const completedCount = batches.filter(b => b.status === 'completed').length;
  const totalValue = batches.reduce((sum, b) => sum + b.totalCost, 0);

  return (
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Gamybos valdymas</h1>
            <p className="text-sm text-gray-500 mt-1">
              {batches.length} partijos sistemoje
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-4 h-4" />
            <span>Nauja partija</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Suplanuotos</p>
                <p className="text-3xl font-bold text-gray-900 tracking-tight">{plannedCount}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl shadow-sm">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Gaminamos</p>
                <p className="text-3xl font-bold text-gray-900 tracking-tight">{inProgressCount}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl shadow-sm">
                <Play className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Užbaigtos</p>
                <p className="text-3xl font-bold text-gray-900 tracking-tight">{completedCount}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl shadow-sm">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Bendra vertė</p>
                <p className="text-3xl font-bold text-gray-900 tracking-tight">€{totalValue.toFixed(0)}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl shadow-sm">
                <span className="w-6 h-6 text-purple-600 font-bold text-lg flex items-center justify-center">€</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Ieškoti partijų, formulių arba klientų..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
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
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="productionDate">Gamybos data</option>
                  <option value="batchNumber">Partijos numeris</option>
                  <option value="formulaName">Formulė</option>
                  <option value="status">Būsena</option>
                  <option value="totalCost">Savikaina</option>
                </select>
                <button
                  onClick={() => updateSort(sortField)}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  {sortDirection === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Production Batches */}
        <div className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : batches.length === 0 ? (
            <div className="text-center py-12">
              <Factory className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Gamybos partijų nerasta</h3>
              <p className="text-gray-500">Sukurkite naują gamybos partiją</p>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6'
                : ''
            }>
              {viewMode === 'grid' ? (
                batches.map(batch => (
                  <ProductionBatchCard
                    key={batch.id}
                    batch={batch}
                    onStart={handleStartProduction}
                    onComplete={handleCompleteProduction}
                    onCancel={handleCancelProduction}
                    onDelete={handleDeleteBatch}
                  />
                ))
              ) : (
                <ProductionBatchList
                  batches={batches}
                  onStart={handleStartProduction}
                  onComplete={handleCompleteProduction}
                  onCancel={handleCancelProduction}
                  onDelete={handleDeleteBatch}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Production Form Modal */}
      {showForm && (
        <ProductionForm
          onSave={handleCreateBatch}
          onCancel={() => setShowForm(false)}
          formulas={formulas}
          clients={allClients}
        />
      )}
    </div>
  );
};

export default ProductionView;