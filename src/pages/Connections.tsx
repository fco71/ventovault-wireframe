import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Send, Star, X, Check, UserPlus, Lock } from 'lucide-react';
import { Recipient } from '../types';
import { recipientService } from '../services';
import { useAuth } from '../contexts/AuthContext';
import { shortTimeAgo, toCurrency } from '../services/mock/utils';
import { toast } from '../components/ui/Toast';

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const avatarColors = [
  'from-primary-400 to-primary-600',
  'from-violet-400 to-violet-600',
  'from-amber-400 to-amber-600',
  'from-emerald-400 to-emerald-600',
  'from-rose-400 to-rose-600',
  'from-sky-400 to-sky-600',
];

function stateLabel(recipient: Recipient): { label: string; className: string; sendBlocked: boolean } {
  if (recipient.state === 'flagged') {
    return { label: 'Flagged', className: 'text-[10px] font-medium text-error-700 bg-error-50 px-1.5 py-0.5 rounded-full', sendBlocked: true };
  }

  if (recipient.state === 'pending_validation') {
    return { label: 'Validating', className: 'text-[10px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-full', sendBlocked: true };
  }

  if (recipient.state === 'validated_new') {
    const coolingActive = recipient.coolingOffEndsAt ? recipient.coolingOffEndsAt.getTime() > Date.now() : false;
    return {
      label: coolingActive ? 'Cooling Off' : 'Newly Validated',
      className: 'text-[10px] font-medium text-primary-700 bg-primary-50 px-1.5 py-0.5 rounded-full',
      sendBlocked: coolingActive,
    };
  }

  return { label: 'Verified', className: 'text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full', sendBlocked: false };
}

export default function Connections() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [connections, setConnections] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [newConnection, setNewConnection] = useState({
    name: '',
    email: '',
    country: '',
  });

  useEffect(() => {
    let mounted = true;

    async function loadRecipients() {
      if (!currentUser) {
        return;
      }

      const result = await recipientService.listRecipients(currentUser.id);
      if (mounted && result.ok && result.data) {
        setConnections(result.data);
      }
      if (mounted) {
        setLoading(false);
      }
    }

    void loadRecipients();

    return () => {
      mounted = false;
    };
  }, [currentUser]);

  const filteredConnections = useMemo(
    () =>
      connections.filter((connection) => {
        const matchesSearch =
          connection.name.toLowerCase().includes(search.toLowerCase()) ||
          connection.email.toLowerCase().includes(search.toLowerCase()) ||
          connection.country.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' || connection.isFavorite;
        return matchesSearch && matchesFilter;
      }),
    [connections, filter, search]
  );

  const toggleFavorite = async (id: string) => {
    if (!currentUser) {
      return;
    }

    const result = await recipientService.toggleFavorite(currentUser.id, id);
    if (result.ok && result.data) {
      setConnections((prev) => prev.map((item) => (item.id === id ? result.data! : item)));
    }
  };

  const handleAddConnection = async () => {
    if (!currentUser) {
      return;
    }

    if (!newConnection.name || !newConnection.email) {
      toast.error('Name and email are required');
      return;
    }

    const result = await recipientService.addRecipient(currentUser.id, {
      name: newConnection.name,
      email: newConnection.email,
      country: newConnection.country || 'Dominican Republic',
    });

    if (!result.ok || !result.data) {
      toast.error(result.error?.message || 'Unable to add recipient');
      return;
    }

    setConnections((prev) => [result.data!, ...prev]);
    setNewConnection({ name: '', email: '', country: '' });
    setShowAddForm(false);
    toast.success('Recipient added');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto pb-20 md:pb-6">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: smoothEase }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-950 font-display tracking-tight">People</h1>
            <p className="text-sm text-gray-500 mt-1">
              {connections.length} connections · {connections.filter((item) => item.isFavorite).length} favorites
            </p>
          </div>
          <motion.button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 hover:bg-gray-800 shadow-sm"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            <Plus className="w-4 h-4" />
            Add Person
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: smoothEase }}
              className="overflow-hidden mb-6"
            >
              <div className="rounded-2xl border border-gray-200/60 bg-white p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-gray-400" />
                    <h3 className="text-sm font-semibold text-gray-900">New Connection</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Full name"
                    value={newConnection.name}
                    onChange={(event) => setNewConnection((prev) => ({ ...prev, name: event.target.value }))}
                    className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:bg-white transition-all outline-none"
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={newConnection.email}
                    onChange={(event) => setNewConnection((prev) => ({ ...prev, email: event.target.value }))}
                    className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:bg-white transition-all outline-none"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Country"
                      value={newConnection.country}
                      onChange={(event) => setNewConnection((prev) => ({ ...prev, country: event.target.value }))}
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:bg-white transition-all outline-none"
                    />
                    <motion.button
                      type="button"
                      onClick={() => void handleAddConnection()}
                      className="px-4 py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Check className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1, ease: smoothEase }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search people..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200/60 bg-white/60 backdrop-blur-sm text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:bg-white transition-all outline-none"
            />
          </div>
          <div className="flex items-center gap-1 bg-gray-100/80 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-md text-[12px] font-semibold transition-colors ${
                filter === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilter('favorites')}
              className={`px-3 py-1.5 rounded-md text-[12px] font-semibold transition-colors flex items-center gap-1 ${
                filter === 'favorites' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Star className="w-3 h-3" />
              Favorites
            </button>
          </div>
        </motion.div>

        {loading ? (
          <div className="card text-sm text-gray-500">Loading recipients...</div>
        ) : (
          <div className="space-y-2">
            {filteredConnections.map((connection, index) => {
              const initial = connection.name
                .split(' ')
                .map((item) => item[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);
              const badge = stateLabel(connection);

              return (
                <motion.div
                  key={connection.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.04 * index, ease: smoothEase }}
                  className="group rounded-2xl border border-gray-200/40 bg-white/60 backdrop-blur-sm hover:bg-white hover:border-gray-200 hover:shadow-md transition-all duration-300 p-4"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-11 h-11 bg-gradient-to-br ${avatarColors[index % avatarColors.length]} rounded-xl flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0 shadow-sm`}
                    >
                      {initial}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900 truncate">{connection.name}</p>
                        <span className={badge.className}>{badge.label}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400">
                          {connection.countryFlag} {connection.country}
                        </span>
                        <span className="text-gray-300">·</span>
                        <span className="text-xs text-gray-400">{connection.email}</span>
                      </div>
                      {connection.state === 'validated_new' && connection.coolingOffEndsAt && connection.coolingOffEndsAt.getTime() > Date.now() && (
                        <div className="text-[11px] text-amber-700 mt-1">
                          Cooling-off ends {connection.coolingOffEndsAt.toLocaleString()}
                        </div>
                      )}
                    </div>

                    <div className="hidden sm:flex items-center gap-6 text-right">
                      <div>
                        <p className="text-xs text-gray-400">Total sent</p>
                        <p className="text-sm font-semibold text-gray-900">{toCurrency(connection.totalSentUsd || 0)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Last</p>
                        <p className="text-sm font-medium text-gray-600">
                          {connection.lastSentAt ? shortTimeAgo(connection.lastSentAt) : 'Never'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <motion.button
                        type="button"
                        onClick={() => void toggleFavorite(connection.id)}
                        className={`p-2 rounded-lg transition-all ${
                          connection.isFavorite
                            ? 'text-amber-500 bg-amber-50'
                            : 'text-gray-300 hover:text-amber-400 hover:bg-gray-50'
                        }`}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Star className={`w-4 h-4 ${connection.isFavorite ? 'fill-current' : ''}`} />
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={() => navigate('/send', { state: { recipientId: connection.id } })}
                        disabled={badge.sendBlocked}
                        className={`p-2 rounded-lg transition-all ${
                          badge.sendBlocked
                            ? 'text-gray-300 bg-gray-50 cursor-not-allowed'
                            : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100 opacity-0 group-hover:opacity-100'
                        }`}
                        whileHover={{ scale: badge.sendBlocked ? 1 : 1.05 }}
                        whileTap={{ scale: badge.sendBlocked ? 1 : 0.95 }}
                      >
                        {badge.sendBlocked ? <Lock className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {filteredConnections.length === 0 && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-900">No connections found</p>
            <p className="text-xs text-gray-400 mt-1">Try a different search or add a new person</p>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
