import { useMemo } from 'react';
import { useOperationalInspector } from '../contexts/OperationalInspectorContext';
import { 
  analyzeAmountStage, 
  analyzeRecipientStage, 
  analyzeReviewStage, 
  IntelPacket 
} from '../logic/operationalRules';
import { 
  VerificationTier, 
  Recipient, 
  FundingMethod, 
  TransferMode, 
  Quote 
} from '../types';

interface UseOperationalIntelProps {
  currentRecipient: Recipient | null;
  amount: number;
  mode: TransferMode;
  fundingMethod: FundingMethod;
  quote: Quote | null;
  userTier: VerificationTier;
  usageStats: { daily: number; monthly: number };
}

export function useOperationalIntel({
  currentRecipient,
  amount,
  mode,
  fundingMethod,
  quote,
  userTier,
  usageStats
}: UseOperationalIntelProps) {
  const { currentStage, isOpen } = useOperationalInspector();

  const intel = useMemo<IntelPacket | null>(() => {
    // If the inspector is closed, don't calculate anything to save performance
    if (!isOpen) return null;

    switch (currentStage) {
      case 'recipient':
        return analyzeRecipientStage(currentRecipient);
      
      case 'amount':
        return analyzeAmountStage(amount, mode, fundingMethod, userTier, usageStats);
      
      case 'review':
        return analyzeReviewStage(quote);
      
      case 'success':
        return {
          title: 'Final Settlement',
          description: 'Transaction committed to immutable ledger. Receipt generated.',
          severity: 'normal',
          checks: [
            { label: 'Ledger', status: 'pass', detail: 'Committed' },
            { label: 'Notifications', status: 'pass', detail: 'Email/Push Sent' }
          ],
          manualRef: 'Ops Manual 8.0: Settlement & Recon',
          backendProcess: 'Core: COMMIT_TXN -> EMIT_RECEIPT'
        };

      default:
        return null;
    }
  }, [
    currentStage, 
    isOpen, 
    currentRecipient, 
    amount, 
    mode, 
    fundingMethod, 
    quote, 
    userTier, 
    usageStats
  ]);

  return intel;
}