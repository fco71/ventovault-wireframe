import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Wallet, Home, ArrowUpRight, ArrowDownLeft, BarChart3, Bell, Settings, LogOut, Command } from 'lucide-react';
import CommandPalette from './CommandPalette';

interface LayoutProps {
  children: React.ReactNode;
}

const iconComponents = {
  Home,
  ArrowUpRight,
  ArrowDownLeft,
  BarChart3,
  Bell,
  Settings,
};

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [paletteOpen, setPaletteOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', label: 'Home', icon: 'Home' as const },
    { path: '/send', label: 'Send', icon: 'ArrowUpRight' as const },
    { path: '/receive', label: 'Receive', icon: 'ArrowDownLeft' as const },
    { path: '/transactions', label: 'Activity', icon: 'BarChart3' as const },
    { path: '/notifications', label: 'Alerts', icon: 'Bell' as const },
    { path: '/settings', label: 'Settings', icon: 'Settings' as const },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
        <div className="absolute -top-48 right-[-10%] w-[520px] h-[520px] bg-primary-300/10 blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-[420px] h-[420px] bg-accent-200/8 blur-3xl" />
      </div>

      {/* Top Navbar */}
      <nav className="sticky top-0 z-50">
        <div className="bg-white/70 backdrop-blur-2xl border-b border-white/60 shadow-[0_12px_30px_-22px_rgba(15,23,42,0.5)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link to="/dashboard" className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-glow">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-lg font-semibold text-gray-900 font-display">VentoVault</span>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500">Global Wallet</div>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-2">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const IconComponent = iconComponents[item.icon];
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-primary-100/80 text-primary-700 shadow-[0_10px_25px_-16px_rgba(6,182,212,0.6)]'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-white/70'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {/* User Menu */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPaletteOpen(true)}
                  className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold text-gray-700 bg-white/70 border border-white/70 hover:bg-white transition-all"
                >
                  <Command className="w-4 h-4" />
                  Command
                  <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 border border-white/70 rounded-full px-2 py-1 bg-white/70">
                    ⌘K
                  </span>
                </button>
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {currentUser?.displayName}
                  </div>
                  <div className="text-xs text-gray-500">{currentUser?.email}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary flex items-center gap-2 px-4 py-2 text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 md:pb-10">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-4 left-0 right-0 z-50">
        <div className="mx-4 bg-white/80 border border-white/70 backdrop-blur-2xl rounded-2xl shadow-[0_18px_40px_-25px_rgba(15,23,42,0.45)]">
          <div className="flex justify-around items-center h-16">
            {navItems.slice(0, 5).map((item) => {
              const isActive = location.pathname === item.path;
              const IconComponent = iconComponents[item.icon];
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${
                    isActive ? 'text-primary-700' : 'text-gray-500'
                  }`}
                >
                  <IconComponent className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                  <span className="text-[10px] mt-1 font-semibold tracking-wide">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <CommandPalette open={paletteOpen} setOpen={setPaletteOpen} />
    </div>
  );
}
