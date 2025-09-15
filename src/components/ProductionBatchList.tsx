import React from 'react';
import { ProductionBatch } from '../types/production';
import { Play, CheckCircle, Clock, X, Trash2, Calendar, Factory } from 'lucide-react';

interface ProductionBatchListProps {
  batches: ProductionBatch[];
  onStart: (batchId: string) => void;
  onComplete: (batchId: string) => void;
  onCancel: (batchId: string) => void;
  onDelete: (batchId: string) => void;
}

const ProductionBatchList: React.FC<ProductionBatchListProps> = ({
  batches,
  onStart,
  onComplete,
  onCancel,
  onDelete
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'planned': return <Calendar className="w-3 h-3" />;
      case 'in_progress': return <Play className="w-3 h-3" />;
      case 'completed': return <CheckCircle className="w-3 h-3" />;
      case 'cancelled': return <X className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'planned': return 'Suplanuota';
      case 'in_progress': return 'Gaminama';
      case 'completed': return 'Užbaigta';
      case 'cancelled': return 'Atšaukta';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('lt-LT');
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Partija
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Formulė
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gamybos data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kiekis
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Savikaina
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Būsena
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Klientas
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Veiksmai
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {batches.map((batch) => (
              <tr key={batch.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="p-1.5 bg-green-100 rounded-lg mr-3">
                      <Factory className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{batch.batchNumber}</div>
                      <div className="text-sm text-gray-500">{batch.producedBy}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{batch.formulaName}</div>
                  <div className="text-sm text-gray-500">v{batch.formulaVersion}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatDate(batch.productionDate)}</div>
                  {batch.plannedDate && batch.status === 'planned' && (
                    <div className="text-xs text-blue-600">
                      Planuota: {formatDate(batch.plannedDate)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {batch.unitsToProduct} vnt × {batch.volumePerUnit} ml
                  </div>
                  <div className="text-sm text-gray-500">
                    Iš viso: {batch.totalVolume} ml
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">€{batch.totalCost.toFixed(2)}</div>
                  <div className="text-sm text-gray-500">€{batch.costPerUnit.toFixed(2)} / vnt</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(batch.status)}`}>
                    {getStatusIcon(batch.status)}
                    <span className="ml-1">{getStatusText(batch.status)}</span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {batch.clientName || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    {batch.status === 'planned' && (
                      <button
                        onClick={() => onStart(batch.id)}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors duration-150"
                        title="Pradėti gamybą"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    )}
                    {batch.status === 'in_progress' && (
                      <button
                        onClick={() => onComplete(batch.id)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors duration-150"
                        title="Užbaigti gamybą"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    {(batch.status === 'planned' || batch.status === 'in_progress') && (
                      <button
                        onClick={() => onCancel(batch.id)}
                        className="text-orange-600 hover:text-orange-900 p-1 rounded hover:bg-orange-50 transition-colors duration-150"
                        title="Atšaukti gamybą"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(batch.id)}
                      className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors duration-150"
                      title="Ištrinti partiją"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {batches.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">Gamybos partijų nerasta</div>
        </div>
      )}
    </div>
  );
};

export default ProductionBatchList;