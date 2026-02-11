import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Wallet, Zap, Lock } from 'lucide-react';

export default function Signup() {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);

    try {
      await signup(formData.email, formData.password, formData.displayName);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
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
            <div className="text-xs uppercase tracking-[0.2em] text-gray-500">Global Money Transfers</div>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <h1 className="text-5xl font-semibold text-gray-900 leading-tight font-display">
            Send money<br />anywhere in the world
          </h1>
          <p className="text-lg text-gray-600 max-w-lg">
            Fast, secure international transfers with real-time exchange rates and no hidden fees.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            {[
              { icon: Zap, label: 'Instant transfers', desc: 'Minutes, not days' },
              { icon: Lock, label: 'Bank-level security', desc: 'Encrypted end-to-end' },
              { icon: Zap, label: 'Transparent fees', desc: 'No hidden margins' },
              { icon: Lock, label: 'Best rates', desc: 'Always competitive' },
            ].map((feature, index) => (
              <div key={`${feature.label}-${index}`} className="card p-4">
                <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center mb-3">
                  <feature.icon className="w-5 h-5" />
                </div>
                <div className="font-semibold text-gray-900">{feature.label}</div>
                <div className="text-sm text-gray-600">{feature.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md animate-slide-up">
          <div className="lg:hidden mb-8 flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-glow">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-gray-900 font-display">VentoVault</div>
              <div className="text-xs uppercase tracking-[0.2em] text-gray-500">Global Transfers</div>
            </div>
          </div>

          <div className="card p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-semibold text-gray-900 font-display">Create account</h2>
              <p className="text-gray-600 mt-2">Start sending money in minutes.</p>
            </div>

            {error && (
              <div
                id="signup-error"
                role="alert"
                aria-live="assertive"
                className="mb-6 p-4 bg-error-50 border border-error-500/20 rounded-xl text-error-600 text-sm"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" aria-describedby={error ? 'signup-error' : undefined}>
              <div>
                <label htmlFor="signup-display-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  id="signup-display-name"
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  className="input"
                  placeholder="John Doe"
                  autoComplete="name"
                  aria-invalid={!!error}
                  required
                />
              </div>

              <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="signup-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input"
                  placeholder="you@example.com"
                  autoComplete="email"
                  aria-invalid={!!error}
                  required
                />
              </div>

              <div>
                <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="signup-password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  aria-invalid={!!error}
                  required
                />
              </div>

              <div>
                <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  id="signup-confirm-password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  aria-invalid={!!error}
                  required
                />
              </div>

              <label className="flex items-start" htmlFor="signup-terms">
                <input
                  id="signup-terms"
                  type="checkbox"
                  required
                  className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-400"
                />
                <span className="ml-2 text-sm text-gray-600">
                  I agree to the{' '}
                  <button type="button" className="text-primary-700 hover:text-primary-800 font-semibold">
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button type="button" className="text-primary-700 hover:text-primary-800 font-semibold">
                    Privacy Policy
                  </button>
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                className="w-full btn btn-primary py-3 text-lg disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-700 hover:text-primary-800 font-semibold">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
