import { Presentation } from 'lucide-react';
import { useDemoMode } from '../../contexts/DemoModeContext';

export default function DemoModeToggle() {
  const { isDemoMode, toggleDemoMode } = useDemoMode();

  return (
    <button
      onClick={toggleDemoMode}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg font-semibold transition-all ${
        isDemoMode
          ? 'bg-blue-600 text-white hover:bg-blue-700'
          : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
      }`}
      title="Toggle Demo Mode"
    >
      <Presentation className={`w-5 h-5 ${isDemoMode ? 'animate-pulse' : ''}`} />
      <span className="text-sm">
        {isDemoMode ? 'Exit' : 'Demo'} Mode
      </span>
    </button>
  );
}
