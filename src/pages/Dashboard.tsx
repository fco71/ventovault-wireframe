import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/common/Layout';
import { Eye, EyeOff, ArrowUpRight, ArrowDownLeft, BarChart3, Settings, Gift, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCountUp } from '../hooks/useCountUp';
import SpendingChart from '../components/charts/SpendingChart';
import ActivityChart from '../components/charts/ActivityChart';
import Card from '../components/ui/Card';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  const balance = currentUser?.balance || 1000;
  const animatedBalance = useCountUp(mounted ? balance : 0, 1500, 100);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mock data for demo
  const recentTransactions = [
    {
      id: '1',
      type: 'send',
      recipient: 'Maria Rodriguez',
      amount: 250.00,
      date: '2 hours ago',
      status: 'completed',
      flag: '🇩🇴'
    },
    {
      id: '2',
      type: 'receive',
      recipient: 'Carlos Jimenez',
      amount: 150.00,
      date: '1 day ago',
      status: 'completed',
      flag: '🇩🇴'
    },
    {
      id: '3',
      type: 'send',
      recipient: 'Ana Santos',
      amount: 300.00,
      date: '2 days ago',
      status: 'completed',
      flag: '🇲🇽'
    }
  ];

  return (
    <Layout>
      <div className="space-y-6 pb-20 md:pb-6">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {currentUser?.displayName?.split(' ')[0]}!
          </h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your account</p>
        </motion.div>

        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative overflow-hidden"
        >
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 animate-gradient" />

          {/* Floating orbs */}
          <motion.div
            className="absolute top-0 right-0 w-64 h-64 bg-primary-400/30 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <div className="card relative bg-transparent text-white shadow-glow border-0">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-primary-100 text-sm flex items-center gap-2"
                >
                  Available Balance
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                  >
                    <TrendingUp className="w-4 h-4 text-success-400" />
                  </motion.span>
                </motion.p>
                <motion.h2
                  className="text-5xl font-bold mt-2 transition-all"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {balanceVisible ? (
                    <span className="tabular-nums">
                      ${animatedBalance.toFixed(2)}
                    </span>
                  ) : (
                    '••••••'
                  )}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-primary-200 text-sm mt-2"
                >
                  +$120.50 this week
                </motion.p>
              </div>
              <motion.button
                onClick={() => setBalanceVisible(!balanceVisible)}
                className="p-3 bg-white/10 backdrop-blur rounded-xl hover:bg-white/20 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  key={balanceVisible ? 'visible' : 'hidden'}
                  initial={{ rotate: 180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {balanceVisible ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </motion.div>
              </motion.button>
            </div>
            <div className="flex gap-3 mt-8">
              <Link to="/send" className="flex-1">
                <motion.div
                  className="bg-white text-primary-700 py-3.5 px-4 rounded-xl font-semibold text-center hover:shadow-xl transition-all"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Send Money
                </motion.div>
              </Link>
              <Link to="/receive" className="flex-1">
                <motion.div
                  className="bg-white/10 backdrop-blur text-white py-3.5 px-4 rounded-xl font-semibold text-center hover:bg-white/20 transition-all border border-white/20"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Request
                </motion.div>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { to: '/send', icon: ArrowUpRight, label: 'Send Money', desc: 'Transfer funds', gradient: 'from-primary-500 to-primary-700' },
            { to: '/receive', icon: ArrowDownLeft, label: 'Receive', desc: 'Request payment', gradient: 'from-success-500 to-success-700' },
            { to: '/transactions', icon: BarChart3, label: 'Activity', desc: 'View history', gradient: 'from-purple-500 to-purple-700' },
            { to: '/settings', icon: Settings, label: 'Settings', desc: 'Manage account', gradient: 'from-gray-600 to-gray-800' },
          ].map((action, index) => (
            <Link key={action.to} to={action.to}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
              >
                <Card variant="interactive" hover3d className="group">
                  <motion.div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-3 shadow-lg`}
                    whileHover={{ rotate: [0, -5, 5, -5, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <action.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <div className="font-semibold text-gray-900">{action.label}</div>
                  <div className="text-sm text-gray-500 mt-1">{action.desc}</div>
                </Card>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <SpendingChart />
          <ActivityChart />
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: 12, label: 'Transactions', delay: 0.4 },
            { value: 2.4, label: 'Total Sent', prefix: '$', suffix: 'K', delay: 0.45 },
            { value: 5, label: 'Recipients', delay: 0.5 },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: stat.delay }}
            >
              <Card className="text-center group hover:border-primary-200 border border-transparent transition-all">
                <motion.div
                  className="text-3xl font-bold text-gray-900"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: stat.delay + 0.1 }}
                >
                  {stat.prefix}{stat.value}{stat.suffix}
                </motion.div>
                <div className="text-sm text-gray-500 mt-2">{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
              <Link to="/transactions" className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1 group">
                View All
                <motion.span
                  className="inline-block"
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </Link>
            </div>

            <div className="space-y-3">
              {recentTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 hover:shadow-md transition-all cursor-pointer group"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center gap-4">
                    <motion.div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
                        transaction.type === 'send' ? 'bg-red-100' : 'bg-green-100'
                      }`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {transaction.type === 'send' ? (
                        <ArrowUpRight className="w-5 h-5 text-red-600" />
                      ) : (
                        <ArrowDownLeft className="w-5 h-5 text-green-600" />
                      )}
                    </motion.div>
                    <div>
                      <div className="font-semibold text-gray-900 flex items-center gap-2">
                        <span>{transaction.flag}</span>
                        {transaction.recipient}
                      </div>
                      <div className="text-sm text-gray-500">{transaction.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${
                      transaction.type === 'send' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {transaction.type === 'send' ? '-' : '+'}${transaction.amount.toFixed(2)}
                    </div>
                    <span className={`inline-flex mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      transaction.status === 'completed' ? 'bg-success-50 text-success-700' : 'bg-warning-50 text-warning-700'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Promotional Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className="relative overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-xl">
            <motion.div
              className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, 180, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <div className="relative flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <motion.div
                  className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Gift className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-lg font-bold mb-1">Invite friends, earn rewards!</h3>
                  <p className="text-purple-100 text-sm">Get $25 for every friend who signs up</p>
                </div>
              </div>
              <motion.button
                className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all whitespace-nowrap"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Invite Now
              </motion.button>
            </div>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
}
