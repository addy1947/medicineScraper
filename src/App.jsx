import { useState } from 'react'
import './App.css'
import SearchBar from './components/SearchBar'
import ApolloTable from './components/ApolloTable'
import PharmEasyTable from './components/PharmEasyTable'
import NetmedsTable from './components/NetmedsTable'
import OneMgTable from './components/OneMgTable'
import TruemedsTable from './components/TruemedsTable'
import CompareModal from './components/CompareModal'
// formatters and helpers are used within individual components

function App() {
  const [medicineName, setMedicineName] = useState('paracetamol');
  const [error, setError] = useState(null);
  const [apolloResults, setApolloResults] = useState(null);
  const [apolloLoading, setApolloLoading] = useState(false);
  const [pharmResults, setPharmResults] = useState(null);
  const [netmedsResults, setNetmedsResults] = useState(null);
  const [oneMgResults, setOneMgResults] = useState(null);
  const [truemedsResults, setTruemedsResults] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  // Theme transition animation state
  const [themeAnimating, setThemeAnimating] = useState(false);
  const [themeTransitioning, setThemeTransitioning] = useState(false);
  const [themeParticles, setThemeParticles] = useState([]); // array of particle objects

  // Selection and compare modal state
  const [selectedMap, setSelectedMap] = useState({}); // key -> normalized item
  const [savedMap, setSavedMap] = useState({}); // key -> normalized item (persists across searches)
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const selectedList = Object.values(selectedMap);
  const savedList = Object.values(savedMap);
  const selectedCount = selectedList.length;
  const savedCount = savedList.length;
  const [ocrNames, setOcrNames] = useState([]);
  const [uploadingOcr, setUploadingOcr] = useState(false);

  const isSelected = (key) => !!selectedMap[key];
  const toggleSelect = (item) => {
    setSelectedMap((prev) => {
      const copy = { ...prev };
      if (copy[item.key]) delete copy[item.key]; else copy[item.key] = item;
      return copy;
    });
  };
  const removeSelected = (key) => setSelectedMap((prev) => {
    const copy = { ...prev };
    delete copy[key];
    return copy;
  });
  const clearSelected = () => setSelectedMap({});
  
  // Save functionality
  const saveSelected = () => {
    setSavedMap((prev) => ({ ...prev, ...selectedMap }));
    setSelectedMap({});
  };
  const removeSaved = (key) => setSavedMap((prev) => {
    const copy = { ...prev };
    delete copy[key];
    return copy;
  });
  const clearSaved = () => setSavedMap({});

  // helpers moved to components

  const handleApolloSearch = async (e) => {
    e.preventDefault();
    setApolloLoading(true);
    setError(null);
    setApolloResults(null);
    setPharmResults(null);
    setNetmedsResults(null);
    setOneMgResults(null);
    setTruemedsResults(null);
    // Clear all selections when performing a new search
    setSelectedMap({});

    try {
      // Try backend on 3001; on network error or non-OK, fallback to 3002
      const makeReq = async (port) => fetch(`http://localhost:${port}/api/apollo-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: medicineName })
      });

      let data = null;
      let lastErr = null;
      for (const port of [3001, 3002]) {
        try {
          const res = await makeReq(port);
          const body = await res.json().catch(() => ({}));
          if (!res.ok || !body.success) {
            throw new Error(body.error || `Backend responded with ${res.status}`);
          }
          data = body;
          break;
        } catch (err) {
          lastErr = err;
          // try next port
        }
      }
      if (!data) {
        throw lastErr || new Error('Backend unavailable');
      }
      // data.data is the productDetails object with products array (top 3 from backend)
      setApolloResults({
        query: medicineName,
        details: data.data || null,
      });
      // Store PharmEasy info and products if available (no file saving now)
      if (data.pharmeasy) {
        const products = Array.isArray(data.pharmeasy.products) ? data.pharmeasy.products : [];
        if (products.length) {
          setPharmResults({ query: medicineName, products });
        }
      }
      // Store Netmeds products if available
      if (data.netmeds && data.netmeds.ok) {
        const products = Array.isArray(data.netmeds.products) ? data.netmeds.products : [];
        if (products.length) {
          setNetmedsResults({ query: medicineName, products });
        }
      }
      // Store 1mg products if available
      if (data.onemg && data.onemg.ok) {
        const products = Array.isArray(data.onemg.products) ? data.onemg.products : [];
        if (products.length) {
          setOneMgResults({ query: medicineName, products });
        }
      }
      // Store Truemeds products if available
      if (data.truemeds && data.truemeds.ok) {
        setTruemedsResults(data.truemeds);
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setApolloLoading(false);
    }
  }

  return (
  <div className={`min-h-screen py-3 px-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-500 ${themeTransitioning ? 'theme-smooth' : ''}`}>
      <div className="max-w-[1400px] mx-auto">
        <div className={`px-6 py-4 rounded-xl shadow-md mb-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1 text-center">
              <h1 className={`text-2xl font-extrabold tracking-tight ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Medicine Price Comparison</h1>
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Apollo • PharmEasy • Netmeds • 1mg • Truemeds</p>
            </div>
            <button
              onClick={(e) => {
                const togglingToDark = !darkMode;
                // Generate particle burst around button center
                const rect = e.currentTarget.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const docScrollY = window.scrollY || 0;
                const particles = Array.from({ length: 14 }).map((_, i) => {
                  const angle = (Math.PI * 2 * i) / 14;
                  const dist = 40 + Math.random() * 30;
                  return {
                    id: `${Date.now()}-${i}`,
                    x: cx,
                    y: cy + docScrollY,
                    tx: cx + Math.cos(angle) * dist,
                    ty: cy + Math.sin(angle) * dist + docScrollY,
                    delay: Math.random() * 80,
                    kind: i % 3 === 0 ? 'ray' : 'star',
                    dark: togglingToDark,
                  };
                });
                setThemeParticles(particles);
                setThemeAnimating(true);
                setThemeTransitioning(true);
                // Switch theme shortly after burst starts
                window.setTimeout(() => setDarkMode(togglingToDark), 160);
                // End transitions
                window.setTimeout(() => setThemeTransitioning(false), 600);
                // Clear particles
                window.setTimeout(() => {
                  setThemeAnimating(false);
                  setThemeParticles([]);
                }, 700);
              }}
              className={`px-3 py-2 rounded-lg border shadow-sm transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? (
                <svg className={`w-5 h-5 transition-transform duration-500 ${themeAnimating ? 'rotate-180 scale-110' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className={`w-5 h-5 transition-transform duration-500 ${themeAnimating ? 'rotate-180 scale-110' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
          <SearchBar
            value={medicineName}
            onChange={(e) => setMedicineName(e.target.value)}
            onSubmit={handleApolloSearch}
            loading={apolloLoading}
            darkMode={darkMode}
          />
          {/* Upload Prescription Button */}
          <div className="mt-2 flex items-center justify-start">
            <label className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold border shadow-sm cursor-pointer transition-colors ${uploadingOcr ? 'bg-gray-200 text-gray-400 border-gray-200' : 'bg-fuchsia-600 text-white border-fuchsia-600 hover:bg-fuchsia-700'}`}
              title="Upload a prescription image to extract medicines"
            >
              <input type="file" accept="image/*" className="hidden" disabled={uploadingOcr} onChange={async (e) => {
                const file = e.target.files && e.target.files[0];
                if (!file) return;
                setUploadingOcr(true);
                try {
                  const reader = new FileReader();
                  reader.onload = async () => {
                    const base64 = reader.result; // data:*/*;base64,...
                    try {
                      const res = await fetch('http://localhost:3001/api/ocr-prescription', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ imageBase64: base64, mimeType: file.type })
                      });
                      const data = await res.json();
                      if (data.success) {
                        setOcrNames(data.medicines || []);
                        // Don't open modal, just show below
                      } else {
                        setError(data.error || 'OCR failed');
                      }
                    } catch (err) {
                      setError('OCR network error: ' + err.message);
                    } finally {
                      setUploadingOcr(false);
                      e.target.value = '';
                    }
                  };
                  reader.readAsDataURL(file);
                } catch (err) {
                  setError('File read error: ' + err.message);
                  setUploadingOcr(false);
                }
              }} />
              {uploadingOcr ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25"/><path className="opacity-75" strokeWidth="4" strokeLinecap="round" d="M4 12a8 8 0 018-8"/></svg>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v16h16M4 4l6 6m0 0h4m-4 0v4"/></svg>
                  <span>Upload Prescription</span>
                </>
              )}
            </label>
          </div>
          
          {/* OCR Extracted Medicines - Show below upload button */}
          {ocrNames.length > 0 && (
            <div className={`mt-3 p-3 border rounded-lg ${darkMode ? 'bg-fuchsia-900/20 border-fuchsia-700' : 'bg-fuchsia-50 border-fuchsia-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${darkMode ? 'text-fuchsia-300' : 'text-fuchsia-900'}`}>Extracted Medicines</span>
                  <span className={`inline-flex items-center justify-center w-5 h-5 text-xs rounded-full border ${darkMode ? 'bg-fuchsia-800 text-fuchsia-200 border-fuchsia-600' : 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200'}`}>{ocrNames.length}</span>
                </div>
                <button
                  onClick={() => setOcrNames([])}
                  className={`text-xs font-medium ${darkMode ? 'text-fuchsia-400 hover:text-fuchsia-300' : 'text-fuchsia-600 hover:text-fuchsia-800'}`}
                >
                  Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {ocrNames.map((name, idx) => (
                  <button
                    key={`${name}-${idx}`}
                    onClick={() => setMedicineName(name)}
                    className={`px-3 py-1.5 text-sm rounded-lg border transition-colors shadow-sm ${darkMode ? 'bg-gray-700 border-fuchsia-600 text-fuchsia-200 hover:bg-gray-600 hover:border-fuchsia-500' : 'bg-white border-fuchsia-300 text-fuchsia-900 hover:bg-fuchsia-100 hover:border-fuchsia-400'}`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Compare Button */}
          <div className="mt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={saveSelected}
              disabled={selectedCount === 0}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold border shadow-sm transition-colors ${selectedCount === 0 ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-teal-600 text-white border-teal-600 hover:bg-teal-700'}`}
              title={selectedCount === 0 ? 'Select items to save' : 'Save selected items'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Save
              <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs ${selectedCount ? 'bg-white text-teal-700' : 'bg-gray-200 text-gray-500'}`}>{selectedCount}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsSaveModalOpen(true)}
              disabled={savedCount === 0}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold border shadow-sm transition-colors ${savedCount === 0 ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-amber-600 text-white border-amber-600 hover:bg-amber-700'}`}
              title={savedCount === 0 ? 'No saved items' : 'View saved items'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Saved
              <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs ${savedCount ? 'bg-white text-amber-700' : 'bg-gray-200 text-gray-500'}`}>{savedCount}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsCompareOpen(true)}
              disabled={selectedCount < 2}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold border shadow-sm transition-colors ${selectedCount < 2 ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700'}`}
              title={selectedCount < 2 ? 'Select at least 2 items to compare' : 'Compare selected items'}
            >
              Compare
              <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs ${selectedCount ? 'bg-white text-indigo-700' : 'bg-gray-200 text-gray-500'}`}>{selectedCount}</span>
            </button>
          </div>
          {error && (
            <div className={`max-w-3xl mx-auto border rounded-lg p-3 mt-3 ${darkMode ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-200'}`}>
              <h3 className={`font-semibold text-sm mb-1 ${darkMode ? 'text-red-300' : 'text-red-800'}`}>❌ Error</h3>
              <p className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{error}</p>
            </div>
          )}
        </div>

        {apolloResults && (
          <ApolloTable results={apolloResults} onToggleSelect={toggleSelect} isSelected={isSelected} darkMode={darkMode} />
        )}

        {pharmResults && Array.isArray(pharmResults.products) && pharmResults.products.length > 0 && (
          <PharmEasyTable results={pharmResults} onToggleSelect={toggleSelect} isSelected={isSelected} darkMode={darkMode} />
        )}

        {netmedsResults && Array.isArray(netmedsResults.products) && netmedsResults.products.length > 0 && (
          <NetmedsTable results={netmedsResults} onToggleSelect={toggleSelect} isSelected={isSelected} darkMode={darkMode} />
        )}

        {oneMgResults && Array.isArray(oneMgResults.products) && oneMgResults.products.length > 0 && (
          <OneMgTable results={oneMgResults} onToggleSelect={toggleSelect} isSelected={isSelected} darkMode={darkMode} />
        )}

        {truemedsResults && (
          <TruemedsTable data={truemedsResults} onToggleSelect={toggleSelect} isSelected={isSelected} darkMode={darkMode} />
        )}

        {/* Compare Modal */}
        {isCompareOpen && (
          <CompareModal
            items={selectedList}
            onClose={() => setIsCompareOpen(false)}
            onRemove={removeSelected}
            onClear={clearSelected}
            darkMode={darkMode}
          />
        )}

        {/* Saved Items Modal */}
        {isSaveModalOpen && (
          <CompareModal
            items={savedList}
            onClose={() => setIsSaveModalOpen(false)}
            onRemove={removeSaved}
            onClear={clearSaved}
            title="Saved Items"
            emptyMessage="No saved items yet. Use the Save button to save selected items."
            darkMode={darkMode}
          />
        )}
      </div>
      {/* Theme particle burst (stars/rays) */}
      {themeAnimating && themeParticles.map(p => (
        <div
          key={p.id}
          className={`pointer-events-none fixed top-0 left-0 theme-particle ${p.kind === 'ray' ? 'theme-ray' : 'theme-star'} ${p.dark ? 'particle-dark' : 'particle-light'}`}
          style={{
            '--start-x': `${p.x}px`,
            '--start-y': `${p.y}px`,
            '--end-x': `${p.tx}px`,
            '--end-y': `${p.ty}px`,
            '--delay': `${p.delay}ms`
          }}
        />
      ))}
    </div>
  );
}

//

export default App
