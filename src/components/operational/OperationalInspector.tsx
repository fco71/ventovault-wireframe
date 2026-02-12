import { useOperationalInspector } from '../../contexts/OperationalInspectorContext';

/**
 * Operational Inspector Panel
 *
 * Modern, technical side panel showing operational details.
 * Clean design, no emojis, no blocking - just contextual technical information.
 */

export default function OperationalInspector() {
  const { isOpen, currentData } = useOperationalInspector();

  if (!isOpen || !currentData) {
    return null;
  }

  return (
    <div className="fixed right-0 top-0 bottom-0 w-96 bg-slate-900 text-slate-100 border-l border-slate-700 shadow-2xl z-40 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              {currentData.stage}
            </div>
            <div className="text-lg font-semibold text-slate-100 mt-1">
              {currentData.title}
            </div>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      </div>

      {/* Content Sections */}
      <div className="p-6 space-y-6">
        {currentData.sections.map((section, idx) => {
          const colorClasses = {
            info: 'border-slate-600 bg-slate-800/50',
            critical: 'border-red-900/50 bg-red-950/20',
            technical: 'border-blue-900/50 bg-blue-950/20',
            financial: 'border-emerald-900/50 bg-emerald-950/20',
          };

          const labelColors = {
            info: 'text-slate-300',
            critical: 'text-red-400',
            technical: 'text-blue-400',
            financial: 'text-emerald-400',
          };

          const type = section.type || 'info';

          return (
            <div
              key={idx}
              className={`border rounded-lg p-4 ${colorClasses[type]} transition-all`}
            >
              <div className={`text-sm font-semibold mb-2 font-mono ${labelColors[type]}`}>
                {section.label}
              </div>
              <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {section.content}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-slate-800 border-t border-slate-700 px-6 py-3">
        <div className="text-xs text-slate-500 font-mono">
          Operational Framework Inspector v1.0
        </div>
      </div>
    </div>
  );
}
