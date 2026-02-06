import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/common/Layout';
import Toggle from '../components/ui/Toggle';
import { transferService } from '../services';
import { ReceiveRequest } from '../types';
import { shortTimeAgo } from '../services/mock/utils';
import { toast } from '../components/ui/Toast';

const templates = [
  { title: 'Monthly Rent', amount: 950, note: 'Due on the 1st' },
  { title: 'Family Support', amount: 250, note: 'Weekly transfer' },
];

export default function Receive() {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [autoReminder, setAutoReminder] = useState(true);
  const [requests, setRequests] = useState<ReceiveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  const shareLink = `https://ventovault.com/pay/${currentUser?.id || 'guest'}`;

  useEffect(() => {
    let mounted = true;

    async function loadRequests() {
      if (!currentUser) {
        return;
      }

      const result = await transferService.listReceiveRequests(currentUser.id);
      if (mounted && result.ok && result.data) {
        setRequests(result.data);
      }

      if (mounted) {
        setLoading(false);
      }
    }

    void loadRequests();

    return () => {
      mounted = false;
    };
  }, [currentUser]);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'Pay me on VentoVault',
        text: 'Send me money on VentoVault',
        url: shareLink,
      });
      return;
    }

    await navigator.clipboard.writeText(shareLink);
    toast.success('Link copied to clipboard');
  };

  const handleGenerateRequest = async () => {
    if (!currentUser || !amount) {
      return;
    }

    const numericAmount = Number(amount);
    const result = await transferService.createReceiveRequest(
      currentUser.id,
      'Shared Link',
      numericAmount,
      note || undefined
    );

    if (!result.ok || !result.data) {
      toast.error(result.error?.message || 'Unable to create request');
      return;
    }

    setRequests((prev) => [result.data!, ...prev]);
    setShowQR(true);
    toast.success('Payment request created');
  };

  const applyTemplate = (template: typeof templates[number]) => {
    setAmount(template.amount.toString());
    setNote(template.note);
    toast.success(`${template.title} template applied`);
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto pb-20 md:pb-6">
        <div className="card animate-slide-up">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Receive Money</h1>
          <p className="text-gray-600 mb-8">Request payment or share your payment link</p>

          <div className="space-y-6">
            <div className="bg-white/70 border border-white/60 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Your Payment Link</h3>
              <div className="flex gap-3">
                <input type="text" value={shareLink} readOnly className="input flex-1 bg-white" />
                <button type="button" onClick={() => void handleShare()} className="btn btn-primary whitespace-nowrap">
                  Share 📤
                </button>
              </div>
            </div>

            <div className="bg-white/70 border border-white/60 rounded-2xl p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-gray-500">Smart Request</div>
                  <div className="font-semibold text-gray-900 mt-1">Auto-remind in 24 hours</div>
                  <p className="text-sm text-gray-600 mt-2">Send a polite nudge if payment is still pending.</p>
                </div>
                <Toggle checked={autoReminder} onChange={setAutoReminder} />
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Request Specific Amount</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount (USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl font-semibold">$</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(event) => setAmount(event.target.value)}
                      className="input pl-12 text-xl font-semibold"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">What's this for? (optional)</label>
                  <textarea
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    className="input"
                    rows={3}
                    placeholder="e.g., Dinner, Rent, etc."
                  />
                </div>

                <button
                  type="button"
                  onClick={() => void handleGenerateRequest()}
                  disabled={!amount}
                  className="w-full btn btn-primary py-3 disabled:opacity-50"
                >
                  Generate Payment Request
                </button>
              </div>
            </div>

            {showQR && amount && (
              <div className="bg-white/80 border border-primary-300/60 rounded-2xl p-6 text-center animate-slide-up shadow-md">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">Scan to Pay</h3>
                <div className="bg-white/70 border border-white/60 w-64 h-64 mx-auto rounded-2xl flex items-center justify-center mb-4">
                  <div className="text-center">
                    <div className="text-6xl">QR</div>
                    <div className="text-xs text-gray-500 mt-2">Auto-generated demo code</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-primary-700 mb-1">${Number(amount).toFixed(2)}</div>
                {note && <div className="text-gray-600 text-sm">{note}</div>}
                <button type="button" onClick={() => setShowQR(false)} className="mt-4 text-gray-600 hover:text-gray-900 text-sm">
                  Close
                </button>
              </div>
            )}

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Recent Requests</h3>
              <div className="space-y-3">
                {loading ? (
                  <div className="p-4 rounded-xl bg-white/70 border border-white/60 text-sm text-gray-500">Loading requests...</div>
                ) : (
                  requests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 bg-white/70 border border-white/60 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-lg">💰</div>
                        <div>
                          <div className="font-semibold text-gray-900">{request.fromName}</div>
                          <div className="text-sm text-gray-500">{shortTimeAgo(request.createdAt)}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">${request.amount.toFixed(2)}</div>
                        <div className={`text-xs ${request.status === 'paid' ? 'text-success-600' : 'text-accent-600'}`}>
                          {request.status}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Request Templates</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <div key={template.title} className="p-4 rounded-2xl bg-white/70 border border-white/60">
                    <div className="text-xs uppercase tracking-[0.2em] text-gray-500">{template.title}</div>
                    <div className="text-xl font-semibold text-gray-900 mt-2">${template.amount}</div>
                    <div className="text-sm text-gray-600 mt-1">{template.note}</div>
                    <button
                      type="button"
                      onClick={() => applyTemplate(template)}
                      className="mt-4 text-sm font-semibold text-primary-700 hover:text-primary-800"
                    >
                      Use template →
                    </button>
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
