import { useState, useEffect } from 'react';
import type { Expense } from '../types';
import { CATEGORY_COLORS } from '../types';
import { formatCurrency, formatDate } from '../schema';

interface Props {
  expenses: Expense[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ExpenseList({ expenses, onEdit, onDelete }: Props) {
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (!confirmId) return;
    const timer = setTimeout(() => setConfirmId(null), 4000);
    return () => clearTimeout(timer);
  }, [confirmId]);

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 text-text-soft text-sm">
        <p className="text-2xl mb-2">📝</p>
        <p>Tiada transaksi. Tambah perbelanjaan untuk mula.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-2" aria-label="Senarai transaksi">
      {expenses.map((e) => (
        <li
          key={e.id}
          className="flex items-center gap-3 bg-surface border border-border rounded-lg p-3 transition-colors hover:bg-surface-alt"
        >
          <span
            className="w-2 h-10 rounded-full shrink-0"
            style={{ backgroundColor: CATEGORY_COLORS[e.category] }}
            aria-hidden="true"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-text font-medium text-sm">{e.category}</span>
              <span className="text-text-soft text-xs">{formatDate(e.date)}</span>
            </div>
            {e.note && <p className="text-text-soft text-xs truncate mt-0.5">{e.note}</p>}
          </div>
          <span className="text-text font-semibold text-sm shrink-0" style={{ fontFamily: 'ui-monospace, monospace' }}>
            {formatCurrency(e.amount)}
          </span>
          <div className="flex gap-1 shrink-0">
            <button
              onClick={() => onEdit(e.id)}
              aria-label={`Edit ${e.category} ${formatCurrency(e.amount)}`}
              className="text-text-soft hover:text-primary text-xs px-2 py-1 rounded transition-colors"
            >
              Edit
            </button>
            {confirmId === e.id ? (
              <>
                <button
                  onClick={() => { onDelete(e.id); setConfirmId(null); }}
                  aria-label={`Pastikan padam ${e.category} ${formatCurrency(e.amount)}`}
                  className="text-danger hover:text-danger-hover text-xs px-2 py-1 rounded transition-colors"
                >
                  Pastikan
                </button>
                <button
                  onClick={() => setConfirmId(null)}
                  aria-label="Batal padam"
                  className="text-text-soft hover:text-text text-xs px-2 py-1 rounded transition-colors"
                >
                  Batal
                </button>
              </>
            ) : (
              <button
                onClick={() => setConfirmId(e.id)}
                aria-label={`Padam ${e.category} ${formatCurrency(e.amount)}`}
                className="text-text-soft hover:text-danger text-xs px-2 py-1 rounded transition-colors"
              >
                Padam
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}