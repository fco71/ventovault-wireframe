import { useEffect } from 'react';
import { useDemoMode } from '../contexts/DemoModeContext';

interface CalloutConfig {
  target: string;
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'mount' | 'manual';
  delay?: number;
  data?: Record<string, any>;
}

export function useDemoCallout(config: CalloutConfig) {
  const { isDemoMode, showCallout } = useDemoMode();

  useEffect(() => {
    if (!isDemoMode) return;
    if (config.trigger === 'manual') return;

    const timer = setTimeout(() => {
      showCallout({
        target: config.target,
        title: config.title,
        content: config.content,
        placement: config.placement || 'bottom',
        data: config.data,
      });
    }, config.delay || 500);

    return () => clearTimeout(timer);
  }, [isDemoMode, config, showCallout]);

  const trigger = (overrideData?: Record<string, any>) => {
    if (!isDemoMode) return;

    showCallout({
      target: config.target,
      title: config.title,
      content: config.content,
      placement: config.placement || 'bottom',
      data: overrideData || config.data,
    });
  };

  return { trigger };
}
