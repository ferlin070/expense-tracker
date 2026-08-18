# Expense Tracker

A responsive expense tracking web app built with **React + TypeScript + Tailwind CSS**. Track, categorise, and analyse your spending with a clean dark dashboard.

## Features

- **CRUD perbelanjaan** — tambah, edit, dan padam rekod (jumlah, kategori, tarikh, nota)
- **Padam berkonfirmasi** — tindakan destruktif memerlukan sahkan ("Pastikan"/"Batal")
- **Kategori tetap** — Makanan, Pengangkutan, Utiliti, Hiburan, Lain-lain
- **Dashboard** — jumlah perbelanjaan bulan semasa + carta donut pecahan kategori
- **Penapis** — tapis senarai transaksi mengikut bulan dan/atau kategori
- **Export CSV** — muat turun senarai transaksi yang ditapis
- **Persistence** — data kekal selepas browser ditutup (localStorage, error-safe)
- **Responsive** — mobile single-column, desktop 2-column grid
- **Aksesibiliti** — landmark, aria-labels, fokus form, reduced-motion support

## Keperluan

- Node.js 18+ dan npm

## Cara Run

```bash
npm install
npm run dev
```

Buka `http://localhost:5173` dalam browser.

### Production build

```bash
npm run build
npm run preview
```

### Test

```bash
npm test
```

### Typecheck

```bash
npm run typecheck
```

## Struktur Projek

```
src/
  main.tsx              # Entry point
  App.tsx               # Layout & komposisi
  useExpenses.ts        # State management hook (CRUD + filter + persist)
  types.ts              # Types & pemalar kategori
  schema.ts             # Domain logic (validate, stats, filter, format)
  storage.ts            # Persistence layer (error-safe localStorage)
  components/
    ExpenseForm.tsx     # Tambah/Edit form
    ExpenseList.tsx     # Senarai transaksi
    CategoryChart.tsx   # Carta donut SVG (tiada library)
    FilterBar.tsx       # Penapis bulan + kategori
    index.css           # Tailwind theme & design tokens
  tests/
    schema.test.ts      # Domain logic (validation, stats, filter, CSV)
    storage.test.ts     # Persistence (corrupt data, quota error)
    app.test.tsx        # Render SSR + a11y labels
    interactions.test.tsx  # Klik, submit form, edit, padam, filter (Testing Library)
```

## State Management

State dikendalikan melalui `useExpenses` hook — semua transaksi, filter, dan operasi CRUD berpusat di satu tempat. Komponen menerima props daripada App sahaja; tiada props drilling yang berterabur.

## Teknologi

- [React 19](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Vite](https://vitejs.dev) + [Vitest](https://vitest.dev)