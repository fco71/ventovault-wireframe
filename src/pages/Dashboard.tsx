import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import HeroBrandStatement from '../components/dashboard/HeroBrandStatement';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Send, Users, ArrowRight, ArrowUpRight, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { transferService } from '../services';
import { DashboardData, Transaction } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { toCountryCode } from '../utils/country';

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Skeleton components ─────────────────────── */
function KpiSkeleton() {
  return (
    <div className="vv-kpi-card">
      <div className="flex items-center justify-between mb-3">
        <div className="vv-skeleton w-4 h-4 rounded-lg" />
        <div className="vv-skeleton-text w-10" />
      </div>
      <div className="vv-skeleton-text w-24 h-5 mb-2" />
      <div className="vv-skeleton-text w-16" />
    </div>
  );
}

function ActivityRowSkeleton({ delay }: { delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.2 }}
      className="flex items-center justify-between py-3 px-2 -mx-2"
    >
      <div className="flex items-center gap-3">
        <div className="vv-skeleton w-9 h-9 rounded-lg" />
        <div>
          <div className="vv-skeleton-text w-28 h-3.5 mb-1.5" />
          <div className="vv-skeleton-text w-20 h-2.5" />
        </div>
      </div>
      <div className="text-right">
        <div className="vv-skeleton-text w-16 h-3.5 mb-1.5 ml-auto" />
        <div className="vv-skeleton-text w-12 h-2.5 ml-auto" />
      </div>
    </motion.div>
  );
}

/* ── Empty state ─────────────────────────────── */
function EmptyDashboard() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: smoothEase }}
      className="vv-panel text-center py-14"
    >
      {/* Animated illustration */}
      <div className="relative w-20 h-20 mx-auto mb-6">
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50"
          animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Send className="w-8 h-8 text-primary-600" />
        </div>
        <motion.div
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent-100 flex items-center justify-center"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        >
          <ArrowUpRight className="w-3 h-3 text-accent-600" />
        </motion.div>
      </div>

      <h3 className="text-[15px] font-bold text-gray-900 font-display mb-1.5">
        You&apos;re all set up
      </h3>
      <p className="text-[13px] text-gray-500 max-w-xs mx-auto mb-6 leading-relaxed">
        Start by adding a recipient, then send your first transfer. It only takes a minute.
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        <motion.button
          onClick={() => navigate('/connections')}
          className="btn btn-primary px-5 py-2.5 text-[13px] inline-flex items-center gap-2"
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.97 }}
        >
          <UserPlus className="w-4 h-4" />
          Add a recipient
        </motion.button>
        <motion.button
          onClick={() => navigate('/send')}
          className="btn btn-secondary px-4 py-2.5 text-[13px] inline-flex items-center gap-2"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
        >
          <Send className="w-4 h-4" />
          Send Money
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ── Stagger container ───────────────────────── */
const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.12,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: smoothEase } },
};

