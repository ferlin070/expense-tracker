import type { FilterState, Category } from '../types';
import { CATEGORIES } from '../types';
import { getAvailableMonths } from '../schema';
import type { Expense } from '../types';

interface Props {
  filter: FilterState;
  onFilterChange: (filter: FilterState) => void;
  expenses: Expense[];
}

export function FilterBar({ filter, onFilterChange, expenses }: Props) {
  const months = getAvailableMonths(expenses);

  return (
    <div className="flex flex-wrap gap-2" aria-label="Penapis transaksi">
      <select
        value={filter.month ?? ''}
        onChange={(e) => onFilterChange({ ...filter, month: e.target.value || null })}
        aria-label="Tapis mengikut bulan"
        className="bg-surface-alt border border-border rounded-lg px-3 py-1.5 text-text text-sm focus:outline-2 focus:outline-primary"
      >
        <option value="">Semua Bulan</option>
        {months.map((m) => {
          const [y, mo] = m.split('-');
          const label = new Date(Number(y), Number(mo) - 1).toLocaleDateString('en-MY', { month: 'long', year: 'numeric' });
          return <option key={m} value={m}>{label}</option>;
        })}
      </select>
      <select
        value={filter.category ?? ''}
        onChange={(e) => onFilterChange({ ...filter, category: (e.target.value || null) as Category | null })}
        aria-label="Tapis mengikut kategori"
        className="bg-surface-alt border border-border rounded-lg px-3 py-1.5 text-text text-sm focus:outline-2 focus:outline-primary"
      >
        <option value="">Semua Kategori</option>
        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
    </div>
  );
}
