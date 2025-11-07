import React from 'react';
import { inr, extractQty } from '../utils/formatters';
import MedicinePlaceholder from './MedicinePlaceholder';

export default function OneMgTable({ results, onToggleSelect, isSelected, darkMode }) {
  if (!results?.products?.length) return null;
  return (
    <div className="mt-4">
      {/* Header Card with Gradient */}
      <div className="relative group/header">
        <div className="absolute -inset-0.5 bg-linear-to-r from-purple-400 to-purple-600 rounded-xl blur opacity-15 group-hover/header:opacity-25 transition duration-300"></div>
        <div className={`relative rounded-xl p-3 shadow-md border ${darkMode ? 'bg-linear-to-br from-purple-900/40 to-purple-800/40 border-purple-700' : 'bg-linear-to-br from-purple-50 to-purple-100 border-purple-300'}`}>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-purple-500 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-xl">🟣</span>
            </div>
            <div>
              <h3 className={`text-base font-bold ${darkMode ? 'text-purple-300' : 'text-purple-900'}`}>1mg</h3>
              <p className={`text-xs ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>"{results.query}"</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
  <div className={`mt-3 rounded-xl shadow-lg border overflow-hidden transition-colors duration-500 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className={`border-b transition-colors duration-500 ${darkMode ? 'bg-gray-900 border-purple-700' : 'bg-linear-to-r from-gray-50 to-gray-100 border-purple-200'}`}>
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
                const hasSellingPrice = p.selling_price !== null && p.selling_price !== undefined;
                const sellingPrice = hasSellingPrice ? p.selling_price : (p.mrp || 0);
                const mrpPrice = p.mrp || 0;
                const qty = extractQty(p.pack_size) || 0;
                const pricePerUnit = qty && sellingPrice ? sellingPrice / qty : 0;
                const key = `1mg:${p.name}-${mrpPrice}-${p.pack_size || ''}`;
                const normalized = {
                  key,
                  source: '1mg',
                  id: key,
                  name: p.name,
                  image: p.image_url || null,
                  mrp: mrpPrice,
                  price: sellingPrice,
                  discount: p.discount ?? null,
                  pack: p.pack_size || null,
                  composition: p.composition || null,
                  manufacturer: p.manufacturer || null,
                  link: p.product_url || null,
                  pricePerUnit: pricePerUnit > 0 ? pricePerUnit : null,
                };
                return (
                  <tr 
                    key={idx} 
                    className={`transition-all duration-200 group/row ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-purple-50'}`}
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    {/* Select */}
                    <td className="px-2 py-2.5 text-center align-middle">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                        checked={isSelected ? isSelected(key) : false}
                        onChange={() => onToggleSelect && onToggleSelect(normalized)}
                      />
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden border transition-colors shrink-0 ${darkMode ? 'bg-gray-700 border-gray-600 group-hover/row:border-purple-600' : 'bg-gray-50 border-gray-100 group-hover/row:border-purple-200'}`}>
                          {p.image_url ? (
                            <img src={p.image_url} alt={p.name} className="w-full h-full object-contain p-0.5" />
                          ) : (
                            <MedicinePlaceholder className="w-10 h-10" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`font-semibold text-sm transition-colors flex items-center flex-wrap gap-1.5 ${darkMode ? 'text-gray-200 group-hover/row:text-purple-400' : 'text-gray-900 group-hover/row:text-purple-700'}`}>
                            <span className="truncate">{p.name}</span>
                            {p.prescription_required && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-700 border border-red-200 shrink-0">
                                <svg className="w-2.5 h-2.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd"></path>
                                </svg>
                                Rx
                              </span>
                            )}
                            {p.is_ad && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
                                Ad
                              </span>
                            )}
                          </div>
                          <div className={`flex items-center gap-2 mt-0.5 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {p.delivery_info && (
                              <span className="flex items-center gap-0.5 truncate">
                                <svg className="w-2.5 h-2.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path>
                                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"></path>
                                </svg>
                                {p.delivery_info}
                              </span>
                            )}
                            {p.rating && (
                              <span className="flex items-center gap-0.5 text-amber-600 shrink-0">
                                <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                </svg>
                                {p.rating}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className={`px-3 py-2.5 text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{p.pack_size || '-'}</td>
                    <td className="px-3 py-2.5">
                      <span className="text-base font-bold text-green-600">
                        {sellingPrice > 0 ? inr(sellingPrice) : '-'}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`text-xs line-through ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {mrpPrice > 0 ? inr(mrpPrice) : '-'}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      {p.discount ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                          {p.discount}
                        </span>
                      ) : (
                        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>-</span>
                      )}
                    </td>
                    <td className={`px-3 py-2.5 text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{qty > 0 ? qty : '-'}</td>
                    <td className={`px-3 py-2.5 text-xs font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      {pricePerUnit > 0 ? inr(pricePerUnit) : '-'}
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        {p.product_url && (
                          <a
                            href={p.product_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-500 text-white hover:bg-purple-600 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View
                          </a>
                        )}
                        {p.out_of_stock && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-700 border border-red-200 whitespace-nowrap">
                            <svg className="w-2.5 h-2.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd"></path>
                            </svg>
                            OOS
                          </span>
                        )}
                      </div>
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

