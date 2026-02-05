import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowDownLeft,
  ArrowUpRight,
  BarChart3,
  Bell,
  Command,
  Home,
  Search,
  Settings,
  Sparkles
} from 'lucide-react';

interface CommandPaletteProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface CommandAction {
  id: string;
  label: string;
  description: string;
  group: 'Navigation' | 'Actions' | 'Insights';
  icon: React.ElementType;
  path: string;
  shortcut?: string;
}

const actions: CommandAction[] = [
  {
    id: 'home',
    label: 'Go to Dashboard',
    description: 'Overview of balances and insights',
    group: 'Navigation',
    icon: Home,
    path: '/dashboard',
    shortcut: 'G D',
  },
  {
    id: 'send',
    label: 'Send Money',
    description: 'Start a new transfer',
    group: 'Actions',
    icon: ArrowUpRight,
    path: '/send',
    shortcut: 'S',
  },
  {
    id: 'receive',
    label: 'Request Payment',
    description: 'Create a pay link or QR',
    group: 'Actions',
    icon: ArrowDownLeft,
    path: '/receive',
    shortcut: 'R',
  },
  {
    id: 'activity',
    label: 'View Activity',
    description: 'Search and export transfers',
    group: 'Navigation',
    icon: BarChart3,
    path: '/transactions',
    shortcut: 'G A',
  },
  {
    id: 'alerts',
    label: 'Open Alerts',
    description: 'Security and payment signals',
    group: 'Navigation',
    icon: Bell,
    path: '/notifications',
  },
  {
    id: 'settings',
    label: 'Open Settings',
    description: 'Manage preferences and automation',
    group: 'Navigation',
    icon: Settings,
    path: '/settings',
  },
  {
    id: 'insights',
    label: 'Smart Insights',
    description: 'Predictive routing and FX shield',
    group: 'Insights',
    icon: Sparkles,
    path: '/dashboard',
    shortcut: 'I',
  },
];

export default function CommandPalette({ open, setOpen }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(!open);
      }

      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, setOpen]);

  useEffect(() => {
    if (!open) {
      setQuery('');
    }
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((action) => action.label.toLowerCase().includes(q) || action.description.toLowerCase().includes(q));
  }, [query]);

  const grouped = useMemo(() => {
    return filtered.reduce<Record<string, CommandAction[]>>((acc, action) => {
      acc[action.group] = acc[action.group] || [];
      acc[action.group].push(action);
      return acc;
    }, {});
  }, [filtered]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <div className="relative mx-auto mt-20 w-full max-w-2xl px-4">
        <div className="card border border-white/70 bg-white/85 backdrop-blur-2xl shadow-[0_35px_80px_-45px_rgba(15,23,42,0.6)]">
          <div className="flex items-center gap-3 border-b border-white/60 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-primary-50 text-primary-700 flex items-center justify-center">
              <Command className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="text-xs uppercase tracking-[0.2em] text-gray-500">Command Palette</div>
              <div className="text-lg font-semibold text-gray-900 font-display">What do you want to do?</div>
            </div>
            <span className="text-xs text-gray-500 border border-white/70 rounded-full px-2 py-1 bg-white/70">
              Esc
            </span>
          </div>

          <div className="mt-4 flex items-center gap-3 bg-white/70 border border-white/70 rounded-2xl px-4 py-3">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search actions, people, amounts, or insights..."
              className="flex-1 bg-transparent outline-none text-gray-900 placeholder:text-gray-400 text-sm"
              autoFocus
            />
            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500">⌘K</span>
          </div>

          <div className="mt-5 space-y-4 max-h-[360px] overflow-y-auto pr-2">
            {Object.entries(grouped).map(([group, items]) => (
              <div key={group}>
                <div className="text-xs uppercase tracking-[0.2em] text-gray-500 px-2 mb-2">{group}</div>
                <div className="space-y-2">
                  {items.map((action) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.id}
                        onClick={() => {
                          navigate(action.path);
                          setOpen(false);
                        }}
                        className="w-full flex items-center gap-3 p-3 rounded-2xl bg-white/70 border border-white/60 hover:bg-white transition-all text-left"
                      >
                        <div className="w-10 h-10 rounded-2xl bg-primary-50 text-primary-700 flex items-center justify-center">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{action.label}</div>
                          <div className="text-sm text-gray-600">{action.description}</div>
                        </div>
                        {action.shortcut && (
                          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 border border-white/70 rounded-full px-2 py-1 bg-white/70">
                            {action.shortcut}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center text-sm text-gray-500 py-10">
                No matches yet. Try a recipient name, amount, or action.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
