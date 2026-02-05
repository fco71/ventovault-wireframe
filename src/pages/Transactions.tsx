import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/common/Layout';
import { ArrowUpRight, ArrowDownLeft, Download, Search, Filter } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

export default function Transactions() {
  const [filter, setFilter] = useState<'all' | 'send' | 'receive'>('all');

  const transactions = [
    { id: '1', type: 'send', to: 'Maria Rodriguez', amount: 250, date: '2024-02-04', status: 'completed', flag: '🇩🇴' },
    { id: '2', type: 'receive', to: 'Carlos Jimenez', amount: 150, date: '2024-02-03', status: 'completed', flag: '🇩🇴' },
    { id: '3', type: 'send', to: 'Ana Santos', amount: 300, date: '2024-02-02', status: 'completed', flag: '🇲🇽' },
    { id: '4', type: 'send', to: 'Pedro Martinez', amount: 175, date: '2024-02-01', status: 'pending', flag: '🇩🇴' },
    { id: '5', type: 'receive', to: 'Sofia Lopez', amount: 200, date: '2024-01-31', status: 'completed', flag: '🇬🇹' },
    { id: '6', type: 'send', to: 'Luis Garcia', amount: 425, date: '2024-01-30', status: 'completed', flag: '🇲🇽' },
  ];

  const filtered = filter === 'all' ? transactions : transactions.filter(t => t.type === filter);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto pb-20 md:pb-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
          <p className="text-gray-600 mt-1">View all your money transfers</p>
        </motion.div>

        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex gap-3"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              className="input pl-12"
            />
          </div>
          <Button variant="outline" icon={<Filter className="w-4 h-4" />}>
            Filter
          </Button>
          <Button variant="outline" icon={<Download className="w-4 h-4" />}>
            Export
          </Button>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex gap-2 bg-white p-2 rounded-xl shadow-sm"
        >
          {[
            { value: 'all', label: 'All' },
            { value: 'send', label: 'Sent' },
            { value: 'receive', label: 'Received' },
          ].map((tab) => (
            <motion.button
              key={tab.value}
              onClick={() => setFilter(tab.value as any)}
              className={`flex-1 px-6 py-2.5 rounded-lg font-medium transition-all relative ${
                filter === tab.value
                  ? 'text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {filter === tab.value && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-md"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Transactions List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <div className="space-y-2">
                {filtered.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="p-4 hover:bg-gray-50 rounded-xl transition-all cursor-pointer group"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center justify-between">
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
                            {transaction.to}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(transaction.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold text-lg ${
                          transaction.type === 'send' ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {transaction.type === 'send' ? '-' : '+'}${transaction.amount.toFixed(2)}
                        </div>
                        <Badge
                          variant={transaction.status === 'completed' ? 'success' : 'warning'}
                          size="sm"
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="grid grid-cols-3 gap-4"
        >
          {[
            { label: 'Total Sent', value: '$1,150', color: 'text-red-600' },
            { label: 'Total Received', value: '$350', color: 'text-green-600' },
            { label: 'Net Balance', value: '-$800', color: 'text-gray-900' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
            >
              <Card className="text-center">
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Layout>
  );
}
