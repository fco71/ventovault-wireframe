import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface CalloutData {
  target: string;
  title: string;
  content: string;
  placement: 'top' | 'bottom' | 'left' | 'right';
  data?: Record<string, any>;
}

interface DemoModeContextType {
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  currentCallout: CalloutData | null;
  showCallout: (callout: CalloutData) => void;
  hideCallout: () => void;
  registerInteraction: (key: string, data?: any) => void;
}

const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined);

export function useDemoMode() {
  const context = useContext(DemoModeContext);
  if (!context) {
    throw new Error('useDemoMode must be used within DemoModeProvider');
  }
  return context;
}

export function DemoModeProvider({ children }: { children: ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [currentCallout, setCurrentCallout] = useState<CalloutData | null>(null);

  const toggleDemoMode = useCallback(() => {
    const newMode = !isDemoMode;
    setIsDemoMode(newMode);
    if (!newMode) {
      setCurrentCallout(null);
    }
  }, [isDemoMode]);

  const showCallout = useCallback((callout: CalloutData) => {
    if (isDemoMode) {
      setCurrentCallout(callout);
    }
  }, [isDemoMode]);

  const hideCallout = useCallback(() => {
    setCurrentCallout(null);
  }, []);

  const registerInteraction = useCallback((key: string, data?: any) => {
    if (!isDemoMode) return;

    // Log interaction for analytics/debugging
    console.log('[Demo Mode] Interaction:', key, data);
  }, [isDemoMode]);

  return (
    <DemoModeContext.Provider
      value={{
        isDemoMode,
        toggleDemoMode,
        currentCallout,
        showCallout,
        hideCallout,
        registerInteraction,
      }}
    >
      {children}
    </DemoModeContext.Provider>
  );
}
