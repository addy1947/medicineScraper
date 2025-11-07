export const inr = (n) =>
  typeof n === 'number'
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n)
    : '';

// Extract quantity from various unit strings, e.g.:
// "10 tablets", "strip of 15 tablets", "bottle of 60 ml", "2 x 10 tablets"
export const extractQty = (unitSize) => {
  if (!unitSize) return null;
  const s = String(unitSize).trim();
  // Handle patterns like "2x10", "2 x 10", "Pack of 2 x 10"
  let m = s.match(/(\d+(?:\.\d+)?)\s*[xX]\s*(\d+(?:\.\d+)?)/);
  if (m) {
    const a = parseFloat(m[1]);
    const b = parseFloat(m[2]);
    if (!isNaN(a) && !isNaN(b)) return a * b;
  }
  // Starts with a number e.g. "10 tablets", "60 ml"
  m = s.match(/^(\d+(?:\.\d+)?)/);
  if (m) return parseFloat(m[1]);
  // Contains "of <num>" e.g. "strip of 15 tablets", "bottle of 60 ml"
  m = s.match(/of\s+(\d+(?:\.\d+)?)/i);
  if (m) return parseFloat(m[1]);
  // Fallback: first number anywhere
  m = s.match(/(\d+(?:\.\d+)?)/);
  return m ? parseFloat(m[1]) : null;
};
