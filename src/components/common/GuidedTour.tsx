import { useEffect, useState, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDemoMode } from '../../contexts/DemoModeContext';

export default function GuidedTour() {
  const { isDemoMode, currentCallout, hideCallout, nextStep, prevStep, currentStepIndex, currentFlow } = useDemoMode();
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [calloutPosition, setCalloutPosition] = useState({ top: 0, left: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const previousCalloutRef = useRef<any>(null);

  useEffect(() => {
    if (!isDemoMode || !currentCallout) {
      setIsVisible(false);
      setTargetElement(null);
      return;
    }

    // Check if callout actually changed
    if (previousCalloutRef.current === currentCallout) {
      return;
    }
    previousCalloutRef.current = currentCallout;

    // Find target element
    let element: HTMLElement | null = null;
    if (typeof currentCallout.target === 'string') {
      element = document.querySelector(currentCallout.target);
    } else {
      element = currentCallout.target;
    }

    if (!element) {
      console.warn('[Demo Mode] Target element not found:', currentCallout.target);
      // Try body as fallback
      element = document.body;
    }

    setTargetElement(element);

    // Calculate callout position
    const rect = element.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    let top = 0, left = 0;
    const calloutWidth = 450;
    const calloutMinHeight = 200;

    switch (currentCallout.placement) {
      case 'top':
        top = rect.top + scrollY - calloutMinHeight - 20;
        left = rect.left + scrollX + rect.width / 2 - calloutWidth / 2;
        break;
      case 'bottom':
        top = rect.bottom + scrollY + 20;
        left = rect.left + scrollX + rect.width / 2 - calloutWidth / 2;
        break;
      case 'left':
        top = rect.top + scrollY + rect.height / 2 - calloutMinHeight / 2;
        left = rect.left + scrollX - calloutWidth - 20;
        break;
      case 'right':
        top = rect.top + scrollY + rect.height / 2 - calloutMinHeight / 2;
        left = rect.right + scrollX + 20;
        break;
    }

    // Keep callout within viewport
    const maxLeft = window.innerWidth - calloutWidth - 20;
    const minLeft = 20;
    left = Math.max(minLeft, Math.min(left, maxLeft));

    const minTop = scrollY + 20;
    top = Math.max(minTop, top);

    setCalloutPosition({ top, left });

    // Scroll element into view smoothly
    if (element !== document.body) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    }

    // Add highlight with animation
    if (element !== document.body) {
      element.style.position = 'relative';
      element.style.zIndex = '60';
      element.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';

      requestAnimationFrame(() => {
        element!.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.6), 0 0 0 99999px rgba(0, 0, 0, 0.6)';
        element!.style.borderRadius = '12px';
        setIsVisible(true);
      });
    } else {
      setIsVisible(true);
    }

    return () => {
      if (element && element !== document.body) {
        element.style.position = '';
        element.style.zIndex = '';
        element.style.boxShadow = '';
        element.style.borderRadius = '';
        element.style.transition = '';
      }
    };
  }, [isDemoMode, currentCallout]);

  if (!isDemoMode || !currentCallout || !isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    if (hideCallout) hideCallout();
  };

  const hasData = currentCallout.data && Object.keys(currentCallout.data).length > 0;

  return (
    <>
      {/* Callout bubble */}
      <div
        className="fixed z-[70] w-[450px] bg-white rounded-2xl shadow-2xl border-2 border-blue-500 transition-all duration-300"
        style={{
          top: `${calloutPosition.top}px`,
          left: `${calloutPosition.left}px`,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(10px)',
        }}
      >
        {/* Arrow indicator */}
        {currentCallout.placement === 'bottom' && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[14px] border-b-blue-500" />
        )}
        {currentCallout.placement === 'top' && (
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[14px] border-t-blue-500" />
        )}
        {currentCallout.placement === 'right' && (
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[14px] border-t-transparent border-b-[14px] border-b-transparent border-r-[14px] border-r-blue-500" />
        )}
        {currentCallout.placement === 'left' && (
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[14px] border-t-transparent border-b-[14px] border-b-transparent border-l-[14px] border-l-blue-500" />
        )}

        {/* Content */}
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 pr-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full mb-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-blue-700">Investor Demo Mode</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">{currentCallout.title}</h3>
            </div>
            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content with HTML support */}
          <div
            className="text-sm text-slate-700 leading-relaxed prose prose-sm max-w-none prose-p:my-0"
            dangerouslySetInnerHTML={{ __html: currentCallout.content }}
          />

          {/* Real-time data display */}
          {hasData && (
            <div className="mt-4 p-3 bg-gradient-to-br from-blue-50 to-slate-50 rounded-lg border border-blue-100">
              <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2 flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                Real-Time Data
              </div>
              <div className="space-y-1.5">
                {Object.entries(currentCallout.data).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 font-medium">{key}:</span>
                    <span className="font-bold text-slate-900 font-mono text-xs">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation & Progress */}
          <div className="mt-5 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <button
                onClick={prevStep}
                disabled={currentStepIndex === 0}
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>

              <div className="text-xs text-slate-500 font-semibold">
                Continue using the app →
              </div>

              <button
                onClick={nextStep}
                className="px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
