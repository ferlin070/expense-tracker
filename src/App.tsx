import { useExpenses } from './useExpenses';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { CategoryChart } from './components/CategoryChart';
import { FilterBar } from './components/FilterBar';
import { computeMonthlyStats, filterExpenses, formatCurrency, toCsv } from './schema';
import type { Expense, ExpenseDraft, FilterState } from './types';

export interface ExpensesApi {
  expenses: Expense[];
  error: string | null;
  filter: FilterState;
  setFilter: (f: FilterState) => void;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  addExpense: (d: ExpenseDraft) => void;
  editExpense: (id: string, d: ExpenseDraft) => void;
  deleteExpense: (id: string) => void;
  dismissError: () => void;
}

export function AppView(api: ExpensesApi) {
  const { expenses, error, filter, setFilter, editingId, setEditingId, editExpense, addExpense, deleteExpense, dismissError } = api;
  const editing = editingId ? expenses.find((e) => e.id === editingId) ?? null : null;
  const stats = computeMonthlyStats(expenses, filter.month);
  const filtered = filterExpenses(expenses, filter);

  const handleSubmit = (draft: ExpenseDraft) => {
    if (editingId) {
      editExpense(editingId, draft);
      setEditingId(null);
    } else {
      addExpense(draft);
    }
  };

  const handleExport = () => {
    const blob = new Blob([toCsv(filtered)], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expenses.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-4 md:px-6 py-6">
      <header aria-label="Header halaman" className="mb-6">
        <h1 className="text-2xl font-bold text-text">💰 Expense Tracker</h1>
        <p className="text-text-soft text-sm mt-1">Jejak perbelanjaan anda</p>
      </header>

      {error && (
        <div role="alert" className="flex items-center justify-between gap-3 bg-danger/10 border border-danger/30 rounded-lg p-3 mb-4">
          <span className="text-danger text-sm">{error}</span>
          <button onClick={dismissError} className="text-danger text-lg leading-none" aria-label="Tutup amaran">×</button>
        </div>
      )}

      <main className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6" aria-label="Kandungan utama">
        <section aria-label="Borang perbelanjaan" className="space-y-4">
          <div className="bg-surface border border-border rounded-xl p-5 shadow-lg">
            <h2 className="text-text font-semibold text-sm mb-3">
              {editing ? 'Edit Perbelanjaan' : 'Tambah Perbelanjaan'}
            </h2>
            <ExpenseForm
              editing={editing}
              onSubmit={handleSubmit}
              onCancel={() => setEditingId(null)}
            />
          </div>
          <div className="bg-surface border border-border rounded-xl p-5 shadow-lg">
            <h2 className="text-text font-semibold text-sm mb-3">Carta Pecahan</h2>
            <CategoryChart stats={stats.byCategory} total={stats.total} />
          </div>
        </section>

        <section aria-label="Senarai transaksi" className="space-y-4">
          <div className="bg-surface border border-border rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-text font-semibold text-sm">Transaksi</h2>
                <p className="text-text-soft text-xs mt-0.5">
                  Jumlah bulan ini: <span className="text-text font-medium" style={{ fontFamily: 'ui-monospace, monospace' }}>{formatCurrency(stats.total)}</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-text-soft text-xs">{filtered.length} transaksi</span>
                <button
                  onClick={handleExport}
                  aria-label="Export senarai transaksi ke CSV"
                  className="text-text-soft hover:text-primary text-xs px-2 py-1 rounded border border-border transition-colors"
                >
                  Export CSV
                </button>
              </div>
            </div>
            <FilterBar filter={filter} onFilterChange={setFilter} expenses={expenses} />
          </div>
          <div className="bg-surface border border-border rounded-xl p-5 shadow-lg">
            <ExpenseList
              expenses={filtered}
              onEdit={(id) => setEditingId(id)}
              onDelete={deleteExpense}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

export function App() {
  const api = useExpenses();
  if (api.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-surface-alt border-t-primary rounded-full animate-spin" aria-hidden="true" />
        <span className="sr-only">Memuatkan...</span>
      </div>
    );
  }
  return <AppView {...api} />;
}