import { describe, expect, it, beforeEach, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App, AppView } from '../App';
import { getCurrentMonth } from '../schema';

beforeEach(() => localStorage.clear());

describe('Expense Tracker interactions', () => {
  it('adds a new expense via the form', async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByText('Tambah Perbelanjaan');
    const list = screen.getByRole('list', { name: 'Senarai transaksi' });
    const before = within(list).getAllByRole('listitem').length;

    await user.type(screen.getByLabelText('Jumlah perbelanjaan dalam Ringgit Malaysia'), '75');
    await user.selectOptions(screen.getByLabelText('Kategori perbelanjaan'), 'Hiburan');
    await user.type(screen.getByLabelText('Nota perbelanjaan'), 'Konsert');
    await user.click(screen.getByRole('button', { name: 'Tambah' }));

    expect(within(list).getAllByRole('listitem')).toHaveLength(before + 1);
    expect(within(list).getByText('Konsert')).toBeInTheDocument();
    expect(within(list).getByText('RM 75.00')).toBeInTheDocument();
  });

  it('edits an expense via the form', async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByText('Tambah Perbelanjaan');
    const list = screen.getByRole('list', { name: 'Senarai transaksi' });

    await user.click(within(list).getAllByRole('button', { name: /^Edit / })[0]!);

    const amount = screen.getByLabelText('Jumlah perbelanjaan dalam Ringgit Malaysia');
    await user.clear(amount);
    await user.type(amount, '99.99');
    await user.click(screen.getByRole('button', { name: 'Simpan' }));

    expect(within(list).getByText('RM 99.99')).toBeInTheDocument();
  });

  it('requires confirmation before deleting', async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByText('Tambah Perbelanjaan');
    const list = screen.getByRole('list', { name: 'Senarai transaksi' });
    const before = within(list).getAllByRole('listitem').length;

    await user.click(within(list).getAllByRole('button', { name: /^Padam / })[0]!);

    expect(within(list).getByRole('button', { name: 'Batal padam' })).toBeInTheDocument();
    expect(within(list).getAllByRole('button', { name: /^Pastikan / })).toHaveLength(1);

    await user.click(within(list).getAllByRole('button', { name: /^Pastikan / })[0]!);

    expect(within(list).getAllByRole('listitem')).toHaveLength(before - 1);
  });

  it('filters transactions by category', async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByText('Tambah Perbelanjaan');
    const list = screen.getByRole('list', { name: 'Senarai transaksi' });

    await user.selectOptions(screen.getByLabelText('Tapis mengikut kategori'), 'Makanan');

    const items = within(list).getAllByRole('listitem');
    expect(items.length).toBeGreaterThan(0);
    items.forEach((item) => expect(item).toHaveTextContent('Makanan'));
  });

  it('dismisses the error banner', async () => {
    const user = userEvent.setup();
    const dismissError = vi.fn();
    const api = {
      expenses: [],
      error: 'Could not save.',
      filter: { month: getCurrentMonth(), category: null },
      setFilter: () => {},
      editingId: null,
      setEditingId: () => {},
      addExpense: () => {},
      editExpense: () => {},
      deleteExpense: () => {},
      dismissError,
    };
    render(<AppView {...api} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Could not save.');
    await user.click(screen.getByRole('button', { name: 'Tutup amaran' }));
    expect(dismissError).toHaveBeenCalledTimes(1);
  });
});
