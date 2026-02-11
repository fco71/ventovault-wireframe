import { useEffect, useState } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { useDemoMode } from '../../contexts/DemoModeContext';
import { useLocation } from 'react-router-dom';

interface TourStep {
  target: string; // CSS selector
  title: string;
  content: string;
  placement: 'top' | 'bottom' | 'left' | 'right';
  highlight?: boolean;
}

const TOUR_STEPS: Record<string, TourStep[]> = {
  '/dashboard': [
    {
      target: '[data-tour="balance-card"]',
      title: '💰 Balance Overview',
      content: 'Real-time balance synced via WebSocket. Behind the scenes: Continuous sanctions screening (OFAC/EU lists) and behavioral analytics.',
      placement: 'bottom',
      highlight: true,
    },
    {
      target: '[data-tour="send-button"]',
      title: '📤 Send Money',
      content: 'Click here to start a transfer. Our stablecoin model costs 1.7% + $1.50 vs 2.4% traditional banking rails. Speed: <2 hours.',
      placement: 'bottom',
      highlight: true,
    },
    {
      target: '[data-tour="transactions"]',
      title: '📊 Transaction History',
      content: 'Every transaction creates an immutable audit trail. ISO 20022 compliant, FATF Travel Rule (Rec 16) compliant, 5-year retention.',
      placement: 'top',
      highlight: true,
    },
  ],
  '/send': [
    {
      target: '[data-tour="amount-input"]',
      title: '💵 Enter Amount',
      content: '🖥️ FRONT-END: Amount validation with min/max limits. 🔧 BEHIND: Step 1 of 10 - INTENT captured with 128-bit UUID for idempotency.',
      placement: 'right',
      highlight: true,
    },
    {
      target: '[data-tour="recipient-input"]',
      title: '👤 Recipient Details',
      content: '🔍 VALIDATION: Fuzzy name matching (85%+ threshold), IBAN format checking. 🛡️ SANCTIONS: Pre-screening against OFAC, UN, EU lists.',
      placement: 'right',
      highlight: true,
    },
    {
      target: '[data-tour="exchange-rate"]',
      title: '💱 Exchange Rate',
      content: 'Real-time FX rates updated every 30 seconds. Stablecoin advantage: 0.2% on-ramp + $1.50 blockchain gas vs 0.8% traditional FX spread.',
      placement: 'left',
      highlight: true,
    },
    {
      target: '[data-tour="fee-breakdown"]',
      title: '💰 Fee Breakdown',
      content: 'TOTAL: 1.7% + $1.50 = Collection (0.5%) + On-ramp (0.2%) + Gas ($1.50) + Off-ramp (0.4%) + Payout (0.3%) + Compliance (0.3%)',
      placement: 'top',
      highlight: true,
    },
    {
      target: '[data-tour="consent-button"]',
      title: '⚖️ The Consent Bridge (LEGAL FIREWALL)',
      content: '🔥 CRITICAL: User independently authorizes partners (NOT VentoVault). This is FinCEN FIN-2019-G001 compliance - we\'re software, not money transmitter.',
      placement: 'top',
      highlight: true,
    },
  ],
};

export default function GuidedTour() {
  const { isDemoMode, toggleDemoMode } = useDemoMode();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [calloutPosition, setCalloutPosition] = useState({ top: 0, left: 0 });

  const steps = TOUR_STEPS[location.pathname] || [];
  const step = steps[currentStep];

  useEffect(() => {
    if (!isDemoMode || !step) return;

    const element = document.querySelector(step.target) as HTMLElement;
    if (!element) return;

    setTargetElement(element);

    // Calculate callout position based on element position and placement
    const rect = element.getBoundingClientRect();
    let top = 0, left = 0;

    switch (step.placement) {
      case 'top':
        top = rect.top - 200;
        left = rect.left + rect.width / 2 - 200;
        break;
      case 'bottom':
        top = rect.bottom + 20;
        left = rect.left + rect.width / 2 - 200;
        break;
      case 'left':
        top = rect.top + rect.height / 2 - 100;
        left = rect.left - 420;
        break;
      case 'right':
        top = rect.top + rect.height / 2 - 100;
        left = rect.right + 20;
        break;
    }

    setCalloutPosition({ top, left });

    // Scroll element into view
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Add highlight
    if (step.highlight) {
      element.style.position = 'relative';
      element.style.zIndex = '60';
      element.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 0 99999px rgba(0, 0, 0, 0.5)';
      element.style.borderRadius = '12px';
      element.style.transition = 'all 0.3s ease';
    }

    return () => {
      if (element && step.highlight) {
        element.style.position = '';
        element.style.zIndex = '';
        element.style.boxShadow = '';
        element.style.borderRadius = '';
      }
    };
  }, [isDemoMode, currentStep, step]);

  if (!isDemoMode || steps.length === 0) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    toggleDemoMode();
  };

  if (!step) return null;

  return (
    <>
      {/* Callout bubble */}
      <div
        className="fixed z-[70] w-[400px] bg-white rounded-2xl shadow-2xl border-2 border-blue-500 animate-in fade-in zoom-in duration-300"
        style={{
          top: `${calloutPosition.top}px`,
          left: `${calloutPosition.left}px`,
        }}
      >
        {/* Arrow indicator based on placement */}
        {step.placement === 'bottom' && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[12px] border-b-blue-500" />
        )}
        {step.placement === 'top' && (
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-blue-500" />
        )}
        {step.placement === 'right' && (
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-r-[12px] border-r-blue-500" />
        )}
        {step.placement === 'left' && (
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-l-[12px] border-l-blue-500" />
        )}

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900 pr-8">{step.title}</h3>
            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <p className="text-sm text-slate-700 leading-relaxed mb-6">
            {step.content}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500 font-medium">
              Step {currentStep + 1} of {steps.length}
            </div>

            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <button
                  onClick={handlePrev}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1"
              >
                {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                {currentStep < steps.length - 1 && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 px-6 pb-4">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentStep
                  ? 'w-8 bg-blue-600'
                  : idx < currentStep
                  ? 'w-1.5 bg-blue-400'
                  : 'w-1.5 bg-slate-300'
              }`}
            />
          ))}
        </div>
      </div>
    </>
  );
}
