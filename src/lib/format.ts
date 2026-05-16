export function truncateCa(ca: string): string {
  if (ca.length <= 12) return ca;
  return `${ca.slice(0, 4)}…${ca.slice(-4)}`;
}

export function formatDateForDisplay(iso: string): string {
  // iso = YYYY-MM-DD; render as "Jul 21, 1969" — no timezone tricks
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  return `${monthNames[m - 1]} ${d}, ${y}`;
}
