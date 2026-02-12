import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface CalloutData {
  target: string | HTMLElement;
  title: string;
  content: string;
  placement: 'top' | 'bottom' | 'left' | 'right';
  data?: Record<string, any>;
  autoAdvanceOn?: string; // Event to listen for to auto-advance
}

interface FlowStep {
  id: string;
  callout: CalloutData;
  waitFor?: string; // Wait for specific element to appear
  extractData?: (element: HTMLElement) => Record<string, any>; // Extract real data from DOM
}

interface DemoFlow {
  name: string;
  steps: FlowStep[];
}

interface DemoModeContextType {
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  currentCallout: CalloutData | null;
  currentFlow: string | null;
  currentStepIndex: number;
  startFlow: (flowName: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  hideCallout: () => void;
  showCallout: (callout: CalloutData) => void;
  registerInteraction: (element: HTMLElement, eventType: string) => void;
}

const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined);

export function useDemoMode() {
  const context = useContext(DemoModeContext);
  if (!context) {
    throw new Error('useDemoMode must be used within DemoModeProvider');
  }
  return context;
}

// Flow definitions - these describe the complete user journeys
const DEMO_FLOWS: Record<string, DemoFlow> = {
  dashboard: {
    name: 'Dashboard Overview',
    steps: [
      {
        id: 'balance-welcome',
        callout: {
          target: '.vv-kpi-card:first-child',
          title: '💰 Welcome to VentoVault',
          content: `
            <p class="mb-3"><strong>🖥️ What You See:</strong> Real-time balance and transaction stats.</p>
            <p class="mb-3"><strong>🔧 Behind the Scenes:</strong> Continuous sanctions screening (OFAC, UN, EU), behavioral analytics, WebSocket sync with settlement partners.</p>
            <p class="mb-3"><strong>🛡️ Control-Not-Custody:</strong> We NEVER touch your money. We're software orchestration only.</p>
            <p class="text-sm text-slate-500">👇 Click "Send Money" to see how transfers work</p>
          `,
          placement: 'bottom',
          autoAdvanceOn: 'click:send',
        },
      },
    ],
  },
  sendFlow: {
    name: 'Send Money Flow',
    steps: [
      {
        id: 'send-welcome',
        callout: {
          target: 'body',
          title: '📤 Starting a Transfer',
          content: `
            <p class="mb-3"><strong>🎯 What You'll Do:</strong> Enter amount → Select recipient → Review → Authorize.</p>
            <p class="mb-3"><strong>💰 Stablecoin Advantage:</strong> Cost: 1.7% + $1.50 vs 2.4% traditional. Speed: <2 hours vs 1-2 days.</p>
            <p class="mb-3"><strong>🔧 Behind the Scenes:</strong> We log your request with a 128-bit UUID for idempotency. Sanctions pre-screening starts immediately.</p>
            <p class="text-sm text-slate-500">👇 Enter an amount to see real-time cost calculations</p>
          `,
          placement: 'top',
          autoAdvanceOn: 'input:amount', // Advance when user types in amount field
        },
        extractData: () => ({
          'Current Page': 'Send Money',
          'Flow': 'International Transfer',
        }),
      },
      {
        id: 'amount-entered',
        waitFor: 'input[type="number"]',
        callout: {
          target: 'input[type="number"]',
          title: '💵 Amount & Cost Calculation',
          content: `
            <p class="mb-3"><strong>🖥️ What You See:</strong> Input field with real-time validation (min/max limits per corridor).</p>
            <p class="mb-3"><strong>🔧 Behind the Scenes:</strong> Intent logged with UUID. Pre-screening starts: OFAC/UN/EU sanctions lists, velocity checks (max 5/day for new users), country risk assessment.</p>
            <p class="mb-3"><strong>💰 Stablecoin Math:</strong> Cost = Amount × 1.7% + $1.50 gas fee. See REAL numbers below updating as you type!</p>
            <p class="text-sm text-slate-500">👇 Select a recipient or click to next field</p>
          `,
          placement: 'right',
          autoAdvanceOn: 'input:recipient', // Advance when user focuses recipient field
        },
        extractData: (element) => {
          const input = element as HTMLInputElement;
          const amount = parseFloat(input.value) || 0;
          if (amount > 0) {
            const cost = amount * 0.017 + 1.50;
            const revenue = amount * 0.025;
            const margin = revenue - cost;
            return {
              'You Send': `$${amount.toFixed(2)}`,
              'Total Cost': `$${cost.toFixed(2)} (${((cost/amount)*100).toFixed(2)}%)`,
              'VV Revenue': `$${revenue.toFixed(2)} (2.5%)`,
              'VV Margin': `$${margin.toFixed(2)}`,
            };
          }
          return {};
        },
      },
      {
        id: 'recipient-select',
        waitFor: 'input[placeholder*="recipient" i], select',
        callout: {
          target: 'input[placeholder*="recipient" i], select',
          title: '👤 Recipient Validation',
          content: `
            <p class="mb-3"><strong>🖥️ What You See:</strong> Recipient selector or input field.</p>
            <p class="mb-3"><strong>🔧 Behind the Scenes:</strong> Fuzzy name matching (85%+ threshold) against sanctions lists. IBAN/account format validation. Recipient country risk assessment using FATF grey/blacklists.</p>
            <p class="mb-3"><strong>🛡️ Layer 1 Screening:</strong> VentoVault Safety Net checks sender + recipient against OFAC/UN/EU lists BEFORE showing quote.</p>
            <p class="mb-3"><strong>📋 FATF Travel Rule:</strong> Full sender/recipient data prepared for transmission (Recommendation 16 compliance).</p>
            <p class="text-sm text-slate-500">👇 Click Review/Continue to generate quote</p>
          `,
          placement: 'right',
          autoAdvanceOn: 'click:review', // Advance when user clicks Review/Continue button
        },
      },
      {
        id: 'review-quote',
        waitFor: 'button:contains("Review"), button:contains("Continue"), button:contains("Next")',
        callout: {
          target: 'button:contains("Review"), button:contains("Continue"), button:contains("Next")',
          title: '💱 Quote Generation & Rate Lock',
          content: `
            <p class="mb-3"><strong>🖥️ What You'll See:</strong> Final quote showing exact amounts, FX rate, fees breakdown, total delivery amount.</p>
            <p class="mb-3"><strong>🔧 Behind the Scenes:</strong> We query all 5 partners simultaneously: Collection Partner ($2.50 fee), On-Ramp Provider ($1.00), Blockchain Gas ($1.50), Off-Ramp Provider ($2.00), Payout Partner ($1.50), Compliance Layer ($1.50). We pick the cheapest path.</p>
            <p class="mb-3"><strong>⏱️ Rate Lock:</strong> FX rate locked for 90 seconds. Rate is guaranteed ceiling - if we find better rate during execution, you get savings.</p>
            <p class="mb-3"><strong>🎯 Quote = Contract:</strong> Time-bounded agreement. Pessimistic by design (we overestimate costs slightly for safety).</p>
            <p class="text-sm text-slate-500">👇 Click Confirm/Authorize to reach the Consent Bridge</p>
          `,
          placement: 'top',
          autoAdvanceOn: 'click:confirm', // Advance when user clicks Confirm/Authorize
        },
      },
      {
        id: 'consent-bridge',
        waitFor: 'button:contains("Confirm"), button:contains("Authorize"), button:contains("Send")',
        callout: {
          target: 'button:contains("Confirm"), button:contains("Authorize"), button:contains("Send")',
          title: '⚖️ THE CONSENT BRIDGE - Legal Firewall',
          content: `
            <p class="mb-3 text-red-600 font-bold text-base">🔥 CRITICAL LEGAL MOMENT - THIS IS OUR MOAT</p>
            <p class="mb-3"><strong>🖥️ What You See:</strong> Consent/authorization button. Clicking confirms your independent authorization of our partners.</p>
            <p class="mb-3"><strong>⚖️ Legal Architecture (FinCEN FIN-2019-G001):</strong> You are independently authorizing PARTNERS (Collection Partner, Settlement Partner, Payout Partner) - NOT VentoVault. We are software orchestration only. This is the legal disengagement point.</p>
            <p class="mb-3"><strong>🛡️ Why This Matters:</strong> Control-Not-Custody = No Money Transmitter License required in 50 states. We never have custody or control of funds. Saves us millions in licensing costs and state-by-state compliance burden.</p>
            <p class="mb-3"><strong>📝 What Gets Logged:</strong> UTC timestamp, IP address, consent version (v1.2.3), device fingerprint. Transmitted IMMEDIATELY to ALL partners via ISO 20022 messaging (Collection, Settlement, Payout, Compliance layers).</p>
            <p class="mb-3"><strong>⏱️ Next Step:</strong> 30-second temporal independence window. Partners verify consent independently. This delay proves VentoVault doesn't have immediate control over fund movement.</p>
            <p class="text-sm text-slate-500 mt-3">Click to authorize and watch the transaction execute through our audit trail</p>
          `,
          placement: 'top',
        },
      },
    ],
  },
  transactionView: {
    name: 'Transaction History',
    steps: [
      {
        id: 'transaction-list',
        callout: {
          target: '.vv-panel, [class*="transaction"]',
          title: '📊 Complete Audit Trail',
          content: `
            <p class="mb-3"><strong>🔧 10-Step Internal Process:</strong></p>
            <ol class="list-decimal ml-4 mb-3 text-sm space-y-1">
              <li>Intent & Quoting</li>
              <li>The Consent Bridge (legal firewall)</li>
              <li>Double-Validation (Layer 1 VV + Layer 2 Partners)</li>
              <li>Regulated Entry (Collection Partner)</li>
              <li>Layer 2 Compliance (Partner validation)</li>
              <li>Stablecoin Conversion (USD → USDC)</li>
              <li>Blockchain Transfer ($1.50 gas)</li>
              <li>Off-Ramp (USDC → Local currency)</li>
              <li>Regulated Exit (Payout Partner)</li>
              <li>Executed Truth (Immutable receipt)</li>
            </ol>
            <p class="mb-2"><strong>📋 Compliance:</strong> ISO 20022 messaging, FATF Travel Rule (Rec 16), 5-year retention.</p>
          `,
          placement: 'bottom',
        },
      },
    ],
  },
};

