import React from 'react';
import { inr, extractQty } from '../utils/formatters';
import MedicinePlaceholder from './MedicinePlaceholder';

const pharmPricePerUnit = (item) => {
  const qty = extractQty(item?.unit);
  if (qty && typeof item?.price === 'number') {
    return item.price / qty;
  }
  return null;
};

export default function PharmEasyTable({ results, onToggleSelect, isSelected, darkMode }) {
  if (!results?.products?.length) return null;
  return (
    <div className="mt-4">
      {/* Header Card with Gradient */}
      <div className="relative group/header">
        <div className="absolute -inset-0.5 bg-linear-to-r from-emerald-400 to-emerald-600 rounded-xl blur opacity-15 group-hover/header:opacity-25 transition duration-300"></div>
        <div className={`relative rounded-xl p-3 shadow-md border ${darkMode ? 'bg-linear-to-br from-emerald-900/40 to-emerald-800/40 border-emerald-700' : 'bg-linear-to-br from-emerald-50 to-emerald-100 border-emerald-300'}`}>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-xl">🟢</span>
            </div>
            <div>
              <h3 className={`text-base font-bold ${darkMode ? 'text-emerald-300' : 'text-emerald-900'}`}>PharmEasy</h3>
              <p className={`text-xs ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>"{results.query}"</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
  <div className={`mt-3 rounded-xl shadow-lg border overflow-hidden transition-colors duration-500 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className={`border-b transition-colors duration-500 ${darkMode ? 'bg-gray-900 border-emerald-700' : 'bg-linear-to-r from-gray-50 to-gray-100 border-emerald-200'}`}>
                <th className={`px-2 py-2 text-center text-xs font-bold uppercase tracking-wider w-10 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Select</th>
                <th className={`px-3 py-2 text-left text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Product</th>
                <th className={`px-3 py-2 text-left text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Unit</th>
                <th className={`px-3 py-2 text-left text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Price</th>
                <th className={`px-3 py-2 text-left text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Original</th>
                <th className={`px-3 py-2 text-left text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Discount</th>
                <th className={`px-3 py-2 text-left text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Qty</th>
                <th className={`px-3 py-2 text-left text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Price/Unit</th>
                <th className={`px-3 py-2 text-left text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
              {results.products.map((p, idx) => {
                const ppu = pharmPricePerUnit(p);
                const qty = extractQty(p?.unit);
                const key = `pharmeasy:${p.dataId}`;
                const normalized = {
                  key,
                  source: 'PharmEasy',
                  id: p.dataId,
                  name: p.name,
                  image: p.image || null,
                  mrp: typeof p.originalPrice === 'number' ? p.originalPrice : null,
                  price: typeof p.price === 'number' ? p.price : null,
                  discount: p.discount ?? null,
                  pack: p.unit || null,
                  composition: null,
                  manufacturer: p.brand || null,
                  link: p.url || null,
                  pricePerUnit: typeof ppu === 'number' ? ppu : null,
                };
                return (
                  <tr 
                    key={p.dataId} 
                    className={`transition-all duration-200 group/row ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-emerald-50'}`}
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    {/* Select */}
                    <td className="px-2 py-2.5 text-center align-middle">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                        checked={isSelected ? isSelected(key) : false}
                        onChange={() => onToggleSelect && onToggleSelect(normalized)}
                      />
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden border transition-colors shrink-0 ${darkMode ? 'bg-gray-700 border-gray-600 group-hover/row:border-emerald-600' : 'bg-gray-50 border-gray-100 group-hover/row:border-emerald-200'}`}>
                          {p.image ? (
                            <img src={p.image} alt={p.name} className="w-full h-full object-contain p-0.5" />
                          ) : (
                            <MedicinePlaceholder className="w-10 h-10" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`font-semibold text-sm transition-colors truncate ${darkMode ? 'text-gray-200 group-hover/row:text-emerald-400' : 'text-gray-900 group-hover/row:text-emerald-700'}`}>{p.name}</div>
                          {p.brand && (
                            <div className={`text-xs mt-0.5 flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              <svg className="w-2.5 h-2.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                              </svg>
                              <span className="truncate">{p.brand}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className={`px-3 py-2.5 text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{p.unit || '-'}</td>
                    <td className="px-3 py-2.5">
                      <span className="text-base font-bold text-green-600">
                        {typeof p.price === 'number' ? inr(p.price) : '-'}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`text-xs line-through ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {typeof p.originalPrice === 'number' ? inr(p.originalPrice) : '-'}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      {p.discount ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                          {p.discount}%
                        </span>
                      ) : (
                        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>-</span>
                      )}
                    </td>
                    <td className={`px-3 py-2.5 text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{qty ?? '-'}</td>
                    <td className={`px-3 py-2.5 text-xs font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{typeof ppu === 'number' ? inr(ppu) : '-'}</td>
                    <td className="px-3 py-2.5">
                      {p.url && (
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View
                        </a>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
