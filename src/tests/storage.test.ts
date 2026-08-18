import { describe, expect, it, beforeEach, vi } from 'vitest';
import { loadExpenses, saveExpenses } from '../storage';
import { createExpense } from '../schema';

beforeEach(() => localStorage.clear());

describe('storage', () => {
  it('round-trips save then load', () => {
    const e = createExpense({ amount: 50, category: 'Makanan', date: '2025-01-01', note: 'test' });
    saveExpenses([e]);
    const r = loadExpenses();
    expect(r.ok).toBe(true);
    expect(r.data).toHaveLength(1);
    expect(r.data[0]?.amount).toBe(50);
  });

  it('seeds on first load', () => {
    const r = loadExpenses();
    expect(r.ok).toBe(true);
    expect(r.data.length).toBeGreaterThan(0);
  });

  it('drops invalid records', () => {
    localStorage.setItem('expense-tracker:v1', JSON.stringify([{ bad: true }, 'garbage']));
    const r = loadExpenses();
    expect(r.ok).toBe(true);
    expect(r.data).toHaveLength(0);
    expect(r.error).toContain('invalid');
  });

  it('reports error on corrupt JSON', () => {
    localStorage.setItem('expense-tracker:v1', '{not json');
    const r = loadExpenses();
    expect(r.ok).toBe(false);
    expect(r.error).toBeTruthy();
  });

  it('surfaces quota error without throwing', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('quota', 'QuotaExceededError');
    });
    const r = saveExpenses([]);
    expect(r.ok).toBe(false);
    expect(r.error).toContain('full');
    spy.mockRestore();
  });
});
