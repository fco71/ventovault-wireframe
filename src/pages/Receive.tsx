import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Banknote, QrCode, Smartphone } from 'lucide-react';
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
      <div className="max-w-3xl mx-auto pb-20 md:pb-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="vv-hero"
        >
          <div className="flex flex-wrap items-center gap-2.5 mb-5">
            <span className="vv-chip vv-chip-hot">Request payments</span>
            <span className="vv-chip">Auto-reminders {autoReminder ? 'On' : 'Off'}</span>
            <span className="vv-chip vv-chip-accent">{requests.length} active requests</span>
          </div>
          <h1 className="text-3xl md:text-[2.2rem] font-bold text-gray-950 font-display leading-tight">
            Request money with one secure link
          </h1>
          <p className="text-sm text-gray-600 mt-3 max-w-2xl">
            Share your payment link or QR and track each request from pending to paid.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="vv-panel space-y-6"
        >
          <div className="vv-surface-soft">
            <h3 className="font-semibold text-gray-900 mb-3 font-display">Your Payment Link</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <input type="text" value={shareLink} readOnly className="input flex-1 bg-white" />
              <button
                type="button"
                onClick={() => void handleShare()}
                className="btn btn-primary whitespace-nowrap"
              >
                Share Link
              </button>
            </div>
          </div>

          <div className="vv-surface-soft">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-gray-500">Automatic Reminder</div>
                <div className="font-semibold text-gray-900 mt-1">Send reminder after 24 hours</div>
                <p className="text-sm text-gray-600 mt-2">
                  Send a polite nudge if payment is still pending.
                </p>
              </div>
              <Toggle checked={autoReminder} onChange={setAutoReminder} />
            </div>
          </div>

          <div className="vv-surface-soft space-y-4">
            <h3 className="font-semibold text-gray-900 font-display">Request Specific Amount</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount (USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl font-semibold">
                  $
                </span>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What's this for? (optional)
              </label>
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
              Create payment request
            </button>
          </div>

          {showQR && amount && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="vv-surface-soft border-primary-300/70 text-center"
            >
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
                <Smartphone className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-2 font-display">Scan to Pay</h3>
              <div className="bg-white/80 border border-white/70 w-64 h-64 mx-auto rounded-2xl flex items-center justify-center mb-4">
                <div className="text-center">
                  <QrCode className="mx-auto h-16 w-16 text-gray-800" />
                  <div className="text-xs text-gray-500 mt-2">Demo QR preview</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-primary-700 mb-1">${Number(amount).toFixed(2)}</div>
              {note && <div className="text-gray-600 text-sm">{note}</div>}
              <button
                type="button"
                onClick={() => setShowQR(false)}
                className="mt-4 text-gray-600 hover:text-gray-900 text-sm font-semibold"
              >
                Close
              </button>
            </motion.div>
          )}

          <div>
            <h3 className="font-semibold text-gray-900 mb-4 font-display">Recent Requests</h3>
            <div className="space-y-3">
              {loading ? (
                <div className="vv-surface-soft text-sm text-gray-500">Loading requests...</div>
              ) : (
                requests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.24, delay: index * 0.04 }}
                    className="vv-request-row"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700">
                        <Banknote className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{request.fromName}</div>
                        <div className="text-sm text-gray-500">{shortTimeAgo(request.createdAt)}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">${request.amount.toFixed(2)}</div>
                      <div
                        className={`text-xs ${
                          request.status === 'paid' ? 'text-success-600' : 'text-accent-600'
                        }`}
                      >
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4 font-display">Request Templates</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {templates.map((template, index) => (
                <motion.button
                  type="button"
                  key={template.title}
                  onClick={() => applyTemplate(template)}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="vv-template-card text-left"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ transitionDelay: `${index * 40}ms` }}
                >
                  <div className="text-xs uppercase tracking-[0.2em] text-gray-500">{template.title}</div>
                  <div className="text-xl font-semibold text-gray-900 mt-2">${template.amount}</div>
                  <div className="text-sm text-gray-600 mt-1">{template.note}</div>
                  <div className="mt-4 text-sm font-semibold text-primary-700">Use template →</div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
