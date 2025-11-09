import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import LandingPage from './pages/LandingPage';
import SearchPage from './pages/SearchPage';

function AppShell() {
  // Global theme state & animation retained here so both pages share it
  const [darkMode, setDarkMode] = useState(false);
  const [themeAnimating, setThemeAnimating] = useState(false);
  const [themeTransitioning, setThemeTransitioning] = useState(false);
  const [themeParticles, setThemeParticles] = useState([]);
  const location = useLocation();
  const showCta = !location.pathname.startsWith('/search');

  const triggerThemeToggle = (e) => {
    const togglingToDark = !darkMode;
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const scrollY = window.scrollY || 0;
    const particles = Array.from({ length: 12 }).map((_, i) => {
      const ang = (Math.PI * 2 * i) / 12;
      const dist = 36 + Math.random() * 28;
      return {
        id: `${Date.now()}-${i}`,
        x: cx,
        y: cy + scrollY,
        tx: cx + Math.cos(ang) * dist,
        ty: cy + Math.sin(ang) * dist + scrollY,
        delay: Math.random() * 70,
        kind: i % 4 === 0 ? 'ray' : 'star',
        dark: togglingToDark
      };
    });
    setThemeParticles(particles);
    setThemeAnimating(true);
    setThemeTransitioning(true);
    setTimeout(() => setDarkMode(togglingToDark), 140);
    setTimeout(() => setThemeTransitioning(false), 560);
    setTimeout(() => { setThemeAnimating(false); setThemeParticles([]); }, 680);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-500 ${themeTransitioning ? 'theme-smooth' : ''}`}>
        {/* Global Nav */}
  <header className={`sticky top-0 z-40 backdrop-blur supports-backdrop-filter:bg-white/60 dark:supports-backdrop-filter:bg-gray-900/60 ${darkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200'} border-b transition-colors shadow-[0_1px_0_0_rgba(0,0,0,0.02)]`}>          
          <div className="relative max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 font-semibold text-sm">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500 to-indigo-700 text-white shadow">💊</span>
              <span className={darkMode ? 'text-gray-100' : 'text-gray-800'}>MedCompare</span>
            </Link>
            <nav className="flex items-center gap-3 sm:gap-4">
              <Link
                to="/search"
                className={`text-sm font-medium px-3 py-1.5 rounded-full transition-colors ${location.pathname.startsWith('/search')
                  ? (darkMode ? 'bg-indigo-600/30 text-indigo-200 ring-1 ring-indigo-500/40' : 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200')
                  : (darkMode ? 'text-gray-300 hover:text-indigo-300 hover:bg-gray-800/60' : 'text-gray-700 hover:text-indigo-700 hover:bg-gray-50')}
                `}
              >
                Search
              </Link>
              <button
                onClick={triggerThemeToggle}
                className={`inline-flex items-center justify-center w-9 h-9 rounded-full border text-sm font-semibold transition-colors ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                title={darkMode ? 'Light mode' : 'Dark mode'}
                aria-label="Toggle theme"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              {showCta && (
                <Link to="/search" className={`hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition ${darkMode ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>Get Started</Link>
              )}
            </nav>
            {/* subtle gradient accent line at the bottom of header */}
            <div className="pointer-events-none absolute inset-x-0 -bottom-px h-0.5 opacity-50 bg-[linear-gradient(to_right,#6366f1,#8b5cf6,#10b981)]" />
          </div>
        </header>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<LandingPage darkMode={darkMode} />} />
          <Route path="/search" element={<SearchPage darkMode={darkMode} />} />
        </Routes>

        {/* Theme particle burst */}
        {themeAnimating && themeParticles.map(p => (
          <div
            key={p.id}
            className={`pointer-events-none fixed top-0 left-0 theme-particle ${p.kind === 'ray' ? 'theme-ray' : 'theme-star'} ${p.dark ? 'particle-dark' : 'particle-light'}`}
            style={{ '--start-x': `${p.x}px`, '--start-y': `${p.y}px`, '--end-x': `${p.tx}px`, '--end-y': `${p.ty}px`, '--delay': `${p.delay}ms` }}
          />
        ))}
      </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
