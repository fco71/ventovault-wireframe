import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import HeroBrandStatement from '../components/dashboard/HeroBrandStatement';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Send, Users, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'activity' | 'spending'>('activity');
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  const recentTransactions = [
    { id: 1, recipient: 'Maria Rodriguez', country: '\u{1F1E9}\u{1F1F4}', countryName: 'Dominican Republic', amount: -150.00, status: 'completed', date: '2024-02-04', time: '14:32' },
    { id: 2, recipient: 'Carlos Mendez', country: '\u{1F1F2}\u{1F1FD}', countryName: 'Mexico', amount: -200.00, status: 'completed', date: '2024-02-03', time: '09:15' },
    { id: 3, recipient: 'Ana Garcia', country: '\u{1F1EC}\u{1F1F9}', countryName: 'Guatemala', amount: -75.00, status: 'processing', date: '2024-02-03', time: '16:45' },
    { id: 4, recipient: 'Luis Martinez', country: '\u{1F1E9}\u{1F1F4}', countryName: 'Dominican Republic', amount: -100.00, status: 'completed', date: '2024-02-02', time: '10:20' },
    { id: 5, recipient: 'Sofia Lopez', country: '\u{1F1F2}\u{1F1FD}', countryName: 'Mexico', amount: -300.00, status: 'completed', date: '2024-02-01', time: '15:55' },
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
      <div className="max-w-4xl mx-auto pb-20 md:pb-6">

        {/* ── Hero ── */}
        <HeroBrandStatement />

        {/* ── Divider ── */}
        <div className="border-t border-gray-200/50 my-10" />

        {/* ── Stats ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease: smoothEase }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + 0.05 * index, ease: smoothEase }}
              className="group rounded-xl border border-gray-200/60 bg-white/70 backdrop-blur-sm p-4 hover:bg-white hover:shadow-md hover:border-gray-200 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="w-3.5 h-3.5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">
                  {stat.change}
                </span>
              </div>
              <p className="text-lg md:text-xl font-bold text-gray-900 font-display">
                {stat.value}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Activity ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25, ease: smoothEase }}
          className="rounded-xl border border-gray-200/60 bg-white/70 backdrop-blur-sm p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-1 bg-gray-100/80 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('activity')}
                className={`px-3.5 py-1.5 rounded-md text-[13px] font-semibold transition-colors ${
                  activeTab === 'activity'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Recent Activity
              </button>
              <button
                onClick={() => setActiveTab('spending')}
                className={`px-3.5 py-1.5 rounded-md text-[13px] font-semibold transition-colors ${
                  activeTab === 'spending'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Spending
              </button>
            </div>
            <button
              onClick={() => navigate('/transactions')}
              className="text-[12px] font-medium text-gray-400 hover:text-gray-600 transition-colors"
            >
              View all
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
                <div className="space-y-0.5">
                  {displayedTransactions.map((tx) => (
                    <div
                      key={tx.id}
                      onClick={() => navigate('/transactions')}
                      className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50/80 -mx-2 px-2 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-base flex-shrink-0">
                          {tx.country}
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-gray-900">{tx.recipient}</p>
                          <p className="text-[11px] text-gray-400">{tx.countryName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[13px] font-semibold text-gray-900">
                          -${Math.abs(tx.amount).toFixed(2)}
                        </p>
                        <p className={`text-[10px] font-medium ${
                          tx.status === 'completed' ? 'text-emerald-600' : 'text-amber-500'
                        }`}>
                          {tx.status === 'completed' ? 'Completed' : 'Processing'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {recentTransactions.length > 3 && (
                  <div className="mt-3 pt-3 border-t border-gray-100 text-center">
                    <button
                      onClick={() => setShowAllTransactions(!showAllTransactions)}
                      className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-gray-400 hover:text-gray-700 transition-colors"
                    >
                      {showAllTransactions ? (
                        <span>Show less</span>
                      ) : (
                        <>
                          <span>View all {recentTransactions.length} transactions</span>
                          <ArrowRight className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="spending"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[13px] font-semibold text-gray-900">Monthly Spending</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Last 6 months</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] font-bold text-gray-900">$425</p>
                    <p className="text-[10px] text-emerald-600 font-medium">+12% this month</p>
                  </div>
                </div>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0e7490" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#0e7490" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="month"
                        stroke="#d1d5db"
                        tickLine={false}
                        axisLine={false}
                        style={{ fontSize: '11px', fontFamily: 'Manrope' }}
                      />
                      <YAxis hide />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          borderRadius: '8px',
                          border: '1px solid #e5e7eb',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                          fontSize: '12px',
                          fontFamily: 'Manrope'
                        }}
                        formatter={(value) => [`$${Number(value ?? 0)}`, 'Sent']}
                      />
                      <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#0e7490"
                        strokeWidth={1.5}
                        fill="url(#colorAmount)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <p className="text-[10px] text-gray-300 text-center mt-10">
          VentoVault orchestrates licensed partners. No customer funds are held.
        </p>
      </div>
    </Layout>
  );
}
