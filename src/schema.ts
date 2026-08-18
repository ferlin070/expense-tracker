import type { Expense, ExpenseDraft, Category, MonthlyStat, CategoryStat } from './types';
import { CATEGORIES, CATEGORY_COLORS } from './types';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function createId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function isExpense(v: unknown): v is Expense {
  if (typeof v !== 'object' || v === null) return false;
  const e = v as Record<string, unknown>;
  return (
    typeof e.id === 'string' && UUID_RE.test(e.id) &&
    typeof e.amount === 'number' && Number.isFinite(e.amount) && e.amount > 0 &&
    typeof e.category === 'string' && (CATEGORIES as readonly string[]).includes(e.category) &&
    typeof e.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(e.date) &&
    typeof e.note === 'string' &&
    typeof e.createdAt === 'number' && Number.isFinite(e.createdAt) &&
    typeof e.updatedAt === 'number' && Number.isFinite(e.updatedAt)
  );
}

export class ValidationError extends Error {
  readonly fields: string[];
  constructor(fields: string[], msg = 'Invalid expense data') {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}

export function createExpense(draft: ExpenseDraft): Expense {
  const fields: string[] = [];
  if (!Number.isFinite(draft.amount) || draft.amount <= 0) fields.push('amount');
  if (!(CATEGORIES as readonly string[]).includes(draft.category)) fields.push('category');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(draft.date)) fields.push('date');
  if (draft.note.length > 500) fields.push('note');
  if (fields.length > 0) throw new ValidationError([...new Set(fields)]);

  const now = Date.now();
  return {
    id: createId(),
    amount: Math.round(draft.amount * 100) / 100,
    category: draft.category,
    date: draft.date,
    note: draft.note.trim(),
    createdAt: now,
    updatedAt: now,
  };
}

export function updateExpense(existing: Expense, draft: ExpenseDraft): Expense {
  const next = createExpense(draft);
  return { ...next, id: existing.id, createdAt: existing.createdAt, updatedAt: Date.now() };
}

export function formatCurrency(amount: number): string {
  return 'RM ' + amount.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatDate(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function getMonthKey(isoDate: string): string {
  return isoDate.slice(0, 7); // YYYY-MM
}

export function getCurrentMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function computeMonthlyStats(expenses: Expense[], month: string | null): MonthlyStat {
  const filtered = month ? expenses.filter((e) => getMonthKey(e.date) === month) : expenses;
  const total = filtered.reduce((s, e) => s + e.amount, 0);
  const count = filtered.length;

  const byCategory: CategoryStat[] = CATEGORIES.map((cat) => {
    const items = filtered.filter((e) => e.category === cat);
    const catTotal = items.reduce((s, e) => s + e.amount, 0);
    return {
      category: cat,
      total: Math.round(catTotal * 100) / 100,
      percentage: total > 0 ? Math.round((catTotal / total) * 1000) / 10 : 0,
      color: CATEGORY_COLORS[cat],
      count: items.length,
    };
  }).filter((s) => s.count > 0);

  return { total: Math.round(total * 100) / 100, count, byCategory };
}

export function filterExpenses(
  expenses: Expense[],
  filter: { month: string | null; category: Category | null }
): Expense[] {
  return expenses
    .filter((e) => {
      if (filter.month && getMonthKey(e.date) !== filter.month) return false;
      if (filter.category && e.category !== filter.category) return false;
      return true;
    })
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
}

export function getAvailableMonths(expenses: Expense[]): string[] {
  const months = new Set(expenses.map((e) => getMonthKey(e.date)));
  return Array.from(months).sort((a, b) => b.localeCompare(a));
}

export function toCsv(expenses: Expense[]): string {
  const header = 'Jumlah,Kategori,Tarikh,Nota';
  const rows = expenses.map((e) => [
    e.amount,
    e.category,
    e.date,
    `"${e.note.replace(/"/g, '""')}"`,
  ].join(','));
  return [header, ...rows].join('\n');
}

export function seedExpenses(): Expense[] {
  const now = Date.now();
  const today = new Date();
  const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const day = (n: number) => { const d = new Date(today); d.setDate(d.getDate() - n); return iso(d); };

  const make = (amount: number, category: Category, date: string, note: string): Expense => ({
    id: createId(), amount, category, date, note, createdAt: now, updatedAt: now,
  });

  return [
    make(25.50, 'Makanan', day(1), 'Lunch at mamak'),
    make(15.00, 'Pengangkutan', day(1), 'Grab to office'),
    make(120.00, 'Utiliti', day(3), 'Electricity bill'),
    make(45.00, 'Hiburan', day(5), 'Movie tickets'),
    make(8.50, 'Makanan', day(0), 'Breakfast'),
    make(30.00, 'Lain-lain', day(2), 'Stationery'),
  ];
}
