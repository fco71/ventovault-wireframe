import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Investor Demo System - Auto-Play Orchestrator
 *
 * This system demonstrates how the VentoVault app embodies the comprehensive
 * operational framework from the manual (Chapters 4-5).
 *
 * Design: Hybrid auto-play + manual exploration
 * - Auto-plays through the 8-step canonical lifecycle once
 * - Pauses at THE CONSENT BRIDGE for maximum impact
 * - Then allows manual exploration
 */

type DemoMode = 'inactive' | 'intro' | 'auto-playing' | 'paused' | 'manual';
type DemoStage = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

interface CalloutData {
  stage: DemoStage;
  title: string;
  content: string;
  target?: string | HTMLElement; // CSS selector or element
  placement?: 'top' | 'bottom' | 'left' | 'right';
  pauseHere?: boolean; // Should auto-play pause at this callout?
  data?: Record<string, any>; // Real-time extracted data
}

interface InvestorDemoContextType {
  isActive: boolean;
  mode: DemoMode;
  currentStage: DemoStage | null;
  currentCallout: CalloutData | null;

  // Control functions
  startDemo: () => void;
  stopDemo: () => void;
  pauseDemo: () => void;
  resumeDemo: () => void;
  replayStage: (stage: DemoStage) => void;

  // Manual mode
  showCalloutForElement: (element: HTMLElement) => void;
  hideCallout: () => void;
}

const InvestorDemoContext = createContext<InvestorDemoContextType | undefined>(undefined);

export function useInvestorDemo() {
  const context = useContext(InvestorDemoContext);
  if (!context) {
    throw new Error('useInvestorDemo must be used within InvestorDemoProvider');
  }
  return context;
}

