import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { cn } from '../../utils/cn';

interface FxTickerProps {
  pair: string;
  baseRate: number;
  precision?: number;
  label?: string;
  className?: string;
}

export default function FxTicker({
  pair,
  baseRate,
  precision = 4,
  label = 'Exchange rate',
  className,
}: FxTickerProps) {
  const [rate, setRate] = useState(baseRate);
  const [delta, setDelta] = useState(0);
  const [direction, setDirection] = useState<'up' | 'down' | 'flat'>('flat');

  const spark = useMemo(
    () => Array.from({ length: 16 }, () => Math.floor(Math.random() * 14) + 6),
    []
  );

  useEffect(() => {
    setRate(baseRate);
    setDelta(0);
    setDirection('flat');
  }, [baseRate]);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const interval = setInterval(() => {
      setRate((prev) => {
        const jitter = (Math.random() - 0.5) * 0.06;
        const next = Number((prev + jitter).toFixed(precision));
        const change = next - prev;
        setDelta(change);
        setDirection(change > 0 ? 'up' : change < 0 ? 'down' : 'flat');
        return next;
      });
    }, prefersReducedMotion ? 6000 : 2200);

    return () => clearInterval(interval);
  }, [precision]);

  const tone =
    direction === 'up'
      ? 'text-success-600 bg-success-50'
      : direction === 'down'
        ? 'text-error-600 bg-error-50'
        : 'text-gray-600 bg-white/70';

  const ArrowIcon = direction === 'down' ? ArrowDownRight : ArrowUpRight;
  const deltaDisplay = `${direction === 'down' ? '' : '+'}${delta.toFixed(4)}`;

  return (
    <div className={cn('rounded-2xl bg-white/70 border border-white/60 p-4', className)}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-gray-500">{label}</div>
          <div className="text-lg font-semibold text-gray-900 font-display mt-1">{pair}</div>
        </div>
        <div className={cn('px-3 py-1 rounded-full text-xs font-semibold', tone)}>
          {direction === 'flat' ? 'Stable' : deltaDisplay}
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <div className="text-3xl font-semibold text-gray-900 font-display tabular-nums">
            {rate.toFixed(precision)}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
            <ArrowIcon className="w-3 h-3" />
            <span>Last 5 min trend</span>
          </div>
        </div>

        <div className="flex items-end gap-1 h-12">
          {spark.map((height, index) => (
            <div
              key={`${pair}-${index}`}
              className={cn(
                'w-1.5 rounded-full transition-all',
                direction === 'down' ? 'bg-error-200' : 'bg-primary-200'
              )}
              style={{ height }}
            />
          ))}
        </div>
      </div>

      <div className="relative mt-4 h-9 rounded-2xl overflow-hidden border border-white/70 bg-white/70">
        <div
          className={cn(
            'absolute inset-0',
            direction === 'up'
              ? 'bg-success-100/70'
              : direction === 'down'
                ? 'bg-error-100/60'
                : 'bg-primary-50/70'
          )}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-70"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
        />
        <div className="relative z-10 h-full flex items-center justify-between px-3 text-xs text-gray-600">
          <span>Rate stability</span>
          <span>Fair pricing</span>
        </div>
      </div>
    </div>
  );
}
