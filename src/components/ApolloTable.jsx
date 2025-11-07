import React from 'react';
import { inr, extractQty } from '../utils/formatters';
import MedicinePlaceholder from './MedicinePlaceholder';

const apolloPricePerUnit = (product) => {
  const qty = extractQty(product?.unitSize);
  const eff = typeof product?.specialPrice === 'number' ? product.specialPrice : product?.price;
  if (qty && eff) return eff / qty;
  const ppu = product?.additionalInfo?.pricePerUnit; // e.g., "₹1.68/unit"
  return ppu || null;
};

export default function ApolloTable({ results, onToggleSelect, isSelected, darkMode }) {
  if (!results?.details?.products?.length) return null;
  return (
    <div className="mt-4">
      {/* Header Card with Gradient */}
      <div className="relative group/header">
        <div className="absolute -inset-0.5 bg-linear-to-r from-orange-400 to-orange-600 rounded-xl blur opacity-15 group-hover/header:opacity-25 transition duration-300"></div>
        <div className={`relative rounded-xl p-3 shadow-md border ${darkMode ? 'bg-linear-to-br from-orange-900/40 to-orange-800/40 border-orange-700' : 'bg-linear-to-br from-orange-50 to-orange-100 border-orange-300'}`}>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-xl">🟠</span>
            </div>
            <div>
              <h3 className={`text-base font-bold ${darkMode ? 'text-orange-300' : 'text-orange-900'}`}>Apollo Pharmacy</h3>
              <p className={`text-xs ${darkMode ? 'text-orange-400' : 'text-orange-700'}`}>"{results.query}"</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
  <div className={`mt-3 rounded-xl shadow-lg border overflow-hidden transition-colors duration-500 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className={`border-b transition-colors duration-500 ${darkMode ? 'bg-gray-900 border-orange-700' : 'bg-linear-to-r from-gray-50 to-gray-100 border-orange-200'}`}>
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
              {results.details.products.map((p, idx) => {
                const qty = extractQty(p.unitSize);
                const ppu = apolloPricePerUnit(p);
                const imgUrl = p.thumbnail ? `https://images.apollo247.in/pub/media${p.thumbnail}?tr=q-40,f-webp,w-150,dpr-3,c-at_max 150w` : null;
                const effPrice = typeof p.specialPrice === 'number' ? p.specialPrice : (typeof p.price === 'number' ? p.price : null);
                const key = `apollo:${p.id}`;
                const normalized = {
                  key,
                  source: 'Apollo',
                  id: p.id,
                  name: p.name,
                  image: imgUrl,
                  mrp: typeof p.price === 'number' ? p.price : null,
                  price: effPrice,
                  discount: typeof p.discountPercentage === 'number' ? p.discountPercentage : null,
                  pack: p.unitSize || null,
                  composition: null,
                  manufacturer: null,
                  link: p.urlKey ? `https://www.apollopharmacy.in/otc/${p.urlKey}` : null,
                  pricePerUnit: typeof ppu === 'number' ? ppu : (typeof ppu === 'string' ? ppu : null),
                };
                return (
                  <tr 
                    key={p.id} 
                    className={`transition-all duration-200 group/row ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-orange-50'}`}
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    {/* Select */}
                    <td className="px-2 py-2.5 text-center align-middle">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500"
                        checked={isSelected ? isSelected(key) : false}
                        onChange={() => onToggleSelect && onToggleSelect(normalized)}
                      />
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden border transition-colors shrink-0 ${darkMode ? 'bg-gray-700 border-gray-600 group-hover/row:border-orange-600' : 'bg-gray-50 border-gray-100 group-hover/row:border-orange-200'}`}>
                          {imgUrl ? (
                            <img src={imgUrl} alt={p.name} className="w-full h-full object-contain p-0.5" />
                          ) : (
                            <MedicinePlaceholder className="w-10 h-10" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`font-semibold text-sm transition-colors truncate ${darkMode ? 'text-gray-200 group-hover/row:text-orange-400' : 'text-gray-900 group-hover/row:text-orange-700'}`}>{p.name}</div>
                          <div className={`text-xs mt-0.5 flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            <svg className="w-2.5 h-2.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path>
                            </svg>
                            <span className="truncate">{p.sku}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className={`px-3 py-2.5 text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{p.unitSize || '-'}</td>
                    <td className="px-3 py-2.5">
                      <span className="text-base font-bold text-green-600">
                        {typeof p.specialPrice === 'number' ? inr(p.specialPrice) : (typeof p.price === 'number' ? inr(p.price) : '-')}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`text-xs line-through ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {typeof p.price === 'number' && p.price !== p.specialPrice ? inr(p.price) : '-'}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      {typeof p.discountPercentage === 'number' && p.discountPercentage > 0 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
                          {p.discountPercentage}%
                        </span>
                      ) : (
                        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>-</span>
                      )}
                    </td>
                    <td className={`px-3 py-2.5 text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{qty ?? '-'}</td>
                    <td className={`px-3 py-2.5 text-xs font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      {typeof ppu === 'number' ? inr(ppu) : (typeof ppu === 'string' ? ppu : '-')}
                    </td>
                    <td className="px-3 py-2.5">
                      {p.urlKey && (
                        <a
                          href={`https://www.apollopharmacy.in/otc/${p.urlKey}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-orange-500 text-white hover:bg-orange-600 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200"
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
