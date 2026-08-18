import type { CategoryStat } from '../types';

interface Props {
  stats: CategoryStat[];
  total: number;
}

export function CategoryChart({ stats, total }: Props) {
  if (stats.length === 0) {
    return (
      <div className="text-center py-8 text-text-soft text-sm">
        Tiada perbelanjaan untuk dipaparkan
      </div>
    );
  }

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-4">
      <svg width="180" height="180" viewBox="0 0 180 180" role="img" aria-label={`Carta pecahan perbelanjaan. Jumlah: RM${total.toFixed(2)}`}>
        <circle cx="90" cy="90" r={radius} fill="none" stroke="var(--color-surface-alt)" strokeWidth="24" />
        {stats.map((s) => {
          const dash = (s.percentage / 100) * circumference;
          const seg = (
            <circle
              key={s.category}
              cx="90" cy="90" r={radius} fill="none"
              stroke={s.color} strokeWidth="24"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 90 90)"
            >
              <title>{`${s.category}: RM${s.total.toFixed(2)} (${s.percentage}%)`}</title>
            </circle>
          );
          offset += dash;
          return seg;
        })}
        <text x="90" y="85" textAnchor="middle" fill="var(--color-text)" fontSize="11" className="font-medium">Jumlah</text>
        <text x="90" y="102" textAnchor="middle" fill="var(--color-text)" fontSize="16" fontWeight="700" fontFamily="ui-monospace, monospace">
          {`RM${total.toFixed(2)}`}
        </text>
      </svg>
      <div className="flex flex-wrap gap-2 justify-center">
        {stats.map((s) => (
          <div key={s.category} className="flex items-center gap-1.5 text-xs">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} aria-hidden="true" />
            <span className="text-text-soft">{s.category}</span>
            <span className="text-text font-medium" style={{ fontFamily: 'ui-monospace, monospace' }}>{s.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
