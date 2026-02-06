import { ReactNode } from 'react';
import { HTMLMotionProps, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '../../utils/cn';

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'className'> {
  variant?: 'default' | 'elevated' | 'glass' | 'interactive';
  hover3d?: boolean;
  glow?: boolean;
  children: ReactNode;
  className?: string;
}

export default function Card({
  variant = 'default',
  hover3d = false,
  glow = false,
  children,
  className,
  ...props
}: CardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7.5deg', '-7.5deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7.5deg', '7.5deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hover3d) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const baseStyles = 'card';

  const variantStyles = {
    default: '',
    elevated: 'hover:shadow-[0_30px_70px_-45px_rgba(15,23,42,0.55)] hover:-translate-y-1',
    glass: 'bg-white/60 border-white/40 backdrop-blur-2xl',
    interactive: 'cursor-pointer hover:shadow-[0_30px_70px_-45px_rgba(15,23,42,0.55)]',
  };

  const glowStyle = glow ? 'hover:shadow-glow' : '';

  return (
    <motion.div
      className={cn(baseStyles, variantStyles[variant], glowStyle, className)}
      style={hover3d ? { rotateX, rotateY, transformStyle: 'preserve-3d' } : undefined}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={variant === 'interactive' ? { scale: 1.02 } : undefined}
      whileTap={variant === 'interactive' ? { scale: 0.98 } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
}
