import { useState, useEffect, useRef } from 'react';
import type { ExpenseDraft, Category, Expense } from '../types';
import { CATEGORIES } from '../types';

interface Props {
  editing: Expense | null;
  onSubmit: (draft: ExpenseDraft) => void;
  onCancel: () => void;
}

export function ExpenseForm({ editing, onSubmit, onCancel }: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Makanan');
  const [date, setDate] = useState(today);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const amountRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      setAmount(String(editing.amount));
      setCategory(editing.category);
      setDate(editing.date);
      setNote(editing.note);
    } else {
      setAmount(''); setCategory('Makanan'); setDate(today); setNote('');
    }
    setError('');
    amountRef.current?.focus();
  }, [editing, today]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { setError('Sila masukkan jumlah yang sah.'); return; }
    onSubmit({ amount: amt, category, date, note: note.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" aria-label={editing ? 'Edit perbelanjaan' : 'Tambah perbelanjaan'}>
      {error && <div role="alert" className="text-danger text-sm">{error}</div>}
      <div>
        <label htmlFor="amount" className="block text-text-soft text-xs font-medium mb-1">Jumlah (RM)</label>
        <input
          ref={amountRef} id="amount" type="number" step="0.01" min="0.01" required
          value={amount} onChange={(e) => setAmount(e.target.value)}
          aria-label="Jumlah perbelanjaan dalam Ringgit Malaysia"
          className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-text focus:outline-2 focus:outline-primary"
        />
      </div>
      <div>
        <label htmlFor="category" className="block text-text-soft text-xs font-medium mb-1">Kategori</label>
        <select
          id="category" value={category} onChange={(e) => setCategory(e.target.value as Category)}
          aria-label="Kategori perbelanjaan"
          className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-text focus:outline-2 focus:outline-primary"
        >
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="date" className="block text-text-soft text-xs font-medium mb-1">Tarikh</label>
        <input
          id="date" type="date" required value={date} onChange={(e) => setDate(e.target.value)}
          aria-label="Tarikh perbelanjaan"
          className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-text focus:outline-2 focus:outline-primary"
        />
      </div>
      <div>
        <label htmlFor="note" className="block text-text-soft text-xs font-medium mb-1">Nota</label>
        <textarea
          id="note" rows={2} maxLength={500} value={note} onChange={(e) => setNote(e.target.value)}
          aria-label="Nota perbelanjaan"
          placeholder="cth: Lunch di mamak"
          className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-text resize-none focus:outline-2 focus:outline-primary"
        />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="flex-1 bg-primary hover:bg-primary-hover text-white font-medium text-sm rounded-lg px-4 py-2 transition-colors">
          {editing ? 'Simpan' : 'Tambah'}
        </button>
        {editing && (
          <button type="button" onClick={onCancel} className="bg-transparent border border-border text-text-soft hover:text-text font-medium text-sm rounded-lg px-4 py-2 transition-colors">
            Batal
          </button>
        )}
      </div>
    </form>
  );
}
