import { createContext, useContext, useState, ReactNode } from 'react';

interface DemoModeContextType {
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
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
  const [currentStep, setCurrentStep] = useState(0);

  const toggleDemoMode = () => {
    setIsDemoMode(!isDemoMode);
    if (!isDemoMode) {
      setCurrentStep(0);
    }
  };

  return (
    <DemoModeContext.Provider value={{ isDemoMode, toggleDemoMode, currentStep, setCurrentStep }}>
      {children}
    </DemoModeContext.Provider>
  );
}
