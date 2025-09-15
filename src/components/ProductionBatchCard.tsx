import React from 'react';
import { ProductionBatch } from '../types/production';
import { Play, CheckCircle, Clock, X, Trash2, Calendar, Factory, Package } from 'lucide-react';

interface ProductionBatchCardProps {
  batch: ProductionBatch;
  onStart: (batchId: string) => void;
  onComplete: (batchId: string) => void;
  onCancel: (batchId: string) => void;
  onDelete: (batchId: string) => void;
}

const ProductionBatchCard: React.FC<ProductionBatchCardProps> = ({
  batch,
  onStart,
  onComplete,
  onCancel,
  onDelete
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'bg-blue-100 text-blue-700';
      case 'in_progress': return 'bg-orange-100 text-orange-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
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
    <div className="bg-white rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-xl transition-all duration-300 p-6 group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <div className="p-1.5 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors duration-200">
              <Factory className="w-4 h-4 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 tracking-tight">{batch.batchNumber}</h3>
          </div>
          <p className="text-sm font-medium text-gray-900 mb-1">{batch.formulaName} v{batch.formulaVersion}</p>
          <p className="text-sm text-gray-600">{batch.producedBy}</p>
        </div>
        
        <div className="flex space-x-2">
          {batch.status === 'planned' && (
            <button
              onClick={() => onStart(batch.id)}
              className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-xl transition-all duration-200 hover:shadow-sm"
              title="Pradėti gamybą"
            >
              <Play className="w-4 h-4" />
            </button>
          )}
          {batch.status === 'in_progress' && (
            <button
              onClick={() => onComplete(batch.id)}
              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:shadow-sm"
              title="Užbaigti gamybą"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
          {(batch.status === 'planned' || batch.status === 'in_progress') && (
            <button
              onClick={() => onCancel(batch.id)}
              className="p-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-xl transition-all duration-200 hover:shadow-sm"
              title="Atšaukti gamybą"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onDelete(batch.id)}
            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 hover:shadow-sm"
            title="Ištrinti partiją"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Gamybos data</p>
          <p className="text-sm font-semibold text-gray-900">{formatDate(batch.productionDate)}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Vienetų</p>
          <p className="text-sm font-semibold text-gray-900">{batch.unitsToProduct}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Tūris vienetu</p>
          <p className="text-sm font-semibold text-gray-900">{batch.volumePerUnit} ml</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Bendras tūris</p>
          <p className="text-sm font-semibold text-gray-900">{batch.totalVolume} ml</p>
        </div>
        {batch.clientName && (
          <div className="col-span-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Klientas</p>
            <p className="text-sm font-semibold text-gray-900">{batch.clientName}</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${getStatusColor(batch.status)}`}>
          {getStatusIcon(batch.status)}
          <span>{getStatusText(batch.status)}</span>
        </div>
        
        <div className="text-right">
          <p className="text-xs text-gray-500">Savikaina</p>
          <p className="text-sm font-semibold text-gray-900">€{batch.totalCost.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500">Savikaina vienetu</p>
          <p className="text-sm font-semibold text-gray-900">€{batch.costPerUnit.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Ingredientų</p>
          <p className="text-sm font-semibold text-gray-900">{batch.ingredients.length}</p>
        </div>
      </div>

      {batch.notes && (
        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Pastabos</p>
          <p className="text-sm text-gray-700">{batch.notes}</p>
        </div>
      )}

      {batch.plannedDate && batch.status === 'planned' && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700">
            Suplanuota: {formatDate(batch.plannedDate)}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductionBatchCard;