import { X, Info } from 'lucide-react';
import { useDemoMode } from '../../contexts/DemoModeContext';
import { useLocation } from 'react-router-dom';

interface Callout {
  title: string;
  sections: {
    heading: string;
    content: string;
    bullets?: string[];
  }[];
}

const DEMO_CALLOUTS: Record<string, Callout> = {
  '/dashboard': {
    title: 'Dashboard Overview',
    sections: [
      {
        heading: '🖥️ Front-End',
        content: 'Clean dashboard showing real-time balance and recent transactions',
        bullets: [
          'Balance updates via WebSocket connection',
          'Quick action buttons for common tasks',
          'Recent transactions with status indicators',
        ],
      },
      {
        heading: '🔧 Behind the Scenes',
        content: 'Continuous monitoring and validation:',
        bullets: [
          'Background sanctions screening (OFAC, UN, EU lists)',
          'Session security: JWT tokens with 30-min expiration',
          'Behavioral analytics flagging unusual access patterns',
          'Real-time balance sync from settlement partners',
        ],
      },
      {
        heading: '🛡️ Security Measures',
        content: 'Multi-layer protection:',
        bullets: [
          'IP geolocation matching',
          'Device fingerprinting for fraud detection',
          'Rate limiting on API calls',
          'Encrypted data: AES-256 at rest, TLS 1.3 in transit',
        ],
      },
      {
        heading: '🔍 VentoVault\'s Role',
        content: 'Technical agency ONLY - Control, Not Custody:',
        bullets: [
          '<span class="text-red-500">VentoVault NEVER has custody</span> of funds',
          'We see: Intent, compliance status, partner confirmations',
          'We do NOT see: Bank credentials, fund locations',
          'Role: Orchestration switchboard',
        ],
      },
    ],
  },
  '/send': {
    title: 'Send Money Flow',
    sections: [
      {
        heading: '🖥️ Front-End',
        content: 'Multi-step transfer flow with real-time validation:',
        bullets: [
          'Amount validation (min/max limits per corridor)',
          'IBAN/account validation with format checking',
          'Real-time FX rates (updated every 30 seconds)',
          'Recipient name fuzzy matching for typo detection',
        ],
      },
      {
        heading: '🔧 Behind the Scenes - Intent Capture',
        content: '<span class="text-blue-500">Step 1 of 10: INTENT</span>',
        bullets: [
          'User intent logged with 128-bit UUID (idempotency)',
          'Intent data: Sender, recipient, amount, currency pair',
          'Pre-screening: sanctions lists, velocity checks',
          'No funds movement yet - data collection only',
          'Intent expires in 15 minutes if not progressed',
        ],
      },
      {
        heading: '🔍 Validation Checks (Layer 1)',
        content: 'VentoVault Safety Net pre-screening:',
        bullets: [
          '<span class="text-yellow-500">Sanctions screening:</span> OFAC, UN, EU lists',
          '<span class="text-yellow-500">Fuzzy matching:</span> 85%+ threshold for name similarity',
          '<span class="text-yellow-500">Velocity checks:</span> Max 5 transfers/day for new users',
          '<span class="text-yellow-500">Country risk:</span> High-risk corridors flagged',
          'If any check fails: Transaction rejected before quote',
        ],
      },
      {
        heading: '💰 Stablecoin Advantage',
        content: 'Why stablecoin rails beat traditional banking:',
        bullets: [
          '<span class="text-green-500">Cost: 1.7% + $1.50</span> vs 2.4% traditional',
          '<span class="text-green-500">Speed: <2 hours</span> vs 1-2 days',
          'Blockchain transfer nearly free (just gas fee)',
          'Sweet spot: $100-$2,000 transactions',
        ],
      },
    ],
  },
  '/transactions': {
    title: 'Transaction History',
    sections: [
      {
        heading: '🖥️ Front-End',
        content: 'Complete transaction audit trail:',
        bullets: [
          'All 10 internal steps visible to user as 4 simple stages',
          'Real-time status updates via WebSocket',
          'Filterable by date, status, amount, recipient',
          'Downloadable receipts for each transaction',
        ],
      },
      {
        heading: '🔧 Internal 10-Step Process',
        content: 'What actually happens:',
        bullets: [
          '1. Intent & Quoting: System generates time-bound contract',
          '2. The Consent Bridge: User authorizes partner chain',
          '3. Double-Validation: Layer 1 (VV) + Layer 2 (Partners)',
          '4. Regulated Entry: Collection Partner collects funds',
          '5. Layer 2 Compliance: Partner independent validation',
          '6. Stablecoin Conversion: USD → USDC on-ramp',
          '7. Blockchain Transfer: USDC moves cross-border ($1.50 gas)',
          '8. Off-Ramp: USDC → Local currency',
          '9. Regulated Exit: Payout Partner delivers funds',
          '10. Executed Truth: Immutable receipt generated',
        ],
      },
      {
        heading: '🛡️ Compliance & Audit',
        content: 'Every transaction creates forensic proof:',
        bullets: [
          'ISO 20022 compliant messaging',
          'FATF Travel Rule (Recommendation 16) compliance',
          'Immutable audit trail (5-year retention)',
          'Partner confirmation IDs for reconciliation',
        ],
      },
    ],
  },
  '/settings': {
    title: 'Account Settings',
    sections: [
      {
        heading: '🖥️ Current State',
        content: 'Basic account management (Phase 1):',
        bullets: [
          'Email/password authentication',
          'Profile information',
          'Notification preferences',
        ],
      },
      {
        heading: '🔮 Production Requirements',
        content: '<span class="text-red-500">Full KYC/AML will be required:</span>',
        bullets: [
          '<span class="text-yellow-500">Tier 1 (Low Risk):</span> Name, DOB, address verification',
          '<span class="text-yellow-500">Tier 2 (Medium):</span> Gov ID, proof of address',
          '<span class="text-yellow-500">Tier 3 (High/Large $):</span> Enhanced DD, source of funds',
          'Biometric verification for high-value transactions',
          'Continuous PEP/sanctions screening',
        ],
      },
      {
        heading: '🔧 Compliance Layers',
        content: 'Double-validation system:',
        bullets: [
          '<span class="text-blue-500">Layer 1:</span> VentoVault Safety Net (fuzzy matching 85%+)',
          '<span class="text-blue-500">Layer 2:</span> Partner validation (their own rules)',
          'Both must pass before funds move',
          'Protects against regulatory ambiguity',
        ],
      },
    ],
  },
};

