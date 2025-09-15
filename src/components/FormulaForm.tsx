import React, { useState, useEffect } from 'react';
import { Formula, FormulaFormData } from '../types/formula';
import { X } from 'lucide-react';

interface FormulaFormProps {
  formula?: Formula;
  onSave: (data: FormulaFormData) => void;
  onCancel: () => void;
  categories: string[];
  developers: string[];
  clients: Array<{ id: string; name: string }>;
}

const FormulaForm: React.FC<FormulaFormProps> = ({ 
  formula, 
  onSave, 
  onCancel, 
  categories, 
  developers,
  clients
}) => {
  const [formData, setFormData] = useState<FormulaFormData>({
    name: '',
    version: '1.0',
    description: '',
    category: '',
    batchSize: 1000,
    developedBy: 'Jonas Jonaitis',
    clientId: '',
    status: 'draft',
    notes: '',
    stability: '',
    ph: undefined,
    viscosity: '',
    color: '',
    odor: ''
  });

  useEffect(() => {
    if (formula) {
      setFormData({
        name: formula.name,
        version: formula.version,
        description: formula.description,
        category: formula.category,
        batchSize: formula.batchSize,
        developedBy: formula.developedBy,
        clientId: formula.clientId || '',
        status: formula.status,
        notes: formula.notes,
        stability: formula.stability || '',
        ph: formula.ph,
        viscosity: formula.viscosity || '',
        color: formula.color || '',
        odor: formula.odor || ''
      });
    }
  }, [formula]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || undefined }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {formula ? 'Redaguoti formulę' : 'Sukurti naują formulę'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                Pagrindinė informacija
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Formulės pavadinimas*</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                    placeholder="Įveskite formulės pavadinimą"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Versija*</label>
                  <input
                    type="text"
                    name="version"
                    value={formData.version}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                    placeholder="1.0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Aprašymas</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                  placeholder="Įveskite formulės aprašymą"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kategorija*</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                  >
                    <option value="">Pasirinkite kategoriją</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="Veido priežiūra">Veido priežiūra</option>
                    <option value="Kūno priežiūra">Kūno priežiūra</option>
                    <option value="Plaukų priežiūra">Plaukų priežiūra</option>
                    <option value="Saulės apsauga">Saulės apsauga</option>
                    <option value="Dekoratyvinė kosmetika">Dekoratyvinė kosmetika</option>
                    <option value="Kita">Kita</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Partijos dydis (g)*</label>
                  <input
                    type="number"
                    name="batchSize"
                    value={formData.batchSize}
                    onChange={handleChange}
                    min="1"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                    placeholder="1000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Klientas (pasirinktinai)</label>
                  <select
                    name="clientId"
                    value={formData.clientId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                  >
                    <option value="">Nepriskirta klientui</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kūrėjas*</label>
                  <select
                    name="developedBy"
                    value={formData.developedBy}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                  >
                    {developers.map(dev => (
                      <option key={dev} value={dev}>{dev}</option>
                    ))}
                    <option value="Jonas Jonaitis">Jonas Jonaitis</option>
                    <option value="Marija Petraitienė">Marija Petraitienė</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Būsena</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                  >
                    <option value="draft">Juodraštis</option>
                    <option value="testing">Testuojama</option>
                    <option value="approved">Patvirtinta</option>
                    <option value="archived">Archyvuota</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Properties */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                Produkto savybės
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">pH</label>
                  <input
                    type="number"
                    name="ph"
                    value={formData.ph || ''}
                    onChange={handleChange}
                    min="0"
                    max="14"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                    placeholder="5.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Klampumas</label>
                  <select
                    name="viscosity"
                    value={formData.viscosity}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                  >
                    <option value="">Pasirinkite klampumą</option>
                    <option value="Skystas">Skystas</option>
                    <option value="Vidutinė">Vidutinė</option>
                    <option value="Tiršta">Tiršta</option>
                    <option value="Labai tiršta">Labai tiršta</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Spalva</label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                    placeholder="Balta, geltona, skaidri..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kvapas</label>
                  <input
                    type="text"
                    name="odor"
                    value={formData.odor}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                    placeholder="Neutralus, gėlių, citrusų..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stabilumas</label>
                <input
                  type="text"
                  name="stability"
                  value={formData.stability}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                  placeholder="24 mėnesiai, 12 mėnesių..."
                />
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                placeholder="Papildomos pastabos apie formulę"
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
              className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
            >
              {formula ? 'Atnaujinti formulę' : 'Sukurti formulę'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormulaForm;