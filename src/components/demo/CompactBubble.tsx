import { useState } from 'react';
import { ChevronDown, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';

/**
 * Compact Bubble - Small, unobtrusive explanation bubble
 *
 * Design:
 * - Collapsed: 280px x 80px (title + one line)
 * - Expanded: 320px x auto (max 400px, scrollable)
 * - Position: Bottom-right corner (doesn't block anything)
 * - Semi-transparent background
 * - Click to expand/collapse
 */

interface CompactBubbleProps {
  title: string;
  subtitle: string; // One key sentence shown when collapsed
  behindScenes?: string[];
  whatCanGoWrong?: string[];
  howWePrevent?: string[];
  manualRefs?: { chapter: string; topic: string }[];
  type?: 'default' | 'critical';
}

export default function CompactBubble({
  title,
  subtitle,
  behindScenes,
  whatCanGoWrong,
  howWePrevent,
  manualRefs,
  type = 'default',
}: CompactBubbleProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const isCritical = type === 'critical';

  // Build sections array
  const sections: { title: string; items: string[] }[] = [];
  if (behindScenes?.length) sections.push({ title: 'Behind the Scenes', items: behindScenes });
  if (whatCanGoWrong?.length) sections.push({ title: 'What Can Go Wrong', items: whatCanGoWrong });
  if (howWePrevent?.length) sections.push({ title: 'How We Prevent', items: howWePrevent });
  if (manualRefs?.length) {
    sections.push({
      title: 'Manual References',
      items: manualRefs.map((r) => `${r.chapter}: ${r.topic}`),
    });
  }

  return (
    <div
      className={`
        fixed bottom-20 right-6 z-50
        ${isExpanded ? 'w-80' : 'w-72'}
        transition-all duration-300 ease-out
        ${isCritical ? 'shadow-red-500/20' : 'shadow-blue-500/20'}
        shadow-2xl
      `}
    >
      <div
        className={`
          rounded-lg overflow-hidden
          backdrop-blur-md
          border
          ${
            isCritical
              ? 'bg-red-950/80 border-red-500/40'
              : 'bg-slate-900/80 border-blue-500/40'
          }
        `}
      >
        {/* Header - Always Visible */}
        <button
          onClick={toggleExpand}
          className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div
                className={`
                  text-xs font-semibold mb-1
                  ${isCritical ? 'text-red-400' : 'text-blue-400'}
                `}
              >
                {title}
              </div>
              {!isExpanded && (
                <div className="text-xs text-slate-300 leading-snug line-clamp-2">
                  {subtitle}
                </div>
              )}
            </div>
            <div className="flex-shrink-0 mt-0.5">
              {isExpanded ? (
                <Minimize2 className="w-4 h-4 text-slate-400" />
              ) : (
                <Maximize2 className="w-4 h-4 text-slate-400" />
              )}
            </div>
          </div>
        </button>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="max-h-96 overflow-y-auto">
            {/* Full subtitle when expanded */}
            <div className="px-4 pb-3 text-xs text-slate-200 leading-relaxed">
              {subtitle}
            </div>

            {/* Expandable Sections */}
            {sections.length > 0 && (
              <div className="border-t border-slate-700/50">
                {sections.map((section) => {
                  const isSectionExpanded = expandedSections.has(section.title);

                  return (
                    <div key={section.title} className="border-b border-slate-800/50 last:border-b-0">
                      {/* Section Header */}
                      <button
                        onClick={() => toggleSection(section.title)}
                        className="w-full px-4 py-2 flex items-center justify-between hover:bg-white/5 transition-colors"
                      >
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                          {section.title}
                        </span>
                        {isSectionExpanded ? (
                          <ChevronDown className="w-3 h-3 text-slate-400" />
                        ) : (
                          <ChevronRight className="w-3 h-3 text-slate-400" />
                        )}
                      </button>

                      {/* Section Content */}
                      {isSectionExpanded && (
                        <div className="px-4 pb-2 space-y-1">
                          {section.items.map((item, idx) => (
                            <div key={idx} className="flex gap-1.5">
                              <span className="text-slate-500 text-xs flex-shrink-0 mt-0.5">•</span>
                              <p className="text-xs text-slate-300 leading-relaxed">{item}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
