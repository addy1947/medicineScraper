import React from 'react';

export default function OcrModal({ names = [], onPick, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 w-[min(560px,92vw)] max-h-[80vh] overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-linear-to-r from-gray-50 to-white">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧾</span>
            <h3 className="font-bold text-gray-900">Pick a medicine</h3>
            <span className="ml-2 inline-flex items-center justify-center w-6 h-6 text-xs rounded-full bg-amber-100 text-amber-700 border border-amber-200">{names.length}</span>
          </div>
          <button onClick={onClose} className="px-3 py-1.5 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Close</button>
        </div>
        <div className="p-3 overflow-auto">
          {(!names || names.length === 0) ? (
            <div className="text-center py-12 text-gray-500 text-sm">No names extracted. Try a clearer image.</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {names.map((n, idx) => (
                <li key={`${n}-${idx}`} className="flex items-center justify-between gap-3 py-2">
                  <span className="text-sm text-gray-800 truncate">{n}</span>
                  <button
                    onClick={() => onPick && onPick(n)}
                    className="px-2.5 py-1 text-xs rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    Use
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
