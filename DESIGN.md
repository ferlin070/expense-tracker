# DESIGN.md — Expense Tracker

## 1. Visual Theme & Atmosphere
- **Mood**: Clean, calm, trustworthy. Financial clarity without corporate stiffness.
- **Density**: Moderate — dashboard is scannable, list is compact, form is spacious.
- **Philosophy**: Numbers first, chrome second. Every pixel serves comprehension.

## 2. Color Palette & Roles
| Name | Hex | Role |
|---|---|---|
| `--bg` | `#0f172a` | App background (dark slate) |
| `--surface` | `#1e293b` | Cards, panels, form |
| `--surface-alt` | `#334155` | Hover, active filters |
| `--text` | `#f1f5f9` | Primary text |
| `--text-soft` | `#94a3b8` | Secondary text, labels |
| `--border` | `#334155` | Dividers, inputs |
| `--primary` | `#10b981` | Add, save, positive |
| `--primary-hover` | `#059669` | Hover state |
| `--danger` | `#ef4444` | Delete, negative |
| `--danger-hover` | `#dc2626` | Hover state |
| `--warning` | `#f59e0b` | Warning, over-budget |

### Category Colors (for chart + badges)
| Category | Color |
|---|---|
| Makanan | `#f59e0b` (amber) |
| Pengangkutan | `#3b82f6` (blue) |
| Utiliti | `#8b5cf6` (violet) |
| Hiburan | `#ec4899` (pink) |
| Lain-lain | `#6b7280` (gray) |

## 3. Typography Rules
| Level | Font | Size | Weight |
|---|---|---|---|
| Display | System sans | `2rem` | 700 |
| Heading | System sans | `1.25rem` | 600 |
| Body | System sans | `0.875rem` | 400 |
| Mono (numbers) | `ui-monospace, monospace` | `0.9rem` | 600 |
| Caption | System sans | `0.75rem` | 500 |

No external font load — system stack keeps bundle small and loads instantly.

## 4. Component Stylings
- **Buttons**: `rounded-lg`, `px-4 py-2`, `font-medium text-sm`, transition on hover. Primary=green, Danger=red, Ghost=transparent+border.
- **Cards**: `rounded-xl`, `bg-surface`, `border border-border`, `p-5`.
- **Inputs**: `rounded-lg`, `bg-surface-alt`, `border-border`, `text-text`, focus ring=primary.
- **Badges**: `rounded-full`, `px-2.5 py-0.5`, `text-xs font-medium`, category color tint.
- **Chart**: SVG-based, no chart library (keep bundle small). Donut or bar.

## 5. Layout Principles
- Mobile-first single column. Desktop: 2-column grid (dashboard left, list right).
- Spacing: 4px base scale (1=4px, 2=8px, 4=16px, 6=24px, 8=32px).
- Max-width: `1024px` centered. Padding: `px-4 md:px-6`.

## 6. Depth & Elevation
- Cards: `shadow-lg` equivalent (`0 4px 12px rgba(0,0,0,0.3)`).
- Modals: `shadow-2xl` + backdrop blur.
- No elevation on inputs/badges — flat.

## 7. Do's and Don'ts
- ✅ Use category colors consistently across chart, badges, filters.
- ✅ Show currency with `RM` prefix (Malaysian Ringgit).
- ✅ Format numbers with thousand separators.
- ❌ Don't use Inter or external fonts — system stack only.
- ❌ Don't nest cards inside cards.
- ❌ Don't use bounce/elastic easing.
- ❌ Don't use pure black — always tint (`#0f172a` not `#000`).

## 8. Responsive Behavior
- Mobile (<640px): single column, full-width form, chart above list.
- Tablet (640-1024px): 2-column, form in modal.
- Desktop (>1024px): 2-column grid, sticky dashboard.
- Touch targets: minimum 44px height.

## 9. Agent Prompt Guide
```
Build using: dark theme, bg=#0f172a, surface=#1e293b, primary=#10b981, danger=#ef4444.
Category colors: Makanan=amber, Pengangkutan=blue, Utiliti=violet, Hiburan=pink, Lain-lain=gray.
Font: system sans. Numbers: monospace. Currency: RM. No external fonts.
Layout: mobile-first single column, desktop 2-col grid (dashboard+list).
Chart: SVG donut, no library. Cards: rounded-xl with shadow.
```
