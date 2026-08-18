export type Category = 'Makanan' | 'Pengangkutan' | 'Utiliti' | 'Hiburan' | 'Lain-lain';

export const CATEGORIES: readonly Category[] = [
  'Makanan', 'Pengangkutan', 'Utiliti', 'Hiburan', 'Lain-lain',
] as const;

export const CATEGORY_COLORS: Record<Category, string> = {
  'Makanan': '#f59e0b',
  'Pengangkutan': '#3b82f6',
  'Utiliti': '#8b5cf6',
  'Hiburan': '#ec4899',
  'Lain-lain': '#6b7280',
};

export interface Expense {
  id: string;
  amount: number;
  category: Category;
  date: string; // ISO date (YYYY-MM-DD)
  note: string;
  createdAt: number;
  updatedAt: number;
}

export interface ExpenseDraft {
  amount: number;
  category: Category;
  date: string;
  note: string;
}

export interface CategoryStat {
  category: Category;
  total: number;
  percentage: number;
  color: string;
  count: number;
}

export interface MonthlyStat {
  total: number;
  count: number;
  byCategory: CategoryStat[];
}

export interface FilterState {
  month: string | null; // YYYY-MM or null = all
  category: Category | null;
}

export interface LoadResult {
  ok: boolean;
  data: Expense[];
  error?: string;
}

export interface SaveResult {
  ok: boolean;
  error?: string;
}
