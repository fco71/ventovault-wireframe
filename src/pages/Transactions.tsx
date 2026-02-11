import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/common/Layout';
import { ArrowUpRight, ArrowDownLeft, Download, Search } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Timeline from '../components/ui/Timeline';
import { transferService } from '../services';
import { Transaction, TransferReceipt } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { shortTimeAgo } from '../services/mock/utils';
import { toast } from '../components/ui/Toast';
import { toCountryCode } from '../utils/country';

export default function Transactions() {
  const { currentUser } = useAuth();
  const [filter, setFilter] = useState<'all' | 'send' | 'receive'>('all');
  const [search, setSearch] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<TransferReceipt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadTransactions() {
      if (!currentUser) {
        return;
      }

      const result = await transferService.listTransactions(currentUser.id);
      if (mounted && result.ok && result.data) {
        setTransactions(result.data);
        if (result.data.length > 0) {
          setSelectedTransactionId(result.data[0].id);
        }
      }

      if (mounted) {
        setLoading(false);
      }
    }

    void loadTransactions();

    return () => {
      mounted = false;
    };
  }, [currentUser]);

  useEffect(() => {
    let mounted = true;

    async function loadReceipt() {
      if (!selectedTransactionId) {
        setSelectedReceipt(null);
        return;
      }

      const result = await transferService.getReceipt(selectedTransactionId);
      if (mounted && result.ok && result.data) {
        setSelectedReceipt(result.data);
      }
    }

    void loadReceipt();

    return () => {
      mounted = false;
    };
  }, [selectedTransactionId]);

  const filtered = useMemo(() => {
    const byType = filter === 'all' ? transactions : transactions.filter((item) => item.type === filter);

    if (!search.trim()) {
      return byType;
    }

    const query = search.toLowerCase();
    return byType.filter(
      (item) =>
        item.to.name.toLowerCase().includes(query) ||
        item.from.name.toLowerCase().includes(query) ||
        item.amount.toString().includes(query) ||
        (item.note || '').toLowerCase().includes(query)
    );
  }, [filter, search, transactions]);

  const selected = useMemo(
    () => transactions.find((item) => item.id === selectedTransactionId) || null,
    [selectedTransactionId, transactions]
  );

  const detailTimeline = useMemo(() => {
    if (!selectedReceipt) {
      return [
        {
          title: 'Select a transfer',
          subtitle: 'Choose a transaction to see its details',
          time: 'Now',
          tone: 'neutral' as const,
        },
      ];
    }

    if (selectedReceipt.timeline.length === 0) {
      return [
        {
          title: 'Legacy transfer data',
          subtitle: 'Timeline details are not available for this transfer',
          time: 'N/A',
          tone: 'warning' as const,
        },
      ];
    }

    return selectedReceipt.timeline.map((item) => ({
      title: item.title,
      subtitle: item.subtitle,
      time: shortTimeAgo(item.timestamp),
      tone:
        item.state === 'completed'
          ? ('success' as const)
          : item.state === 'failed' || item.state === 'refunded'
            ? ('warning' as const)
            : ('primary' as const),
    }));
  }, [selectedReceipt]);

  const summary = useMemo(() => {
    const totalSent = transactions.filter((item) => item.type === 'send').reduce((sum, item) => sum + item.amount, 0);
    const totalReceived = transactions.filter((item) => item.type === 'receive').reduce((sum, item) => sum + item.amount, 0);

    return {
      totalSent,
      totalReceived,
      net: totalReceived - totalSent,
    };
  }, [transactions]);

  const completedCount = useMemo(
    () => transactions.filter((item) => item.status === 'completed').length,
    [transactions]
  );

  const pendingCount = transactions.length - completedCount;

  const exportCsv = () => {
    if (filtered.length === 0) {
      toast.error('No transactions to export');
      return;
    }

    const header = ['id', 'type', 'amount', 'status', 'counterparty', 'country', 'createdAt'];
    const rows = filtered.map((item) => [
      item.id,
      item.type,
      item.amount.toFixed(2),
      item.status,
      item.type === 'send' ? item.to.name : item.from.name,
      item.to.country,
      item.createdAt.toISOString(),
    ]);

    const csv = [header, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ventovault-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Export started');
  };


  return (
    <Layout>
      <div className="max-w-5xl mx-auto pb-20 md:pb-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        >
          <div>
            <h1 className="text-[1.35rem] md:text-[1.6rem] font-bold text-gray-950 font-display tracking-tight">
              Activity
            </h1>
            <p className="text-[13px] text-gray-500 mt-0.5">
              {transactions.length} transfers{pendingCount > 0 ? ` · ${pendingCount} in progress` : ''}
            </p>
          </div>
          <button
            type="button"
            className="btn btn-secondary text-[13px] inline-flex items-center gap-2"
            onClick={exportCsv}
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="vv-panel"
        >
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, amount, or purpose..."
                className="input pl-12"
              />
            </div>
          </div>

          <div className="mt-4 flex gap-2 rounded-xl border border-white/80 bg-white/80 p-1">
            {[
              { value: 'all', label: 'All' },
              { value: 'send', label: 'Sent' },
              { value: 'receive', label: 'Received' },
            ].map((tab) => (
              <motion.button
                key={tab.value}
                onClick={() => setFilter(tab.value as 'all' | 'send' | 'receive')}
                className={`flex-1 px-6 py-2.5 rounded-lg font-medium transition-all relative ${
                  filter === tab.value ? 'text-white' : 'text-gray-600 hover:bg-white/70'
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                {filter === tab.value && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-md"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="vv-panel"
          >
            <div className="space-y-2">
              {loading ? (
                <div className="vv-surface-soft text-sm text-gray-500">Loading transactions...</div>
              ) : filtered.length === 0 ? (
                <div className="vv-surface-soft text-sm text-gray-500">
                  No transactions match that filter.
                </div>
              ) : (
                filtered.map((transaction, index) => (
                  <motion.button
                    type="button"
                    key={transaction.id}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.26, delay: index * 0.04 }}
                    className={`vv-choice-card group ${
                      transaction.id === selectedTransactionId ? 'vv-choice-card-active' : ''
                    }`}
                    whileHover={{ y: -2 }}
                    onClick={() => setSelectedTransactionId(transaction.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <motion.div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
                            transaction.type === 'send' ? 'bg-error-50' : 'bg-success-50'
                          }`}
                          whileHover={{ rotate: 8 }}
                          transition={{ duration: 0.18 }}
                        >
                          {transaction.type === 'send' ? (
                            <ArrowUpRight className="w-5 h-5 text-error-600" />
                          ) : (
                            <ArrowDownLeft className="w-5 h-5 text-success-600" />
                          )}
                        </motion.div>
                        <div>
                          <div className="font-semibold text-gray-900 flex items-center gap-2">
                            <span className="vv-country-badge h-6 w-8 rounded-md text-[10px]">
                              {toCountryCode(transaction.to.country)}
                            </span>
                            {transaction.type === 'send'
                              ? transaction.to.name
                              : transaction.from.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {transaction.createdAt.toLocaleDateString('en-US')}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`font-bold text-lg ${
                            transaction.type === 'send' ? 'text-error-600' : 'text-success-600'
                          }`}
                        >
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
                  </motion.button>
                ))
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="vv-panel"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-gray-500">Transfer Detail</div>
              <div className="text-lg font-semibold text-gray-900 font-display mt-1">
                {selected ? `${selected.to.name} · $${selected.amount.toFixed(2)}` : 'Select a transaction'}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {selectedReceipt?.quoteMatched
                  ? 'Delivered at the quoted rate.'
                  : 'Step-by-step progress for this transfer.'}
              </p>
            </div>
            <span className="badge badge-success">Tracked</span>
          </div>
          <div className="vv-surface-soft">
            <Timeline items={detailTimeline} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {[
            { label: 'Total Sent', value: `$${summary.totalSent.toFixed(2)}`, color: 'text-error-600' },
            { label: 'Total Received', value: `$${summary.totalReceived.toFixed(2)}`, color: 'text-success-600' },
            {
              label: 'Net Balance',
              value: `${summary.net >= 0 ? '+' : '-'}$${Math.abs(summary.net).toFixed(2)}`,
              color: 'text-gray-900',
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              className="group vv-kpi-card text-center"
            >
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-[11px] text-gray-500 mt-1 uppercase tracking-[0.14em]">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Layout>
  );
}
