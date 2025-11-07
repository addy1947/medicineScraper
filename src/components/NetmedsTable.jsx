import React from 'react';
import { inr } from '../utils/formatters';
import MedicinePlaceholder from './MedicinePlaceholder';

export default function NetmedsTable({ results, onToggleSelect, isSelected, darkMode }) {
  if (!results?.products?.length) return null;
  return (
    <div className="mt-4">
      {/* Header Card with Gradient */}
      <div className="relative group/header">
        <div className="absolute -inset-0.5 bg-linear-to-r from-blue-400 to-blue-600 rounded-xl blur opacity-15 group-hover/header:opacity-25 transition duration-300"></div>
        <div className={`relative rounded-xl p-3 shadow-md border ${darkMode ? 'bg-linear-to-br from-blue-900/40 to-blue-800/40 border-blue-700' : 'bg-linear-to-br from-blue-50 to-blue-100 border-blue-300'}`}>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-xl">🔵</span>
            </div>
            <div>
              <h3 className={`text-base font-bold ${darkMode ? 'text-blue-300' : 'text-blue-900'}`}>Netmeds</h3>
              <p className={`text-xs ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>"{results.query}"</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
  <div className={`mt-3 rounded-xl shadow-lg border overflow-hidden transition-colors duration-500 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className={`border-b transition-colors duration-500 ${darkMode ? 'bg-gray-900 border-blue-700' : 'bg-linear-to-r from-gray-50 to-gray-100 border-blue-200'}`}>
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
                const mrp = p.medicine_info?.mrp;
                const sellingPrice = p.selling_price;
                const packSize = p.medicine_info?.pack_size && p.medicine_info?.pack_size_unit
                  ? `${p.medicine_info.pack_size} ${p.medicine_info?.pack_size_unit}`
                  : (p.medicine_info?.pack_size_unit || p.medicine_info?.pack_size || '-');
                const qty = p.medicine_info?.pack_size || null;
                const key = `netmeds:${p.uid || p.item_code}`;
                const normalized = {
                  key,
                  source: 'Netmeds',
                  id: p.uid || p.item_code,
                  name: p.name,
                  image: p.image_url || null,
                  mrp: typeof mrp === 'number' ? mrp : null,
                  price: typeof sellingPrice === 'number' ? sellingPrice : null,
                  discount: p.discount ?? null,
                  pack: packSize,
                  composition: null,
                  manufacturer: p.medicine_info?.manufacturer || null,
                  link: p.product_url || null,
                  pricePerUnit: typeof p.price_per_unit === 'number' ? p.price_per_unit : null,
                };
                return (
                  <tr 
                    key={p.uid || p.item_code} 
                    className={`transition-all duration-200 group/row ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-50'}`}
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    {/* Select */}
                    <td className="px-2 py-2.5 text-center align-middle">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        checked={isSelected ? isSelected(key) : false}
                        onChange={() => onToggleSelect && onToggleSelect(normalized)}
                      />
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden border transition-colors shrink-0 ${darkMode ? 'bg-gray-700 border-gray-600 group-hover/row:border-blue-600' : 'bg-gray-50 border-gray-100 group-hover/row:border-blue-200'}`}>
                          {p.image_url ? (
                            <img src={p.image_url} alt={p.name} className="w-full h-full object-contain p-0.5" />
                          ) : (
                            <MedicinePlaceholder className="w-10 h-10" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`font-semibold text-sm transition-colors truncate ${darkMode ? 'text-gray-200 group-hover/row:text-blue-400' : 'text-gray-900 group-hover/row:text-blue-700'}`}>{p.name}</div>
                          {p.medicine_info?.manufacturer && (
                            <div className={`text-xs mt-0.5 flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              <svg className="w-2.5 h-2.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                              </svg>
                              <span className="truncate">{p.medicine_info.manufacturer}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className={`px-3 py-2.5 text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{packSize}</td>
                    <td className="px-3 py-2.5">
                      <span className="text-base font-bold text-green-600">
                        {typeof sellingPrice === 'number' ? inr(sellingPrice) : '-'}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`text-xs line-through ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {typeof mrp === 'number' && mrp !== sellingPrice ? inr(mrp) : '-'}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      {p.discount ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                          {p.discount}
                        </span>
                      ) : (
                        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>-</span>
                      )}
                    </td>
                    <td className={`px-3 py-2.5 text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{qty ?? '-'}</td>
                    <td className={`px-3 py-2.5 text-xs font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      {typeof p.price_per_unit === 'number' ? inr(p.price_per_unit) : '-'}
                    </td>
                    <td className="px-3 py-2.5">
                      {p.product_url && (
                        <a
                          href={p.product_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-500 text-white hover:bg-blue-600 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200"
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
