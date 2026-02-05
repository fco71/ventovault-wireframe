import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/common/Layout';

export default function Receive() {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [showQR, setShowQR] = useState(false);
  const { currentUser } = useAuth();

  const shareLink = `ventovault.com/pay/${currentUser?.id}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Pay me on VentoVault',
        text: `Send me money on VentoVault`,
        url: shareLink,
      });
    } else {
      navigator.clipboard.writeText(shareLink);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto pb-20 md:pb-6">
        <div className="card animate-slide-up">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Receive Money</h1>
          <p className="text-gray-600 mb-8">Request payment or share your payment link</p>

          <div className="space-y-6">
            {/* Your Payment Link */}
            <div className="bg-primary-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Your Payment Link</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="input flex-1 bg-white"
                />
                <button
                  onClick={handleShare}
                  className="btn btn-primary whitespace-nowrap"
                >
                  Share 📤
                </button>
              </div>
            </div>

            {/* Request Specific Amount */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Request Specific Amount</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl font-semibold">$</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="input pl-12 text-xl font-semibold"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What's this for? (optional)
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="input"
                    rows={3}
                    placeholder="e.g., Dinner, Rent, etc."
                  />
                </div>

                <button
                  onClick={() => setShowQR(true)}
                  disabled={!amount}
                  className="w-full btn btn-primary py-3 disabled:opacity-50"
                >
                  Generate Payment Request
                </button>
              </div>
            </div>

            {/* QR Code Section */}
            {showQR && amount && (
              <div className="bg-white border-2 border-primary-600 rounded-xl p-6 text-center animate-slide-up">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">Scan to Pay</h3>
                <div className="bg-gray-100 w-64 h-64 mx-auto rounded-xl flex items-center justify-center mb-4">
                  <div className="text-6xl">QR</div>
                </div>
                <div className="text-2xl font-bold text-primary-700 mb-1">
                  ${parseFloat(amount).toFixed(2)}
                </div>
                {note && <div className="text-gray-600 text-sm">{note}</div>}
                <button
                  onClick={() => setShowQR(false)}
                  className="mt-4 text-gray-600 hover:text-gray-900 text-sm"
                >
                  Close
                </button>
              </div>
            )}

            {/* Recent Requests */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Recent Requests</h3>
              <div className="space-y-3">
                {[
                  { from: 'Carlos J.', amount: 100, status: 'pending', time: '2 hours ago' },
                  { from: 'Ana S.', amount: 50, status: 'paid', time: '1 day ago' },
                ].map((request, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-lg">
                        💰
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{request.from}</div>
                        <div className="text-sm text-gray-500">{request.time}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">${request.amount}</div>
                      <div className={`text-xs ${
                        request.status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {request.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