export default function DemoModeOverlay() {
  const { isDemoMode, toggleDemoMode } = useDemoMode();
  const location = useLocation();

  if (!isDemoMode) return null;

  const callout = DEMO_CALLOUTS[location.pathname];

  if (!callout) return null;

  return (
    <>
      {/* Semi-transparent overlay */}
      <div className="fixed inset-0 bg-black/30 z-40 pointer-events-none" />

      {/* Callout panel */}
      <div className="fixed right-0 top-0 bottom-0 w-[450px] bg-slate-900 text-white shadow-2xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 border-b border-blue-500/30">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-blue-400">{callout.title}</h2>
            <button
              onClick={toggleDemoMode}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-2 text-sm text-slate-400 flex items-center gap-2">
            <Info className="w-4 h-4" />
            <span>Investor Presentation Mode</span>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {callout.sections.map((section, idx) => (
            <div key={idx} className="space-y-3">
              <h3 className="text-base font-semibold text-blue-300 flex items-center gap-2">
                <span className="text-blue-500">▸</span>
                {section.heading}
              </h3>
              <p
                className="text-sm text-slate-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
              {section.bullets && section.bullets.length > 0 && (
                <ul className="space-y-2 ml-4">
                  {section.bullets.map((bullet, bIdx) => (
                    <li
                      key={bIdx}
                      className="text-sm text-slate-400 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: `• ${bullet}` }}
                    />
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 border-t border-blue-500/30">
          <div className="text-xs text-slate-500 text-center">
            Navigate pages to see different callouts
          </div>
        </div>
      </div>
    </>
  );
}