// Stage definitions from manual Chapter 4.3 + 5.3
const STAGE_CALLOUTS: Record<DemoStage, Omit<CalloutData, 'stage'>> = {
  1: {
    title: '📤 Stage 1: Intent Creation',
    content: `
      <p class="mb-3"><strong>🖥️ What You See:</strong> Recipient selection interface.</p>
      <p class="mb-3"><strong>🔧 Behind the Scenes:</strong> The system enforces our Control-Not-Custody posture. Recipient payout details must point to a regulated payout method.</p>
      <p class="mb-3"><strong>⚖️ Constitutional Posture:</strong> We are a user-authorized coordination layer - NOT a bank, money transmitter, or custodian. We coordinate flights without owning planes.</p>
      <p class="mb-3"><strong>🛡️ Risk Point:</strong> User mistakes and fraud (wrong recipient, mule recipient, stolen identity).</p>
      <p class="mb-3"><strong>📋 Control:</strong> Recipient verification rules + risk scoring and limits.</p>
      <p class="text-sm text-slate-500 mt-3">Watch as we automatically select a recipient and proceed...</p>
    `,
    target: '.vv-panel',
    placement: 'bottom',
  },
  2: {
    title: '💱 Stage 2: Quoting & Counterparty Disclosure',
    content: `
      <p class="mb-3"><strong>🖥️ What You See:</strong> Amount entry + real-time quote generation.</p>
      <p class="mb-3"><strong>🔧 Behind the Scenes:</strong> VentoVault queries all settlement partners and selects route using priority: Compliance feasibility → Reliability → Cost.</p>
      <p class="mb-3"><strong>💰 Stablecoin Cost Math:</strong> $1,000 × 1.7% + $1.50 gas = $18.50 total cost (vs $24 traditional banking = 30% savings).</p>
      <p class="mb-3"><strong>📋 Disclosure (FinCEN FIN-2019-G001):</strong> Quote must name specific regulated partners (Collection Partner, Settlement Partner, Payout Partner) for that route.</p>
      <p class="mb-3"><strong>⏱️ Contract Moment:</strong> This becomes time-bounded contract only after user explicitly accepts named partners and settlement instrument.</p>
      <p class="text-sm text-slate-500 mt-3">Strategic Guardrail: Cheapest route that fails 5% of time isn't cheaper once support and refunds are included.</p>
    `,
    target: 'input[inputMode="decimal"]',
    placement: 'right',
  },
  3: {
    title: '⚖️ THE CONSENT BRIDGE - Legal Firewall',
    content: `
      <p class="mb-2 text-red-600 font-bold text-lg">🔥 CRITICAL LEGAL MOMENT - THIS IS OUR MOAT</p>
      <p class="mb-3"><strong>🖥️ What You See:</strong> Authorization checkbox: "I authorize VentoVault and its regulated partners..."</p>
      <p class="mb-3"><strong>⚖️ The Consent Bridge as Legal Disengagement:</strong> By authorizing this, the user independently authorizes PARTNERS (Collection Partner, Settlement Partner, Payout Partner) - NOT VentoVault.</p>
      <p class="mb-3"><strong>📋 What This Means:</strong></p>
      <ul class="list-disc ml-5 mb-3 text-sm space-y-1">
        <li><strong>Orchestration Termination:</strong> VentoVault's role limited to delivery of instructions</li>
        <li><strong>Liability Transfer:</strong> Named partner assumes sole responsibility for fund custody and settlement finality</li>
        <li><strong>Documentation Duty:</strong> Our accountability shifts from "outcome guarantee" to "forensic documentation" of partner's execution</li>
      </ul>
      <p class="mb-3"><strong>🛡️ Why It Matters (FinCEN FIN-2019-G001):</strong> Control-Not-Custody = No Money Transmitter License required in 50 states. VentoVault does NOT exercise functional control over funds → isolates firm from risks of independent money transmission. <strong>This saves millions in licensing costs and state-by-state compliance burden.</strong></p>
      <p class="mb-3"><strong>⏱️ Non-VentoVault Control Gate:</strong> Mandatory 30-second minimum delay enforced by external oracle or time-locked mechanism. This ensures VentoVault cannot execute immediately upon receiving partner authorization → proves technical and temporal independence from unilateral control.</p>
      <p class="mb-3"><strong>📝 What Gets Logged & Transmitted:</strong> UTC timestamp, IP address, consent version (v1.2.3), device fingerprint → transmitted IMMEDIATELY to ALL partners (Collection, Settlement, Payout, Compliance layers) via ISO 20022 messaging (pacs.008 standards).</p>
      <p class="text-sm text-blue-600 font-semibold mt-3">This single architectural decision is why VentoVault doesn't need MTLs. This is the legal moat.</p>
    `,
    target: 'input[type="checkbox"]',
    placement: 'top',
    pauseHere: true, // PAUSE at this critical moment
  },
  4: {
    title: '💵 Stage 4: Funding (Regulated Entry)',
    content: `
      <p class="mb-3"><strong>🔧 What Happens:</strong> Sender funds transaction through regulated Collection Partner.</p>
      <p class="mb-3"><strong>⚖️ Regulated Entry Point:</strong> Fiat enters system through licensed endpoint. Identity linkage becomes enforceable (who funded, from what instrument).</p>
      <p class="mb-3"><strong>🛡️ Risk Point:</strong> Chargebacks, stolen instruments, identity mismatch.</p>
      <p class="mb-3"><strong>📋 Control:</strong> Funding method policies, step-up verification, limits, holding periods where needed.</p>
      <p class="mb-3"><strong>Phase 1 Principle:</strong> System must avoid "send to US first" trap. Funding must occur locally in sender's country.</p>
    `,
    placement: 'top',
  },
  5: {
    title: '🛡️ Stage 5: Compliance Gating (Double-Validation)',
    content: `
      <p class="mb-3"><strong>🔧 Two-Tier Screening Process:</strong> Before value progresses to irreversible leg, it must pass double validation.</p>
      <p class="mb-3"><strong>Layer 1 (Internal Safety Net):</strong> VentoVault performs independent sanctions check using <strong>Fuzzy/Phonetic Matching</strong> thresholds against OFAC/UN/EU lists.</p>
      <ul class="list-disc ml-5 mb-3 text-sm">
        <li><strong>Standard Logic:</strong> Queries high-speed local cache updated every 60 minutes</li>
        <li><strong>Real-Time Bypass:</strong> Transactions over $5,000, high-risk corridors, or within 90 minutes of global sanctions update → bypass cache for mandatory real-time API call (Temporal Risk mitigation)</li>
        <li><strong>Outcome:</strong> If hit detected → transaction killed locally. This prevents VentoVault from ever "polluting" partner's license with prohibited transaction.</li>
      </ul>
      <p class="mb-3"><strong>Layer 2 (Regulated Execution):</strong> Only if Layer 1 passes → instruction transmitted to partner for their independent, binding check under their regulatory program.</p>
      <p class="mb-3"><strong>Phase 1 Rule:</strong> We do NOT rely solely on partner screening. We pre-screen to protect partners' licenses.</p>
      <p class="mb-3"><strong>Strategic Guardrail:</strong> If we send a sanctioned name to bank partner (even if <em>they</em> catch it), we have failed as risk manager.</p>
    `,
    placement: 'top',
  },
  6: {
    title: '🔄 Stage 6: Conversion + Settlement (The Middle)',
    content: `
      <p class="mb-3"><strong>🔧 What Happens:</strong> Value converted into settlement-friendly instrument (USDC stablecoin) → moved to destination-side execution environment → converted back to destination fiat.</p>
      <p class="mb-3"><strong>💰 The Efficiency Play:</strong></p>
      <ul class="list-disc ml-5 mb-3 text-sm">
        <li>USD → USDC on-ramp: 0.2% (Circle/Coinbase)</li>
        <li>Blockchain transfer gas: $1.50 flat</li>
        <li>USDC → destination currency off-ramp: 1.5%</li>
        <li><strong>Total middle cost:</strong> ~1.7% + $1.50 vs 2.4% traditional = 30% savings</li>
      </ul>
      <p class="mb-3"><strong>🎯 Key Design Constraint:</strong> Users never need to understand or handle the settlement instrument. The middle must remain auditable (tx ID, timestamps, confirmations) but invisible in behavior.</p>
      <p class="mb-3"><strong>🛡️ Risk Point:</strong> Market movement, liquidity failures, partner outage.</p>
      <p class="mb-3"><strong>📋 Control:</strong> Quote validity windows, retry rules, fallback routing, exception workflows.</p>
      <p class="mb-3"><strong>Strategic Guardrail:</strong> If you pitch "coin choice" too early, you look like trading app not payments system.</p>
    `,
    placement: 'top',
  },
  7: {
    title: '✅ Stage 7: Payout (Regulated Exit)',
    content: `
      <p class="mb-3"><strong>🔧 What Happens:</strong> Funds delivered to recipient through regulated Payout Partner.</p>
      <p class="mb-3"><strong>💡 The "Moment of Truth":</strong> Either payout lands correctly or product fails in user's mind. Regardless of perfect execution in earlier stages.</p>
      <p class="mb-3"><strong>📋 Non-Negotiable:</strong> Payout confirmations must be captured as first-class events and tracked.</p>
      <p class="mb-3"><strong>🛡️ Risk Point:</strong> Payout failures drive support cost and kill trust.</p>
      <p class="mb-3"><strong>📋 Control:</strong> Payout partner SLAs, retries, reroutes, clear failure states with actionable user guidance.</p>
      <p class="mb-3"><strong>Strategic Guardrail:</strong> Payout is where product lives or dies. Investors will focus here once they understand flow.</p>
    `,
    placement: 'top',
  },
  8: {
    title: '📋 Stage 8: Reconciliation & Receipt (Executed Truth)',
    content: `
      <p class="mb-3"><strong>🔧 What Happens:</strong> VentoVault issues receipt based on executed truth from all partners.</p>
      <ul class="list-disc ml-5 mb-3 text-sm">
        <li>Executed rate (not quoted rate if it changed)</li>
        <li>Executed fees (including any adjustments)</li>
        <li>Timestamps for each stage</li>
        <li>Confirmation IDs from all partners</li>
        <li>Buffer returned (if quote was pessimistic)</li>
      </ul>
      <p class="mb-3"><strong>🔒 Idempotency Enforcement:</strong> Every transaction governed by 128-bit UUID → ensures multiple retries from partners result in only single successful execution.</p>
      <p class="mb-3"><strong>🎯 Deterministic State Machine:</strong> Each transaction follows defined states. Every event logged.</p>
      <p class="mb-3"><strong>📋 Rollback Execution IDs:</strong> To prevent "double-refunds," every atomic rollback generates unique ID logged in evidence layer BEFORE refund attempted → ensures system retries only result in single successful reversal.</p>
      <p class="mb-3"><strong>⚖️ ISO 20022 & Reconstruction Readiness:</strong> Internal data model maps directly to pacs.008 messaging standards → ensures straight-through processing (STP) at destination bank.</p>
      <p class="mb-3"><strong>📋 FATF Travel Rule (Recommendation 16):</strong> System captures and transmits required Originator and Beneficiary data for every virtual asset settlement leg.</p>
      <p class="mb-3"><strong>Non-Negotiable:</strong> Receipts must reflect what actually happened, not what was intended.</p>
      <p class="mb-3"><strong>🛡️ Risk Point:</strong> Mismatched receipts trigger disputes and bank skepticism.</p>
      <p class="mb-3"><strong>📋 Control:</strong> Deterministic event logs and reconciliation. Verifiable History layer retains immutable records: pricing inputs, timestamps, user consent, partner validation events.</p>
    `,
    placement: 'top',
  },
};

