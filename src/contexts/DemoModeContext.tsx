import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

/**
 * Demo Mode Context
 *
 * Powers the interactive walkthrough / presentation mode for VentoVault.
 * When active, the demo overlay displays contextual information that tracks
 * the real application state — no DOM inspection required.
 *
 * Each screen reports its current stage via reportStage(), and the demo
 * components read currentStage to show the right educational content.
 */

export type AppStage =
  | 'recipient'  // User is selecting a recipient
  | 'amount'     // User is entering amount / getting a quote
  | 'review'     // User is reviewing the quote before authorising
  | 'success';   // Transaction submitted and processing

interface DemoModeContextType {
  isOpen: boolean;
  currentStage: AppStage | null;
  toggle: () => void;
  open: () => void;
  close: () => void;
  reportStage: (stage: AppStage) => void;
}

const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined);

export function useDemoMode() {
  const ctx = useContext(DemoModeContext);
  if (!ctx) throw new Error('useDemoMode must be used within DemoModeProvider');
  return ctx;
}

export function DemoModeProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStage, setCurrentStage] = useState<AppStage | null>(null);

  const toggle      = useCallback(() => setIsOpen(p => !p), []);
  const open        = useCallback(() => setIsOpen(true), []);
  const close       = useCallback(() => setIsOpen(false), []);
  const reportStage = useCallback((stage: AppStage) => setCurrentStage(stage), []);

  return (
    <DemoModeContext.Provider value={{ isOpen, currentStage, toggle, open, close, reportStage }}>
      {children}
    </DemoModeContext.Provider>
  );
}
