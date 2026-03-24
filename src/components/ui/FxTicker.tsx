import { cn } from '../../utils/cn';

interface FxTickerProps {
  pair: string;
  baseRate: number;
  precision?: number;
  label?: string;
  className?: string;
}

/**
 * FxTicker — displays a quoted exchange rate.
 *
 * Rates are fixed at quote time and locked for 45 seconds (per spec § 3.1).
 * This is NOT a live market feed — no random jitter or polling.
 * The rate updates only when a new quote is fetched.
 */
export default function FxTicker({
  pair,
  baseRate,
  precision = 4,
  label = 'Quoted rate',
  className,
}: FxTickerProps) {
  return (
    <div className={cn('rounded-2xl bg-white/70 border border-white/60 p-4', className)}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-gray-500">{label}</div>
          <div className="text-lg font-semibold text-gray-900 font-display mt-1">{pair}</div>
        </div>
        <div className="px-3 py-1 rounded-full text-xs font-semibold text-gray-600 bg-white/70">
          Locked · 45s
        </div>
      </div>

      <div className="mt-4">
        <div className="text-3xl font-semibold text-gray-900 font-display tabular-nums">
          {baseRate.toFixed(precision)}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Rate guaranteed for this quote window
        </div>
      </div>

      <div className="mt-4 h-9 rounded-2xl border border-white/70 bg-primary-50/70 flex items-center justify-between px-3 text-xs text-gray-600">
        <span>Mid-market spread applied</span>
        <span>Fair pricing</span>
      </div>
    </div>
  );
}