export function DemoModeProvider({ children }: { children: ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [currentFlow, setCurrentFlow] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentCallout, setCurrentCallout] = useState<CalloutData | null>(null);
  const location = useLocation();

  // Auto-start flow based on current route
  useEffect(() => {
    if (!isDemoMode) return;

    const path = location.pathname;
    if (path === '/dashboard') {
      startFlow('dashboard');
    } else if (path === '/send') {
      startFlow('sendFlow');
    } else if (path === '/transactions') {
      startFlow('transactionView');
    }
  }, [isDemoMode, location.pathname]);

  const startFlow = useCallback((flowName: string) => {
    const flow = DEMO_FLOWS[flowName];
    if (!flow) return;

    setCurrentFlow(flowName);
    setCurrentStepIndex(0);

    // Show first step
    const firstStep = flow.steps[0];
    showStepCallout(firstStep);
  }, []);

  const showStepCallout = useCallback((step: FlowStep) => {
    // Wait for element if needed
    if (step.waitFor) {
      const checkElement = setInterval(() => {
        const element = document.querySelector(step.waitFor!);
        if (element) {
          clearInterval(checkElement);
          displayCallout(step, element as HTMLElement);
        }
      }, 100);

      // Timeout after 5 seconds
      setTimeout(() => clearInterval(checkElement), 5000);
    } else {
      displayCallout(step);
    }
  }, []);

  const displayCallout = useCallback((step: FlowStep, element?: HTMLElement) => {
    let target = step.callout.target;
    if (typeof target === 'string') {
      const found = document.querySelector(target);
      if (!found && element) {
        target = element;
      } else if (found) {
        target = found as HTMLElement;
      }
    }

    // Extract real data if function provided
    let data = step.callout.data || {};
    if (step.extractData && element) {
      data = { ...data, ...step.extractData(element) };
    }

    setCurrentCallout({
      ...step.callout,
      target,
      data,
    });
  }, []);

  const nextStep = useCallback(() => {
    if (!currentFlow) return;

    const flow = DEMO_FLOWS[currentFlow];
    const nextIndex = currentStepIndex + 1;

    if (nextIndex < flow.steps.length) {
      setCurrentStepIndex(nextIndex);
      showStepCallout(flow.steps[nextIndex]);
    } else {
      // Flow complete
      setCurrentCallout(null);
    }
  }, [currentFlow, currentStepIndex, showStepCallout]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      const newIndex = currentStepIndex - 1;
      setCurrentStepIndex(newIndex);
      if (currentFlow) {
        showStepCallout(DEMO_FLOWS[currentFlow].steps[newIndex]);
      }
    }
  }, [currentStepIndex, currentFlow, showStepCallout]);

  const toggleDemoMode = useCallback(() => {
    const newMode = !isDemoMode;
    setIsDemoMode(newMode);
    if (!newMode) {
      setCurrentCallout(null);
      setCurrentFlow(null);
      setCurrentStepIndex(0);
    }
  }, [isDemoMode]);

  const hideCallout = useCallback(() => {
    setCurrentCallout(null);
  }, []);

  const showCallout = useCallback((callout: CalloutData) => {
    setCurrentCallout(callout);
  }, []);

  const registerInteraction = useCallback((element: HTMLElement, eventType: string) => {
    if (!isDemoMode || !currentFlow) return;

    console.log('[Demo Mode] Interaction:', eventType, element);

    // Auto-advance if this interaction matches the step's autoAdvanceOn
    const flow = DEMO_FLOWS[currentFlow];
    const currentStep = flow.steps[currentStepIndex];

    if (currentStep.callout.autoAdvanceOn) {
      const [expectedEvent, expectedTarget] = currentStep.callout.autoAdvanceOn.split(':');

      if (eventType === expectedEvent) {
        // Check if element matches the expected target
        let matches = false;

        if (expectedTarget) {
          // Check text content, class name, placeholder, type attribute
          const elementText = element.textContent?.toLowerCase() || '';
          const elementClass = element.className?.toLowerCase() || '';
          const elementPlaceholder = (element as HTMLInputElement).placeholder?.toLowerCase() || '';
          const elementType = (element as HTMLInputElement).type?.toLowerCase() || '';
          const targetLower = expectedTarget.toLowerCase();

          matches = elementText.includes(targetLower) ||
                   elementClass.includes(targetLower) ||
                   elementPlaceholder.includes(targetLower) ||
                   elementType.includes(targetLower);
        } else {
          matches = true;
        }

        if (matches) {
          // For input events, advance immediately (user is actively typing)
          // For click events, small delay to let the click complete
          const delay = eventType === 'input' ? 800 : 1500;
          setTimeout(() => nextStep(), delay);
        }
      }
    }
  }, [isDemoMode, currentFlow, currentStepIndex, nextStep]);

  // Global click observer
  useEffect(() => {
    if (!isDemoMode) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      registerInteraction(target, 'click');
    };

    const handleInput = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA') {
        registerInteraction(target, 'input');

        // Re-extract data on input change
        if (currentFlow) {
          const flow = DEMO_FLOWS[currentFlow];
          const step = flow.steps[currentStepIndex];
          if (step.extractData) {
            displayCallout(step, target);
          }
        }
      }
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('input', handleInput);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('input', handleInput);
    };
  }, [isDemoMode, registerInteraction, currentFlow, currentStepIndex, displayCallout]);

  return (
    <DemoModeContext.Provider
      value={{
        isDemoMode,
        toggleDemoMode,
        currentCallout,
        currentFlow,
        currentStepIndex,
        startFlow,
        nextStep,
        prevStep,
        hideCallout,
        showCallout,
        registerInteraction,
      }}
    >
      {children}
    </DemoModeContext.Provider>
  );
}
