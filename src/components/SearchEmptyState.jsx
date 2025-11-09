import React from 'react';

export default function SearchEmptyState({ darkMode }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border ${darkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-white border-gray-200'} shadow-lg`}>      
      {/* soft background gradients */}
      <div className="pointer-events-none absolute -inset-1 opacity-60">
        <div className={`absolute inset-0 ${darkMode ? 'opacity-20' : 'opacity-30'} bg-[radial-gradient(80%_60%_at_20%_10%,#34d399_0%,transparent_60%)]`} />
        <div className={`absolute inset-0 ${darkMode ? 'opacity-20' : 'opacity-30'} bg-[radial-gradient(80%_60%_at_80%_70%,#6366f1_0%,transparent_65%)]`} />
      </div>

      <div className="relative grid md:grid-cols-[1fr,420px] items-center gap-8 p-6 md:p-10">
        <div>
          <h3 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Search medicines and compare across pharmacies</h3>
          <p className={`mt-3 text-sm md:text-base leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Start by typing a medicine name above, or upload a prescription. Toggle scrapers on the left to include your preferred sources.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold ${darkMode ? 'bg-gray-800 text-indigo-200 ring-1 ring-indigo-500/30' : 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200'}`}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" /></svg>
              Type a name and press Enter
            </span>
            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold ${darkMode ? 'bg-gray-800 text-emerald-200 ring-1 ring-emerald-500/30' : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'}`}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 4v16h16M4 4l6 6m0 0h4m-4 0v4" /></svg>
              Or upload a prescription
            </span>
          </div>
        </div>

        {/* Animated medical illustration */}
        <div className="relative h-[220px] md:h-[260px]">
          {/* ECG line */}
          <svg viewBox="0 0 600 200" className="absolute inset-0 w-full h-full" fill="none">
            <defs>
              <linearGradient id="ecg" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
            <path
              d="M0 100 L60 100 L90 60 L110 140 L140 100 L220 100 L260 40 L280 160 L310 100 L360 100 L390 60 L410 140 L440 100 L520 100 L560 45 L580 155 L600 100"
              stroke="url(#ecg)"
              strokeWidth="3"
              className="ecg-line"
            />
          </svg>

          {/* Floating pill */}
          <div className="absolute left-6 top-10 animate-float-slow">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <defs>
                <linearGradient id="pillA" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>
              <rect x="2" y="18" width="28" height="28" rx="14" fill="url(#pillA)" />
              <rect x="34" y="18" width="28" height="28" rx="14" fill="#fff" stroke="#e5e7eb" />
            </svg>
          </div>

          {/* Floating cross */}
          <div className="absolute right-10 bottom-8 animate-float-slower">
            <svg width="54" height="54" viewBox="0 0 24 24" fill="none" className={`${darkMode ? 'text-indigo-300' : 'text-indigo-500'}`}>
              <path d="M10 2h4v6h6v4h-6v6h-4v-6H4V8h6V2z" fill="currentColor" />
            </svg>
          </div>

          {/* Stethoscope circle pulse */}
          <div className="absolute left-1/2 -translate-x-1/2 top-5">
            <div className={`w-3 h-3 rounded-full ${darkMode ? 'bg-emerald-400' : 'bg-emerald-500'} animate-pulse-ring`} />
          </div>
        </div>
      </div>
    </div>
  );
}
