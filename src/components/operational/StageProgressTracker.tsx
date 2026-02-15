import { useOperationalInspector, type AppStage } from '../../contexts/OperationalInspectorContext';

/**
 * Stage Progress Tracker
 *
 * Shows progress through the transaction lifecycle.
 * Now connected to actual app state via OperationalInspectorContext.
 */

interface Stage {
  id: number;
  name: string;
  appStage: AppStage | 'post-submit';  // Maps to Send.tsx step state
}

const STAGES: Stage[] = [
  { id: 1, name: 'Recipient', appStage: 'recipient' },
  { id: 2, name: 'Quote', appStage: 'amount' },
  { id: 3, name: 'Review', appStage: 'review' },
  { id: 4, name: 'Fund', appStage: 'success' },
  { id: 5, name: 'Comply', appStage: 'success' },
  { id: 6, name: 'Settle', appStage: 'success' },
  { id: 7, name: 'Payout', appStage: 'success' },
  { id: 8, name: 'Receipt', appStage: 'success' },
];

export default function StageProgressTracker() {
  const { isOpen, currentStage } = useOperationalInspector();

  if (!isOpen || !currentStage) {
    return null;
  }

  // Determine which stage to highlight
  const getCurrentStageId = (): number => {
    switch (currentStage) {
      case 'recipient':
        return 1;
      case 'amount':
        return 2;
      case 'review':
        return 3;
      case 'success':
        return 4; // First post-submit stage
      default:
        return 0;
    }
  };

  const currentStageId = getCurrentStageId();

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 backdrop-blur-sm border border-slate-700 rounded-full px-6 py-3 shadow-xl">
      <div className="flex items-center gap-3">
        {STAGES.map((stage, index) => {
          const isActive = stage.id === currentStageId;
          const isCompleted = stage.id < currentStageId;
          const isCritical = stage.id === 3; // Review stage

          return (
            <div key={stage.id} className="flex items-center gap-3">
              {/* Stage Circle */}
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    font-mono text-xs font-bold
                    transition-all duration-300
                    ${
                      isActive
                        ? isCritical
                          ? 'bg-red-600 text-white ring-4 ring-red-600/30 scale-110'
                          : 'bg-blue-600 text-white ring-4 ring-blue-600/30 scale-110'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-700 text-slate-400'
                    }
                  `}
                >
                  {isCompleted ? '✓' : stage.id}
                </div>
                <div
                  className={`
                    text-xs font-medium whitespace-nowrap
                    transition-all duration-300
                    ${
                      isActive
                        ? 'text-white font-semibold'
                        : isCompleted
                        ? 'text-emerald-400'
                        : 'text-slate-500'
                    }
                  `}
                >
                  {stage.name}
                </div>
              </div>

              {/* Connector Line */}
              {index < STAGES.length - 1 && (
                <div
                  className={`
                    h-0.5 w-8 transition-all duration-300
                    ${
                      isCompleted
                        ? 'bg-emerald-600'
                        : 'bg-slate-700'
                    }
                  `}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
