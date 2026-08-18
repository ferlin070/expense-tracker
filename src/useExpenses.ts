import { useState, useEffect, useCallback } from 'react';
import type { Expense, ExpenseDraft, FilterState } from './types';
import { loadExpenses, saveExpenses } from './storage';
import { createExpense, updateExpense, getCurrentMonth } from './schema';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterState>({ month: getCurrentMonth(), category: null });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const result = loadExpenses();
      setExpenses(result.data);
      if (!result.ok && result.error) setError(result.error);
      else if (result.error) setError(result.error);
      setLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const persist = useCallback((next: Expense[]) => {
    const result = saveExpenses(next);
    if (!result.ok) setError(result.error ?? 'Save failed.');
    else setError(null);
  }, []);

  const addExpense = useCallback((draft: ExpenseDraft) => {
    const created = createExpense(draft);
    setExpenses((prev) => {
      const next = [created, ...prev];
      persist(next);
      return next;
    });
  }, [persist]);

  const editExpense = useCallback((id: string, draft: ExpenseDraft) => {
    setExpenses((prev) => {
      const existing = prev.find((e) => e.id === id);
      if (!existing) return prev;
      const updated = updateExpense(existing, draft);
      const next = prev.map((e) => (e.id === id ? updated : e));
      persist(next);
      return next;
    });
  }, [persist]);

  const deleteExpense = useCallback((id: string) => {
    setExpenses((prev) => {
      const next = prev.filter((e) => e.id !== id);
      persist(next);
      return next;
    });
  }, [persist]);

  return {
    expenses, loading, error, filter, setFilter,
    editingId, setEditingId,
    addExpense, editExpense, deleteExpense,
  };
}
