import React, { useState } from 'react';
import { useFormulas } from '../hooks/useFormulas';
import { Formula } from '../types/formula';
import FormulaCard from './FormulaCard';
import FormulaForm from './FormulaForm';
import FormulaEditor from './FormulaEditor';
import FormulasList from './FormulasList';
import FormulaPrintView from './FormulaPrintView';
import { 
  Search, 
  Plus, 
  Filter, 
  Grid,
  List,
  SortAsc, 
  SortDesc, 
  Beaker,
  CheckCircle,
  Clock,
  FileText
} from 'lucide-react';

const FormulaView: React.FC = () => {
  const {
    formulas,
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
  } = useFormulas();

  const [showForm, setShowForm] = useState(false);
  const [editingFormula, setEditingFormula] = useState<Formula | undefined>();
  const [viewingFormula, setViewingFormula] = useState<Formula | undefined>();
  const [editingFormulaDetails, setEditingFormulaDetails] = useState<Formula | undefined>();
  const [printingFormula, setPrintingFormula] = useState<{ formula: Formula; type: 'production' | 'technical' } | undefined>();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleAddFormula = () => {
    setEditingFormula(undefined);
    setShowForm(true);
  };

  const handleEditFormula = (formula: Formula) => {
    setEditingFormula(formula);
    setShowForm(true);
  };

  const handleViewFormula = (formula: Formula) => {
    setViewingFormula(formula);
  };

  const handleEditFormulaDetails = (formula: Formula) => {
    setEditingFormulaDetails(formula);
  };

  const handlePrintFormula = (formula: Formula, type: 'production' | 'technical') => {
    setPrintingFormula({ formula, type });
  };

  const handleSaveFormula = (formulaData: any) => {
    if (editingFormula) {
      updateFormula(editingFormula.id, formulaData);
    } else {
      const newId = addFormula(formulaData);
      // Optionally open the new formula for editing details
      const newFormula = formulas.find(f => f.id === newId);
      if (newFormula) {
        setEditingFormulaDetails(newFormula);
      }
    }
    setShowForm(false);
    setEditingFormula(undefined);
  };

  const handleDeleteFormula = (id: string) => {
    if (window.confirm('Ar tikrai norite ištrinti šią formulę?')) {
      deleteFormula(id);
    }
  };

  const handleDuplicateFormula = (id: string) => {
    const newId = duplicateFormula(id);
    if (newId) {
      const newFormula = formulas.find(f => f.id === newId);
      if (newFormula) {
        setEditingFormulaDetails(newFormula);
      }
    }
  };

  const approvedCount = formulas.filter(f => f.status === 'approved').length;
  const testingCount = formulas.filter(f => f.status === 'testing').length;
  const draftCount = formulas.filter(f => f.status === 'draft').length;

  return (
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Formulių valdymas</h1>
            <p className="text-sm text-gray-500 mt-1">
              {formulas.length} formulės sistemoje
            </p>
          </div>
          <button
            onClick={handleAddFormula}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Sukurti formulę</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Beaker className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Iš viso formulių</p>
                <p className="text-xl font-semibold text-gray-900">{formulas.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Patvirtintos</p>
                <p className="text-xl font-semibold text-green-600">{approvedCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Testuojamos</p>
                <p className="text-xl font-semibold text-yellow-600">{testingCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg">
                <FileText className="w-5 h-5 text-gray-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Juodraščiai</p>
                <p className="text-xl font-semibold text-gray-600">{draftCount}</p>
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
                  placeholder="Ieškoti formulių, versijų arba aprašymų..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
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
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="name">Pavadinimas</option>
                  <option value="version">Versija</option>
                  <option value="category">Kategorija</option>
                  <option value="developmentDate">Sukurta</option>
                  <option value="lastModified">Paskutinį kartą keista</option>
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

        {/* Formulas Grid */}
        <div className="flex gap-6">
          {/* Sidebar Filters */}
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
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Būsena</h3>
                <div className="space-y-2">
                  {[
                    { value: 'draft', label: 'Juodraštis' },
                    { value: 'testing', label: 'Testuojama' },
                    { value: 'approved', label: 'Patvirtinta' },
                    { value: 'archived', label: 'Archyvuota' }
                  ].map(status => (
                    <label key={status.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.status.includes(status.value)}
                        onChange={() => {
                          const newStatuses = filters.status.includes(status.value)
                            ? filters.status.filter(s => s !== status.value)
                            : [...filters.status, status.value];
                          setFilters({ ...filters, status: newStatuses });
                        }}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{status.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Developer Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Kūrėjas</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {developers.map(developer => (
                    <label key={developer} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.developedBy.includes(developer)}
                        onChange={() => {
                          const newDevelopers = filters.developedBy.includes(developer)
                            ? filters.developedBy.filter(d => d !== developer)
                            : [...filters.developedBy, developer];
                          setFilters({ ...filters, developedBy: newDevelopers });
                        }}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{developer}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Client Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Klientas</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {allClients.map(client => (
                    <label key={client.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.clientId.includes(client.id)}
                        onChange={() => {
                          const newClients = filters.clientId.includes(client.id)
                            ? filters.clientId.filter(c => c !== client.id)
                            : [...filters.clientId, client.id];
                          setFilters({ ...filters, clientId: newClients });
                        }}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{client.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Formulas Content */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : formulas.length === 0 ? (
              <div className="text-center py-12">
                <Beaker className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Formulių nerasta</h3>
                <p className="text-gray-500">Pabandykite pakeisti paieškos kriterijus arba filtrus</p>
              </div>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6'
                  : ''
              }>
                {viewMode === 'grid' ? (
                  formulas.map(formula => (
                    <FormulaCard
                      key={formula.id}
                      formula={formula}
                      onEdit={handleEditFormula}
                      onDelete={handleDeleteFormula}
                      onDuplicate={handleDuplicateFormula}
                      onView={handleEditFormulaDetails}
                      onPrint={handlePrintFormula}
                    />
                  ))
                ) : (
                  <FormulasList
                    formulas={formulas}
                    onEdit={handleEditFormula}
                    onDelete={handleDeleteFormula}
                    onDuplicate={handleDuplicateFormula}
                    onView={handleEditFormulaDetails}
                    onPrint={handlePrintFormula}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Formula Form Modal */}
      {showForm && (
        <FormulaForm
          formula={editingFormula}
          onSave={handleSaveFormula}
          onCancel={() => {
            setShowForm(false);
            setEditingFormula(undefined);
          }}
          categories={categories}
          developers={developers}
          clients={allClients}
        />
      )}

      {/* Formula Editor Modal */}
      {editingFormulaDetails && (
        <FormulaEditor
          formula={editingFormulaDetails}
          onSave={(formula) => {
            updateFormula(formula.id, formula);
            setEditingFormulaDetails(undefined);
          }}
          onCancel={() => setEditingFormulaDetails(undefined)}
        />
      )}

      {/* Formula Print View */}
      {printingFormula && (
        <FormulaPrintView
          formula={printingFormula.formula}
          type={printingFormula.type}
          onClose={() => setPrintingFormula(undefined)}
        />
      )}
    </div>
  );
};

export default FormulaView;