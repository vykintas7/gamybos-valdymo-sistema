import React, { useState, useEffect } from 'react';
import { Material, MaterialFormData } from '../types/material';
import { X, Plus, Minus } from 'lucide-react';

interface MaterialFormProps {
  material?: Material;
  onSave: (data: MaterialFormData) => void;
  onCancel: () => void;
  categories: string[];
}

const MaterialForm: React.FC<MaterialFormProps> = ({ material, onSave, onCancel, categories }) => {
  const [formData, setFormData] = useState<MaterialFormData>({
    name: '',
    sku: '',
    description: '',
    category: '',
    supplier: '',
    currentStock: 0,
    minStock: 0,
    maxStock: 0,
    unit: 'kg',
    unitPrice: 0,
    location: '',
    expiryDate: '',
    batchNumber: '',
    inciName: '',
    casNumber: '',
    suitableForCosmetics: false,
    suitableForSupplements: false,
    certifications: [],
    notes: '',
    status: 'active'
  });

  const [newCertification, setNewCertification] = useState('');

  useEffect(() => {
    if (material) {
      setFormData({
        name: material.name,
        sku: material.sku,
        description: material.description,
        category: material.category,
        supplier: material.supplier,
        currentStock: material.currentStock,
        minStock: material.minStock,
        maxStock: material.maxStock,
        unit: material.unit,
        unitPrice: material.unitPrice,
        location: material.location,
        expiryDate: material.expiryDate || '',
        batchNumber: material.batchNumber || '',
        inciName: material.inciName || '',
        casNumber: material.casNumber || '',
        suitableForCosmetics: material.suitableForCosmetics,
        suitableForSupplements: material.suitableForSupplements,
        certifications: [...material.certifications],
        notes: material.notes,
        status: material.status
      });
    }
  }, [material]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      status: formData.status as 'active' | 'discontinued' | 'pending'
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const addCertification = () => {
    if (newCertification.trim() && !formData.certifications.includes(newCertification.trim())) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }));
      setNewCertification('');
    }
  };

  const removeCertification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {material ? 'Redaguoti medžiagą' : 'Pridėti naują medžiagą'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                Pagrindinė informacija
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Medžiagos pavadinimas*</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Įveskite medžiagos pavadinimą"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SKU*</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Įveskite SKU"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Aprašymas</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Įveskite medžiagos aprašymą"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategorija*</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  <option value="">Pasirinkite kategoriją</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="kita">Kita</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tiekėjas*</label>
                <input
                  type="text"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Įveskite tiekėjo pavadinimą"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vieta*</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="pvz., A-12-3"
                />
              </div>
            </div>

            {/* Stock and Pricing */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                Atsargos ir kainodara
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vienetas</label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  >
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="L">L</option>
                    <option value="mL">mL</option>
                    <option value="pieces">pieces</option>
                    <option value="boxes">dėžės</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vieneto kaina*</label>
                  <input
                    type="number"
                    name="unitPrice"
                    value={formData.unitPrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="0.00 €"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dabartinės atsargos*</label>
                  <input
                    type="number"
                    name="currentStock"
                    value={formData.currentStock}
                    onChange={handleChange}
                    min="0"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min. atsargos*</label>
                  <input
                    type="number"
                    name="minStock"
                    value={formData.minStock}
                    onChange={handleChange}
                    min="0"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maks. atsargos*</label>
                  <input
                    type="number"
                    name="maxStock"
                    value={formData.maxStock}
                    onChange={handleChange}
                    min="0"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Galiojimo data</label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Partijos numeris</label>
                  <input
                    type="text"
                    name="batchNumber"
                    value={formData.batchNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Įveskite partijos numerį"
                  />
                </div>
              </div>

              {/* Cosmetic Information - Only show if suitable for cosmetics */}
              {formData.suitableForCosmetics && (
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <h4 className="text-md font-medium text-gray-900">Kosmetikos informacija</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">INCI pavadinimas</label>
                    <input
                      type="text"
                      name="inciName"
                      value={formData.inciName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      placeholder="Tarptautinis kosmetikos ingredientų pavadinimas"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CAS numeris</label>
                    <input
                      type="text"
                      name="casNumber"
                      value={formData.casNumber}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      placeholder="Cheminių santraukų tarnybos registro numeris"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Būsena</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  <option value="aktyvus">Aktyvus</option>
                  <option value="nutrauktas">Nutrauktas</option>
                  <option value="laukiantis">Laukiantis</option>
                </select>
              </div>
            </div>

            {/* Suitability */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                Tinkamumas
              </h3>

              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="suitableForCosmetics"
                    name="suitableForCosmetics"
                    checked={formData.suitableForCosmetics}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="suitableForCosmetics" className="ml-2 text-sm font-medium text-gray-700">
                    Tinka kosmetikai
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="suitableForSupplements"
                    name="suitableForSupplements"
                    checked={formData.suitableForSupplements}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="suitableForSupplements" className="ml-2 text-sm font-medium text-gray-700">
                    Tinka papildams
                  </label>
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                Sertifikatai
              </h3>

              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newCertification}
                  onChange={(e) => setNewCertification(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Pridėti sertifikatą"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                />
                <button
                  type="button"
                  onClick={addCertification}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.certifications.map((cert, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {cert}
                    <button
                      type="button"
                      onClick={() => removeCertification(index)}
                      className="ml-2 text-gray-400 hover:text-red-600"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Pastabos</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="Papildomos pastabos apie šią medžiagą"
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
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              {material ? 'Atnaujinti medžiagą' : 'Pridėti medžiagą'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaterialForm;