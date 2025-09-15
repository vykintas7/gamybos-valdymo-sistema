import React, { useState, useRef } from 'react';
import { MaterialFormData } from '../types/material';
import { Upload, Download, FileText, CheckCircle, AlertTriangle, X } from 'lucide-react';

interface MaterialImportProps {
  onImport: (materials: MaterialFormData[]) => void;
  onClose: () => void;
}

interface ImportResult {
  success: MaterialFormData[];
  errors: { row: number; error: string; data: any }[];
}

const MaterialImport: React.FC<MaterialImportProps> = ({ onImport, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = () => {
    const csvContent = `name,sku,description,category,supplier,currentStock,minStock,maxStock,unit,unitPrice,location,expiryDate,batchNumber,inciName,casNumber,suitableForCosmetics,suitableForSupplements,certifications,notes,status
"Hialurono rūgšties milteliai","HA-001","Didelio molekulinio svorio hialurono rūgštis odos priežiūros produktams","Aktyvūs ingredientai","BioChem sprendimai",150,50,500,"kg",485.00,"A-12-3","2025-08-15","HA240215","Sodium Hyaluronate","9067-32-7",TRUE,FALSE,"ISO 9001|Cosmos patvirtinta|USP klasė","Laikyti vėsioje, sausoje vietoje. Higroskopinė medžiaga.","active"
"Vitaminas C (L-askorbo rūgštis)","VC-002","Gryna L-askorbo rūgštis kosmetikos ir maisto papildų gamybai","Vitaminai","NutriChem pramonė",25,30,200,"kg",125.50,"B-08-1","2025-06-30","VC240118","Ascorbic Acid","50-81-7",TRUE,TRUE,"FDA patvirtinta|ISO 9001|GMP sertifikuota","Jautri šviesai. Saugoti nuo karščio ir drėgmės.","active"
"Kolageno peptidai","COL-003","Jūrų kolageno peptidai maisto papildų gamybai","Baltymai","Jūrų biotechnologijos UAB",85,40,300,"kg",95.75,"C-15-2","2024-12-20","COL240201","","",FALSE,TRUE,"HACCP|Halal|Ne-GMO","Tik maisto klasės. Netinka išoriniam naudojimui.","active"`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'medziagu_importo_sablonai.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const parseCSV = (csvText: string): any[] => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
      const values = [];
      let current = '';
      let inQuotes = false;
      
      for (let j = 0; j < lines[i].length; j++) {
        const char = lines[i][j];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());

      if (values.length === headers.length) {
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index].replace(/"/g, '');
        });
        rows.push(row);
      }
    }

    return rows;
  };

  const validateMaterial = (data: any, rowIndex: number): { isValid: boolean; material?: MaterialFormData; error?: string } => {
    try {
      // Required fields validation
      if (!data.name || !data.sku || !data.category || !data.supplier || !data.location) {
        return { isValid: false, error: 'Trūksta privalomų laukų (name, sku, category, supplier, location)' };
      }

      // Numeric fields validation
      const currentStock = parseFloat(data.currentStock) || 0;
      const minStock = parseFloat(data.minStock) || 0;
      const maxStock = parseFloat(data.maxStock) || 0;
      const unitPrice = parseFloat(data.unitPrice) || 0;

      if (currentStock < 0 || minStock < 0 || maxStock < 0 || unitPrice < 0) {
        return { isValid: false, error: 'Skaitinės reikšmės negali būti neigiamos' };
      }

      // Boolean fields
      const suitableForCosmetics = data.suitableForCosmetics?.toLowerCase() === 'true';
      const suitableForSupplements = data.suitableForSupplements?.toLowerCase() === 'true';

      // Certifications array
      const certifications = data.certifications ? data.certifications.split('|').filter((c: string) => c.trim()) : [];

      // Status validation
      const status = ['active', 'discontinued', 'pending'].includes(data.status) ? data.status : 'active';

      const material: MaterialFormData = {
        name: data.name,
        sku: data.sku,
        description: data.description || '',
        category: data.category,
        supplier: data.supplier,
        currentStock,
        minStock,
        maxStock,
        unit: data.unit || 'kg',
        unitPrice,
        location: data.location,
        expiryDate: data.expiryDate || undefined,
        batchNumber: data.batchNumber || undefined,
        inciName: data.inciName || undefined,
        casNumber: data.casNumber || undefined,
        suitableForCosmetics,
        suitableForSupplements,
        certifications,
        notes: data.notes || '',
        status: status as 'active' | 'discontinued' | 'pending'
      };

      return { isValid: true, material };
    } catch (error) {
      return { isValid: false, error: `Klaida apdorojant duomenis: ${error}` };
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setResult(null);
    } else {
      alert('Prašome pasirinkti CSV failą');
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    try {
      const text = await file.text();
      const rows = parseCSV(text);
      
      const success: MaterialFormData[] = [];
      const errors: { row: number; error: string; data: any }[] = [];

      rows.forEach((row, index) => {
        const validation = validateMaterial(row, index + 2); // +2 because of header and 0-based index
        if (validation.isValid && validation.material) {
          success.push(validation.material);
        } else {
          errors.push({
            row: index + 2,
            error: validation.error || 'Nežinoma klaida',
            data: row
          });
        }
      });

      setResult({ success, errors });
    } catch (error) {
      alert('Klaida skaitant failą: ' + error);
    } finally {
      setImporting(false);
    }
  };

  const handleConfirmImport = () => {
    if (result?.success) {
      onImport(result.success);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Žaliavų importas iš CSV</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {!result ? (
            <div className="space-y-6">
              {/* Template Download */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-medium text-blue-900 mb-2">1. Atsisiųskite šabloną</h3>
                    <p className="text-sm text-blue-700 mb-3">
                      Atsisiųskite CSV šabloną su pavyzdiniais duomenimis ir teisingais stulpelių pavadinimais.
                    </p>
                    <button
                      onClick={downloadTemplate}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      <Download className="w-4 h-4" />
                      <span>Atsisiųsti CSV šabloną</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Upload className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-2">2. Įkelkite užpildytą CSV failą</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Pasirinkite savo užpildytą CSV failą importavimui.
                    </p>
                    <div className="flex items-center space-x-4">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        Pasirinkti failą
                      </button>
                      {file && (
                        <span className="text-sm text-gray-600">
                          Pasirinktas: {file.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Import Instructions */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-medium text-yellow-900 mb-2">Importavimo instrukcijos:</h3>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• CSV failas turi turėti antraštės eilutę su stulpelių pavadinimais</li>
                  <li>• Privalomi laukai: name, sku, category, supplier, location</li>
                  <li>• Boolean laukai (suitableForCosmetics, suitableForSupplements): TRUE arba FALSE</li>
                  <li>• Sertifikatai atskirti "|" simboliu (pvz., "ISO 9001|GMP|Organic")</li>
                  <li>• Datos formatas: YYYY-MM-DD</li>
                  <li>• Skaitinės reikšmės su tašku kaip dešimtainiu skyriklis</li>
                </ul>
              </div>

              {/* Import Button */}
              {file && (
                <div className="flex justify-end">
                  <button
                    onClick={handleImport}
                    disabled={importing}
                    className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{importing ? 'Importuojama...' : 'Importuoti žaliavas'}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Import Results */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h3 className="font-medium text-green-900">Sėkmingai importuota</h3>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{result.success.length}</p>
                  <p className="text-sm text-green-700">žaliavų</p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <h3 className="font-medium text-red-900">Klaidos</h3>
                  </div>
                  <p className="text-2xl font-bold text-red-600">{result.errors.length}</p>
                  <p className="text-sm text-red-700">eilučių su klaidomis</p>
                </div>
              </div>

              {/* Errors List */}
              {result.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-medium text-red-900 mb-3">Klaidos detalės:</h3>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {result.errors.map((error, index) => (
                      <div key={index} className="bg-white border border-red-200 rounded p-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-red-900">Eilutė {error.row}</p>
                            <p className="text-sm text-red-700">{error.error}</p>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-600">
                          <strong>Duomenys:</strong> {JSON.stringify(error.data, null, 2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Success Preview */}
              {result.success.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-medium text-green-900 mb-3">Sėkmingai importuojamos žaliavos:</h3>
                  <div className="max-h-60 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {result.success.slice(0, 10).map((material, index) => (
                        <div key={index} className="bg-white border border-green-200 rounded p-2">
                          <p className="font-medium text-green-900">{material.name}</p>
                          <p className="text-sm text-green-700">SKU: {material.sku}</p>
                          <p className="text-xs text-gray-600">{material.category}</p>
                        </div>
                      ))}
                    </div>
                    {result.success.length > 10 && (
                      <p className="text-sm text-green-700 mt-2">
                        ... ir dar {result.success.length - 10} žaliavų
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setResult(null);
                    setFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Importuoti kitą failą
                </button>
                {result.success.length > 0 && (
                  <button
                    onClick={handleConfirmImport}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    Patvirtinti importą ({result.success.length} žaliavų)
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialImport;