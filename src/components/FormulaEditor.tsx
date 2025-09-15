import React, { useState, useEffect } from 'react';
import { Formula, FormulaIngredient, ProductionStep } from '../types/formula';
import { Material } from '../types/material';
import { useMaterials } from '../hooks/useMaterials';
import { useComments } from '../hooks/useComments';
import CommentSection from './CommentSection';
import { X, Plus, Trash2, Move, Calculator } from 'lucide-react';

interface FormulaEditorProps {
  formula: Formula;
  onSave: (formula: Formula) => void;
  onCancel: () => void;
}

const FormulaEditor: React.FC<FormulaEditorProps> = ({ formula, onSave, onCancel }) => {
  const { materials } = useMaterials();
  const { comments, addComment, resolveComment, deleteComment } = useComments(formula.id);
  const [editedFormula, setEditedFormula] = useState<Formula>(formula);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'production' | 'comments'>('ingredients');
  const [newPhase, setNewPhase] = useState('');

  const cosmeticMaterials = materials.filter(m => m.suitableForCosmetics);

  const updateIngredient = (id: string, updates: Partial<FormulaIngredient>) => {
    setEditedFormula(prev => ({
      ...prev,
      ingredients: prev.ingredients.map(ing => 
        ing.id === id ? { ...ing, ...updates } : ing
      )
    }));
  };

  const addIngredient = () => {
    const newIngredient: FormulaIngredient = {
      id: Date.now().toString(),
      materialId: '',
      materialName: '',
      materialSku: '',
      phase: editedFormula.phases[0] || 'A',
      percentage: 0,
      weightGrams: 0,
      additionStage: '',
      notes: ''
    };
    
    setEditedFormula(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, newIngredient]
    }));
  };

  const removeIngredient = (id: string) => {
    setEditedFormula(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter(ing => ing.id !== id)
    }));
  };

  const updateProductionStep = (id: string, updates: Partial<ProductionStep>) => {
    setEditedFormula(prev => ({
      ...prev,
      productionSteps: prev.productionSteps.map(step => 
        step.id === id ? { ...step, ...updates } : step
      )
    }));
  };

  const addProductionStep = () => {
    const newStep: ProductionStep = {
      id: Date.now().toString(),
      stepNumber: editedFormula.productionSteps.length + 1,
      phase: editedFormula.phases[0] || 'A',
      description: '',
      temperature: undefined,
      mixingTime: undefined,
      mixingSpeed: '',
      equipment: '',
      notes: ''
    };
    
    setEditedFormula(prev => ({
      ...prev,
      productionSteps: [...prev.productionSteps, newStep]
    }));
  };

  const removeProductionStep = (id: string) => {
    setEditedFormula(prev => ({
      ...prev,
      productionSteps: prev.productionSteps.filter(step => step.id !== id)
        .map((step, index) => ({ ...step, stepNumber: index + 1 }))
    }));
  };

  const addPhase = () => {
    if (newPhase && !editedFormula.phases.includes(newPhase)) {
      setEditedFormula(prev => ({
        ...prev,
        phases: [...prev.phases, newPhase].sort()
      }));
      setNewPhase('');
    }
  };

  const removePhase = (phase: string) => {
    if (editedFormula.phases.length > 1) {
      setEditedFormula(prev => ({
        ...prev,
        phases: prev.phases.filter(p => p !== phase),
        ingredients: prev.ingredients.map(ing => 
          ing.phase === phase ? { ...ing, phase: prev.phases[0] } : ing
        ),
        productionSteps: prev.productionSteps.map(step => 
          step.phase === phase ? { ...step, phase: prev.phases[0] } : step
        )
      }));
    }
  };

  const calculateTotalPercentage = () => {
    return editedFormula.ingredients.reduce((sum, ing) => sum + ing.percentage, 0);
  };

  const recalculateWeights = () => {
    const totalPercentage = calculateTotalPercentage();
    if (totalPercentage > 0) {
      setEditedFormula(prev => ({
        ...prev,
        ingredients: prev.ingredients.map(ing => ({
          ...ing,
          weightGrams: (ing.percentage / 100) * prev.batchSize
        })),
        totalPercentage
      }));
    }
  };

  const handleMaterialSelect = (ingredientId: string, materialId: string) => {
    const material = cosmeticMaterials.find(m => m.id === materialId);
    if (material) {
      updateIngredient(ingredientId, {
        materialId: material.id,
        materialName: material.name,
        materialSku: material.sku
      });
    }
  };

  const handlePercentageChange = (ingredientId: string, percentage: number) => {
    updateIngredient(ingredientId, { 
      percentage,
      weightGrams: (percentage / 100) * editedFormula.batchSize
    });
  };

  const handleSave = () => {
    const totalPercentage = calculateTotalPercentage();
    onSave({
      ...editedFormula,
      totalPercentage,
      lastModified: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {editedFormula.name} v{editedFormula.version}
            </h2>
            <p className="text-sm text-gray-500">Partijos dydis: {editedFormula.batchSize}g</p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'ingredients'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Sudėtis ir ingredientai
            </button>
            <button
              onClick={() => setActiveTab('production')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'production'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Gamybos procesas
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'comments'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Komentarai ({comments.length})
            </button>
          </nav>
        </div>

        <div className="overflow-y-auto max-h-[calc(95vh-200px)]">
          {activeTab === 'ingredients' && (
            <div className="p-6">
              {/* Phase Management */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Fazių valdymas</h3>
                <div className="flex items-center space-x-4 mb-4">
                  <input
                    type="text"
                    value={newPhase}
                    onChange={(e) => setNewPhase(e.target.value.toUpperCase())}
                    placeholder="Nauja fazė (pvz., D)"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <button
                    onClick={addPhase}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {editedFormula.phases.map(phase => (
                    <div key={phase} className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border">
                      <span className="font-medium">Fazė {phase}</span>
                      {editedFormula.phases.length > 1 && (
                        <button
                          onClick={() => removePhase(phase)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Percentage */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    Bendras procentas: {calculateTotalPercentage().toFixed(2)}%
                  </h3>
                  <button
                    onClick={recalculateWeights}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Calculator className="w-4 h-4" />
                    <span>Perskaičiuoti svorius</span>
                  </button>
                </div>
                {Math.abs(calculateTotalPercentage() - 100) > 0.01 && (
                  <p className="text-sm text-orange-600 mt-2">
                    Įspėjimas: Bendras procentas nėra 100%
                  </p>
                )}
              </div>

              {/* Ingredients Table */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Ingredientai</h3>
                    <button
                      onClick={addIngredient}
                      className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Pridėti ingredientą</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Medžiaga
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fazė
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Procentas
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Svoris (g)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Pridėjimo etapas
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Pastabos
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Veiksmai
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {editedFormula.ingredients.map((ingredient) => (
                        <tr key={ingredient.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={ingredient.materialId}
                              onChange={(e) => handleMaterialSelect(ingredient.id, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            >
                              <option value="">Pasirinkite medžiagą</option>
                              {cosmeticMaterials.map(material => (
                                <option key={material.id} value={material.id}>
                                  {material.name} ({material.sku})
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={ingredient.phase}
                              onChange={(e) => updateIngredient(ingredient.id, { phase: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            >
                              {editedFormula.phases.map(phase => (
                                <option key={phase} value={phase}>Fazė {phase}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              value={ingredient.percentage}
                              onChange={(e) => handlePercentageChange(ingredient.id, parseFloat(e.target.value) || 0)}
                              min="0"
                              max="100"
                              step="0.01"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              value={ingredient.weightGrams.toFixed(2)}
                              readOnly
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="text"
                              value={ingredient.additionStage}
                              onChange={(e) => updateIngredient(ingredient.id, { additionStage: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                              placeholder="Pridėjimo etapas"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="text"
                              value={ingredient.notes || ''}
                              onChange={(e) => updateIngredient(ingredient.id, { notes: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                              placeholder="Pastabos"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button
                              onClick={() => removeIngredient(ingredient.id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors duration-150"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'production' && (
            <div className="p-6">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Gamybos procesas</h3>
                    <button
                      onClick={addProductionStep}
                      className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Pridėti žingsnį</span>
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {editedFormula.productionSteps.map((step) => (
                    <div key={step.id} className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded-full font-semibold">
                            {step.stepNumber}
                          </div>
                          <select
                            value={step.phase}
                            onChange={(e) => updateProductionStep(step.id, { phase: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          >
                            {editedFormula.phases.map(phase => (
                              <option key={phase} value={phase}>Fazė {phase}</option>
                            ))}
                          </select>
                        </div>
                        <button
                          onClick={() => removeProductionStep(step.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors duration-150"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Aprašymas*</label>
                          <textarea
                            value={step.description}
                            onChange={(e) => updateProductionStep(step.id, { description: e.target.value })}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="Aprašykite gamybos žingsnį"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Temperatūra (°C)</label>
                          <input
                            type="number"
                            value={step.temperature || ''}
                            onChange={(e) => updateProductionStep(step.id, { temperature: parseFloat(e.target.value) || undefined })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="70"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Maišymo laikas (min)</label>
                          <input
                            type="number"
                            value={step.mixingTime || ''}
                            onChange={(e) => updateProductionStep(step.id, { mixingTime: parseFloat(e.target.value) || undefined })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="10"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Maišymo greitis</label>
                          <select
                            value={step.mixingSpeed || ''}
                            onChange={(e) => updateProductionStep(step.id, { mixingSpeed: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          >
                            <option value="">Pasirinkite greitį</option>
                            <option value="lėtas">Lėtas</option>
                            <option value="vidutinis">Vidutinis</option>
                            <option value="greitas">Greitas</option>
                            <option value="labai greitas">Labai greitas</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Įranga</label>
                          <input
                            type="text"
                            value={step.equipment || ''}
                            onChange={(e) => updateProductionStep(step.id, { equipment: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="Maišytuvas su šildymu"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Pastabos</label>
                          <textarea
                            value={step.notes || ''}
                            onChange={(e) => updateProductionStep(step.id, { notes: e.target.value })}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="Papildomos pastabos apie šį žingsnį"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="p-6">
              <CommentSection
                formulaId={formula.id}
                comments={comments}
                onAddComment={addComment}
                onResolveComment={resolveComment}
                onDeleteComment={deleteComment}
              />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Atšaukti
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
          >
            Išsaugoti formulę
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormulaEditor;