import SearchBar from '../components/SearchBar';
import ApolloTable from '../components/ApolloTable';
import PharmEasyTable from '../components/PharmEasyTable';
import NetmedsTable from '../components/NetmedsTable';
import OneMgTable from '../components/OneMgTable';
import TruemedsTable from '../components/TruemedsTable';
import CompareModal from '../components/CompareModal';
import { useState, useEffect } from 'react';
import SearchEmptyState from '../components/SearchEmptyState';

export default function SearchPage({ darkMode }) {
  const [medicineName, setMedicineName] = useState('paracetamol');
  const [enabled, setEnabled] = useState({ apollo: true, pharmeasy: true, netmeds: true, onemg: true, truemeds: true });
  const [error, setError] = useState(null);
  const [apolloResults, setApolloResults] = useState(null);
  const [apolloLoading, setApolloLoading] = useState(false);
  const [pharmResults, setPharmResults] = useState(null);
  const [netmedsResults, setNetmedsResults] = useState(null);
  const [oneMgResults, setOneMgResults] = useState(null);
  const [truemedsResults, setTruemedsResults] = useState(null);

  const [selectedMap, setSelectedMap] = useState({});
  const [savedMap, setSavedMap] = useState({});
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const selectedList = Object.values(selectedMap);
  const savedList = Object.values(savedMap);
  const selectedCount = selectedList.length;
  const savedCount = savedList.length;
  const [ocrNames, setOcrNames] = useState([]);
  const [uploadingOcr, setUploadingOcr] = useState(false);

  // Persist toggle preferences
  useEffect(() => {
    try {
      const saved = localStorage.getItem('enabledScrapers');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only take known keys to avoid pollution
        const next = {
          apollo: typeof parsed.apollo === 'boolean' ? parsed.apollo : true,
          pharmeasy: typeof parsed.pharmeasy === 'boolean' ? parsed.pharmeasy : true,
          netmeds: typeof parsed.netmeds === 'boolean' ? parsed.netmeds : true,
          onemg: typeof parsed.onemg === 'boolean' ? parsed.onemg : true,
          truemeds: typeof parsed.truemeds === 'boolean' ? parsed.truemeds : true,
        };
        setEnabled(next);
      }
    } catch (e) {
      // non-critical: ignore storage errors
      console.debug('enabledScrapers load failed', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('enabledScrapers', JSON.stringify(enabled));
    } catch (e) {
      // non-critical: ignore storage errors
      console.debug('enabledScrapers save failed', e);
    }
  }, [enabled]);

  const isSelected = (key) => !!selectedMap[key];
  const toggleSelect = (item) => {
    setSelectedMap((prev) => {
      const copy = { ...prev };
      if (copy[item.key]) delete copy[item.key]; else copy[item.key] = item;
      return copy;
    });
  };
  const removeSelected = (key) => setSelectedMap((prev) => { const c = { ...prev }; delete c[key]; return c; });
  const clearSelected = () => setSelectedMap({});

  const saveSelected = () => { setSavedMap((prev) => ({ ...prev, ...selectedMap })); setSelectedMap({}); };
  const removeSaved = (key) => setSavedMap((prev) => { const c = { ...prev }; delete c[key]; return c; });
  const clearSaved = () => setSavedMap({});

  const handleApolloSearch = async (e) => {
    e.preventDefault();
    setApolloLoading(true);
    setError(null);
    setApolloResults(null);
    setPharmResults(null);
    setNetmedsResults(null);
    setOneMgResults(null);
    setTruemedsResults(null);
    setSelectedMap({});

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const makeReq = async () => fetch(`${API_URL}/api/apollo-search`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ keyword: medicineName, enabledScrapers: enabled })
      });
      
      const res = await makeReq();
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.success) throw new Error(body.error || `Backend responded with ${res.status}`);
      const data = body;

  if (enabled.apollo) setApolloResults({ query: medicineName, details: data.data || null });
  if (enabled.pharmeasy && data.pharmeasy) { const products = Array.isArray(data.pharmeasy.products) ? data.pharmeasy.products : []; setPharmResults({ query: medicineName, products }); }
  if (enabled.netmeds && data.netmeds && data.netmeds.ok) { const products = Array.isArray(data.netmeds.products) ? data.netmeds.products : []; setNetmedsResults({ query: medicineName, products }); }
  if (enabled.onemg && data.onemg && data.onemg.ok) { const products = Array.isArray(data.onemg.products) ? data.onemg.products : []; setOneMgResults({ query: medicineName, products }); }
  if (enabled.truemeds && data.truemeds && data.truemeds.ok) setTruemedsResults(data.truemeds);
    } catch (err) {
      console.error('Search error:', err);
      setError('Network error: ' + err.message);
    } finally {
      setApolloLoading(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto py-6 px-4">
      <div className={`px-6 pt-4 pb-5 rounded-xl shadow-md mb-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        {/* Scraper ON/OFF segmented switches */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {[
            { key: 'apollo', label: 'Apollo', color: 'blue' },
            { key: 'pharmeasy', label: 'PharmEasy', color: 'purple' },
            { key: 'netmeds', label: 'Netmeds', color: 'teal' },
            { key: 'onemg', label: '1mg', color: 'orange' },
            { key: 'truemeds', label: 'Truemeds', color: 'pink' },
          ].map(({ key, label, color }) => {
            const isOn = enabled[key];
            const colorClasses = {
              blue: { active: 'from-blue-500 to-blue-600', text: 'text-blue-600', glow: 'shadow-blue-500/50' },
              purple: { active: 'from-purple-500 to-purple-600', text: 'text-purple-600', glow: 'shadow-purple-500/50' },
              teal: { active: 'from-teal-500 to-teal-600', text: 'text-teal-600', glow: 'shadow-teal-500/50' },
              orange: { active: 'from-orange-500 to-orange-600', text: 'text-orange-600', glow: 'shadow-orange-500/50' },
              pink: { active: 'from-pink-500 to-pink-600', text: 'text-pink-600', glow: 'shadow-pink-500/50' },
            }[color];

            return (
              <div
                key={key}
                className={`group flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all duration-300 ${
                  isOn 
                    ? (darkMode 
                        ? 'bg-linear-to-br from-gray-800 to-gray-900 border-gray-600 shadow-lg' 
                        : 'bg-white border-gray-200 shadow-md hover:shadow-lg')
                    : (darkMode 
                        ? 'bg-gray-800/50 border-gray-700/50' 
                        : 'bg-gray-50 border-gray-200')
                }`}
              >
                <div className="flex flex-col gap-0.5 min-w-[70px]">
                  <span className={`text-xs font-bold tracking-tight transition-colors ${
                    isOn 
                      ? (darkMode ? 'text-white' : colorClasses.text)
                      : (darkMode ? 'text-gray-500' : 'text-gray-400')
                  }`}>
                    {label}
                  </span>
                  <span className={`text-[9px] uppercase tracking-wider font-semibold transition-colors ${
                    isOn 
                      ? (darkMode ? 'text-emerald-400' : 'text-emerald-600')
                      : (darkMode ? 'text-gray-600' : 'text-gray-400')
                  }`}>
                    {isOn ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div 
                  className={`relative flex items-center w-14 h-7 rounded-full cursor-pointer transition-all duration-300 ${
                    isOn 
                      ? `bg-linear-to-r ${colorClasses.active} shadow-md ${colorClasses.glow}` 
                      : (darkMode ? 'bg-gray-700' : 'bg-gray-300')
                  }`}
                  onClick={() => setEnabled((prev) => ({ ...prev, [key]: !prev[key] }))}
                  role="switch"
                  aria-checked={isOn}
                  aria-label={`Toggle ${label}`}
                >
                  <div 
                    className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 transform ${
                      isOn ? 'translate-x-7' : 'translate-x-0.5'
                    }`}
                  >
                    <div className={`w-full h-full rounded-full flex items-center justify-center transition-colors duration-300 ${
                      isOn ? colorClasses.text : 'text-gray-400'
                    }`}>
                      {isOn ? (
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className={`absolute inset-0 flex items-center justify-start pl-2 text-[9px] font-black tracking-wider uppercase transition-opacity duration-200 ${
                    isOn ? 'opacity-0' : 'opacity-100 text-white'
                  }`}>
                    OFF
                  </span>
                  <span className={`absolute inset-0 flex items-center justify-end pr-2 text-[9px] font-black tracking-wider uppercase transition-opacity duration-200 ${
                    isOn ? 'opacity-100 text-white' : 'opacity-0'
                  }`}>
                    ON
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <SearchBar value={medicineName} onChange={(e) => setMedicineName(e.target.value)} onSubmit={handleApolloSearch} loading={apolloLoading} darkMode={darkMode} />
        <div className="mt-2 flex items-center justify-start">
          <label className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold border shadow-sm cursor-pointer transition-colors ${uploadingOcr ? 'bg-gray-200 text-gray-400 border-gray-200' : 'bg-fuchsia-600 text-white border-fuchsia-600 hover:bg-fuchsia-700'}`}>
            <input type="file" accept="image/*" className="hidden" disabled={uploadingOcr} onChange={async (e) => {
              const file = e.target.files && e.target.files[0]; if (!file) return; setUploadingOcr(true);
              try {
                const reader = new FileReader();
                reader.onload = async () => {
                  const base64 = reader.result;
                  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
                  try {
                    const res = await fetch(`${API_URL}/api/ocr-prescription`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imageBase64: base64, mimeType: file.type }) });
                    const data = await res.json();
                    if (data.success) setOcrNames(data.medicines || []); else setError(data.error || 'OCR failed');
                  } catch (err) { setError('OCR network error: ' + err.message); }
                  finally { setUploadingOcr(false); e.target.value = ''; }
                };
                reader.readAsDataURL(file);
              } catch (err) { setError('File read error: ' + err.message); setUploadingOcr(false); }
            }} />
            {uploadingOcr ? (<><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25"/><path className="opacity-75" strokeWidth="4" strokeLinecap="round" d="M4 12a8 8 0 018-8"/></svg><span>Processing...</span></>) : (<><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v16h16M4 4l6 6m0 0h4m-4 0v4"/></svg><span>Upload Prescription</span></>)}
          </label>
        </div>
        {ocrNames.length > 0 && (
          <div className={`mt-3 p-3 border rounded-lg ${darkMode ? 'bg-fuchsia-900/20 border-fuchsia-700' : 'bg-fuchsia-50 border-fuchsia-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold ${darkMode ? 'text-fuchsia-300' : 'text-fuchsia-900'}`}>Extracted Medicines</span>
                <span className={`inline-flex items-center justify-center w-5 h-5 text-xs rounded-full border ${darkMode ? 'bg-fuchsia-800 text-fuchsia-200 border-fuchsia-600' : 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200'}`}>{ocrNames.length}</span>
              </div>
              <button onClick={() => setOcrNames([])} className={`text-xs font-medium ${darkMode ? 'text-fuchsia-400 hover:text-fuchsia-300' : 'text-fuchsia-600 hover:text-fuchsia-800'}`}>Clear</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {ocrNames.map((name, idx) => (
                <button key={`${name}-${idx}`} onClick={() => setMedicineName(name)} className={`px-3 py-1.5 text-sm rounded-lg border transition-colors shadow-sm ${darkMode ? 'bg-gray-700 border-fuchsia-600 text-fuchsia-200 hover:bg-gray-600 hover:border-fuchsia-500' : 'bg-white border-fuchsia-300 text-fuchsia-900 hover:bg-fuchsia-100 hover:border-fuchsia-400'}`}>{name}</button>
              ))}
            </div>
          </div>
        )}
  <div className="mt-3 flex items-center justify-end gap-2">
          <button type="button" onClick={saveSelected} disabled={selectedCount === 0} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold border shadow-sm transition-colors ${selectedCount === 0 ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-teal-600 text-white border-teal-600 hover:bg-teal-700'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
            Save <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs ${selectedCount ? 'bg-white text-teal-700' : 'bg-gray-200 text-gray-500'}`}>{selectedCount}</span>
          </button>
          <button type="button" onClick={() => setIsSaveModalOpen(true)} disabled={savedCount === 0} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold border shadow-sm transition-colors ${savedCount === 0 ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-amber-600 text-white border-amber-600 hover:bg-amber-700'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
            Saved <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs ${savedCount ? 'bg-white text-amber-700' : 'bg-gray-200 text-gray-500'}`}>{savedCount}</span>
          </button>
          <button type="button" onClick={() => setIsCompareOpen(true)} disabled={selectedCount < 2} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold border shadow-sm transition-colors ${selectedCount < 2 ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700'}`}>Compare <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs ${selectedCount ? 'bg-white text-indigo-700' : 'bg-gray-200 text-gray-500'}`}>{selectedCount}</span></button>
        </div>
      </div>

      {enabled.apollo && apolloResults && (<ApolloTable results={apolloResults} onToggleSelect={toggleSelect} isSelected={isSelected} darkMode={darkMode} />)}
  {enabled.pharmeasy && pharmResults && Array.isArray(pharmResults.products) && pharmResults.products.length > 0 && (<PharmEasyTable results={pharmResults} onToggleSelect={toggleSelect} isSelected={isSelected} darkMode={darkMode} />)}
  {enabled.netmeds && netmedsResults && Array.isArray(netmedsResults.products) && netmedsResults.products.length > 0 && (<NetmedsTable results={netmedsResults} onToggleSelect={toggleSelect} isSelected={isSelected} darkMode={darkMode} />)}
  {enabled.onemg && oneMgResults && Array.isArray(oneMgResults.products) && oneMgResults.products.length > 0 && (<OneMgTable results={oneMgResults} onToggleSelect={toggleSelect} isSelected={isSelected} darkMode={darkMode} />)}
  {enabled.truemeds && truemedsResults && (<TruemedsTable data={truemedsResults} onToggleSelect={toggleSelect} isSelected={isSelected} darkMode={darkMode} />)}

      {/* Empty state animation when no results and not loading */}
      {(!apolloLoading && !error && !apolloResults && !pharmResults && !netmedsResults && !oneMgResults && !truemedsResults) && (
        <div className="mt-6">
          <SearchEmptyState darkMode={darkMode} />
        </div>
      )}

      {isCompareOpen && (
        <CompareModal items={selectedList} onClose={() => setIsCompareOpen(false)} onRemove={removeSelected} onClear={clearSelected} darkMode={darkMode} />
      )}
      {isSaveModalOpen && (
        <CompareModal items={savedList} onClose={() => setIsSaveModalOpen(false)} onRemove={removeSaved} onClear={clearSaved} title="Saved Items" emptyMessage="No saved items yet. Use the Save button to save selected items." darkMode={darkMode} />
      )}
      {error && (
        <div className={`max-w-3xl mx-auto border rounded-lg p-3 mt-3 ${darkMode ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-200'}`}>
          <h3 className={`font-semibold text-sm mb-1 ${darkMode ? 'text-red-300' : 'text-red-800'}`}>❌ Error</h3>
          <p className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{error}</p>
        </div>
      )}
    </div>
  );
}
