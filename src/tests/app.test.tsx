import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { createElement } from 'react';
import { AppView } from '../App';
import { createId } from '../schema';
import { getCurrentMonth } from '../schema';
import type { Expense } from '../types';

const month = getCurrentMonth();
const expense: Expense = {
  id: createId(), amount: 42.5, category: 'Makanan', date: `${month}-15`,
  note: 'Lunch', createdAt: 0, updatedAt: 0,
};

const api = {
  expenses: [expense],
  error: null,
  filter: { month, category: null },
  setFilter: () => {},
  editingId: null,
  setEditingId: () => {},
  addExpense: () => {},
  editExpense: () => {},
  deleteExpense: () => {},
};

describe('AppView render', () => {
  it('renders header and form', () => {
    const html = renderToString(createElement(AppView, api));
    expect(html).toContain('Expense Tracker');
    expect(html).toContain('Tambah Perbelanjaan');
    expect(html).toContain('Makanan');
    expect(html).toContain('Pengangkutan');
    expect(html).toContain('Utiliti');
    expect(html).toContain('Hiburan');
    expect(html).toContain('Lain-lain');
  });

  it('has accessible form labels and filters', () => {
    const html = renderToString(createElement(AppView, api));
    expect(html).toContain('id="amount"');
    expect(html).toContain('id="category"');
    expect(html).toContain('id="date"');
    expect(html).toContain('id="note"');
    expect(html).toContain('aria-label="Tapis mengikut bulan"');
    expect(html).toContain('aria-label="Tapis mengikut kategori"');
  });

  it('renders the transaction list with currency', () => {
    const html = renderToString(createElement(AppView, api));
    expect(html).toContain('RM42.50');
    expect(html).toContain('Lunch');
    expect(html).toContain('aria-label="Senarai transaksi"');
  });

  it('shows chart title and category breakdown', () => {
    const html = renderToString(createElement(AppView, api));
    expect(html).toContain('Carta Pecahan');
    expect(html).toContain('role="img"');
  });

  it('shows alert on storage error', () => {
    const html = renderToString(createElement(AppView, { ...api, error: 'Could not save.' }));
    expect(html).toContain('role="alert"');
    expect(html).toContain('Could not save.');
  });
});