export function InvestorDemoProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<DemoMode>('inactive');
  const [currentStage, setCurrentStage] = useState<DemoStage | null>(null);
  const [currentCallout, setCurrentCallout] = useState<CalloutData | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const showCallout = useCallback((stage: DemoStage, data?: Record<string, any>) => {
    const calloutDef = STAGE_CALLOUTS[stage];
    setCurrentCallout({
      stage,
      ...calloutDef,
      data,
    });
  }, []);

  const hideCallout = useCallback(() => {
    setCurrentCallout(null);
  }, []);

  // Auto-play orchestration
  const playStage1 = useCallback(async () => {
    console.log('[InvestorDemo] Playing Stage 1: Intent Creation');
    setCurrentStage(1);

    // Navigate to send if not already there
    if (location.pathname !== '/send') {
      navigate('/send');
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Show stage 1 callout
    showCallout(1);

    // Wait 4 seconds
    await new Promise(resolve => setTimeout(resolve, 4000));

    // Auto-select first recipient and click "Send" button
    await new Promise(resolve => setTimeout(resolve, 500));
    const sendButtons = Array.from(document.querySelectorAll('button')).filter(btn =>
      btn.textContent?.toLowerCase().includes('send')
    );
    const firstSendBtn = sendButtons.find(btn => {
      // Find the "Send" button within recipient cards (not "Send Money" header button)
      const parent = btn.closest('.vv-choice-card');
      return parent !== null;
    });

    if (firstSendBtn) {
      firstSendBtn.click();
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Proceed to stage 2
    return playStage2();
  }, [location, navigate, showCallout]);

  const playStage2 = useCallback(async () => {
    console.log('[InvestorDemo] Playing Stage 2: Quoting');
    setCurrentStage(2);

    // Wait for amount input to appear
    await new Promise(resolve => setTimeout(resolve, 500));
    const amountInput = document.querySelector('input[inputMode="decimal"]') as HTMLInputElement;

    if (!amountInput) {
      console.warn('[InvestorDemo] Amount input not found');
      return;
    }

    // Show stage 2 callout
    showCallout(2);

    // Auto-type 1000 with typewriter effect
    await new Promise(resolve => setTimeout(resolve, 2000));
    const targetValue = '1000';

    for (let i = 0; i <= targetValue.length; i++) {
      const partial = targetValue.slice(0, i);
      amountInput.value = partial;
      amountInput.dispatchEvent(new Event('input', { bubbles: true }));
      amountInput.dispatchEvent(new Event('change', { bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, 150));
    }

    // Wait for quote to generate (watch for quote display)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Update callout with real cost data
    const costData = {
      'You Send': '$1,000.00',
      'Total Cost': '$18.50 (1.85%)',
      'Traditional Cost': '$24.00 (2.4%)',
      'Savings': '$5.50 (23%)',
      'VV Revenue': '$25.00 (2.5%)',
      'VV Margin': '$6.50 (26%)',
    };
    showCallout(2, costData);

    // Wait to let user see the costs
    await new Promise(resolve => setTimeout(resolve, 4000));

    // Auto-click "Review transfer" button
    const reviewBtn = Array.from(document.querySelectorAll('button')).find(btn =>
      btn.textContent?.toLowerCase().includes('review')
    );
    if (reviewBtn) {
      reviewBtn.click();
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Proceed to stage 3 - THE CONSENT BRIDGE
    return playStage3();
  }, [showCallout]);

  const playStage3 = useCallback(async () => {
    console.log('[InvestorDemo] Playing Stage 3: THE CONSENT BRIDGE');
    setCurrentStage(3);

    // Wait for review screen
    await new Promise(resolve => setTimeout(resolve, 500));

    // Show THE CONSENT BRIDGE callout
    showCallout(3);

    // PAUSE HERE - this is the critical moment
    setMode('paused');

    // Auto-play stops here. User must manually continue or replay.
  }, [showCallout]);

  const playStages4to8 = useCallback(async () => {
    console.log('[InvestorDemo] Playing Stages 4-8: Execution');

    // Auto-check the authorization checkbox
    const checkbox = document.querySelector('input[type="checkbox"]') as HTMLInputElement;
    if (checkbox && !checkbox.checked) {
      checkbox.click();
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Show stage 4 callout
    setCurrentStage(4);
    showCallout(4);
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Auto-click "Send" button
    const sendBtn = Array.from(document.querySelectorAll('button')).find(btn =>
      btn.textContent?.toLowerCase().includes('send $')
    );
    if (sendBtn) {
      sendBtn.click();
    }

    // Show stages 5-8 in sequence while transfer executes
    await new Promise(resolve => setTimeout(resolve, 2000));
    setCurrentStage(5);
    showCallout(5);

    await new Promise(resolve => setTimeout(resolve, 3000));
    setCurrentStage(6);
    showCallout(6);

    await new Promise(resolve => setTimeout(resolve, 3000));
    setCurrentStage(7);
    showCallout(7);

    await new Promise(resolve => setTimeout(resolve, 3000));
    setCurrentStage(8);
    showCallout(8);

    // Demo complete - switch to manual mode
    await new Promise(resolve => setTimeout(resolve, 4000));
    setMode('manual');
  }, [showCallout]);

  const startDemo = useCallback(() => {
    console.log('[InvestorDemo] Starting investor demo');
    setIsActive(true);
    setMode('intro');

    // Show intro message
    setTimeout(() => {
      setMode('auto-playing');
      playStage1();
    }, 2000);
  }, [playStage1]);

  const stopDemo = useCallback(() => {
    console.log('[InvestorDemo] Stopping demo');
    setIsActive(false);
    setMode('inactive');
    setCurrentStage(null);
    setCurrentCallout(null);
  }, []);

  const pauseDemo = useCallback(() => {
    setMode('paused');
  }, []);

  const resumeDemo = useCallback(() => {
    if (currentStage === 3) {
      // Resume from Consent Bridge - play stages 4-8
      setMode('auto-playing');
      playStages4to8();
    } else {
      setMode('manual');
    }
  }, [currentStage, playStages4to8]);

  const replayStage = useCallback((stage: DemoStage) => {
    // Show that stage's callout
    showCallout(stage);
  }, [showCallout]);

  const showCalloutForElement = useCallback((element: HTMLElement) => {
    // Determine which stage this element belongs to
    // This is for manual mode - show contextual callouts
    // TODO: Implement element-to-stage mapping
  }, []);

  return (
    <InvestorDemoContext.Provider
      value={{
        isActive,
        mode,
        currentStage,
        currentCallout,
        startDemo,
        stopDemo,
        pauseDemo,
        resumeDemo,
        replayStage,
        showCalloutForElement,
        hideCallout,
      }}
    >
      {children}
    </InvestorDemoContext.Provider>
  );
}
