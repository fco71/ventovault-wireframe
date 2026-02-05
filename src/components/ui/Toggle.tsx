import { cn } from '../../utils/cn';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: 'sm' | 'md';
}

export default function Toggle({ checked, onChange, size = 'md' }: ToggleProps) {
  const sizeStyles = {
    sm: {
      wrapper: 'w-10 h-6',
      knob: 'w-4 h-4',
      translate: 'translate-x-4',
    },
    md: {
      wrapper: 'w-12 h-7',
      knob: 'w-5 h-5',
      translate: 'translate-x-5',
    },
  };

  const styles = sizeStyles[size];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex items-center rounded-full border border-white/70 transition-all duration-200',
        styles.wrapper,
        checked ? 'bg-primary-500 shadow-glow' : 'bg-white/70'
      )}
    >
      <span
        className={cn(
          'absolute left-1 top-1 rounded-full bg-white shadow-md transition-transform duration-200',
          styles.knob,
          checked ? styles.translate : 'translate-x-0'
        )}
      />
    </button>
  );
}
