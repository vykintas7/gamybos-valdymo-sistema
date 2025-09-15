import React, { useState, useEffect } from 'react';
import { ProductionFormData } from '../types/production';
import { Formula } from '../types/formula';
import { Client } from '../types/client';
import { useMaterials } from '../hooks/useMaterials';
import { X, Calculator, AlertTriangle } from 'lucide-react';

interface ProductionFormProps {
  onSave: (data: ProductionFormData) => void;
  onCancel: () => void;
  formulas: Formula[];
  clients: Client[];
}

const ProductionForm: React.FC<ProductionFormProps> = ({ onSave, onCancel, formulas, clients }) => {
  const { materials } = useMaterials();
  const [formData, setFormData] = useState<ProductionFormData>({
    formulaId: '',
    clientId: '',
    unitsToProduct: 1,
    volumePerUnit: 100,
    productionDate: new Date().toISOString().split('T')[0],
    plannedDate: '',
    notes: ''
  });

  const [selectedFormula, setSelectedFormula] = useState<Formula | null>(null);
  const [totalVolume, setTotalVolume] = useState(0);
  const [scaleFactor, setScaleFactor] = useState(0);
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [materialWarnings, setMaterialWarnings] = useState<string[]>([]);

  useEffect(() => {
    const formula = formulas.find(f => f.id === formData.formulaId);
    setSelectedFormula(formula || null);
  }, [formData.formulaId, formulas]);

  useEffect(() => {
    const newTotalVolume = formData.unitsToProduct * formData.volumePerUnit;
    setTotalVolume(newTotalVolume);
    
    if (selectedFormula && newTotalVolume > 0) {
      const newScaleFactor = newTotalVolume / selectedFormula.batchSize;
      setScaleFactor(newScaleFactor);
      
      // Calculate estimated cost and check material availability
      let cost = 0;
      const warnings: string[] = [];
      
      selectedFormula.ingredients.forEach(ingredient => {
        const material = materials.find(m => m.id === ingredient.materialId);
        if (material) {
          const requiredAmountG = ingredient.weightGrams * newScaleFactor;
          const requiredAmountKg = requiredAmountG / 1000;
          const ingredientCost = requiredAmountKg * material.unitPrice;
          cost += ingredientCost;
          
          if (material.currentStock < requiredAmountKg) {
            warnings.push(`${material.name}: reikia ${requiredAmountKg.toFixed(2)}kg, turima ${material.currentStock}kg`);
          }
        }
      });
      
      setEstimatedCost(cost);
      setMaterialWarnings(warnings);
    } else {
      setEstimatedCost(0);
      setMaterialWarnings([]);
    }
  }, [formData.unitsToProduct, formData.volumePerUnit, selectedFormula, materials]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (materialWarnings.length > 0 && !formData.plannedDate) {
      if (!window.confirm('Nepakanka kai kurių žaliavų. Ar tikrai norite tęsti?')) {
        return;
      }
    }
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const approvedFormulas = formulas.filter(f => f.status === 'approved');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Nauja gamybos partija</h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6 space-y-6">
            {/* Formula Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                Formulės pasirinkimas
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Formulė*</label>
                  <select
                    name="formulaId"
                    value={formData.formulaId}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                  >
                    <option value="">Pasirinkite formulę</option>
                    {approvedFormulas.map(formula => (
                      <option key={formula.id} value={formula.id}>
                        {formula.name} v{formula.version}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Klientas (pasirinktinai)</label>
                  <select
                    name="clientId"
                    value={formData.clientId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                  >
                    <option value="">Nepriskirta klientui</option>
                    {clients.filter(c => c.status === 'active').map(client => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedFormula && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Formulės informacija</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">Bazinis dydis:</span>
                      <p className="font-semibold text-blue-900">{selectedFormula.batchSize}g</p>
                    </div>
                    <div>
                      <span className="text-blue-700">Ingredientų:</span>
                      <p className="font-semibold text-blue-900">{selectedFormula.ingredients.length}</p>
                    </div>
                    <div>
                      <span className="text-blue-700">Fazių:</span>
                      <p className="font-semibold text-blue-900">{selectedFormula.phases.length}</p>
                    </div>
                    <div>
                      <span className="text-blue-700">Kūrėjas:</span>
                      <p className="font-semibold text-blue-900">{selectedFormula.developedBy}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Production Parameters */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                Gamybos parametrai
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vienetų kiekis*</label>
                  <input
                    type="number"
                    name="unitsToProduct"
                    value={formData.unitsToProduct}
                    onChange={handleChange}
                    min="1"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                    placeholder="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tūris vienetu (ml)*</label>
                  <input
                    type="number"
                    name="volumePerUnit"
                    value={formData.volumePerUnit}
                    onChange={handleChange}
                    min="1"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                    placeholder="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bendras tūris</label>
                  <input
                    type="text"
                    value={`${totalVolume} ml`}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                  />
                </div>
              </div>

              {selectedFormula && scaleFactor > 0 && (
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calculator className="w-4 h-4 text-green-600" />
                    <h4 className="font-medium text-green-900">Skaičiavimai</h4>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-green-700">Mastelio koeficientas:</span>
                      <p className="font-semibold text-green-900">{scaleFactor.toFixed(2)}x</p>
                    </div>
                    <div>
                      <span className="text-green-700">Bendras svoris:</span>
                      <p className="font-semibold text-green-900">{(selectedFormula.batchSize * scaleFactor).toFixed(0)}g</p>
                    </div>
                    <div>
                      <span className="text-green-700">Numatoma savikaina:</span>
                      <p className="font-semibold text-green-900">€{estimatedCost.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-green-700">Savikaina vienetu:</span>
                      <p className="font-semibold text-green-900">€{(estimatedCost / formData.unitsToProduct).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              )}

              {materialWarnings.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <h4 className="font-medium text-red-900">Žaliavų trūkumas</h4>
                  </div>
                  <ul className="text-sm text-red-700 space-y-1">
                    {materialWarnings.map((warning, index) => (
                      <li key={index}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Dates */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                Datos
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gamybos data*</label>
                  <input
                    type="date"
                    name="productionDate"
                    value={formData.productionDate}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Planuojama data (pasirinktinai)</label>
                  <input
                    type="date"
                    name="plannedDate"
                    value={formData.plannedDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Jei nurodyta, partija bus suplanuota, bet žaliavos nebus nurašytos
                  </p>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pastabos</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                placeholder="Papildomos pastabos apie gamybą"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Atšaukti
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200"
            >
              {formData.plannedDate ? 'Suplanuoti gamybą' : 'Sukurti partiją'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductionForm;