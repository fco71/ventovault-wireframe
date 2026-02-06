import { ReactNode, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'enhanced' | 'dark';
  hover?: boolean;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className, variant = 'default', hover = true, ...props }, ref) => {
    const variantStyles = {
      default: 'backdrop-blur-xl bg-white/70 border border-white/40',
      enhanced: 'backdrop-blur-2xl bg-white/60 border border-white/30 shadow-xl',
      dark: 'backdrop-blur-xl bg-gray-900/60 border border-gray-700/30',
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          'relative overflow-hidden rounded-2xl p-6 transition-all duration-300',
          variantStyles[variant],
          hover && 'hover:shadow-[0_25px_60px_-45px_rgba(15,23,42,0.45)] hover:-translate-y-1',
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={hover ? { scale: 1.02 } : undefined}
        {...props}
      >
        {/* Inner shine effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </motion.div>
    );
  }
);

GlassCard.displayName = 'GlassCard';

export default GlassCard;
