import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Send, Star, X, Check, UserPlus } from 'lucide-react';

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface Connection {
  id: number;
  name: string;
  email: string;
  country: string;
  countryFlag: string;
  lastSent: string;
  totalSent: string;
  favorite: boolean;
  avatar: string;
  status: 'verified' | 'pending';
}

const mockConnections: Connection[] = [
  {
    id: 1, name: 'Maria Rodriguez', email: 'maria.r@email.com',
    country: 'Dominican Republic', countryFlag: '\u{1F1E9}\u{1F1F4}',
    lastSent: '2 days ago', totalSent: '$2,450', favorite: true,
    avatar: 'MR', status: 'verified',
  },
  {
    id: 2, name: 'Carlos Mendez', email: 'carlos.m@email.com',
    country: 'Mexico', countryFlag: '\u{1F1F2}\u{1F1FD}',
    lastSent: '1 week ago', totalSent: '$1,820', favorite: true,
    avatar: 'CM', status: 'verified',
  },
  {
    id: 3, name: 'Ana Garcia', email: 'ana.garcia@email.com',
    country: 'Guatemala', countryFlag: '\u{1F1EC}\u{1F1F9}',
    lastSent: '3 days ago', totalSent: '$675', favorite: false,
    avatar: 'AG', status: 'verified',
  },
  {
    id: 4, name: 'Luis Martinez', email: 'luis.mtz@email.com',
    country: 'Dominican Republic', countryFlag: '\u{1F1E9}\u{1F1F4}',
    lastSent: '2 weeks ago', totalSent: '$1,100', favorite: false,
    avatar: 'LM', status: 'verified',
  },
  {
    id: 5, name: 'Sofia Lopez', email: 'sofia.l@email.com',
    country: 'Mexico', countryFlag: '\u{1F1F2}\u{1F1FD}',
    lastSent: '1 month ago', totalSent: '$3,200', favorite: false,
    avatar: 'SL', status: 'verified',
  },
  {
    id: 6, name: 'Pedro Ramirez', email: 'pedro.r@email.com',
    country: 'Honduras', countryFlag: '\u{1F1ED}\u{1F1F3}',
    lastSent: 'Never', totalSent: '$0', favorite: false,
    avatar: 'PR', status: 'pending',
  },
];

const avatarColors = [
  'from-primary-400 to-primary-600',
  'from-violet-400 to-violet-600',
  'from-amber-400 to-amber-600',
  'from-emerald-400 to-emerald-600',
  'from-rose-400 to-rose-600',
  'from-sky-400 to-sky-600',
];

export default function Connections() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [connections, setConnections] = useState(mockConnections);
  const [newConnection, setNewConnection] = useState({
    name: '', email: '', country: '',
  });

  const filteredConnections = connections.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.country.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || c.favorite;
    return matchesSearch && matchesFilter;
  });

  const toggleFavorite = (id: number) => {
    setConnections(prev => prev.map(c =>
      c.id === id ? { ...c, favorite: !c.favorite } : c
    ));
  };

  const handleAddConnection = () => {
    if (!newConnection.name || !newConnection.email) return;
    const newConn: Connection = {
      id: Date.now(),
      name: newConnection.name,
      email: newConnection.email,
      country: newConnection.country || 'Unknown',
      countryFlag: '\u{1F30D}',
      lastSent: 'Never',
      totalSent: '$0',
      favorite: false,
      avatar: newConnection.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      status: 'pending',
    };
    setConnections(prev => [newConn, ...prev]);
    setNewConnection({ name: '', email: '', country: '' });
    setShowAddForm(false);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto pb-20 md:pb-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: smoothEase }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-950 font-display tracking-tight">
              People
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {connections.length} connections &middot; {connections.filter(c => c.favorite).length} favorites
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

        {/* Add Connection Form — slides in */}
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
                    onChange={(e) => setNewConnection(prev => ({ ...prev, name: e.target.value }))}
                    className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:bg-white transition-all outline-none"
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={newConnection.email}
                    onChange={(e) => setNewConnection(prev => ({ ...prev, email: e.target.value }))}
                    className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:bg-white transition-all outline-none"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Country"
                      value={newConnection.country}
                      onChange={(e) => setNewConnection(prev => ({ ...prev, country: e.target.value }))}
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:bg-white transition-all outline-none"
                    />
                    <motion.button
                      onClick={handleAddConnection}
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

        {/* Search + Filter */}
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
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200/60 bg-white/60 backdrop-blur-sm text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:bg-white transition-all outline-none"
            />
          </div>
          <div className="flex items-center gap-1 bg-gray-100/80 rounded-lg p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-md text-[12px] font-semibold transition-colors ${
                filter === 'all'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('favorites')}
              className={`px-3 py-1.5 rounded-md text-[12px] font-semibold transition-colors flex items-center gap-1 ${
                filter === 'favorites'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Star className="w-3 h-3" />
              Favorites
            </button>
          </div>
        </motion.div>

        {/* Connections List */}
        <div className="space-y-2">
          {filteredConnections.map((connection, index) => (
            <motion.div
              key={connection.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.04 * index, ease: smoothEase }}
              className="group rounded-2xl border border-gray-200/40 bg-white/60 backdrop-blur-sm hover:bg-white hover:border-gray-200 hover:shadow-md transition-all duration-300 p-4"
            >
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className={`w-11 h-11 bg-gradient-to-br ${avatarColors[index % avatarColors.length]} rounded-xl flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0 shadow-sm`}>
                  {connection.avatar}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900 truncate">{connection.name}</p>
                    {connection.status === 'verified' && (
                      <div className="w-4 h-4 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-2.5 h-2.5 text-emerald-600" />
                      </div>
                    )}
                    {connection.status === 'pending' && (
                      <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">Pending</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-400">{connection.countryFlag} {connection.country}</span>
                    <span className="text-gray-300">&middot;</span>
                    <span className="text-xs text-gray-400">{connection.email}</span>
                  </div>
                </div>

                {/* Stats — visible on hover or always on mobile */}
                <div className="hidden sm:flex items-center gap-6 text-right">
                  <div>
                    <p className="text-xs text-gray-400">Total sent</p>
                    <p className="text-sm font-semibold text-gray-900">{connection.totalSent}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Last</p>
                    <p className="text-sm font-medium text-gray-600">{connection.lastSent}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5">
                  <motion.button
                    onClick={() => toggleFavorite(connection.id)}
                    className={`p-2 rounded-lg transition-all ${
                      connection.favorite
                        ? 'text-amber-500 bg-amber-50'
                        : 'text-gray-300 hover:text-amber-400 hover:bg-gray-50'
                    }`}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Star className={`w-4 h-4 ${connection.favorite ? 'fill-current' : ''}`} />
                  </motion.button>
                  <motion.button
                    onClick={() => navigate('/send')}
                    className="p-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all opacity-0 group-hover:opacity-100"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty state */}
        {filteredConnections.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
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
