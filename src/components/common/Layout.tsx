import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Wallet, Home, ArrowUpRight, ArrowDownLeft, BarChart3, Users, Settings } from 'lucide-react';

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
    <div className="min-h-screen relative overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
        <div className="absolute -top-48 right-[-10%] w-[520px] h-[520px] bg-primary-300/10 blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-[420px] h-[420px] bg-accent-200/8 blur-3xl" />
      </div>

      {/* ─── Top Navbar ─── Minimal, brand-forward ─── */}
      <nav className="sticky top-0 z-50">
        <div className="bg-white/70 backdrop-blur-2xl border-b border-gray-200/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-14">

              {/* Logo — clean, no subtitle */}
              <Link to="/dashboard" className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-white" />
                </div>
                <span className="text-[15px] font-semibold text-gray-900 font-display tracking-tight">
                  VentoVault
                </span>
              </Link>

              {/* Desktop Navigation — icons only with tooltip-style labels */}
              <div className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const IconComponent = iconComponents[item.icon];
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      aria-current={isActive ? 'page' : undefined}
                      className={`group relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-gray-900 text-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/60'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className={isActive ? '' : 'hidden lg:inline'}>{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Right side — minimal: avatar + settings */}
              <div className="flex items-center gap-2">
                <Link
                  to="/settings"
                  aria-label="Open settings"
                  className={`p-2 rounded-xl transition-all duration-200 ${
                    location.pathname === '/settings'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100/60'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                </Link>
                <div className="w-px h-5 bg-gray-200/60 mx-1" />
                <button
                  type="button"
                  onClick={handleLogout}
                  aria-label="Sign out"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100/60 transition-all duration-200"
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center text-[10px] font-bold text-white">
                    {currentUser?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:inline">{currentUser?.displayName?.split(' ')[0]}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
        {children}
      </main>

      {/* ─── Mobile Bottom Nav ─── */}
      <nav className="md:hidden fixed bottom-4 left-0 right-0 z-50">
        <div className="mx-4 bg-white/90 border border-gray-200/60 backdrop-blur-2xl rounded-2xl shadow-[0_-4px_30px_-10px_rgba(15,23,42,0.12)]">
          <div className="flex justify-around items-center h-14">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const IconComponent = iconComponents[item.icon];
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  aria-label={item.label}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${
                    isActive ? 'text-gray-900' : 'text-gray-400'
                  }`}
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
    </div>
  );
}
