import {
  validateAmountForTier,
  validateFundingMethodForTier,
  validateModeForTier,
} from '../state/transferMachine';
import { getTierLimits } from '../config/domain';
import { Recipient, VerificationTier, FundingMethod, TransferMode } from '../types';

export interface ComplianceCheck {
  label: string;
  status: 'pass' | 'fail' | 'warn' | 'info';
  detail: string;
}

export interface IntelPacket {
  title: string;
  description: string;
  checks: ComplianceCheck[];
  manualRef: string;
  backendProcess: string;
  severity: 'normal' | 'warning' | 'critical';
}

/**
 * STAGE 1: RECIPIENT ANALYSIS
 * Analyzes the destination corridor and recipient status.
 */
export function analyzeRecipientStage(recipient: Recipient | null): IntelPacket | null {
  if (!recipient) return null;

  const isHighRisk = ['TR', 'MX', 'CN', 'RU', 'IR'].includes(recipient.country);
  const isSanctioned = ['IR', 'KP'].includes(recipient.country);

  // 1. Critical Sanctions Check
  if (isSanctioned) {
    return {
      title: 'OFAC Sanctions Block',
      description: 'Destination jurisdiction is on the FATF High-Risk list. Transaction prohibited.',
      severity: 'critical',
      checks: [
        { label: 'SDN List Scan', status: 'fail', detail: 'Match Found: Country Ban' },
        { label: 'Export Control', status: 'fail', detail: 'License Required' }
      ],
      manualRef: 'Risk Policy 1.1: Prohibited Jurisdictions',
      backendProcess: 'API: SANCTIONS_GATEWAY -> BLOCK_TXN'
    };
  }

  // 2. Enhanced Due Diligence (EDD)
  if (isHighRisk) {
    return {
      title: 'Enhanced Due Diligence (EDD)',
      description: 'Corridor requires additional screening layers. Routing switches to Correspondent Banking.',
      severity: 'warning',
      checks: [
        { label: 'PEP Screening', status: 'warn', detail: 'Running L3 Deep Search' },
        { label: 'Routing', status: 'info', detail: 'Switched to SWIFT gpi (Traceable)' }
      ],
      manualRef: 'Risk Matrix Appendix B: High Risk Corridors',
      backendProcess: 'Compliance: TRIGGER_EDD_WORKFLOW'
    };
  }

  // 3. Standard Domestic/Low-Risk
  return {
    title: 'Standard Corridor Routing',
    description: 'Recipient validated for instant/standard settlement rails.',
    severity: 'normal',
    checks: [
      { label: 'Sort Code/BIC', status: 'pass', detail: 'Checksum Verified' },
      { label: 'Account Name', status: 'pass', detail: 'Fuzzy Match > 90%' },
      { label: 'Sanctions', status: 'pass', detail: 'Clear (Last Scan: <1m)' }
    ],
    manualRef: 'Ops Manual 3.0: Standard Settlement',
    backendProcess: 'API: VALIDATE_BENEFICIARY_DETAILS'
  };
}

/**
 * STAGE 2: AMOUNT & FUNDING ANALYSIS
 * Analyzes liquidity, velocity limits, and source of funds.
 */
