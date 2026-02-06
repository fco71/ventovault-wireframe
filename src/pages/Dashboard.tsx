import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import HeroBrandStatement from '../components/dashboard/HeroBrandStatement';
import HeroBalanceCard from '../components/dashboard/HeroBalanceCard';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Send, Users, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'activity' | 'spending'>('activity');
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
    : recentTransactions.slice(0, 3);

  const chartData = [
    { month: 'Jan', amount: 400 },
    { month: 'Feb', amount: 300 },
    { month: 'Mar', amount: 600 },
    { month: 'Apr', amount: 800 },
    { month: 'May', amount: 500 },
    { month: 'Jun', amount: 700 },
  ];

  const stats = [
    { label: 'This Month', value: '$425', change: '+12%', icon: TrendingUp },
    { label: 'Total Sent', value: '$2,340', change: 'All time', icon: Send },
    { label: 'Recipients', value: '8', change: '3 active', icon: Users },
  ];

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-5 pb-20 md:pb-6">
        <div className="focus-stage">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: smoothEase }}
            className="focus-intro"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-primary-700/80">
              Command Center
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Primary decisions first. Supporting detail reveals as you explore.
            </p>
          </motion.div>

          <section className="focus-panel focus-panel-active space-y-6">
            <HeroBrandStatement />
            <HeroBalanceCard />
          </section>

          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: smoothEase }}
            className="focus-panel focus-panel-muted"
          >
            <div className="grid grid-cols-3 gap-3 md:gap-4 rounded-2xl border border-white/70 bg-white/60 p-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/60 bg-white/70 p-4"
                >
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {stat.label}
                  </p>
                  <p className="text-lg md:text-xl font-bold text-gray-900 mt-1 font-display">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{stat.change}</p>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3, ease: smoothEase }}
            className="focus-panel focus-panel-muted"
          >
            <div className="rounded-2xl border border-white/70 bg-white/60 p-5">
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 w-fit mb-6">
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                    activeTab === 'activity'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Recent Activity
                </button>
                <button
                  onClick={() => setActiveTab('spending')}
                  className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                    activeTab === 'spending'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Spending
                </button>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'activity' ? (
                  <motion.div
                    key="activity"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 p-5">
                      <div className="space-y-1">
                        {displayedTransactions.map((tx) => (
                          <div
                            key={tx.id}
                            onClick={() => navigate('/transactions')}
                            className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                                {tx.country}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{tx.recipient}</p>
                                <p className="text-xs text-gray-500">{tx.countryName}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-gray-900">
                                -${Math.abs(tx.amount).toFixed(2)}
                              </p>
                              <p className={`text-xs font-medium ${
                                tx.status === 'completed' ? 'text-emerald-600' : 'text-amber-600'
                              }`}>
                                {tx.status === 'completed' ? 'Completed' : 'Processing'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-100 text-center">
                        <button
                          onClick={() => setShowAllTransactions(!showAllTransactions)}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          {showAllTransactions ? (
                            <span>Show less</span>
                          ) : (
                            <>
                              <span>View all {recentTransactions.length} transactions</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="spending"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Monthly Spending</p>
                          <p className="text-xs text-gray-500 mt-0.5">Last 6 months</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">$425</p>
                          <p className="text-xs text-emerald-600 font-medium">+12% this month</p>
                        </div>
                      </div>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData}>
                            <defs>
                              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0e7490" stopOpacity={0.12} />
                                <stop offset="95%" stopColor="#0e7490" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <XAxis
                              dataKey="month"
                              stroke="#94a3b8"
                              tickLine={false}
                              axisLine={false}
                              style={{ fontSize: '11px', fontFamily: 'Manrope' }}
                            />
                            <YAxis hide />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                fontSize: '13px',
                                fontFamily: 'Manrope'
                              }}
                              formatter={(value) => [`$${Number(value ?? 0)}`, 'Sent']}
                            />
                            <Area
                              type="monotone"
                              dataKey="amount"
                              stroke="#0e7490"
                              strokeWidth={2}
                              fill="url(#colorAmount)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>
        </div>

        <p className="text-xs text-gray-400 text-center">
          VentoVault orchestrates licensed partners. No customer funds are held.
        </p>
      </div>
    </Layout>
  );
}