/* ── Main dashboard ──────────────────────────── */
export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'activity' | 'spending'>('activity');
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      if (!currentUser) {
        return;
      }

      setLoading(true);
      const result = await transferService.getDashboardData(currentUser.id);
      if (mounted && result.ok && result.data) {
        setDashboardData(result.data);
      }
      if (mounted) {
        setLoading(false);
      }
    }

    void loadDashboard();

    return () => {
      mounted = false;
    };
  }, [currentUser]);

  const recentTransactions = useMemo(
    () => dashboardData?.recentTransactions ?? [],
    [dashboardData]
  );

  const displayedTransactions = showAllTransactions
    ? recentTransactions
    : recentTransactions.slice(0, 3);

  const chartData = dashboardData?.monthlySpending || [];
  const pendingCount = useMemo(
    () => recentTransactions.filter((tx) => tx.status !== 'completed').length,
    [recentTransactions]
  );
  const lastSendTransaction = useMemo(
    () => recentTransactions.find((tx) => tx.type === 'send') || null,
    [recentTransactions]
  );

  const stats = useMemo(() => {
    if (!dashboardData) {
      return [
        { label: 'This Month', value: '$0.00', change: '+0%', icon: TrendingUp },
        { label: 'Total Sent', value: '$0.00', change: 'All time', icon: Send },
        { label: 'Recipients', value: '0', change: '0 active', icon: Users },
      ];
    }

    return [
      {
        label: 'This Month',
        value: `$${dashboardData.stats.thisMonthUsd.toFixed(2)}`,
        change: `${dashboardData.stats.thisMonthDeltaPercent >= 0 ? '+' : ''}${dashboardData.stats.thisMonthDeltaPercent}%`,
        icon: TrendingUp,
      },
      {
        label: 'Total Sent',
        value: `$${dashboardData.stats.totalSentUsd.toFixed(2)}`,
        change: 'All time',
        icon: Send,
      },
      {
        label: 'Recipients',
        value: `${dashboardData.stats.recipientCount}`,
        change: `${dashboardData.stats.activeRecipientCount} active`,
        icon: Users,
      },
    ];
  }, [dashboardData]);

  const formatRecipient = (tx: Transaction) => tx.type === 'receive' ? tx.from.name : tx.to.name;
  const formatCountry = (tx: Transaction) => tx.type === 'receive' ? 'United States' : tx.to.country;
  const formatCountryCode = (tx: Transaction) => toCountryCode(formatCountry(tx));
  const hasTransactions = !loading && recentTransactions.length > 0;
  const isEmpty = !loading && recentTransactions.length === 0;

  const repeatTransfer = (tx: Transaction) => {
    if (tx.type !== 'send') {
      return;
    }

    navigate('/send', {
      state: {
        recipientId: tx.to.id,
        presetAmount: tx.amount,
        presetNote: tx.note,
        focusStep: 'amount',
      },
    });
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto pb-20 md:pb-6">
        <HeroBrandStatement />

        {/* Status chips */}
        {hasTransactions && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1, ease: smoothEase }}
            className="mt-4 flex flex-wrap items-center gap-2.5"
          >
            <span className="vv-chip vv-chip-hot">{recentTransactions.length} transfers</span>
            {pendingCount > 0 && (
              <span className="vv-chip vv-chip-accent">{pendingCount} pending</span>
            )}
            {lastSendTransaction && (
              <button
                type="button"
                onClick={() => repeatTransfer(lastSendTransaction)}
                className="vv-chip text-primary-700 hover:text-primary-800 hover:border-primary-200 transition-colors"
              >
                Repeat last transfer
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </motion.div>
        )}

        {/* KPI cards — skeleton while loading, hidden when no data */}
        {loading && (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 mb-5"
          >
            <KpiSkeleton />
            <KpiSkeleton />
            <KpiSkeleton />
          </motion.div>
        )}
        {hasTransactions && (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 mb-5"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={staggerItem}
                className="group vv-kpi-card"
              >
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="w-3.5 h-3.5 text-gray-400 group-hover:text-primary-600 transition-colors duration-300" />
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.14em] group-hover:text-gray-600 transition-colors duration-300">
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl md:text-[1.65rem] font-bold text-gray-950 font-display leading-tight">
                  {stat.value}
                </p>
                <p className="text-[11px] text-gray-400 mt-1 uppercase tracking-[0.16em]">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty state */}
        {isEmpty && <EmptyDashboard />}

        {/* Activity / Spending panel */}
        {(hasTransactions || loading) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25, ease: smoothEase }}
            className="vv-panel"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-1 bg-white/80 border border-white/80 rounded-lg p-1 shadow-sm">
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`px-3.5 py-1.5 rounded-md text-[13px] font-semibold transition-all ${
                    activeTab === 'activity'
                      ? 'bg-gray-950 text-white shadow-[0_12px_24px_-16px_rgba(8,25,49,0.68)]'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Recent
                </button>
                <button
                  onClick={() => setActiveTab('spending')}
                  className={`px-3.5 py-1.5 rounded-md text-[13px] font-semibold transition-all ${
                    activeTab === 'spending'
                      ? 'bg-gray-950 text-white shadow-[0_12px_24px_-16px_rgba(8,25,49,0.68)]'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Spending
                </button>
              </div>
              <button
                onClick={() => navigate('/transactions')}
                className="text-[12px] font-semibold text-gray-400 hover:text-gray-800 transition-colors"
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
                  {loading ? (
                    <div className="space-y-0.5">
                      {[0, 1, 2].map((i) => (
                        <ActivityRowSkeleton key={i} delay={i * 0.08} />
                      ))}
                    </div>
                  ) : (
                    <motion.div
                      variants={staggerContainer}
                      initial="hidden"
                      animate="show"
                      className="space-y-0.5"
                    >
                      {displayedTransactions.map((tx) => (
                        <motion.div
                          key={tx.id}
                          variants={staggerItem}
                          onClick={() => navigate('/transactions')}
                          className="vv-activity-row group/row"
                        >
                          <div className="flex items-center gap-3">
                            <div className="vv-country-badge w-9 h-9 rounded-lg text-[11px] flex-shrink-0">
                              {formatCountryCode(tx)}
                            </div>
                            <div>
                              <p className="text-[13px] font-semibold text-gray-900">{formatRecipient(tx)}</p>
                              <p className="text-[11px] text-gray-500">{formatCountry(tx)}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {tx.type === 'send' && (
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  repeatTransfer(tx);
                                }}
                                className="vv-row-action text-[11px] font-semibold text-primary-600 flex items-center gap-1 hover:text-primary-700"
                              >
                                Send again
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                            <div className="text-right">
                              <p className="text-[13px] font-semibold text-gray-900">
                                {tx.type === 'send' ? '-' : '+'}${Math.abs(tx.amount).toFixed(2)}
                              </p>
                              <p className={`text-[10px] font-medium ${
                                tx.status === 'completed' ? 'text-emerald-600' : 'text-amber-500'
                              }`}>
                                {tx.status === 'completed' ? 'Completed' : 'Processing'}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {recentTransactions.length > 3 && (
                    <div className="mt-3 pt-3 border-t border-gray-100 text-center">
                      <button
                        onClick={() => setShowAllTransactions(!showAllTransactions)}
                        className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-gray-400 hover:text-gray-800 transition-colors"
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
                      <p className="text-[13px] font-semibold text-gray-900">Monthly spending</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">Last 6 months</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[13px] font-bold text-gray-900">
                        ${dashboardData?.stats.thisMonthUsd.toFixed(2) || '0.00'}
                      </p>
                      <p className="text-[10px] text-emerald-600 font-medium">
                        +{dashboardData?.stats.thisMonthDeltaPercent.toFixed(1) || '0'}% this month
                      </p>
                    </div>
                  </div>
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0e7490" stopOpacity={0.28} />
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
                            backgroundColor: 'rgba(255,255,255,0.95)',
                            borderRadius: '12px',
                            border: '1px solid rgba(203,213,225,0.75)',
                            boxShadow: '0 12px 28px -20px rgba(8,25,49,0.7)',
                            fontSize: '12px',
                            fontFamily: 'Manrope',
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
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        <p className="text-[10px] text-gray-400 text-center mt-10 uppercase tracking-[0.14em]">
          VentoVault partners with licensed providers. Your funds are never held by us.
        </p>
      </div>
    </Layout>
  );
}
