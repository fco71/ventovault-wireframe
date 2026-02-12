import { PlayCircle, StopCircle } from 'lucide-react';
import { useInvestorDemo } from '../../contexts/InvestorDemoContext';

/**
 * Investor Demo Toggle Button
 *
 * Floating button to start/stop the investor demo mode.
 * Positioned in bottom-right corner.
 */

export default function InvestorDemoToggle() {
  const { isActive, startDemo, stopDemo, mode } = useInvestorDemo();

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={isActive ? stopDemo : startDemo}
        className={`
          group relative px-5 py-3 rounded-full font-semibold text-sm
          shadow-lg hover:shadow-xl transition-all duration-300
          flex items-center gap-2.5
          ${
            isActive
              ? 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600'
              : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600'
          }
        `}
      >
        {isActive ? (
          <>
            <StopCircle className="w-5 h-5" />
            <span>Stop Demo</span>
          </>
        ) : (
          <>
            <PlayCircle className="w-5 h-5" />
            <span>Investor Demo</span>
          </>
        )}

        {/* Pulsing indicator when active */}
        {isActive && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}

        {/* Tooltip */}
        <div className="absolute bottom-full mb-2 right-0 w-64 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-slate-900 text-white text-xs rounded-lg p-3 shadow-xl">
            {isActive ? (
              <p>Click to stop the investor demo and return to normal mode.</p>
            ) : (
              <>
                <p className="font-semibold mb-1">🎯 Investor Demo Mode</p>
                <p>
                  Watch an auto-play demonstration of how VentoVault's app embodies the comprehensive
                  remittance system from our operational manual.
                </p>
                <p className="mt-2 text-slate-300">
                  The demo will automatically progress through the 8-step canonical lifecycle,
                  pausing at THE CONSENT BRIDGE.
                </p>
              </>
            )}
          </div>
        </div>
      </button>

      {/* Mode indicator */}
      {isActive && (
        <div className="mt-2 text-center">
          <span className="inline-block px-3 py-1 bg-white rounded-full text-xs font-semibold text-slate-700 shadow-sm">
            {mode === 'intro' && '🎬 Starting...'}
            {mode === 'auto-playing' && '▶️ Auto-Playing'}
            {mode === 'paused' && '⏸️ Paused'}
            {mode === 'manual' && '👆 Manual Mode'}
          </span>
        </div>
      )}
    </div>
  );
}
