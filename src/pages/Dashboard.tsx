import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/common/Layout';

export default function Dashboard() {
  const { currentUser } = useAuth();

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
        <div className="animate-slide-up">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {currentUser?.displayName?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your account</p>
        </div>

        {/* Balance Card */}
        <div className="card bg-gradient-to-br from-primary-600 to-primary-800 text-white animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-primary-100 text-sm">Available Balance</p>
              <h2 className="text-4xl font-bold mt-1">
                ${currentUser?.balance?.toFixed(2) || '0.00'}
              </h2>
            </div>
            <button className="p-2 bg-white/10 backdrop-blur rounded-lg hover:bg-white/20 transition-all">
              <span className="text-xl">👁️</span>
            </button>
          </div>
          <div className="flex gap-2 mt-6">
            <Link
              to="/send"
              className="flex-1 bg-white text-primary-700 py-3 px-4 rounded-xl font-semibold text-center hover:bg-primary-50 transition-all"
            >
              Send Money
            </Link>
            <Link
              to="/receive"
              className="flex-1 bg-white/10 backdrop-blur text-white py-3 px-4 rounded-xl font-semibold text-center hover:bg-white/20 transition-all"
            >
              Request
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Link to="/send" className="card hover:shadow-lg transition-all cursor-pointer">
            <div className="text-3xl mb-3">↗️</div>
            <div className="font-semibold text-gray-900">Send Money</div>
            <div className="text-sm text-gray-500 mt-1">Transfer funds</div>
          </Link>

          <Link to="/receive" className="card hover:shadow-lg transition-all cursor-pointer">
            <div className="text-3xl mb-3">↙️</div>
            <div className="font-semibold text-gray-900">Receive</div>
            <div className="text-sm text-gray-500 mt-1">Request payment</div>
          </Link>

          <Link to="/transactions" className="card hover:shadow-lg transition-all cursor-pointer">
            <div className="text-3xl mb-3">📊</div>
            <div className="font-semibold text-gray-900">Activity</div>
            <div className="text-sm text-gray-500 mt-1">View history</div>
          </Link>

          <Link to="/settings" className="card hover:shadow-lg transition-all cursor-pointer">
            <div className="text-3xl mb-3">⚙️</div>
            <div className="font-semibold text-gray-900">Settings</div>
            <div className="text-sm text-gray-500 mt-1">Manage account</div>
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="card text-center">
            <div className="text-2xl font-bold text-gray-900">12</div>
            <div className="text-sm text-gray-500 mt-1">Transactions</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-gray-900">$2.4K</div>
            <div className="text-sm text-gray-500 mt-1">Total Sent</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-gray-900">5</div>
            <div className="text-sm text-gray-500 mt-1">Recipients</div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
            <Link to="/transactions" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
              View All →
            </Link>
          </div>

          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    transaction.type === 'send' ? 'bg-red-100' : 'bg-green-100'
                  }`}>
                    <span className="text-xl">{transaction.type === 'send' ? '↗️' : '↙️'}</span>
                  </div>
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
                  <div className="text-xs text-gray-500 capitalize">{transaction.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Promotional Banner */}
        <div className="card bg-gradient-to-r from-purple-500 to-pink-500 text-white animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold mb-1">Invite friends, earn rewards! 🎉</h3>
              <p className="text-purple-100 text-sm">Get $25 for every friend who signs up</p>
            </div>
            <button className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all whitespace-nowrap">
              Invite Now
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
