import { useOperationalInspector } from '../../contexts/OperationalInspectorContext';

/**
 * Toggle button for Operational Inspector
 * Clean, modern design without emojis
 */

export default function OperationalInspectorToggle() {
  const { isOpen, toggle } = useOperationalInspector();

  return (
    <button
      onClick={toggle}
      className={`
        fixed bottom-6 right-6 z-50
        px-4 py-2.5
        rounded-lg
        font-mono text-sm font-medium
        border
        transition-all duration-200
        shadow-lg hover:shadow-xl
        ${
          isOpen
            ? 'bg-slate-900 text-slate-100 border-slate-600'
            : 'bg-slate-100 text-slate-900 border-slate-300 hover:bg-slate-200'
        }
      `}
      aria-label={isOpen ? 'Close Demo Mode' : 'Open Demo Mode'}
    >
      <div className="flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-emerald-400' : 'bg-slate-400'}`} />
        <span>{isOpen ? 'HIDE DEMO' : 'DEMO MODE'}</span>
      </div>
    </button>
  );
}
