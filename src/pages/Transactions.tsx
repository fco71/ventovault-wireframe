import { useState } from 'react';
import Layout from '../components/common/Layout';

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
      <div className="max-w-4xl mx-auto pb-20 md:pb-6">
        <div className="mb-6 animate-slide-up">
          <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
          <p className="text-gray-600 mt-1">View all your money transfers</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-xl font-medium transition-all ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('send')}
            className={`px-6 py-2 rounded-xl font-medium transition-all ${
              filter === 'send'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Sent
          </button>
          <button
            onClick={() => setFilter('receive')}
            className={`px-6 py-2 rounded-xl font-medium transition-all ${
              filter === 'receive'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Received
          </button>
        </div>

        {/* Transactions List */}
        <div className="card animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="space-y-1">
            {filtered.map((transaction, index) => (
              <div
                key={transaction.id}
                className="p-4 hover:bg-gray-50 rounded-xl transition-all cursor-pointer"
                style={{ animationDelay: `${0.3 + index * 0.05}s` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      transaction.type === 'send' ? 'bg-red-100' : 'bg-green-100'
                    }`}>
                      <span className="text-xl">{transaction.type === 'send' ? '↗️' : '↙️'}</span>
                    </div>
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
                    <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                      transaction.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {transaction.status}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Download Statement */}
        <div className="mt-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <button className="btn btn-secondary w-full py-3">
            📄 Download Statement
          </button>
        </div>
      </div>
    </Layout>
  );
}
