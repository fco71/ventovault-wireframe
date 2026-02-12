import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Operational Inspector - Technical Deep-Dive Panel
 *
 * Shows what's happening under the hood at each step of the transaction lifecycle.
 * This is NOT a UI demo - it's a technical explanation system for investors.
 *
 * Design: Clean side panel that updates contextually based on user's location.
 * No auto-play. No blocking modals. No emojis. Modern, technical aesthetic.
 */

interface OperationalData {
  stage: string;
  title: string;
  sections: {
    label: string;
    content: string;
    type?: 'info' | 'critical' | 'technical' | 'financial';
  }[];
}

interface OperationalInspectorContextType {
  isOpen: boolean;
  currentData: OperationalData | null;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

const OperationalInspectorContext = createContext<OperationalInspectorContextType | undefined>(undefined);

export function useOperationalInspector() {
  const context = useContext(OperationalInspectorContext);
  if (!context) {
    throw new Error('useOperationalInspector must be used within OperationalInspectorProvider');
  }
  return context;
}

// Operational data for each stage - derived from moneyTrail.ts and operational manual
const OPERATIONAL_DATA: Record<string, OperationalData> = {
  '/dashboard': {
    stage: 'OVERVIEW',
    title: 'System Overview',
    sections: [
      {
        label: 'Constitutional Posture',
        content: 'VentoVault operates as a user-authorized coordination layer. We are NOT a bank, money transmitter, or custodian. We coordinate flights without owning planes.',
        type: 'info',
      },
      {
        label: 'Legal Architecture',
        content: 'Control-Not-Custody model eliminates Money Transmitter License requirements in 50 states. Partners hold funds, VentoVault holds instructions.',
        type: 'critical',
      },
      {
        label: 'Cost Structure',
        content: 'Stablecoin architecture: 1.7% + $1.50 (vs 2.4% traditional). 30% cost advantage at scale.',
        type: 'financial',
      },
    ],
  },
  '/send-recipient': {
    stage: 'STAGE 1',
    title: 'Intent Creation',
    sections: [
      {
        label: 'User Action',
        content: 'Recipient selection from verified contacts.',
        type: 'info',
      },
      {
        label: 'System Validation',
        content: 'Recipient payout details must point to regulated endpoint. System enforces Control-Not-Custody: all recipient accounts are held at licensed partners, never VentoVault.',
        type: 'technical',
      },
      {
        label: 'Risk Controls',
        content: 'Recipient verification rules, risk scoring, transaction limits. Prevents fraud (wrong recipient, mule accounts, stolen identity).',
        type: 'info',
      },
      {
        label: 'Evidence Captured',
        content: 'recipient_id, payout_method_id, country_code, verification_timestamp',
        type: 'technical',
      },
    ],
  },
  '/send-amount': {
    stage: 'STAGE 2',
    title: 'Quoting & Route Selection',
    sections: [
      {
        label: 'Route Selection Logic',
        content: 'Priority: Compliance feasibility → Reliability → Cost. System queries all settlement partners, evaluates regulatory clearance and historical success rates before considering price.',
        type: 'technical',
      },
      {
        label: 'Cost Breakdown (Example: $1,000)',
        content: 'USD → USDC: 0.2% ($2.00)\nBlockchain gas: $1.50\nUSDC → DOP: 1.5% ($15.00)\nTotal Cost: $18.50 (1.85%)\nTraditional: $24.00 (2.4%)\nSavings: 23%',
        type: 'financial',
      },
      {
        label: 'Regulatory Disclosure (FinCEN FIN-2019-G001)',
        content: 'Quote must name specific regulated partners: Collection Partner (US), Settlement Partner (blockchain), Payout Partner (DR). This disclosure is mandatory before contract formation.',
        type: 'critical',
      },
      {
        label: 'Quote Validity',
        content: 'Time-bounded contract: 30-90 seconds. Rate lock expires to prevent market risk. User must explicitly accept named partners and settlement instrument.',
        type: 'technical',
      },
      {
        label: 'Evidence Captured',
        content: 'quote_id, locked_rate, expiry_timestamp, route_policy_id, partner_ids (collection, settlement, payout)',
        type: 'technical',
      },
    ],
  },
  '/send-review': {
    stage: 'STAGE 3',
    title: 'THE CONSENT BRIDGE',
    sections: [
      {
        label: 'Critical Legal Moment',
        content: 'User authorization checkbox transfers control from VentoVault to named partners. This is the legal firewall that eliminates MTL requirements.',
        type: 'critical',
      },
      {
        label: 'Orchestration Termination',
        content: 'VentoVault role limited to delivery of instructions. Named partners assume sole responsibility for fund custody and settlement finality.',
        type: 'critical',
      },
      {
        label: 'Liability Transfer',
        content: 'Partner assumes custody risk. VentoVault accountability shifts from "outcome guarantee" to "forensic documentation" of partner execution.',
        type: 'critical',
      },
      {
        label: 'Non-VentoVault Control Gate',
        content: 'Mandatory 30-second minimum delay enforced by external oracle. Proves VentoVault cannot execute immediately → technical and temporal independence from unilateral control.',
        type: 'technical',
      },
      {
        label: 'Why This Matters',
        content: 'Control-Not-Custody = No MTL required in 50 states. Saves millions in licensing costs and state-by-state compliance burden. This is the legal moat.',
        type: 'critical',
      },
      {
        label: 'Evidence Captured',
        content: 'consent_timestamp (UTC), ip_address, consent_version, device_fingerprint → transmitted to ALL partners via ISO 20022 (pacs.008)',
        type: 'technical',
      },
    ],
  },
  '/send-success': {
    stage: 'STAGES 4-8',
    title: 'Execution & Settlement',
    sections: [
      {
        label: 'Stage 4: Funding (Regulated Entry)',
        content: 'Sender funds through licensed Collection Partner. Fiat enters system at regulated endpoint. Identity linkage becomes enforceable (who funded, from what instrument). Risk: chargebacks, stolen instruments. Control: funding method policies, step-up verification.',
        type: 'technical',
      },
      {
        label: 'Stage 5: Compliance Gating (Double-Validation)',
        content: 'Layer 1: VentoVault independent sanctions check (fuzzy/phonetic matching against OFAC/UN/EU). Transactions >$5K or high-risk corridors bypass cache for real-time API. Layer 2: Partner binding check under their regulatory program. Pre-screening protects partner licenses.',
        type: 'technical',
      },
      {
        label: 'Stage 6: Conversion + Settlement',
        content: 'Value converted to USDC → blockchain transfer → converted to destination fiat. Middle remains auditable (tx_id, timestamps, confirmations) but invisible in behavior. Risk: market movement, liquidity. Control: quote validity windows, retry rules, fallback routing.',
        type: 'technical',
      },
      {
        label: 'Stage 7: Payout (Regulated Exit)',
        content: 'Funds delivered through licensed Payout Partner. "Moment of truth" - either payout lands or product fails. Risk: payout failures kill trust. Control: partner SLAs, retries, reroutes, clear failure states.',
        type: 'technical',
      },
      {
        label: 'Stage 8: Reconciliation & Receipt',
        content: 'Receipt based on executed truth: executed rate (not quoted), executed fees, timestamps, confirmation IDs from all partners. 128-bit UUID ensures idempotency. ISO 20022 mapping ensures STP at destination bank. FATF Travel Rule compliance.',
        type: 'technical',
      },
      {
        label: 'Custody Trail (Money Trail L1)',
        content: 'NY Sender → US Collection Partner → Settlement Rails → DR Payout Partner → Recipient Bank. VentoVault never holds funds at any stage.',
        type: 'info',
      },
      {
        label: 'Failure Branches (Money Trail L3A)',
        content: 'Every failure point has defined rollback owner. Funding Failed: never enters custody. Compliance Block: stays at origin for refund. Settlement Stuck: partner holds pending resolution. Payout Failed: partner retries or refunds.',
        type: 'technical',
      },
    ],
  },
};

export function OperationalInspectorProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentData, setCurrentData] = useState<OperationalData | null>(null);
  const location = useLocation();

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Update contextual data based on location
  useEffect(() => {
    // Determine current stage based on URL and DOM
    let key = location.pathname;

    // For /send, determine substage based on DOM
    if (key === '/send') {
      const recipientCards = document.querySelector('.vv-choice-card');
      const amountInput = document.querySelector('input[inputMode="decimal"]');
      const checkbox = document.querySelector('input[type="checkbox"]');
      const successMessage = document.querySelector('.vv-panel')?.textContent?.toLowerCase().includes('transfer complete');

      if (successMessage) {
        key = '/send-success';
      } else if (checkbox) {
        key = '/send-review';
      } else if (amountInput) {
        key = '/send-amount';
      } else if (recipientCards) {
        key = '/send-recipient';
      }
    }

    const data = OPERATIONAL_DATA[key];
    if (data) {
      setCurrentData(data);
    } else {
      setCurrentData(null);
    }
  }, [location]);

  return (
    <OperationalInspectorContext.Provider
      value={{
        isOpen,
        currentData,
        toggle,
        open,
        close,
      }}
    >
      {children}
    </OperationalInspectorContext.Provider>
  );
}
