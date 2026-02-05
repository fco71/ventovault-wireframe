import { cn } from '../../utils/cn';

interface TimelineItem {
  title: string;
  subtitle?: string;
  time?: string;
  tone?: 'primary' | 'success' | 'warning' | 'neutral';
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

const toneStyles = {
  primary: 'bg-primary-500',
  success: 'bg-success-500',
  warning: 'bg-accent-500',
  neutral: 'bg-gray-300',
};

export default function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {items.map((item, index) => (
        <div key={`${item.title}-${index}`} className="flex items-start gap-4">
          <div className="flex flex-col items-center">
            <div className={cn('w-3 h-3 rounded-full', toneStyles[item.tone || 'neutral'])} />
            {index < items.length - 1 && (
              <div className="w-px flex-1 bg-white/60 mt-2" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-4">
              <div className="font-semibold text-gray-900">{item.title}</div>
              {item.time && <span className="text-xs text-gray-500">{item.time}</span>}
            </div>
            {item.subtitle && <p className="text-sm text-gray-600 mt-1">{item.subtitle}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
