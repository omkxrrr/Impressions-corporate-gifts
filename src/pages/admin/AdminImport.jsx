import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, FileType, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Papa from 'papaparse'; // Needs npm install papaparse

const AdminImport = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [validationResults, setValidationResults] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [importResult, setImportResult] = useState(null);

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    
    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setParsedData(results.data);
        validateData(results.data);
      },
      error: (error) => {
        alert("Error parsing CSV: " + error.message);
      }
    });
  };

  const validateData = (data) => {
    let valid = [];
    let invalid = [];

    data.forEach((row, index) => {
      const errors = [];
      
      // Map columns (support various case formats)
      const sku = row.SKU || row.sku || '';
      const name = row.Name || row.name || '';
      const category = row.Category || row.category || '';
      const description = row.Description || row.description || '';
      const features = row.Features || row.features || '';
      const images = row.Images || row.images || '';

      if (!name) errors.push("Missing Name");
      if (!category) errors.push("Missing Category");
      
      // Duplicate SKU validation could be done here if we fetched existing SKUs, 
      // but we'll let the backend catch DB-level duplicates for simplicity.

      const productObj = {
        sku,
        name,
        category,
        description,
        shortDescription: description.substring(0, 100),
        features, // Backend will split by pipe |
        images // Backend will split by comma
      };

      if (errors.length > 0) {
        invalid.push({ row: index + 2, data: productObj, errors }); // +2 because header is row 1, 0-indexed is row 2
      } else {
        valid.push({ row: index + 2, data: productObj });
      }
    });

    setValidationResults({ valid, invalid });
  };

  const handleImport = async () => {
    if (!validationResults || validationResults.valid.length === 0) return;
    
    setUploading(true);
    try {
      const productsToImport = validationResults.valid.map(v => v.data);
      
      const res = await fetch('/api/products/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ products: productsToImport })
      });
      
      const result = await res.json();
      
      if (!res.ok) {
        if (res.status === 401) throw new Error('Unauthorized');
        throw new Error(result.message || 'Import failed');
      }
      
      setImportResult(result);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = "SKU,Name,Category,Description,Features,Images\nPROD001,Premium Coffee Mug,Home & Kitchen,A nice mug.,Feature 1 | Feature 2,https://.../img1.jpg,https://.../img2.jpg";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "impressions_product_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link to="/admin/products" className="mr-4 text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Bulk Import Products</h1>
        </div>
        <button 
          onClick={downloadTemplate}
          className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 transition text-sm"
        >
          Download CSV Template
        </button>
      </div>

      {!importResult ? (
        <>
          {/* Upload Area */}
          <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm text-center mb-8">
            <FileType className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Upload CSV or Excel (CSV format)</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
              Please ensure your file matches the template format. Multiple images should be separated by commas, and features separated by a pipe (|).
            </p>
            <input 
              type="file" 
              accept=".csv" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileUpload} 
            />
            <button 
              onClick={() => fileInputRef.current.click()}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition inline-flex items-center"
            >
              <Upload className="w-4 h-4 mr-2" /> Select File
            </button>
            {file && <p className="mt-4 text-sm font-medium text-green-600">Selected: {file.name}</p>}
          </div>

          {/* Validation Results */}
          {validationResults && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <div className="flex items-center text-green-700 font-bold mb-1">
                    <CheckCircle className="w-5 h-5 mr-2" /> Valid Rows
                  </div>
                  <p className="text-2xl font-black text-green-800">{validationResults.valid.length}</p>
                </div>
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <div className="flex items-center text-red-700 font-bold mb-1">
                    <AlertCircle className="w-5 h-5 mr-2" /> Errors
                  </div>
                  <p className="text-2xl font-black text-red-800">{validationResults.invalid.length}</p>
                </div>
              </div>

              {validationResults.invalid.length > 0 && (
                <div className="bg-white border border-red-200 rounded-lg overflow-hidden">
                  <div className="bg-red-50 p-4 border-b border-red-200 font-semibold text-red-800">
                    Fix these errors before importing
                  </div>
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-2">Row</th>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Issues</th>
                      </tr>
                    </thead>
                    <tbody>
                      {validationResults.invalid.map((item, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="px-4 py-2 font-medium">{item.row}</td>
                          <td className="px-4 py-2">{item.data.name || 'N/A'}</td>
                          <td className="px-4 py-2 text-red-600">
                            {item.errors.join(', ')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {validationResults.valid.length > 0 && (
                <div className="flex justify-end">
                  <button 
                    onClick={handleImport}
                    disabled={uploading || validationResults.invalid.length > 0}
                    className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center"
                  >
                    {uploading ? 'Importing...' : `Import ${validationResults.valid.length} Products`}
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        /* Success Screen */
        <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Import Complete!</h2>
          <p className="text-gray-600 mb-6">
            Successfully imported {importResult.successCount} products.
          </p>
          
          {importResult.errors && importResult.errors.length > 0 && (
            <div className="mb-6 text-left bg-yellow-50 p-4 rounded-md border border-yellow-200">
              <p className="font-bold text-yellow-800 mb-2">Some products failed during DB insertion:</p>
              <ul className="text-sm text-yellow-700 list-disc pl-5">
                {importResult.errors.map((e, i) => (
                  <li key={i}>Row {e.row} ({e.name}): {e.error}</li>
                ))}
              </ul>
            </div>
          )}

          <Link 
            to="/admin/products"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition inline-block"
          >
            Return to Products
          </Link>
        </div>
      )}
    </div>
  );
};

export default AdminImport;
