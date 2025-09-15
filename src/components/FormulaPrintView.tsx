import React from 'react';
import { Formula } from '../types/formula';
import { useMaterials } from '../hooks/useMaterials';

interface FormulaPrintViewProps {
  formula: Formula;
  type: 'production' | 'technical';
  onClose: () => void;
}

const FormulaPrintView: React.FC<FormulaPrintViewProps> = ({ formula, type, onClose }) => {
  const { materials } = useMaterials();

  const handlePrint = () => {
    window.print();
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
    return new Date(dateString).toLocaleDateString('lt-LT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMaterialDetails = (materialId: string) => {
    return materials.find(m => m.id === materialId);
  };

  const groupedIngredients = formula.ingredients.reduce((acc, ingredient) => {
    if (!acc[ingredient.phase]) {
      acc[ingredient.phase] = [];
    }
    acc[ingredient.phase].push(ingredient);
    return acc;
  }, {} as Record<string, typeof formula.ingredients>);

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      {/* Screen controls - hidden when printing */}
      <div className="no-print bg-gray-100 p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">
          {type === 'production' ? 'Gamybinė kortelė' : 'Technologinė kortelė'} - {formula.name}
        </h2>
        <div className="flex space-x-3">
          <button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Spausdinti
          </button>
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Uždaryti
          </button>
        </div>
      </div>

      {/* Printable content */}
      <div className="print-content max-w-4xl mx-auto p-8 bg-white">
        {/* Header */}
        <div className="border-b-2 border-gray-800 pb-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {type === 'production' ? 'GAMYBINĖ KORTELĖ' : 'TECHNOLOGINĖ KORTELĖ'}
              </h1>
              <h2 className="text-xl font-semibold text-gray-700">{formula.name}</h2>
              <p className="text-lg text-gray-600">Versija: {formula.version}</p>
            </div>
            <div className="text-right">
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Dokumento data:</p>
                <p className="text-lg font-semibold">{formatDate(new Date().toISOString())}</p>
                <p className="text-sm text-gray-600 mt-2">Būsena: {getStatusText(formula.status)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Formula Information */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2">
              FORMULĖS INFORMACIJA
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Kategorija:</span>
                <span className="text-gray-900">{formula.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Partijos dydis:</span>
                <span className="text-gray-900 font-semibold">{formula.batchSize}g</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Fazių skaičius:</span>
                <span className="text-gray-900">{formula.phases.length} ({formula.phases.join(', ')})</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Ingredientų:</span>
                <span className="text-gray-900">{formula.ingredients.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Bendras %:</span>
                <span className={`font-semibold ${
                  Math.abs(formula.totalPercentage - 100) < 0.01 ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {formula.totalPercentage.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2">
              KŪRIMO INFORMACIJA
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Kūrėjas:</span>
                <span className="text-gray-900">{formula.developedBy}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Sukurta:</span>
                <span className="text-gray-900">{formatDate(formula.developmentDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Paskutinį kartą keista:</span>
                <span className="text-gray-900">{formatDate(formula.lastModified)}</span>
              </div>
              {formula.ph && (
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">pH:</span>
                  <span className="text-gray-900">{formula.ph}</span>
                </div>
              )}
              {formula.viscosity && (
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Klampumas:</span>
                  <span className="text-gray-900">{formula.viscosity}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ingredients by Phase */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2">
            SUDĖTIS PAGAL FAZES
          </h3>
          
          {formula.phases.map(phase => {
            const phaseIngredients = groupedIngredients[phase] || [];
            const phaseTotal = phaseIngredients.reduce((sum, ing) => sum + ing.percentage, 0);
            
            return (
              <div key={phase} className="mb-6">
                <div className="bg-gray-100 p-3 rounded-t-lg">
                  <h4 className="font-semibold text-gray-900">
                    FAZĖ {phase} ({phaseIngredients.length} ingredientai, {phaseTotal.toFixed(2)}%)
                  </h4>
                </div>
                
                <div className="border border-gray-300 rounded-b-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Nr.</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Medžiaga</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">SKU</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-700 uppercase">%</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-700 uppercase">Svoris (g)</th>
                        {type === 'technical' && (
                          <>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Pridėjimo etapas</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Pastabos</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {phaseIngredients.map((ingredient, index) => {
                        const materialDetails = getMaterialDetails(ingredient.materialId);
                        return (
                          <tr key={ingredient.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                            <td className="px-4 py-3">
                              <div className="text-sm font-medium text-gray-900">{ingredient.materialName}</div>
                              {type === 'technical' && materialDetails?.inciName && (
                                <div className="text-xs text-gray-500">INCI: {materialDetails.inciName}</div>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">{ingredient.materialSku}</td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                              {ingredient.percentage.toFixed(2)}%
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                              {ingredient.weightGrams.toFixed(2)}g
                            </td>
                            {type === 'technical' && (
                              <>
                                <td className="px-4 py-3 text-sm text-gray-700">{ingredient.additionStage}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{ingredient.notes}</td>
                              </>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>

        {/* Production Steps - only for technical card */}
        {type === 'technical' && formula.productionSteps.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2">
              GAMYBOS PROCESAS
            </h3>
            
            <div className="space-y-4">
              {formula.productionSteps
                .sort((a, b) => a.stepNumber - b.stepNumber)
                .map((step) => (
                  <div key={step.id} className="border border-gray-300 rounded-lg p-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                          {step.stepNumber}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <span className="bg-gray-100 px-2 py-1 rounded text-sm font-medium">
                            Fazė {step.phase}
                          </span>
                          {step.temperature && (
                            <span className="text-sm text-gray-600">
                              🌡️ {step.temperature}°C
                            </span>
                          )}
                          {step.mixingTime && (
                            <span className="text-sm text-gray-600">
                              ⏱️ {step.mixingTime} min
                            </span>
                          )}
                          {step.mixingSpeed && (
                            <span className="text-sm text-gray-600">
                              ⚡ {step.mixingSpeed}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-900 font-medium mb-2">{step.description}</p>
                        {step.equipment && (
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">Įranga:</span> {step.equipment}
                          </p>
                        )}
                        {step.notes && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Pastabos:</span> {step.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Additional Properties */}
        {(formula.stability || formula.color || formula.odor || formula.notes) && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2">
              PAPILDOMA INFORMACIJA
            </h3>
            
            <div className="grid grid-cols-2 gap-6">
              {(formula.stability || formula.color || formula.odor) && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Produkto savybės</h4>
                  <div className="space-y-2">
                    {formula.stability && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Stabilumas:</span>
                        <span className="text-gray-900">{formula.stability}</span>
                      </div>
                    )}
                    {formula.color && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Spalva:</span>
                        <span className="text-gray-900">{formula.color}</span>
                      </div>
                    )}
                    {formula.odor && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Kvapas:</span>
                        <span className="text-gray-900">{formula.odor}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {formula.notes && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Pastabos</h4>
                  <p className="text-gray-900 text-sm leading-relaxed">{formula.notes}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t-2 border-gray-800 pt-6 mt-12">
          <div className="grid grid-cols-3 gap-8 text-sm">
            <div>
              <p className="font-medium text-gray-700 mb-2">Paruošė:</p>
              <div className="border-b border-gray-400 h-8 mb-2"></div>
              <p className="text-gray-600">Vardas, pavardė</p>
            </div>
            <div>
              <p className="font-medium text-gray-700 mb-2">Patikrino:</p>
              <div className="border-b border-gray-400 h-8 mb-2"></div>
              <p className="text-gray-600">Vardas, pavardė</p>
            </div>
            <div>
              <p className="font-medium text-gray-700 mb-2">Patvirtino:</p>
              <div className="border-b border-gray-400 h-8 mb-2"></div>
              <p className="text-gray-600">Vardas, pavardė</p>
            </div>
          </div>
          
          <div className="text-center mt-8 text-xs text-gray-500">
            <p>Šis dokumentas yra konfidencialus ir skirtas tik vidiniam naudojimui</p>
            <p>Spausdinta: {formatDate(new Date().toISOString())} | Puslapis 1 iš 1</p>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          .print-content {
            max-width: none !important;
            margin: 0 !important;
            padding: 20px !important;
            font-size: 12px !important;
          }
          
          body {
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          table {
            page-break-inside: avoid;
          }
          
          .border-gray-300 {
            border-color: #000 !important;
          }
          
          .bg-gray-100 {
            background-color: #f5f5f5 !important;
          }
          
          .bg-gray-50 {
            background-color: #fafafa !important;
          }
        }
      `}</style>
    </div>
  );
};

export default FormulaPrintView;