export function analyzeAmountStage(
  amount: number,
  mode: TransferMode,
  fundingMethod: FundingMethod,
  tier: VerificationTier,
  usage: { daily: number; monthly: number }
): IntelPacket | null {
  
  const limits = getTierLimits(tier);
  
  // -- Validation Logic --
  const amountError = validateAmountForTier(tier, amount, usage.daily, usage.monthly, false);
  const methodError = validateFundingMethodForTier(tier, fundingMethod, false);
  const modeError = validateModeForTier(tier, mode, false);

  // 1. Mode Restriction (e.g., Unverified users can't use "Receive Exact")
  if (modeError) {
    return {
      title: 'Feature Restriction',
      description: modeError.message,
      severity: 'warning',
      checks: [
        { label: 'Tier Requirement', status: 'fail', detail: 'Upgrade Required' },
        { label: 'Mode', status: 'fail', detail: mode === 'receive_exact' ? 'Target Amount' : 'Source Amount' }
      ],
      manualRef: 'Product Policy 1.0: Account Tiers',
      backendProcess: 'Frontend: LOCK_FEATURE_TOGGLE'
    };
  }

  // 2. Funding Method Restriction (e.g., Debit Card limits)
  if (methodError) {
    return {
      title: 'Funding Method Restricted',
      description: methodError.message,
      severity: 'warning',
      checks: [
        { label: 'Method Validity', status: 'fail', detail: 'Tier Restriction' },
        { label: 'Risk Check', status: 'warn', detail: 'Card Not Authorized' }
      ],
      manualRef: 'Ops Manual 5.0: Accepted Funding',
      backendProcess: 'Gateway: BLOCK_METHOD'
    };
  }

  // 3. Amount/Velocity Block (Hard Fail)
  if (amountError) {
    return {
      title: 'Velocity Limit Breach',
      description: amountError.message,
      severity: 'critical',
      checks: [
        { label: 'Tier Limit', status: 'fail', detail: `User Tier: ${tier}` },
        { label: 'Daily Utilization', status: 'fail', detail: `$${(usage.daily + amount).toFixed(2)} / $${limits.daily}` }
      ],
      manualRef: 'Risk Policy 2.2: Velocity Controls',
      backendProcess: 'Ledger: REJECT_INSUFFICIENT_LIMIT'
    };
  }

  // 4. High Value Protocol (>$10k)
  if (amount >= 10000) {
    return {
      title: 'Large Currency Transaction (CTR)',
      description: 'Amount exceeds $10k reporting threshold. FinCEN Form 104 generation queued.',
      severity: 'warning',
      checks: [
        { label: 'BSA Reporting', status: 'warn', detail: 'CTR Required' },
        { label: 'Liquidity', status: 'pass', detail: 'Reserved from Omnibus' }
      ],
      manualRef: 'Compliance Manual 4.2: Large Cash Reporting',
      backendProcess: 'Compliance: FLAG_CTR -> RISK_QUEUE'
    };
  }

  // 5. Card Processing Specifics (Valid)
  if (fundingMethod === 'debit_card') {
    return {
      title: 'Card Network Rails',
      description: 'Processing via Visa Direct / Mastercard Send. Interchange fees apply.',
      severity: 'normal',
      checks: [
        { label: '3DS Security', status: 'pass', detail: 'Challenge Required' },
        { label: 'AVS Check', status: 'info', detail: 'Pending Address Match' }
      ],
      manualRef: 'Ops Manual 5.1: Card Acquiring',
      backendProcess: 'Gateway: AUTH_CAPTURE -> 3DS_VERIFY'
    };
  }

  // 6. Standard Success
  if (amount > 0) {
    return {
      title: 'Liquidity & Funding Check',
      description: 'Transaction within limits. Funds reserved against user ledger.',
      severity: 'normal',
      checks: [
        { label: 'Daily Limit', status: 'pass', detail: `${((usage.daily + amount) / limits.daily * 100).toFixed(1)}% Used` },
        { label: 'Ledger Lock', status: 'pass', detail: `ID: RES-${Date.now().toString().slice(-6)}` }
      ],
      manualRef: 'Treasury Ops 2.1: Liquidity Management',
      backendProcess: 'Core Banking: POST_LEDGER_HOLD'
    };
  }

  return null;
}

/**
 * STAGE 3: QUOTE & REVIEW
 * Explains the FX rate construction and fees.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function analyzeReviewStage(quote: any): IntelPacket | null {
  if (!quote) return null;

  return {
    title: 'FX Pricing & Spread',
    description: 'Quote locked for 30s. Spread revenue booked to GL #4001.',
    severity: 'normal',
    checks: [
      { label: 'Mid-Market Rate', status: 'info', detail: quote.midMarketRate.toString() },
      { label: 'Client Rate', status: 'pass', detail: quote.rate.toString() },
      { label: 'Spread Capture', status: 'pass', detail: `${((quote.rate - quote.midMarketRate) / quote.midMarketRate * 100).toFixed(2)}%` }
    ],
    manualRef: 'Treasury Policy 4.0: FX Pricing Models',
    backendProcess: 'Treasury: LOCK_FX_RATE -> BOOK_SPREAD'
  };
}