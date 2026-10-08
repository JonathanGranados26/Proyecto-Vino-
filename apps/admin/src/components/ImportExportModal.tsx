import { useState, useRef } from 'react';
import Papa from 'papaparse';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImportExportModal({ isOpen, onClose }: ImportExportModalProps) {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ imported: number; errors: number; details: any } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      alert('Solo se permiten archivos CSV');
      return;
    }

    setFile(selectedFile);
    setResult(null);

    // Preview del CSV
    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      preview: 5,
      complete: (results) => {
        setPreview(results.data);
      },
    });
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setResult(null);

    const text = await file.text();

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('http://localhost:4000/products-import/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ csvData: text }),
      });

      if (!response.ok) throw new Error('Error al importar');

      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setImporting(false);
    }
  };

  const handleExport = () => {
    window.open('http://localhost:4000/products-import/export', '_blank');
  };

  const downloadTemplate = () => {
    window.open('http://localhost:4000/products-import/template', '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-wine-700 p-4 flex justify-between items-center">
          <h3 className="text-white font-bold text-lg">Importar / Exportar Productos</h3>
          <button onClick={onClose} className="text-white/80 hover:text-white text-2xl">
            &times;
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => { setActiveTab('import'); setResult(null); }}
            className={`flex-1 px-6 py-3 font-medium transition ${
              activeTab === 'import'
                ? 'border-b-2 border-wine-700 text-wine-700'
                : 'text-gray-500 hover:text-wine-700'
            }`}
          >
            📥 Importar CSV
          </button>
          <button
            onClick={() => { setActiveTab('export'); setResult(null); }}
            className={`flex-1 px-6 py-3 font-medium transition ${
              activeTab === 'export'
                ? 'border-b-2 border-wine-700 text-wine-700'
                : 'text-gray-500 hover:text-wine-700'
            }`}
          >
            📤 Exportar CSV
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'import' ? (
            <div className="space-y-4">
              {/* Instrucciones */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">📋 Instrucciones:</h4>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Descarga la plantilla para ver el formato correcto</li>
                  <li>Los campos obligatorios son: name, brand, category, presentation</li>
                  <li>Las notas de cata deben separarse por comas</li>
                  <li>El slug se genera automáticamente del nombre</li>
                </ul>
                <button
                  onClick={downloadTemplate}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                >
                  ⬇️ Descargar Plantilla
                </button>
              </div>

              {/* Upload area */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-wine-500 hover:bg-wine-50 transition flex flex-col items-center justify-center gap-2"
              >
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-gray-600 font-medium">
                  {file ? file.name : 'Haz clic para seleccionar archivo CSV'}
                </span>
              </button>

              {/* Preview */}
              {preview.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Vista previa (primeras 5 filas):</h4>
                  <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          {Object.keys(preview[0]).slice(0, 5).map((key) => (
                            <th key={key} className="px-3 py-2 text-left font-medium text-gray-700">
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {preview.slice(0, 3).map((row, i) => (
                          <tr key={i} className="border-t">
                            {Object.values(row).slice(0, 5).map((val: any, j) => (
                              <td key={j} className="px-3 py-2 text-gray-600 truncate max-w-[150px]">
                                {val}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Total de filas: {preview.length}
                  </p>
                </div>
              )}

              {/* Botón importar */}
              {file && !result && (
                <button
                  onClick={handleImport}
                  disabled={importing}
                  className="w-full py-3 bg-wine-700 text-white rounded-lg font-semibold hover:bg-wine-800 transition disabled:opacity-50"
                >
                  {importing ? ' Importando...' : '🚀 Importar Productos'}
                </button>
              )}

              {/* Resultado */}
              {result && (
                <div className="space-y-3">
                  <div className={`p-4 rounded-lg ${result.errors === 0 ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                    <h4 className="font-semibold mb-2">
                      {result.errors === 0 ? '✅ Importación exitosa' : '️ Importación parcial'}
                    </h4>
                    <p className="text-sm">
                      ✅ Importados: <strong>{result.imported}</strong> productos
                    </p>
                    {result.errors > 0 && (
                      <p className="text-sm text-red-700">
                        ❌ Errores: <strong>{result.errors}</strong> filas
                      </p>
                    )}
                  </div>

                  {result.details.errors.length > 0 && (
                    <div className="max-h-48 overflow-y-auto border border-red-200 rounded-lg p-3 bg-red-50">
                      <h5 className="font-semibold text-red-900 mb-2 text-sm">Errores detallados:</h5>
                      <ul className="text-xs text-red-800 space-y-1">
                        {result.details.errors.map((err: any, i: number) => (
                          <li key={i}>
                            <strong>Fila {err.row}:</strong> {err.error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button
                    onClick={() => { setResult(null); setFile(null); setPreview([]); }}
                    className="w-full py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                    Importar otro archivo
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <div className="text-5xl mb-3">📦</div>
                <h4 className="font-semibold text-green-900 mb-2">Exportar Catálogo Completo</h4>
                <p className="text-sm text-green-800 mb-4">
                  Descarga todos los productos en formato CSV para respaldo o edición externa.
                </p>
                <button
                  onClick={handleExport}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                >
                  ⬇️ Descargar CSV Completo
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">💡 ¿Qué incluye el CSV?</h4>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Todos los campos de cada producto</li>
                  <li>Notas de cata separadas por comas</li>
                  <li>Compatible con Excel, Google Sheets y Numbers</li>
                  <li>Codificación UTF-8 (soporta acentos y ñ)</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}