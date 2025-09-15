import React from 'react';
import { Material } from '../types/material';
import { Edit, Trash2, AlertTriangle, CheckCircle, Clock, Package } from 'lucide-react';

interface MaterialCardProps {
  material: Material;
  onEdit: (material: Material) => void;
  onDelete: (id: string) => void;
}

const MaterialCard: React.FC<MaterialCardProps> = ({ material, onEdit, onDelete }) => {
  const getStockStatus = () => {
    if (material.currentStock <= material.minStock) return 'low';
    if (material.currentStock >= material.maxStock) return 'high';
    return 'normal';
  };

  const getExpiryStatus = () => {
    if (!material.expiryDate) return null;
    const expiryDate = new Date(material.expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return 'expired';
    if (daysUntilExpiry <= 30) return 'expiring';
    return 'valid';
  };

  const stockStatus = getStockStatus();
  const expiryStatus = getExpiryStatus();

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 p-6 group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <div className="p-1.5 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-200">
              <Package className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 tracking-tight">{material.name}</h3>
          </div>
          <p className="text-sm text-gray-500 mb-1 font-medium">SKU: {material.sku}</p>
          <p className="text-sm text-gray-600">{material.description}</p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(material)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:shadow-sm"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(material.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:shadow-sm"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Kategorija</p>
          <p className="text-sm font-semibold text-gray-900">{material.category}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Tiekėjas</p>
          <p className="text-sm font-semibold text-gray-900">{material.supplier}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Vieta</p>
          <p className="text-sm font-semibold text-gray-900">{material.location}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Vieneto kaina</p>
          <p className="text-sm font-semibold text-gray-900">€{material.unitPrice.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
            stockStatus === 'low' ? 'bg-red-100 text-red-700' :
            stockStatus === 'high' ? 'bg-yellow-100 text-yellow-700' :
            'bg-green-100 text-green-700'
          }`}>
            {stockStatus === 'low' ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
            <span>{material.currentStock} {material.unit}</span>
          </div>
          
          {expiryStatus && (
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold shadow-sm ${
              expiryStatus === 'expired' ? 'bg-red-100 text-red-700' :
              expiryStatus === 'expiring' ? 'bg-orange-100 text-orange-700' :
              'bg-green-100 text-green-700'
            }`}>
              <Clock className="w-3 h-3" />
              <span>{material.expiryDate}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {material.suitableForCosmetics && (
          <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 text-xs font-semibold rounded-full shadow-sm">
            Kosmetika
          </span>
        )}
        {material.suitableForSupplements && (
          <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 text-xs font-semibold rounded-full shadow-sm">
            Papildai
          </span>
        )}
        <span className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
          material.status === 'aktyvus' ? 'bg-green-100 text-green-700' :
          material.status === 'nutrauktas' ? 'bg-red-100 text-red-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {material.status === 'aktyvus' ? 'Aktyvus' : 
           material.status === 'nutrauktas' ? 'Nutrauktas' : 
           material.status === 'laukiantis' ? 'Laukiantis' : material.status}
        </span>
      </div>

      {material.certifications.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Sertifikatai</p>
          <div className="flex flex-wrap gap-1">
            {material.certifications.map((cert, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg font-medium">
                {cert}
              </span>
            ))}
          </div>
        </div>
      )}

      {material.suitableForCosmetics && (material.inciName || material.casNumber) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Kosmetikos informacija</p>
          <div className="grid grid-cols-1 gap-2">
            {material.inciName && (
              <div>
                <span className="text-xs text-gray-500">INCI: </span>
                <span className="text-xs font-semibold text-gray-900">{material.inciName}</span>
              </div>
            )}
            {material.casNumber && (
              <div>
                <span className="text-xs text-gray-500">CAS: </span>
                <span className="text-xs font-semibold text-gray-900">{material.casNumber}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialCard;