import React from 'react';
import { inr } from '../utils/formatters';
import MedicinePlaceholder from './MedicinePlaceholder';

export default function TruemedsTable({ data, onToggleSelect, isSelected, darkMode }) {
  if (!data?.ok || !data?.products?.length) return null;

  // Debug: Log the first product to see what data we're getting
  console.log('Truemeds first product:', data.products[0]);

  return (
    <div className="mt-4">
      {/* Header Card with Gradient */}
      <div className="relative group/header">
        <div className="absolute -inset-0.5 bg-linear-to-r from-teal-400 to-teal-600 rounded-xl blur opacity-15 group-hover/header:opacity-25 transition duration-300"></div>
        <div className={`relative rounded-xl p-3 shadow-md border ${darkMode ? 'bg-linear-to-br from-teal-900/40 to-teal-800/40 border-teal-700' : 'bg-linear-to-br from-teal-50 to-teal-100 border-teal-300'}`}>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-teal-500 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-xl">🏥</span>
            </div>
            <div>
              <h3 className={`text-base font-bold ${darkMode ? 'text-teal-300' : 'text-teal-900'}`}>Truemeds</h3>
              <p className={`text-xs ${darkMode ? 'text-teal-400' : 'text-teal-700'}`}>{data.productsCount} products found</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
  <div className={`mt-3 rounded-xl shadow-lg border overflow-hidden transition-colors duration-500 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className={`border-b transition-colors duration-500 ${darkMode ? 'bg-gray-900 border-teal-700' : 'bg-linear-to-r from-gray-50 to-gray-100 border-teal-200'}`}>
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
              {data.products.map((product, idx) => {
                const imageUrl = product.productImageUrl?.split(',')[0]; // Get first image
                // Normalize for comparison
                const key = `truemeds:${product.productCode}`;
                const link = product.link || null;
                const normalized = {
                  key,
                  source: 'Truemeds',
                  id: product.productCode,
                  name: product.skuName,
                  image: imageUrl,
                  mrp: product.mrp,
                  price: product.sellingPrice,
                  discount: product.discount,
                  pack: product.packSize ? `${product.packSize} • ${product.packForm || ''}`.trim() : (product.packForm || ''),
                  composition: product.composition,
                  manufacturer: product.manufacturerName,
                  link,
                  pricePerUnit: product.pricePerItem ?? null,
                };
                
                return (
                  <tr key={product.productCode || idx} className={`transition-all duration-200 group/row ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-teal-50'}`}>
                    {/* Select */}
                    <td className="px-2 py-2.5 text-center align-middle">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                        checked={isSelected ? isSelected(key) : false}
                        onChange={() => onToggleSelect && onToggleSelect(normalized)}
                      />
                    </td>
                    {/* Product with Image */}
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden border transition-colors shrink-0 ${darkMode ? 'bg-gray-700 border-gray-600 group-hover/row:border-teal-600' : 'bg-gray-50 border-gray-100 group-hover/row:border-teal-200'}`}>
                          {imageUrl ? (
                            <img 
                              src={imageUrl} 
                              alt={product.skuName}
                              className="w-full h-full object-contain p-0.5"
                            />
                          ) : (
                            <MedicinePlaceholder className="w-10 h-10" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`font-semibold text-sm transition-colors truncate ${darkMode ? 'text-gray-200 group-hover/row:text-teal-400' : 'text-gray-900 group-hover/row:text-teal-700'}`}>
                            {link ? (
                              <a href={link} target="_blank" rel="noreferrer" className="hover:underline">
                                {product.skuName}
                              </a>
                            ) : (
                              product.skuName
                            )}
                          </div>
                          {product.composition && (
                            <div className={`text-xs mt-0.5 truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {product.composition}
                            </div>
                          )}
                          {product.manufacturerName && (
                            <div className={`text-xs mt-0.5 flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              <span>🏭</span>
                              <span className="truncate">{product.manufacturerName}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Unit/Pack Form */}
                    <td className={`px-3 py-2.5 text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{product.packForm || '-'}</td>

                    {/* Price (Selling Price) */}
                    <td className="px-3 py-2.5">
                      <span className="text-base font-bold text-green-600">
                        {inr(product.sellingPrice)}
                      </span>
                    </td>

                    {/* Original (MRP) */}
                    <td className="px-3 py-2.5">
                      <span className={`text-xs line-through ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {product.mrp ? inr(product.mrp) : '-'}
                      </span>
                    </td>

                    {/* Discount */}
                    <td className="px-3 py-2.5">
                      {product.discount > 0 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800">
                          {product.discount}%
                        </span>
                      ) : (
                        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>-</span>
                      )}
                    </td>

                    {/* Qty (Pack Size) */}
                    <td className={`px-3 py-2.5 text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{product.packSize || '-'}</td>

                    {/* Price Per Unit */}
                    <td className={`px-3 py-2.5 text-xs font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      {product.pricePerItem ? inr(product.pricePerItem) : '-'}
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-2.5">
                      {link && (
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-500 text-white hover:bg-teal-600 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200"
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
