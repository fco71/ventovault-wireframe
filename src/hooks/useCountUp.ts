import { useEffect, useState } from 'react';
import { useSpring, useMotionValue } from 'framer-motion';

export function useCountUp(
  target: number,
  duration: number = 1000,
  delay: number = 0
) {
  const [displayValue, setDisplayValue] = useState(0);
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    stiffness: 50,
    damping: 20,
    duration: duration,
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      motionValue.set(target);
    }, delay);

    return () => clearTimeout(timeout);
  }, [target, delay, motionValue]);

  useEffect(() => {
    const unsubscribe = spring.on('change', (latest) => {
      setDisplayValue(latest);
    });

    return () => unsubscribe();
  }, [spring]);

  return displayValue;
}
