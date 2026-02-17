import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Wallet,
  Home,
  ArrowUpRight,
  ArrowDownLeft,
  BarChart3,
  Users,
  Settings,
} from 'lucide-react';

// --- NEW IMPORT: The Simulator Button ---
import { SimulatorToggle } from '../demo/SimulatorToggle';

interface LayoutProps {
  children: React.ReactNode;
}

const iconComponents = {
  Home,
  ArrowUpRight,
  ArrowDownLeft,
  BarChart3,
  Users,
  Settings,
};

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const firstName = currentUser?.displayName?.split(' ')[0] || 'User';
  const firstInitial = firstName.charAt(0).toUpperCase();

  const navigateToSendHome = () => {
    navigate('/send', {
      replace: location.pathname === '/send',
      state: {
        resetFlow: true,
        resetToken: Date.now(),
      },
    });
  };

  const navItems = [
    { path: '/dashboard', label: 'Home', icon: 'Home' as const },
    { path: '/send', label: 'Send', icon: 'ArrowUpRight' as const },
    { path: '/receive', label: 'Receive', icon: 'ArrowDownLeft' as const },
    { path: '/connections', label: 'People', icon: 'Users' as const },
    { path: '/transactions', label: 'Activity', icon: 'BarChart3' as const },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="vv-world min-h-screen relative overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
        <div className="absolute -top-52 left-[8%] w-[420px] h-[420px] bg-primary-300/14 blur-3xl vv-breath" />
        <div className="absolute top-28 right-[6%] w-[360px] h-[360px] bg-accent-300/12 blur-3xl" />
        <div className="absolute -bottom-40 right-[32%] w-[500px] h-[500px] bg-primary-500/8 blur-3xl" />
      </div>

      {/* Top navbar */}
      <nav className="sticky top-0 z-50 px-3 pt-3 md:px-4 md:pt-4">
        <div className="max-w-7xl mx-auto vv-topbar">
          <div className="vv-topbar-grid">
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="vv-brand-chip">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center shadow-[0_12px_24px_-16px_rgba(8,25,49,0.75)]">
                  <Wallet className="w-4 h-4 text-white" />
                </div>
                <div className="leading-tight">
                  <div className="text-[14px] sm:text-[15px] font-semibold text-gray-900 font-display tracking-tight">
                    VentoVault
                  </div>
                  <div className="hidden sm:block text-[10px] text-gray-500 uppercase tracking-[0.16em]">
                    Money Transfers
                  </div>
                </div>
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-1">
              <div className="flex items-center gap-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const IconComponent = iconComponents[item.icon];
                  if (item.path === '/send') {
                    return (
                      <button
                        key={item.path}
                        type="button"
                        onClick={navigateToSendHome}
                        aria-current={isActive ? 'page' : undefined}
                        className={`vv-nav-link border-0 bg-transparent ${isActive ? 'vv-nav-link-active' : ''}`}
                      >
                        <IconComponent className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  }
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      aria-current={isActive ? 'page' : undefined}
                      className={`vv-nav-link ${isActive ? 'vv-nav-link-active' : ''}`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/settings"
                aria-label="Open settings"
                className={`p-2 rounded-xl transition-all duration-200 ${
                  location.pathname === '/settings'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-white/80'
                }`}
              >
                <Settings className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Sign out"
                className="vv-user-chip"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center text-[10px] font-bold">
                  {firstInitial || 'U'}
                </div>
                <span className="hidden sm:inline">{firstName}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="vv-main-shell">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-4 left-0 right-0 z-50">
        <div className="vv-mobile-dock">
          <div className="flex justify-around items-center h-14">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const IconComponent = iconComponents[item.icon];
              if (item.path === '/send') {
                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={navigateToSendHome}
                    aria-label={item.label}
                    aria-current={isActive ? 'page' : undefined}
                    className={`vv-mobile-link border-0 bg-transparent ${isActive ? 'vv-mobile-link-active' : ''}`}
                  >
                    <IconComponent className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                    <span className={`text-[9px] mt-1 font-semibold tracking-wide ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                      {item.label}
                    </span>
                  </button>
                );
              }
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  aria-label={item.label}
                  aria-current={isActive ? 'page' : undefined}
                  className={`vv-mobile-link ${isActive ? 'vv-mobile-link-active' : ''}`}
                >
                  <IconComponent className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                  <span className={`text-[9px] mt-1 font-semibold tracking-wide ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* --- THE SIMULATOR TOGGLE --- */}
      <SimulatorToggle />
    </div>
  );
}