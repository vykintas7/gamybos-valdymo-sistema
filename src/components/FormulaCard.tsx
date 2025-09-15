import React from 'react';
import { Formula } from '../types/formula';
import { useComments } from '../hooks/useComments';
import { Edit, Trash2, Copy, FileText, Beaker, CheckCircle, Clock, AlertTriangle, Printer } from 'lucide-react';

interface FormulaCardProps {
  formula: Formula;
  onEdit: (formula: Formula) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onView: (formula: Formula) => void;
  onPrint: (formula: Formula, type: 'production' | 'technical') => void;
}

const FormulaCard: React.FC<FormulaCardProps> = ({ 
  formula, 
  onEdit, 
  onDelete, 
  onDuplicate, 
  onView,
  onPrint
}) => {
  const { getCommentStats } = useComments();
  const commentStats = getCommentStats(formula.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'testing': return 'bg-yellow-100 text-yellow-700';
      case 'draft': return 'bg-gray-100 text-gray-700';
      case 'archived': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-3 h-3" />;
      case 'testing': return <Clock className="w-3 h-3" />;
      case 'draft': return <FileText className="w-3 h-3" />;
      case 'archived': return <AlertTriangle className="w-3 h-3" />;
      default: return <FileText className="w-3 h-3" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Patvirtinta';
      case 'testing': return 'Testuojama';
      case 'draft': return 'Juodraštis';
      case 'archived': return 'Archyvuota';
      default: return status;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 p-6 group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <div className="p-1.5 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors duration-200">
              <Beaker className="w-4 h-4 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 tracking-tight">{formula.name}</h3>
            <span className="text-sm text-gray-500">v{formula.version}</span>
          </div>
          <p className="text-sm text-gray-600 mb-2">{formula.description}</p>
          <p className="text-xs text-gray-500 font-medium">Kūrėjas: {formula.developedBy}</p>
        </div>
        
        <div className="flex space-x-1">
          <button
            onClick={() => onView(formula)}
            className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200 hover:shadow-sm"
            title="Peržiūrėti formulę"
          >
            <FileText className="w-4 h-4" />
          </button>
          <div className="relative group">
            <button
              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200 hover:shadow-sm"
              title="Spausdinti korteles"
            >
              <Printer className="w-4 h-4" />
            </button>
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <div className="py-1 min-w-[160px]">
                <button
                  onClick={() => onPrint(formula, 'production')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                >
                  Gamybinė kortelė
                </button>
                <button
                  onClick={() => onPrint(formula, 'technical')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                >
                  Technologinė kortelė
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={() => onEdit(formula)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:shadow-sm"
            title="Redaguoti formulę"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDuplicate(formula.id)}
            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200 hover:shadow-sm"
            title="Kopijuoti formulę"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(formula.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:shadow-sm"
            title="Ištrinti formulę"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Kategorija</p>
          <p className="text-sm font-semibold text-gray-900">{formula.category}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Partijos dydis</p>
          <p className="text-sm font-semibold text-gray-900">{formula.batchSize}g</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Ingredientų</p>
          <p className="text-sm font-semibold text-gray-900">{formula.ingredients.length}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Fazių</p>
          <p className="text-sm font-semibold text-gray-900">{formula.phases.length}</p>
        </div>
        {formula.clientName && (
          <div className="col-span-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Klientas</p>
            <p className="text-sm font-semibold text-gray-900">{formula.clientName}</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${getStatusColor(formula.status)}`}>
          {getStatusIcon(formula.status)}
          <span>{getStatusText(formula.status)}</span>
        </div>
        
        {formula.ph && (
          <div className="text-xs text-gray-500">
            pH: {formula.ph}
          </div>
        )}
        
        {commentStats.total > 0 && (
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-gray-500">{commentStats.total} komentarai</span>
            {commentStats.unresolved > 0 && (
              <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-semibold shadow-sm">
                {commentStats.unresolved} neišspręsta
              </span>
            )}
          </div>
        )}
      </div>

      {formula.phases.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Fazės</p>
          <div className="flex flex-wrap gap-1">
            {formula.phases.map((phase, index) => (
              <span key={index} className="px-2 py-1 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 text-xs font-semibold rounded-lg shadow-sm">
                Fazė {phase}
              </span>
            ))}
          </div>
        </div>
      )}

      {(formula.stability || formula.viscosity || formula.color) && (
        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Savybės</p>
          <div className="grid grid-cols-1 gap-1 text-xs">
            {formula.stability && (
              <div>
                <span className="text-gray-500">Stabilumas: </span>
                <span className="font-semibold text-gray-900">{formula.stability}</span>
              </div>
            )}
            {formula.viscosity && (
              <div>
                <span className="text-gray-500">Klampumas: </span>
                <span className="font-semibold text-gray-900">{formula.viscosity}</span>
              </div>
            )}
            {formula.color && (
              <div>
                <span className="text-gray-500">Spalva: </span>
                <span className="font-semibold text-gray-900">{formula.color}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FormulaCard;