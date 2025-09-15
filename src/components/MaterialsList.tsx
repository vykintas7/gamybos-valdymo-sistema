import React from 'react';
import { Material } from '../types/material';
import { Edit, Trash2, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface MaterialsListProps {
  materials: Material[];
  onEdit: (material: Material) => void;
  onDelete: (id: string) => void;
}

const MaterialsList: React.FC<MaterialsListProps> = ({ materials, onEdit, onDelete }) => {
  const getStockStatus = (material: Material) => {
    if (material.currentStock <= material.minStock) return 'low';
    if (material.currentStock >= material.maxStock) return 'high';
    return 'normal';
  };

  const getExpiryStatus = (material: Material) => {
    if (!material.expiryDate) return null;
    const expiryDate = new Date(material.expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return 'expired';
    if (daysUntilExpiry <= 30) return 'expiring';
    return 'valid';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Medžiaga
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategorija
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Atsargos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kaina
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vieta
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tinkamumas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Būsena
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Veiksmai
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {materials.map((material) => {
              const stockStatus = getStockStatus(material);
              const expiryStatus = getExpiryStatus(material);
              
              return (
                <tr key={material.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">{material.name}</div>
                      <div className="text-sm text-gray-500">SKU: {material.sku}</div>
                      {material.supplier && (
                        <div className="text-xs text-gray-400">{material.supplier}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {material.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className={`flex items-center space-x-1 text-sm font-medium ${
                        stockStatus === 'low' ? 'text-red-600' :
                        stockStatus === 'high' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {stockStatus === 'low' ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                        <span>{material.currentStock} {material.unit}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Min: {material.minStock} | Maks: {material.maxStock}
                      </div>
                      {expiryStatus && (
                        <div className={`flex items-center space-x-1 text-xs ${
                          expiryStatus === 'expired' ? 'text-red-600' :
                          expiryStatus === 'expiring' ? 'text-orange-600' :
                          'text-green-600'
                        }`}>
                          <Clock className="w-3 h-3" />
                          <span>{material.expiryDate}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    €{material.unitPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {material.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {material.suitableForCosmetics && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">
                          Kosmetika
                        </span>
                      )}
                      {material.suitableForSupplements && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                          Papildai
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      material.status === 'aktyvus' ? 'bg-green-100 text-green-800' :
                      material.status === 'nutrauktas' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {material.status === 'aktyvus' ? 'Aktyvus' : 
                       material.status === 'nutrauktas' ? 'Nutrauktas' : 
                       material.status === 'laukiantis' ? 'Laukiantis' : material.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onEdit(material)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors duration-150"
                        title="Redaguoti medžiagą"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(material.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors duration-150"
                        title="Ištrinti medžiagą"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {materials.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">Medžiagų nerasta</div>
        </div>
      )}
    </div>
  );
};

export default MaterialsList;