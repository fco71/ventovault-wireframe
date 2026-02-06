import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      'inline-flex items-center justify-center gap-2 font-semibold rounded-xl',
      'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'relative overflow-hidden shadow-[0_10px_30px_-18px_rgba(15,23,42,0.5)]',
      'hover:-translate-y-0.5 active:scale-[0.98] ripple-effect btn-enhanced'
    );

    const variantStyles = {
      primary: 'bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 text-white hover:shadow-[0_16px_40px_-16px_rgba(6,182,212,0.7)] focus:ring-primary-400',
      secondary: 'bg-white/70 text-gray-900 border border-white/70 backdrop-blur hover:bg-white focus:ring-gray-400',
      outline: 'border-2 border-primary-400/60 text-primary-700 hover:bg-primary-50/80 focus:ring-primary-400',
      ghost: 'text-gray-700 hover:bg-white/70 focus:ring-gray-400',
      danger: 'bg-gradient-to-r from-error-500 to-error-600 text-white hover:shadow-lg focus:ring-error-500',
      gradient: 'bg-gradient-to-r from-gradient-start via-gradient-mid to-gradient-end text-white hover:shadow-[0_16px_40px_-16px_rgba(6,182,212,0.7)] focus:ring-primary-400',
    };

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <motion.button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || loading}
        whileTap={{ scale: 0.98 }}
        whileHover={{ y: -2 }}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {!loading && icon && iconPosition === 'left' && icon}
        {children}
        {!loading && icon && iconPosition === 'right' && icon}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
