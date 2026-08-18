import { useState, useEffect, useCallback, useRef } from 'react';
import type { Expense, ExpenseDraft, FilterState } from './types';
import { loadExpenses, saveExpenses } from './storage';
import { createExpense, updateExpense, getCurrentMonth } from './schema';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterState>({ month: getCurrentMonth(), category: null });
  const [editingId, setEditingId] = useState<string | null>(null);
  const expensesRef = useRef<Expense[]>([]);

  useEffect(() => {
    const result = loadExpenses();
    expensesRef.current = result.data;
    setExpenses(result.data);
    if (result.error) setError(result.error);
    setLoading(false);
  }, []);

  const commit = useCallback((updater: (prev: Expense[]) => Expense[]) => {
    const next = updater(expensesRef.current);
    expensesRef.current = next;
    setExpenses(next);
    const result = saveExpenses(next);
    if (!result.ok) setError(result.error ?? 'Save failed.');
    else setError(null);
  }, []);

  const addExpense = useCallback((draft: ExpenseDraft) => {
    const created = createExpense(draft);
    commit((prev) => [created, ...prev]);
  }, [commit]);

  const editExpense = useCallback((id: string, draft: ExpenseDraft) => {
    commit((prev) => {
      const existing = prev.find((e) => e.id === id);
      if (!existing) return prev;
      const updated = updateExpense(existing, draft);
      return prev.map((e) => (e.id === id ? updated : e));
    });
  }, [commit]);

  const deleteExpense = useCallback((id: string) => {
    commit((prev) => prev.filter((e) => e.id !== id));
  }, [commit]);

  const dismissError = useCallback(() => setError(null), []);

  return {
    expenses, loading, error, filter, setFilter,
    editingId, setEditingId,
    addExpense, editExpense, deleteExpense, dismissError,
  };
}