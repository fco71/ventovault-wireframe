import { useEffect, useState, useRef } from 'react';
import { X } from 'lucide-react';
import { useDemoMode } from '../../contexts/DemoModeContext';

export default function GuidedTour() {
  const { isDemoMode, currentCallout, hideCallout } = useDemoMode();
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [calloutPosition, setCalloutPosition] = useState({ top: 0, left: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const previousCalloutRef = useRef<any>(null);
  const calloutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDemoMode || !currentCallout) {
      // Clean up previous highlight
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
      return;
    }

    // Clean up previous target
    if (targetElement && targetElement !== element) {
      targetElement.style.outline = '';
      targetElement.style.outlineOffset = '';
      targetElement.style.position = '';
      targetElement.style.zIndex = '';
    }

    setTargetElement(element);

    // Scroll element into view smoothly
    element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });

    // Wait for scroll to settle, then position callout
    setTimeout(() => {
      if (!element) return;

      // Add subtle highlight to target (NOT blocking overlay)
      element.style.position = 'relative';
      element.style.zIndex = '10';
      element.style.outline = '3px solid rgba(59, 130, 246, 0.6)';
      element.style.outlineOffset = '4px';
      element.style.borderRadius = '8px';

      // Calculate callout position
      const rect = element.getBoundingClientRect();
      const calloutWidth = 400;
      const calloutHeight = calloutRef.current?.offsetHeight || 280;
      const padding = 24;

      let top = 0, left = 0;

      switch (currentCallout.placement) {
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
          top = rect.top + window.scrollY + rect.height / 2 - calloutHeight / 2;
          left = rect.right + window.scrollX + padding;
          break;
        default:
          // Default to right
          top = rect.top + window.scrollY + rect.height / 2 - calloutHeight / 2;
          left = rect.right + window.scrollX + padding;
      }

      // Keep callout within viewport with padding
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
      if (element) {
        element.style.outline = '';
        element.style.outlineOffset = '';
        element.style.position = '';
        element.style.zIndex = '';
      }
    };
  }, [isDemoMode, currentCallout, targetElement]);

  if (!isDemoMode || !currentCallout || !isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    if (hideCallout) hideCallout();
  };

  const hasData = currentCallout.data && Object.keys(currentCallout.data).length > 0;

  return (
    <div
      ref={calloutRef}
      className="fixed z-50 w-[400px] transition-all duration-300 ease-out"
      style={{
        top: `${calloutPosition.top}px`,
        left: `${calloutPosition.left}px`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-8px)',
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
    >
      {/* Floating callout card */}
      <div className="bg-white rounded-xl shadow-2xl border-2 border-blue-400 overflow-hidden backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Arrow indicator pointing to target */}
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

        {/* Gradient header bar */}
        <div className="h-1 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 animate-pulse" />

        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-blue-50 rounded-full mb-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Investor Demo</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">{currentCallout.title}</h3>
            </div>
            <button
              onClick={handleClose}
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
                Live Data
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

          {/* Auto-advance hint */}
          <div className="mt-4 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 italic">
              <span className="inline-block w-1 h-1 bg-slate-400 rounded-full animate-pulse" />
              <span>Continue using the app - callouts will update automatically</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle pulsing glow effect */}
      <div className="absolute inset-0 rounded-xl bg-blue-400 opacity-20 blur-xl -z-10 animate-pulse" />
    </div>
  );
}
