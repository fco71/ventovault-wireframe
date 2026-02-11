import { useEffect, useState, useRef } from 'react';
import { X } from 'lucide-react';
import { useDemoMode } from '../../contexts/DemoModeContext';

export default function GuidedTour() {
  const { isDemoMode, currentCallout, hideCallout } = useDemoMode();
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [calloutPosition, setCalloutPosition] = useState({ top: 0, left: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!isDemoMode || !currentCallout) {
      setIsVisible(false);
      setTargetElement(null);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      return;
    }

    // Find target element
    const element = document.querySelector(currentCallout.target) as HTMLElement;
    if (!element) {
      console.warn('[Demo Mode] Target element not found:', currentCallout.target);
      return;
    }

    setTargetElement(element);

    // Calculate callout position
    const rect = element.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    let top = 0, left = 0;
    const calloutWidth = 420;
    const calloutHeight = 200;

    switch (currentCallout.placement) {
      case 'top':
        top = rect.top + scrollY - calloutHeight - 20;
        left = rect.left + scrollX + rect.width / 2 - calloutWidth / 2;
        break;
      case 'bottom':
        top = rect.bottom + scrollY + 20;
        left = rect.left + scrollX + rect.width / 2 - calloutWidth / 2;
        break;
      case 'left':
        top = rect.top + scrollY + rect.height / 2 - calloutHeight / 2;
        left = rect.left + scrollX - calloutWidth - 20;
        break;
      case 'right':
        top = rect.top + scrollY + rect.height / 2 - calloutHeight / 2;
        left = rect.right + scrollX + 20;
        break;
    }

    // Keep callout within viewport
    const maxLeft = window.innerWidth - calloutWidth - 20;
    const maxTop = window.innerHeight + scrollY - calloutHeight - 20;
    left = Math.max(20, Math.min(left, maxLeft));
    top = Math.max(scrollY + 20, Math.min(top, maxTop));

    setCalloutPosition({ top, left });

    // Scroll element into view smoothly
    element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });

    // Add highlight with animation
    element.style.position = 'relative';
    element.style.zIndex = '60';
    element.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';

    requestAnimationFrame(() => {
      element.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.6), 0 0 0 99999px rgba(0, 0, 0, 0.6)';
      element.style.borderRadius = '12px';
      setIsVisible(true);
    });

    return () => {
      element.style.position = '';
      element.style.zIndex = '';
      element.style.boxShadow = '';
      element.style.borderRadius = '';
      element.style.transition = '';
    };
  }, [isDemoMode, currentCallout]);

  if (!isDemoMode || !currentCallout || !isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(hideCallout, 300);
  };

  return (
    <>
      {/* Callout bubble */}
      <div
        className="fixed z-[70] w-[420px] bg-white rounded-2xl shadow-2xl border-2 border-blue-500 transition-all duration-300"
        style={{
          top: `${calloutPosition.top}px`,
          left: `${calloutPosition.left}px`,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : 'scale(0.9)',
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
              <h3 className="text-lg font-bold text-slate-900">{currentCallout.title}</h3>
            </div>
            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content with HTML support */}
          <div
            className="text-sm text-slate-700 leading-relaxed prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: currentCallout.content }}
          />

          {/* Optional data display */}
          {currentCallout.data && Object.keys(currentCallout.data).length > 0 && (
            <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Real-Time Data
              </div>
              {Object.entries(currentCallout.data).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center text-sm py-1">
                  <span className="text-slate-600">{key}:</span>
                  <span className="font-semibold text-slate-900">{String(value)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Auto-hide indicator */}
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="text-xs text-slate-500 text-center">
              Continue using the app • Callout will update automatically
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
