import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

/**
 * Operational Inspector Context
 *
 * Connects the demo/presentation system to the actual app state.
 * Components report their current stage, and demo components display
 * contextual information based on the real application state.
 */

export type AppStage =
  | 'recipient'  // Selecting recipient
  | 'amount'     // Entering amount and getting quote
  | 'review'     // Reviewing and accepting quote
  | 'success';   // Transaction submitted/processing

interface OperationalInspectorContextType {
  isOpen: boolean;
  currentStage: AppStage | null;
  toggle: () => void;
  open: () => void;
  close: () => void;
  reportStage: (stage: AppStage) => void;  // Components call this to report their state
}

const OperationalInspectorContext = createContext<OperationalInspectorContextType | undefined>(undefined);

export function useOperationalInspector() {
  const context = useContext(OperationalInspectorContext);
  if (!context) {
    throw new Error('useOperationalInspector must be used within OperationalInspectorProvider');
  }
  return context;
}

export function OperationalInspectorProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStage, setCurrentStage] = useState<AppStage | null>(null);

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const reportStage = useCallback((stage: AppStage) => {
    setCurrentStage(stage);
  }, []);

  return (
    <OperationalInspectorContext.Provider
      value={{
        isOpen,
        currentStage,
        toggle,
        open,
        close,
        reportStage,
      }}
    >
      {children}
    </OperationalInspectorContext.Provider>
  );
}
