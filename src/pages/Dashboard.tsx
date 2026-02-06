import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/common/Layout';
import HeroBrandStatement from '../components/dashboard/HeroBrandStatement';
import HeroBalanceCard from '../components/dashboard/HeroBalanceCard';
import CollapsibleSection from '../components/dashboard/CollapsibleSection';
import AnimatedCounter from '../components/common/AnimatedCounter';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Send, Users, BarChart3, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  const recentTransactions = [
    {
      id: 1,
      recipient: 'Maria Rodriguez',
      country: '🇩🇴',
      countryName: 'Dominican Republic',
      amount: -150.00,
      status: 'completed',
      date: '2024-02-04',
      time: '14:32'
    },
    {
      id: 2,
      recipient: 'Carlos Mendez',
      country: '🇲🇽',
      countryName: 'Mexico',
      amount: -200.00,
      status: 'completed',
      date: '2024-02-03',
      time: '09:15'
    },
    {
      id: 3,
      recipient: 'Ana Garcia',
      country: '🇬🇹',
      countryName: 'Guatemala',
      amount: -75.00,
      status: 'processing',
      date: '2024-02-03',
      time: '16:45'
    },
    {
      id: 4,
      recipient: 'Luis Martinez',
      country: '🇩🇴',
      countryName: 'Dominican Republic',
      amount: -100.00,
      status: 'completed',
      date: '2024-02-02',
      time: '10:20'
    },
    {
      id: 5,
      recipient: 'Sofia Lopez',
      country: '🇲🇽',
      countryName: 'Mexico',
      amount: -300.00,
      status: 'completed',
      date: '2024-02-01',
      time: '15:55'
    },
  ];

  const displayedTransactions = showAllTransactions
    ? recentTransactions
    : recentTransactions.slice(0, 2);

  const chartData = [
    { month: 'Jan', amount: 400 },
    { month: 'Feb', amount: 300 },
    { month: 'Mar', amount: 600 },
    { month: 'Apr', amount: 800 },
    { month: 'May', amount: 500 },
    { month: 'Jun', amount: 700 },
  ];

  const stats = [
    {
      label: 'This Month',
      value: 425.00,
      change: '+12%',
      icon: TrendingUp,
      color: 'from-green-400 to-emerald-600',
    },
    {
      label: 'Total Sent',
      value: 2340.00,
      change: 'All time',
      icon: Send,
      color: 'from-blue-400 to-blue-600',
    },
    {
      label: 'Recipients',
      value: 8,
      change: '3 active',
      icon: Users,
      color: 'from-purple-400 to-purple-600',
      isInteger: true
    },
  ];

  return (
    <Layout>
      <div className="space-y-12 pb-20 md:pb-6">
        {/* Hero Brand Statement */}
        <HeroBrandStatement />

        {/* Massive Hero Balance Card */}
        <HeroBalanceCard />

        {/* Dimmed Secondary Content Starts Here */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="space-y-8"
        >
          {/* Stats Grid - Dimmed, Small, Hoverable */}
          <div className="opacity-60 hover:opacity-100 transition-opacity duration-500">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 2.6 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Quick Stats</h2>
                <span className="text-sm text-gray-500">Hover to focus</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="relative overflow-hidden group cursor-pointer"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10 rounded-2xl`} />
                    <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white shadow`}>
                          <stat.icon className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {stat.change}
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {stat.isInteger ? (
                          stat.value
                        ) : (
                          <>$<AnimatedCounter value={stat.value} decimals={2} duration={1500} /></>
                        )}
                      </div>
                      <div className="text-sm font-medium text-gray-600">{stat.label}</div>

                      {/* Hover Reveal - "View Details" */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileHover={{ opacity: 1, y: 0 }}
                        className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <span className="text-xs text-primary-600 font-semibold">View →</span>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Collapsible Spending Chart */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2.8 }}
            className="opacity-60 hover:opacity-100 transition-opacity duration-500"
          >
            <CollapsibleSection
              title="Spending Overview"
              subtitle="$425 this month · +12% from last month"
              icon={<BarChart3 className="w-6 h-6" />}
              defaultOpen={false}
            >
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="month"
                      stroke="#9ca3af"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis
                      stroke="#9ca3af"
                      style={{ fontSize: '12px' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '12px',
                        border: '1px solid rgba(0,0,0,0.1)',
                        backdropFilter: 'blur(8px)'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#0ea5e9"
                      strokeWidth={3}
                      fill="url(#colorAmount)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CollapsibleSection>
          </motion.div>

          {/* Recent Transactions - Show 2, Expand for More */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 3 }}
            className="opacity-60 hover:opacity-100 transition-opacity duration-500"
          >
            <div className="card-glass p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Recent Transactions</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {showAllTransactions ? 'All transactions' : 'Latest 2 transactions'}
                  </p>
                </div>
                {!showAllTransactions && (
                  <span className="text-xs bg-primary-100 text-primary-700 px-3 py-1 rounded-full font-semibold">
                    {recentTransactions.length - 2} more
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {displayedTransactions.map((tx) => (
                  <motion.div
                    key={tx.id}
                    whileHover={{ x: 5, scale: 1.01 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-transparent rounded-xl hover:from-primary-50 hover:to-transparent transition-all cursor-pointer border border-transparent hover:border-primary-200"
                    onClick={() => navigate('/transactions')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm border border-gray-100">
                        {tx.country}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{tx.recipient}</div>
                        <div className="text-sm text-gray-500">{tx.countryName} • {tx.time}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-gray-900">
                        ${Math.abs(tx.amount).toFixed(2)}
                      </div>
                      <div className={`text-xs font-semibold flex items-center gap-1 justify-end ${
                        tx.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        <div className={`w-2 h-2 rounded-full animate-pulse ${
                          tx.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                        }`} />
                        {tx.status === 'completed' ? 'Completed' : 'Processing'}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Expand/Collapse Button */}
              <motion.div className="mt-6 text-center">
                <button
                  onClick={() => setShowAllTransactions(!showAllTransactions)}
                  className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-sm group"
                >
                  {showAllTransactions ? (
                    <>
                      <span>Show Less</span>
                      <motion.div
                        animate={{ rotate: 180 }}
                        className="group-hover:-translate-y-1 transition-transform"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <span>View All {recentTransactions.length} Transactions</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </motion.div>
            </div>
          </motion.div>

          {/* Technical Agent Notice - Subtle */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 3.2 }}
            className="opacity-50 hover:opacity-100 transition-opacity duration-500"
          >
            <div className="relative overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-5" />
              <div className="relative bg-white/60 backdrop-blur-sm border border-blue-200 rounded-2xl p-5">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white flex-shrink-0 text-lg">
                    🔒
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 mb-1">Technical Agent Architecture</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      VentoVault orchestrates licensed partners. No customer funds are held by VentoVault.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
}
