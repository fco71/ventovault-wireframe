import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Wallet } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  // Demo credentials shortcut
  const fillDemoCredentials = () => {
    setEmail('demo@ventovault.com');
    setPassword('demo123');
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.1fr_0.9fr]">
      {/* Left side - Branding */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-primary-50 to-accent-50" />
        <div className="absolute -top-28 right-0 w-72 h-72 bg-primary-200/40 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-200/35 blur-3xl" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-glow">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-2xl font-semibold text-gray-900 font-display">VentoVault</div>
            <div className="text-xs uppercase tracking-[0.2em] text-gray-500">Future of Remittance</div>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-white/60 px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            Live rails and real-time FX
          </div>
          <h1 className="text-5xl font-semibold text-gray-900 leading-tight font-display">
            Move money<br />at the speed of trust
          </h1>
          <p className="text-lg text-gray-600 max-w-lg">
            Instant transfers, transparent pricing, and global reach designed for modern families and teams.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            {[
              { label: 'Annual Volume', value: '$10.2B' },
              { label: 'Success Rate', value: '98%' },
              { label: 'Avg. Delivery', value: '2 min' },
              { label: 'Supported Markets', value: '120+' },
            ].map((stat) => (
              <div key={stat.label} className="card p-4">
                <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                <div className="text-xs uppercase tracking-[0.2em] text-gray-500 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md animate-slide-up">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-glow">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-gray-900 font-display">VentoVault</div>
              <div className="text-xs uppercase tracking-[0.2em] text-gray-500">Remittance</div>
            </div>
          </div>

          <div className="card p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-semibold text-gray-900 font-display">Welcome back</h2>
                <p className="text-gray-600 mt-2">Log in to continue your money flow.</p>
              </div>
              <div className="hidden sm:flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
                Secure
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-error-50 border border-error-500/20 rounded-xl text-error-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-400" />
                  <span className="ml-2 text-gray-600">Remember me</span>
                </label>
                <button type="button" className="text-primary-700 hover:text-primary-800 font-semibold">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-primary py-3 text-lg disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Log in'}
              </button>

              <button
                type="button"
                onClick={fillDemoCredentials}
                className="w-full btn btn-secondary py-3 text-sm"
              >
                Fill Demo Credentials
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary-700 hover:text-primary-800 font-semibold">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
