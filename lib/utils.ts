/**
 * Deterministic number formatter (prevents Next.js SSR hydration mismatch).
 * Formats numbers with thousands separator without relying on server vs browser locale.
 * Example: 49820 -> "49.820"
 */
export function formatNumber(num: number | undefined | null): string {
  if (num === undefined || num === null) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
