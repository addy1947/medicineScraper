import React from 'react';
import MedicinePlaceholder from './MedicinePlaceholder';
import { inr, extractQty } from '../utils/formatters';

export default function CompareModal({ items = [], onClose, onRemove, onClear, title = "Compare Selected Items", emptyMessage = null, darkMode = false }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 transition-opacity duration-300" onClick={onClose} />
            <div className={`relative rounded-xl shadow-2xl border w-[min(1400px,95vw)] max-h-[90vh] overflow-hidden transition-colors duration-500 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                {/* Header */}
                <div className={`px-4 py-3 border-b flex items-center justify-between transition-colors duration-500 ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-linear-to-r from-gray-50 to-white border-gray-200'}`}>
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🔍</span>
                        <h3 className={`font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{title}</h3>
                        <span className={`ml-2 inline-flex items-center justify-center w-6 h-6 text-xs rounded-full border ${darkMode ? 'bg-indigo-900 text-indigo-200 border-indigo-700' : 'bg-indigo-100 text-indigo-700 border-indigo-200'}`}>{items.length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {items.length > 0 && (
                            <button onClick={onClear} className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>Clear all</button>
                        )}
                        <button onClick={onClose} className="px-3 py-1.5 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Close</button>
                    </div>
                </div>
                {/* Body */}
                <div className="p-3 overflow-auto">
                    {items.length === 0 && emptyMessage ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📋</div>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{emptyMessage}</p>
                        </div>
                    ) : (
                        <table className="min-w-full text-sm transition-colors duration-500">
                            <thead>
                                <tr className={`border-b transition-colors duration-500 ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                                    <th className={`px-3 py-2 text-left text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Source</th>
                                    <th className={`px-3 py-2 text-left text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Product</th>
                                    <th className={`px-3 py-2 text-left text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Manufacturer</th>
                                    <th className={`px-3 py-2 text-left text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Pack</th>
                                    <th className={`px-3 py-2 text-left text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>MRP</th>
                                    <th className={`px-3 py-2 text-left text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Price</th>
                                    <th className={`px-3 py-2 text-left text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Discount</th>
                                    <th className={`px-3 py-2 text-left text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Price/Unit</th>
                                    <th className={`px-3 py-2 text-left text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Composition</th>
                                    <th className="px-3 py-2"></th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                                {items.map((it) => {
                                    const img = it.image ? (it.image.includes(',') ? it.image.split(',')[0] : it.image) : null;
                                    const mrp = typeof it.mrp === 'number' ? it.mrp : null;
                                    const price = typeof it.price === 'number' ? it.price : null;
                                    const discount = typeof it.discount === 'number' ? `${it.discount}%` : (it.discount || null);
                                    // Fallback compute for Price/Unit if not provided in selection
                                    const computedPPU = (typeof it.pricePerUnit === 'number' || typeof it.pricePerUnit === 'string')
                                        ? it.pricePerUnit
                                        : (() => {
                                            const qty = extractQty(it.pack);
                                            if (qty && typeof price === 'number') return price / qty;
                                            return null;
                                        })();
                                    return (
                                        <tr key={it.key} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                                            <td className={`px-3 py-2 text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>{it.source}</td>
                                            <td className="px-3 py-2">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden border shrink-0 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-100'}`}>
                                                        {img ? (
                                                            <img src={img} alt={it.name} className="w-full h-full object-contain p-0.5" />
                                                        ) : (
                                                            <MedicinePlaceholder className="w-10 h-10" />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className={`font-semibold truncate ${darkMode ? 'text-gray-200' : 'text-gray-900'}`} title={it.name}>{it.name}</div>
                                                        {it.link && (
                                                            <a className={`text-xs hover:underline ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} href={it.link} target="_blank" rel="noreferrer">View</a>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={`px-3 py-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>{it.manufacturer || '-'}</td>
                                            <td className={`px-3 py-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>{it.pack || '-'}</td>
                                            <td className={`px-3 py-2 text-xs line-through ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{mrp != null ? inr(mrp) : '-'}</td>
                                            <td className={`px-3 py-2 text-sm font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{price != null ? inr(price) : '-'}</td>
                                            <td className={`px-3 py-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>{discount || '-'}</td>
                                            <td className={`px-3 py-2 text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                                                {typeof computedPPU === 'number' ? inr(computedPPU) : (typeof computedPPU === 'string' ? computedPPU : '-')}
                                            </td>
                                            <td className={`px-3 py-2 text-xs max-w-[22ch] truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} title={it.composition || ''}>{it.composition || '-'}</td>
                                            <td className="px-3 py-2 text-right">
                                                <button onClick={() => onRemove(it.key)} className={`px-2 py-1 text-xs rounded border transition-colors ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>Remove</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
