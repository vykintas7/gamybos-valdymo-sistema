import React from 'react';
import { Formula } from '../types/formula';
import { useComments } from '../hooks/useComments';
import { Edit, Trash2, Copy, FileText, CheckCircle, Clock, AlertTriangle, Printer } from 'lucide-react';

interface FormulasListProps {
  formulas: Formula[];
  onEdit: (formula: Formula) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onView: (formula: Formula) => void;
  onPrint: (formula: Formula, type: 'production' | 'technical') => void;
}

const FormulasList: React.FC<FormulasListProps> = ({ 
  formulas, 
  onEdit, 
  onDelete, 
  onDuplicate, 
  onView 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'testing': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'archived': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('lt-LT');
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Formulė
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategorija
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Partijos dydis
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ingredientai
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kūrėjas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Būsena
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Paskutinį kartą keista
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Veiksmai
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {formulas.map((formula) => (
              <tr key={formula.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <div className="text-sm font-medium text-gray-900">{formula.name}</div>
                    <div className="text-sm text-gray-500">v{formula.version}</div>
                    {formula.description && (
                      <div className="text-xs text-gray-400 mt-1 max-w-xs truncate">
                        {formula.description}
                      </div>
                    )}
                    {formula.clientName && (
                      <div className="text-xs text-blue-600 mt-1">
                        Klientas: {formula.clientName}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {formula.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formula.batchSize}g
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <div className="text-sm font-medium text-gray-900">
                      {formula.ingredients.length} ingredientai
                    </div>
                    <div className="text-xs text-gray-500">
                      {formula.phases.length} fazės ({formula.phases.join(', ')})
                    </div>
                    {formula.totalPercentage > 0 && (
                      <div className={`text-xs ${
                        Math.abs(formula.totalPercentage - 100) < 0.01 
                          ? 'text-green-600' 
                          : 'text-orange-600'
                      }`}>
                        {formula.totalPercentage.toFixed(1)}%
                      </div>
                    )}
                    <CommentInfo formulaId={formula.id} />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formula.developedBy}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(formula.status)}`}>
                    {getStatusIcon(formula.status)}
                    <span className="ml-1">{getStatusText(formula.status)}</span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(formula.lastModified)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onView(formula)}
                      className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50 transition-colors duration-150"
                      title="Peržiūrėti formulę"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    <div className="relative group">
                      <button
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors duration-150"
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
                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors duration-150"
                      title="Redaguoti formulę"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDuplicate(formula.id)}
                      className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors duration-150"
                      title="Kopijuoti formulę"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(formula.id)}
                      className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors duration-150"
                      title="Ištrinti formulę"
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
      
      {formulas.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">Formulių nerasta</div>
        </div>
      )}
    </div>
  );
};

const CommentInfo: React.FC<{ formulaId: string }> = ({ formulaId }) => {
  const { getCommentStats } = useComments();
  const stats = getCommentStats(formulaId);
  
  if (stats.total === 0) return null;
  
  return (
    <div className="flex items-center space-x-2 text-xs mt-1">
      <span className="text-gray-500">{stats.total} komentarai</span>
      {stats.unresolved > 0 && (
        <span className="bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full font-medium">
          {stats.unresolved}
        </span>
      )}
    </div>
  );
};

export default FormulasList;