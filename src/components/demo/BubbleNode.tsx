import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

/**
 * Bubble Node - Interactive explanation bubble
 *
 * Shows practical explanation with expandable technical details.
 * Based on ventovault-map node structure.
 */

interface BubbleSection {
  title: string;
  items: string[];
  defaultOpen?: boolean;
}

interface BubbleNodeProps {
  title: string;
  plainBody: string[];
  behindScenes?: string[];
  whatCanGoWrong?: string[];
  howWePrevent?: string[];
  manualRefs?: { chapter: string; topic: string }[];
  position: { x: number; y: number };
  type?: 'default' | 'critical';
}

export default function BubbleNode({
  title,
  plainBody,
  behindScenes,
  whatCanGoWrong,
  howWePrevent,
  manualRefs,
  position,
  type = 'default',
}: BubbleNodeProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

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

  const sections: BubbleSection[] = [];

  if (behindScenes?.length) {
    sections.push({ title: 'Behind the Scenes', items: behindScenes });
  }
  if (whatCanGoWrong?.length) {
    sections.push({ title: 'What Can Go Wrong', items: whatCanGoWrong });
  }
  if (howWePrevent?.length) {
    sections.push({ title: 'How We Prevent', items: howWePrevent });
  }
  if (manualRefs?.length) {
    sections.push({
      title: 'Manual References',
      items: manualRefs.map((ref) => `${ref.chapter}: ${ref.topic}`),
    });
  }

  const isCritical = type === 'critical';

  return (
    <div
      className="fixed z-50 w-96"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {/* Main Bubble */}
      <div
        className={`
          rounded-xl shadow-2xl
          ${
            isCritical
              ? 'bg-red-950/95 border-2 border-red-500'
              : 'bg-slate-900/95 border-2 border-blue-500'
          }
        `}
      >
        {/* Header */}
        <div
          className={`
            px-4 py-3 border-b
            ${isCritical ? 'border-red-800' : 'border-slate-700'}
          `}
        >
          <div
            className={`
              font-semibold text-sm
              ${isCritical ? 'text-red-300' : 'text-blue-300'}
            `}
          >
            {title}
          </div>
        </div>

        {/* Plain Body (Always Visible) */}
        <div className="px-4 py-3 space-y-2">
          {plainBody.map((text, idx) => (
            <p key={idx} className="text-sm text-slate-200 leading-relaxed">
              {text}
            </p>
          ))}
        </div>

        {/* Expandable Sections */}
        {sections.length > 0 && (
          <div className="border-t border-slate-700">
            {sections.map((section) => {
              const isExpanded = expandedSections.has(section.title);

              return (
                <div key={section.title} className="border-b border-slate-800 last:border-b-0">
                  {/* Section Header (Clickable) */}
                  <button
                    onClick={() => toggleSection(section.title)}
                    className="w-full px-4 py-2 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
                  >
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                      {section.title}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  {/* Section Content (Collapsible) */}
                  {isExpanded && (
                    <div className="px-4 pb-3 space-y-1.5">
                      {section.items.map((item, idx) => (
                        <div key={idx} className="flex gap-2">
                          <span className="text-slate-500 text-xs mt-1">•</span>
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
    </div>
  );
}
