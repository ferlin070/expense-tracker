import { isExpense, seedExpenses } from './schema';
import type { Expense, LoadResult, SaveResult } from './types';

const KEY = 'expense-tracker:v1';

export function loadExpenses(): LoadResult {
  let raw: string | null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    return { ok: false, data: [], error: 'Could not access storage. Data may not persist.' };
  }

  if (raw === null) {
    const seeded = seedExpenses();
    const saved = saveExpenses(seeded);
    return saved.ok
      ? { ok: true, data: seeded }
      : { ok: true, data: seeded, error: saved.error };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, data: [], error: 'Stored data was corrupt and could not be read.' };
  }

  if (!Array.isArray(parsed)) {
    return { ok: false, data: [], error: 'Stored data had an unexpected shape.' };
  }

  const valid = parsed.filter(isExpense);
  const dropped = parsed.length - valid.length;
  return {
    ok: true,
    data: valid,
    error: dropped > 0 ? `${dropped} invalid record(s) were skipped.` : undefined,
  };
}

export function saveExpenses(expenses: Expense[]): SaveResult {
  try {
    localStorage.setItem(KEY, JSON.stringify(expenses));
    return { ok: true };
  } catch (err) {
    const name = err instanceof Error ? err.name : String((err as { name?: unknown })?.name ?? '');
    const isQuota = name === 'QuotaExceededError';
    return {
      ok: false,
      error: isQuota ? 'Storage is full. Your latest change could not be saved.' : 'Could not save.',
    };
  }
}

export function clearExpenses(): SaveResult {
  try {
    localStorage.removeItem(KEY);
    return { ok: true };
  } catch {
    return { ok: false, error: 'Could not clear storage.' };
  }
}
