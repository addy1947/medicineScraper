import React from 'react';

export default function SearchBar({ value, onChange, onSubmit, loading, darkMode }) {
  return (
    <form onSubmit={onSubmit} className="max-w-4xl mx-auto mb-4">
      <div className="relative group">
        {/* Gradient background blur effect */}
        <div className="absolute -inset-0.5 bg-linear-to-r from-orange-400 via-pink-500 to-purple-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
        
        <div className={`relative rounded-xl shadow-lg border overflow-hidden ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
          <div className="flex items-stretch">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-5 w-5 transition-colors duration-300 ${darkMode ? 'text-gray-400 group-hover:text-orange-400' : 'text-gray-400 group-hover:text-orange-500'}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder="Search medicines, supplements, healthcare products..."
                required
                className={`w-full pl-12 pr-4 py-3.5 text-base bg-transparent focus:outline-none focus:ring-0 border-0 transition-all duration-300 ${darkMode ? 'text-gray-100 placeholder-gray-400' : 'text-gray-800 placeholder-gray-400'}`}
              />
              {/* Animated bottom border */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-orange-500 via-pink-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3.5 bg-linear-to-r from-orange-500 to-orange-600 text-white font-semibold text-base 
                         hover:from-orange-600 hover:to-orange-700 
                         disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed
                         transition-all duration-300 ease-in-out
                         shadow-md hover:shadow-lg hover:scale-105
                         flex items-center gap-2 group/btn"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <span>Search</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform duration-300" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Search tips */}
      <div className="mt-2 text-center">
        <p className={`text-xs flex items-center justify-center gap-2 flex-wrap ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <span className="inline-flex items-center gap-1">
            <svg className="h-3 w-3 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Try:</span>
          </span>
          <span className={`px-2 py-0.5 rounded transition-colors cursor-default text-xs ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Paracetamol</span>
          <span className={`px-2 py-0.5 rounded transition-colors cursor-default text-xs ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Vitamin D</span>
          <span className={`px-2 py-0.5 rounded transition-colors cursor-default text-xs ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Cetrizine</span>
        </p>
      </div>
    </form>
  );
}
