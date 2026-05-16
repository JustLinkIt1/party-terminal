import { config } from '../config';

const todayIso = () => new Date().toISOString().slice(0, 10);

export function isValidDialDate(iso: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  if (Number.isNaN(Date.parse(iso))) return false;
  if (iso < config.MIN_DATE) return false;
  if (iso > todayIso()) return false;
  return true;
}

export function randomDate(): string {
  // Weight toward dates inside the "interesting" 1850–today window where the
  // model has rich training data. ~10% of rolls dip earlier for variety.
  const today = new Date();
  const min = new Date(config.MIN_DATE).getTime();
  const max = today.getTime();

  const lowerBound = Math.random() < 0.1 ? min : new Date('1850-01-01').getTime();
  const t = lowerBound + Math.random() * (max - lowerBound);
  return new Date(t).toISOString().slice(0, 10);
}
