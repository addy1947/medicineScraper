import { Link } from 'react-router-dom';

// Landing page no longer renders its own nav; global nav from App wraps it.
export default function LandingPage({ darkMode }) {
  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-950 text-gray-100' : 'bg-white text-gray-900'} transition-colors duration-500`}>
      {/* Hero Section (gradient background) */}
      <header className="relative">
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_30%_30%,#6366f1_0%,transparent_60%)]" />
        <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(circle_at_70%_60%,#10b981_0%,transparent_65%)]" />
        <div className="max-w-7xl mx-auto px-6 pt-14 pb-20 md:pt-24 md:pb-28 relative">
          {/* Add top padding to offset global sticky nav */}
          <div className="max-w-3xl">
            <h1 className={`text-4xl md:text-6xl font-extrabold tracking-tight leading-tight ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Compare Medicine Prices Instantly</h1>
            <p className={`mt-6 text-lg md:text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Search across Apollo, PharmEasy, Netmeds, 1mg and Truemeds in one unified interface. Save, compare and extract prescriptions with AI.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/search" className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold shadow-lg transition ${darkMode ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}>Start Searching →</Link>
              <a href="https://github.com" target="_blank" rel="noreferrer" className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold border transition ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>GitHub Repo</a>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
  <section className="max-w-7xl mx-auto px-6 pb-20 -mt-10 md:-mt-14 relative z-10">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: '⚡',
              title: 'Multi-Source Scraping',
              text: 'Parallel fetching from top pharmacy platforms for faster aggregated results.'
            },
            {
              icon: '🧪',
              title: 'Smart Comparison',
              text: 'Compute price per unit and visualize savings across sources clearly.'
            },
            {
              icon: '🧠',
              title: 'AI Prescription OCR',
              text: 'Upload prescriptions and extract clean medicine lists using Gemini.'
            },
            {
              icon: '💾',
              title: 'Save & Revisit',
              text: 'Persist selected medicines and view them anytime for decisions.'
            },
            {
              icon: '🌙',
              title: 'Dynamic Theming',
              text: 'Beautiful dark mode with animated transitions for immersive use.'
            },
            {
              icon: '🔐',
              title: 'Privacy First',
              text: 'Data stays local; only necessary API calls are performed.'
            }
          ].map(f => (
            <div
              key={f.title}
              className={`group rounded-xl p-5 border shadow-sm relative overflow-hidden will-change-transform
              transition-all duration-300 ease-out
              ${darkMode
                ? 'bg-gray-900/95 backdrop-blur border-gray-700 hover:border-indigo-600 hover:shadow-[0_8px_24px_-12px_rgba(99,102,241,0.45)]'
                : 'bg-white/90 backdrop-blur border-gray-200 hover:border-indigo-300 hover:shadow-[0_10px_28px_-12px_rgba(99,102,241,0.35)]'}
              hover:-translate-y-1 hover:scale-[1.01] md:hover:-translate-y-2 md:hover:scale-[1.02]`}
            >
              {/* soft gradient glow on hover */}
              <div className="pointer-events-none absolute -inset-1 rounded-[14px] opacity-0 group-hover:opacity-100 transition-opacity duration-300
                bg-[radial-gradient(120%_80%_at_30%_0%,rgba(99,102,241,0.12),transparent_60%),radial-gradient(120%_80%_at_100%_20%,rgba(16,185,129,0.10),transparent_60%)]" />

              <div className="relative">
                <div className="text-2xl mb-3 transition-transform duration-300 group-hover:-translate-y-0.5">{f.icon}</div>
                <h3 className={`font-semibold text-lg mb-1 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  <span className="relative inline-block">
                    <span className="relative transition-colors duration-300 bg-clip-text bg-linear-to-r from-indigo-500 to-emerald-500 group-hover:text-transparent">
                      {f.title}
                    </span>
                    <span aria-hidden className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-linear-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-300 group-hover:w-full" />
                  </span>
                </h3>
                <p className={`text-sm leading-relaxed transition-all duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-600'} opacity-90 translate-y-0 group-hover:opacity-100 group-hover:-translate-y-0.5`}>{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className={`mt-auto border-t ${darkMode ? 'border-gray-800 bg-gray-950' : 'border-gray-200 bg-gray-50'} py-8`}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-6 text-sm">
          <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>© {new Date().getFullYear()} MedCompare. All rights reserved.</div>
          <div className="flex gap-4">
            <Link to="/search" className={`hover:underline ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Search</Link>
            <a href="/" className={`hover:underline ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Docs</a>
            <a href="/" className={`hover:underline ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
