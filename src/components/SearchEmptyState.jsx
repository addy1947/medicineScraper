import React, { useState, useEffect } from 'react';

const HEALTH_FACTS = [
  {
    icon: '💧',
    fact: 'Drink 8-10 glasses of water daily to keep your body hydrated and help maintain optimal organ function.'
  },
  {
    icon: '🥗',
    fact: 'Eat a balanced diet rich in fruits, vegetables, whole grains, and lean proteins to support overall health.'
  },
  {
    icon: '🏃',
    fact: 'Regular physical activity for at least 30 minutes a day can reduce the risk of chronic diseases by up to 50%.'
  },
  {
    icon: '😴',
    fact: 'Adults need 7-9 hours of quality sleep each night for proper immune function and mental clarity.'
  },
  {
    icon: '🧘',
    fact: 'Practice stress management through meditation, yoga, or deep breathing to improve mental and physical well-being.'
  }
];

export default function SearchEmptyState({ darkMode }) {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setCurrentFactIndex((prev) => (prev + 1) % HEALTH_FACTS.length);
        setFadeIn(true);
      }, 400);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentFact = HEALTH_FACTS[currentFactIndex];

  return (
    <div className={`relative overflow-hidden rounded-2xl border ${darkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-white border-gray-200'} shadow-lg`}>      
      {/* soft background gradients */}
      <div className="pointer-events-none absolute -inset-1 opacity-60">
        <div className={`absolute inset-0 ${darkMode ? 'opacity-20' : 'opacity-30'} bg-[radial-gradient(80%_60%_at_20%_10%,#34d399_0%,transparent_60%)]`} />
        <div className={`absolute inset-0 ${darkMode ? 'opacity-20' : 'opacity-30'} bg-[radial-gradient(80%_60%_at_80%_70%,#6366f1_0%,transparent_65%)]`} />
      </div>

      {/* Health Facts Carousel - Now at the top */}
      <div className="relative z-10 p-6 md:p-8">
        <div className={`relative rounded-2xl border overflow-hidden backdrop-blur-sm ${
          darkMode 
            ? 'bg-linear-to-br from-emerald-900/30 via-indigo-900/30 to-purple-900/30 border-emerald-500/20' 
            : 'bg-linear-to-br from-emerald-100/80 via-blue-50/80 to-purple-100/80 border-emerald-300/50'
        } shadow-xl transition-all duration-700`}>
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 opacity-30 animate-gradient-shift bg-[linear-gradient(45deg,#10b981,#6366f1,#a855f7,#10b981)] bg-[length:300%_300%]" />
          
          <div className="relative px-6 py-6 md:px-8 md:py-7">
            <div className="flex items-center gap-3 mb-4">
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${
                darkMode ? 'bg-emerald-600/30 text-emerald-300 shadow-lg shadow-emerald-500/20' : 'bg-white/90 text-emerald-600 shadow-md'
              } transition-all duration-300`}>
                <span className="text-xl animate-pulse-slow">💡</span>
              </div>
              <h4 className={`text-base md:text-lg font-bold tracking-wide ${darkMode ? 'text-emerald-300' : 'text-emerald-800'}`}>
                Health Tip of the Moment
              </h4>
            </div>
            
            <div className={`transition-opacity duration-500 ${fadeIn ? 'opacity-100 animate-fade-in-up' : 'opacity-0'}`}>
              <div className="flex items-start gap-4 md:gap-5">
                <div className={`text-4xl md:text-5xl shrink-0 transition-all duration-500 hover:scale-125 hover:rotate-12 ${
                  darkMode ? 'drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'drop-shadow-md'
                }`}>
                  {currentFact.icon}
                </div>
                <p className={`text-sm md:text-base leading-relaxed ${
                  darkMode ? 'text-gray-200' : 'text-gray-800'
                } font-medium`}>
                  {currentFact.fact}
                </p>
              </div>
            </div>

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-2.5 mt-5">
              {HEALTH_FACTS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setFadeIn(false);
                    setTimeout(() => {
                      setCurrentFactIndex(idx);
                      setFadeIn(true);
                    }, 250);
                  }}
                  className={`rounded-full transition-all duration-300 hover:scale-125 ${
                    idx === currentFactIndex
                      ? (darkMode 
                          ? 'bg-emerald-400 w-8 h-2.5 shadow-lg shadow-emerald-500/50' 
                          : 'bg-emerald-600 w-8 h-2.5 shadow-md')
                      : (darkMode 
                          ? 'bg-gray-700 hover:bg-gray-600 w-2.5 h-2.5' 
                          : 'bg-gray-300 hover:bg-gray-400 w-2.5 h-2.5')
                  }`}
                  aria-label={`Go to tip ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative grid md:grid-cols-[1fr,420px] items-center gap-8 p-6 md:p-10 pt-0 md:pt-0">
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
            <svg width="54" height="54" viewBox="0 0 24 24" fill="none" className={`${darkMode ? 'text-indigo-300' : 'ext-indigo-500'}`}>
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
