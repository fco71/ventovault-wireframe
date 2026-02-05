import { ReactNode, HTMLAttributes } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '../../utils/cn';

interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
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

  const baseStyles = 'rounded-2xl p-6 transition-all duration-200';

  const variantStyles = {
    default: 'bg-white shadow-soft',
    elevated: 'bg-white shadow-soft hover:shadow-xl hover:-translate-y-1',
    glass: 'backdrop-blur-xl bg-white/80 border border-white/20 shadow-xl',
    interactive: 'bg-white shadow-soft hover:shadow-xl cursor-pointer',
  };

  const glowStyle = glow ? 'hover:shadow-glow' : '';

  return (
    <motion.div
      className={cn(baseStyles, variantStyles[variant], glowStyle, className)}
      style={hover3d ? { rotateX, rotateY, transformStyle: 'preserve-3d' } : {}}
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
