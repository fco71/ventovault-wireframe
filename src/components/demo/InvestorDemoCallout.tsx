import { useEffect, useState, useRef } from 'react';
import { X, Play, Pause, RotateCcw } from 'lucide-react';
import { useInvestorDemo } from '../../contexts/InvestorDemoContext';

/**
 * Investor Demo Callout Component
 *
 * Displays floating callouts that explain the operational procedures
 * from the VentoVault manual at each stage of the transfer flow.
 *
 * Design: Non-blocking, informative, investor-focused
 */

export default function InvestorDemoCallout() {
  const { isActive, mode, currentCallout, hideCallout, resumeDemo, pauseDemo, currentStage } = useInvestorDemo();
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [calloutPosition, setCalloutPosition] = useState({ top: 0, left: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const calloutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !currentCallout) {
      // Clean up highlighting
      if (targetElement) {
        targetElement.style.outline = '';
        targetElement.style.outlineOffset = '';
        targetElement.style.position = '';
        targetElement.style.zIndex = '';
      }
      setIsVisible(false);
      setTargetElement(null);
      return;
    }

    // Find target element
    let element: HTMLElement | null = null;
    if (typeof currentCallout.target === 'string') {
      element = document.querySelector(currentCallout.target);
    } else if (currentCallout.target) {
      element = currentCallout.target;
    }

    // If no specific target, default to body
    if (!element) {
      element = document.body;
    }

    // Clean up previous target
    if (targetElement && targetElement !== element) {
      targetElement.style.outline = '';
      targetElement.style.outlineOffset = '';
      targetElement.style.position = '';
      targetElement.style.zIndex = '';
    }

    setTargetElement(element);

    // Scroll element into view
    if (element !== document.body) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    }

    // Position callout after scroll settles
    setTimeout(() => {
      if (!element) return;

      // Add subtle highlight to target
      if (element !== document.body) {
        element.style.position = 'relative';
        element.style.zIndex = '10';
        element.style.outline = '3px solid rgba(59, 130, 246, 0.6)';
        element.style.outlineOffset = '4px';
        element.style.borderRadius = '8px';
      }

      // Calculate callout position
      const rect = element.getBoundingClientRect();
      const calloutWidth = 450;
      const calloutHeight = calloutRef.current?.offsetHeight || 400;
      const padding = 24;

      let top = 0, left = 0;
      const placement = currentCallout.placement || 'right';

      switch (placement) {
        case 'top':
          top = rect.top + window.scrollY - calloutHeight - padding;
          left = rect.left + window.scrollX + rect.width / 2 - calloutWidth / 2;
          break;
        case 'bottom':
          top = rect.bottom + window.scrollY + padding;
          left = rect.left + window.scrollX + rect.width / 2 - calloutWidth / 2;
          break;
        case 'left':
          top = rect.top + window.scrollY + rect.height / 2 - calloutHeight / 2;
          left = rect.left + window.scrollX - calloutWidth - padding;
          break;
        case 'right':
        default:
          top = rect.top + window.scrollY + rect.height / 2 - calloutHeight / 2;
          left = rect.right + window.scrollX + padding;
          break;
      }

      // Keep within viewport
      const maxLeft = window.innerWidth - calloutWidth - 20;
      const minLeft = 20;
      left = Math.max(minLeft, Math.min(left, maxLeft));

      const minTop = window.scrollY + 20;
      const maxTop = window.scrollY + window.innerHeight - calloutHeight - 20;
      top = Math.max(minTop, Math.min(top, maxTop));

      setCalloutPosition({ top, left });
      setIsVisible(true);
    }, 400);

    return () => {
      if (element && element !== document.body) {
        element.style.outline = '';
        element.style.outlineOffset = '';
        element.style.position = '';
        element.style.zIndex = '';
      }
    };
  }, [isActive, currentCallout, targetElement]);

  if (!isActive || !currentCallout || !isVisible) return null;

  const hasData = currentCallout.data && Object.keys(currentCallout.data).length > 0;
  const isPaused = mode === 'paused';
  const isPlaying = mode === 'auto-playing';

  // Stage color coding
  const getStageColor = () => {
    if (currentCallout.stage === 3) return 'border-red-400 bg-red-50/10'; // Consent Bridge = red
    if (currentCallout.stage >= 4) return 'border-green-400 bg-green-50/10'; // Execution = green
    return 'border-blue-400'; // Default = blue
  };

  return (
    <div
      ref={calloutRef}
      className={`fixed z-50 w-[450px] transition-all duration-300 ease-out ${getStageColor()}`}
      style={{
        top: `${calloutPosition.top}px`,
        left: `${calloutPosition.left}px`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-8px)',
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
    >
      {/* Floating callout card */}
      <div className="bg-white rounded-xl shadow-2xl border-2 overflow-hidden backdrop-blur-sm">
        {/* Arrow indicators based on placement */}
        {currentCallout.placement === 'bottom' && (
          <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[12px] border-b-blue-400" />
        )}
        {currentCallout.placement === 'top' && (
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-blue-400" />
        )}
        {currentCallout.placement === 'right' && (
          <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-r-[12px] border-r-blue-400" />
        )}
        {currentCallout.placement === 'left' && (
          <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-l-[12px] border-l-blue-400" />
        )}

        {/* Gradient header bar - different color for Consent Bridge */}
        <div className={`h-1 ${currentCallout.stage === 3 ? 'bg-gradient-to-r from-red-600 via-red-500 to-red-600' : 'bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500'} animate-pulse`} />

        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-blue-50 rounded-full mb-2">
                <div className={`w-1.5 h-1.5 ${isPlaying ? 'bg-green-500' : isPaused ? 'bg-amber-500' : 'bg-blue-500'} rounded-full animate-pulse`} />
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                  {isPlaying ? 'Auto-Playing' : isPaused ? 'Paused' : 'Investor Demo'}
                </span>
                <span className="text-[10px] text-slate-500">Stage {currentCallout.stage}/8</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">{currentCallout.title}</h3>
            </div>
            <button
              onClick={hideCallout}
              className="text-slate-400 hover:text-slate-700 transition-colors p-1 hover:bg-slate-100 rounded-md ml-2"
              aria-label="Close callout"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div
            className="text-sm text-slate-600 leading-relaxed prose prose-sm max-w-none prose-p:my-1.5 prose-strong:text-slate-900 prose-strong:font-semibold prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5"
            dangerouslySetInnerHTML={{ __html: currentCallout.content }}
          />

          {/* Real-time data display */}
          {hasData && (
            <div className="mt-4 p-3 bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-50 rounded-lg border border-blue-200 shadow-sm">
              <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Live Cost Breakdown
              </div>
              <div className="space-y-1.5">
                {Object.entries(currentCallout.data).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center text-xs">
                    <span className="text-slate-600 font-medium">{key}:</span>
                    <span className="font-bold text-slate-900 font-mono">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="mt-4 pt-3 border-t border-slate-200">
            {isPaused && currentCallout.pauseHere && (
              <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-800 font-semibold mb-2">⏸️ Demo Paused at Critical Moment</p>
                <p className="text-xs text-amber-700">
                  This is THE CONSENT BRIDGE - the legal moat that makes VentoVault's business model work.
                  Take time to review before continuing.
                </p>
              </div>
            )}

            <div className="flex items-center justify-between gap-2">
              {isPaused ? (
                <button
                  onClick={resumeDemo}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white text-sm font-semibold rounded-lg hover:from-green-700 hover:to-green-600 transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Continue Demo
                </button>
              ) : isPlaying ? (
                <button
                  onClick={pauseDemo}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 text-white text-sm font-semibold rounded-lg hover:from-amber-700 hover:to-amber-600 transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <Pause className="w-4 h-4" />
                  Pause
                </button>
              ) : (
                <div className="flex-1 text-xs text-slate-500 italic text-center">
                  Demo playing automatically...
                </div>
              )}

              <button
                onClick={() => window.location.reload()}
                className="px-3 py-2 bg-slate-100 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2"
                title="Replay demo"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle pulsing glow effect */}
      <div className={`absolute inset-0 rounded-xl ${currentCallout.stage === 3 ? 'bg-red-400' : 'bg-blue-400'} opacity-20 blur-xl -z-10 animate-pulse`} />
    </div>
  );
}
