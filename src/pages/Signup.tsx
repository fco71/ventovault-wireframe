import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

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
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-white">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <span className="text-2xl">💸</span>
            </div>
            <span className="text-2xl font-bold">VentoVault</span>
          </div>
        </div>

        <div className="space-y-8">
          <h1 className="text-5xl font-bold text-white leading-tight">
            Join thousands<br />sending money<br />worldwide
          </h1>
          <div className="grid grid-cols-2 gap-6 pt-8">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <div className="text-3xl mb-2">⚡</div>
              <div className="text-white font-semibold">Instant transfers</div>
              <div className="text-primary-100 text-sm">Within minutes</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <div className="text-3xl mb-2">🔒</div>
              <div className="text-white font-semibold">Bank-level security</div>
              <div className="text-primary-100 text-sm">Your money is safe</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-slide-up">
          <div className="lg:hidden mb-8 flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💸</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">VentoVault</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Create account</h2>
            <p className="text-gray-600 mt-2">Start sending money in minutes</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                className="input"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-start">
              <input type="checkbox" required className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
              <span className="ml-2 text-sm text-gray-600">
                I agree to the{' '}
                <button type="button" className="text-primary-600 hover:text-primary-700 font-medium">
                  Terms of Service
                </button>{' '}
                and{' '}
                <button type="button" className="text-primary-600 hover:text-primary-700 font-medium">
                  Privacy Policy
                </button>
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-3 text-lg disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
