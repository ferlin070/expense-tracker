import { describe, expect, it } from 'vitest';
import {
  createExpense, updateExpense, isExpense, createId,
  computeMonthlyStats, filterExpenses, getMonthKey,
  ValidationError,
} from '../schema';
import type { Expense, ExpenseDraft } from '../types';

const validDraft = (o: Partial<ExpenseDraft> = {}): ExpenseDraft => ({
  amount: 50, category: 'Makanan', date: '2025-01-15', note: 'test', ...o,
});

describe('createExpense', () => {
  it('creates valid expense with trimmed note', () => {
    const e = createExpense(validDraft({ note: '  hi  ' }));
    expect(isExpense(e)).toBe(true);
    expect(e.note).toBe('hi');
    expect(e.amount).toBe(50);
  });

  it('rounds amount to 2 decimals', () => {
    const e = createExpense(validDraft({ amount: 10.999 }));
    expect(e.amount).toBe(11);
  });

  it('throws ValidationError for invalid amount', () => {
    expect(() => createExpense(validDraft({ amount: -5 }))).toThrow(ValidationError);
    expect(() => createExpense(validDraft({ amount: 0 }))).toThrow(ValidationError);
  });

  it('throws for invalid date format', () => {
    expect(() => createExpense(validDraft({ date: '15-01-2025' }))).toThrow(ValidationError);
  });

  it('throws for overlong note', () => {
    expect(() => createExpense(validDraft({ note: 'x'.repeat(501) }))).toThrow(ValidationError);
  });
});

describe('updateExpense', () => {
  it('preserves id and createdAt, bumps updatedAt', () => {
    const orig = createExpense(validDraft());
    const updated = updateExpense(orig, validDraft({ amount: 99 }));
    expect(updated.id).toBe(orig.id);
    expect(updated.createdAt).toBe(orig.createdAt);
    expect(updated.amount).toBe(99);
    expect(updated.updatedAt).toBeGreaterThanOrEqual(orig.updatedAt);
  });
});

describe('computeMonthlyStats', () => {
  const expenses: Expense[] = [
    { id: createId(), amount: 100, category: 'Makanan', date: '2025-01-01', note: '', createdAt: 0, updatedAt: 0 },
    { id: createId(), amount: 50, category: 'Makanan', date: '2025-01-02', note: '', createdAt: 0, updatedAt: 0 },
    { id: createId(), amount: 200, category: 'Utiliti', date: '2025-01-03', note: '', createdAt: 0, updatedAt: 0 },
    { id: createId(), amount: 30, category: 'Hiburan', date: '2025-02-01', note: '', createdAt: 0, updatedAt: 0 },
  ];

  it('filters by month', () => {
    const s = computeMonthlyStats(expenses, '2025-01');
    expect(s.total).toBe(350);
    expect(s.count).toBe(3);
  });

  it('returns all when month is null', () => {
    const s = computeMonthlyStats(expenses, null);
    expect(s.total).toBe(380);
    expect(s.count).toBe(4);
  });

  it('computes category percentages', () => {
    const s = computeMonthlyStats(expenses, '2025-01');
    const makanan = s.byCategory.find((c) => c.category === 'Makanan');
    expect(makanan?.percentage).toBeCloseTo(42.9, 0);
    expect(makanan?.total).toBe(150);
    expect(makanan?.count).toBe(2);
  });

  it('excludes categories with no expenses', () => {
    const s = computeMonthlyStats(expenses, '2025-01');
    expect(s.byCategory.find((c) => c.category === 'Hiburan')).toBeUndefined();
  });

  it('returns empty for no matching expenses', () => {
    const s = computeMonthlyStats(expenses, '2025-06');
    expect(s.total).toBe(0);
    expect(s.byCategory).toHaveLength(0);
  });
});

describe('filterExpenses', () => {
  const expenses: Expense[] = [
    { id: createId(), amount: 10, category: 'Makanan', date: '2025-01-10', note: 'a', createdAt: 1, updatedAt: 0 },
    { id: createId(), amount: 20, category: 'Utiliti', date: '2025-01-15', note: 'b', createdAt: 2, updatedAt: 0 },
    { id: createId(), amount: 30, category: 'Makanan', date: '2025-02-01', note: 'c', createdAt: 3, updatedAt: 0 },
  ];

  it('filters by month', () => {
    expect(filterExpenses(expenses, { month: '2025-01', category: null })).toHaveLength(2);
  });

  it('filters by category', () => {
    expect(filterExpenses(expenses, { month: null, category: 'Makanan' })).toHaveLength(2);
  });

  it('filters by both', () => {
    expect(filterExpenses(expenses, { month: '2025-01', category: 'Makanan' })).toHaveLength(1);
  });

  it('sorts by date descending', () => {
    const r = filterExpenses(expenses, { month: null, category: null });
    expect(r[0]?.date).toBe('2025-02-01');
    expect(r[1]?.date).toBe('2025-01-15');
  });

  it('returns all when no filter', () => {
    expect(filterExpenses(expenses, { month: null, category: null })).toHaveLength(3);
  });
});

describe('getMonthKey', () => {
  it('extracts YYYY-MM from ISO date', () => {
    expect(getMonthKey('2025-01-15')).toBe('2025-01');
    expect(getMonthKey('2025-12-31')).toBe('2025-12');
  });
});
