import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/common/Layout';
import Toggle from '../components/ui/Toggle';
import FxTicker from '../components/ui/FxTicker';

type Step = 'recipient' | 'amount' | 'review' | 'success';

export default function Send() {
  const [step, setStep] = useState<Step>('recipient');
  const [recipient, setRecipient] = useState('');
  const [country, setCountry] = useState('DR');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [sending, setSending] = useState(false);
  const [fxShield, setFxShield] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const countries = [
    { code: 'DR', name: 'Dominican Republic', flag: '🇩🇴', rate: 58.5 },
    { code: 'MX', name: 'Mexico', flag: '🇲🇽', rate: 17.2 },
    { code: 'GT', name: 'Guatemala', flag: '🇬🇹', rate: 7.8 },
  ];

  const selectedCountry = countries.find(c => c.code === country);
  const currencyCode = selectedCountry?.code === 'DR' ? 'DOP' : selectedCountry?.code === 'MX' ? 'MXN' : 'GTQ';
  const fees = parseFloat(amount || '0') * 0.02; // 2% fee
  const totalAmount = parseFloat(amount || '0') + fees;
  const receivedAmount = parseFloat(amount || '0') * (selectedCountry?.rate || 1);

  const handleSend = async () => {
    setSending(true);
    // Simulate sending
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSending(false);
    setStep('success');
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto pb-20 md:pb-6">
        {/* Progress Bar */}
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center justify-between mb-2">
            {['recipient', 'amount', 'review'].map((s, i) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-semibold transition-all ${
                  step === s || (step === 'success' && i < 3)
                    ? 'bg-primary-600 text-white shadow-glow'
                    : 'bg-white/70 text-gray-600 border border-white/70'
                }`}>
                  {i + 1}
                </div>
                {i < 2 && (
                  <div className={`flex-1 h-1 mx-2 transition-all ${
                    (step === 'amount' && i === 0) || (step === 'review' && i < 2) || step === 'success'
                      ? 'bg-primary-600'
                      : 'bg-white/60'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Recipient</span>
            <span>Amount</span>
            <span>Review</span>
          </div>
        </div>

        {/* Step 1: Recipient */}
        {step === 'recipient' && (
          <div className="card animate-slide-up">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Who are you sending to?</h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Name or Email
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="input"
                  placeholder="Maria Rodriguez or maria@email.com"
                />
              </div>

              <div className="bg-white/70 border border-white/60 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-gray-500">Recipient Intelligence</div>
                    <div className="font-semibold text-gray-900 mt-1">Auto-verify identity</div>
                  </div>
                  <span className="badge badge-success">Trusted</span>
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  VentoVault checks name, account history, and payout rails to reduce failed deliveries.
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination Country
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {countries.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => setCountry(c.code)}
                      className={`p-4 rounded-2xl border-2 transition-all text-left ${
                        country === c.code
                          ? 'border-primary-500 bg-primary-50/80'
                          : 'border-white/70 bg-white/70 hover:border-white/90'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{c.flag}</span>
                          <div>
                            <div className="font-semibold text-gray-900">{c.name}</div>
                            <div className="text-sm text-gray-500">Rate: {c.rate} {c.code === 'DR' ? 'DOP' : c.code === 'MX' ? 'MXN' : 'GTQ'}</div>
                          </div>
                        </div>
                        {country === c.code && (
                          <span className="text-primary-600 text-xl">✓</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-accent-50/70 border border-accent-200/40 rounded-2xl p-4 text-sm text-accent-800">
                Compliance note: Transfers above $500 may require instant ID verification at checkout.
              </div>

              <button
                onClick={() => setStep('amount')}
                disabled={!recipient}
                className="w-full btn btn-primary py-3 text-lg disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Amount */}
        {step === 'amount' && (
          <div className="card animate-slide-up">
            <button
              onClick={() => setStep('recipient')}
              className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2"
            >
              ← Back
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">How much do you want to send?</h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-2xl font-semibold">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="input pl-12 text-2xl font-semibold"
                    placeholder="0.00"
                    min="1"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Quick amounts */}
              <div className="grid grid-cols-4 gap-2">
                {[50, 100, 250, 500].map((a) => (
                  <button
                    key={a}
                    onClick={() => setAmount(a.toString())}
                    className="py-2 px-3 rounded-xl border border-white/70 bg-white/60 hover:border-primary-400 hover:bg-primary-50/80 transition-all font-semibold text-gray-900"
                  >
                    ${a}
                  </button>
                ))}
              </div>

              {/* Exchange Rate Info */}
              {amount && parseFloat(amount) > 0 && (
                <div className="bg-white/70 border border-white/60 rounded-2xl p-4 space-y-2 shadow-sm">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">You send</span>
                    <span className="font-semibold text-gray-900">${parseFloat(amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Fees (2%)</span>
                    <span className="font-semibold text-gray-900">${fees.toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-white/60" />
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">Total deducted</span>
                    <span className="font-bold text-lg text-gray-900">${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-white/60" />
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">They receive</span>
                    <span className="font-bold text-lg text-primary-700">
                      {selectedCountry?.flag} {receivedAmount.toFixed(2)} {currencyCode}
                    </span>
                  </div>
                </div>
              )}

              {selectedCountry && (
                <FxTicker
                  pair={`USD → ${currencyCode}`}
                  baseRate={selectedCountry.rate}
                  label="Live FX"
                  className="mt-4"
                />
              )}

              <div className="bg-white/70 border border-white/60 rounded-2xl p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-gray-500">Neural Route</div>
                    <div className="font-semibold text-gray-900">Fastest payout path</div>
                    <div className="text-sm text-gray-600">Estimated delivery: 2 minutes</div>
                  </div>
                  <span className="badge badge-success">Auto</span>
                </div>
                <div className="mt-4 flex items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                    <span className="inline-flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-success-500" />
                      99.4% success
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary-500" />
                      Best FX spread
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">FX Shield</span>
                    <Toggle checked={fxShield} onChange={setFxShield} />
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-3">
                  {fxShield ? 'Locking best rate for 10 minutes.' : 'FX Shield off. Rate may shift with market moves.'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note (optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="input"
                  rows={3}
                  placeholder="What's this for?"
                />
              </div>

              <button
                onClick={() => setStep('review')}
                disabled={!amount || parseFloat(amount) <= 0 || totalAmount > (currentUser?.balance || 0)}
                className="w-full btn btn-primary py-3 text-lg disabled:opacity-50"
              >
                {totalAmount > (currentUser?.balance || 0) ? 'Insufficient Balance' : 'Continue'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 'review' && (
          <div className="card animate-slide-up">
            <button
              onClick={() => setStep('amount')}
              className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2"
            >
              ← Back
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Review and confirm</h2>

            <div className="space-y-6">
              <div className="bg-white/70 border border-white/60 rounded-2xl p-5 space-y-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Sending to</div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{selectedCountry?.flag}</span>
                    <span className="font-semibold text-lg text-gray-900">{recipient}</span>
                  </div>
                </div>

                <div className="h-px bg-white/60" />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">You send</div>
                    <div className="font-semibold text-xl text-gray-900">${parseFloat(amount).toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">They receive</div>
                    <div className="font-semibold text-xl text-primary-700">{receivedAmount.toFixed(2)} {currencyCode}</div>
                  </div>
                </div>

                <div className="h-px bg-white/60" />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">FX Shield</span>
                  <span className="font-semibold text-gray-900">{fxShield ? 'Locked (10 min)' : 'Off'}</span>
                </div>

                {note && (
                  <>
                    <div className="h-px bg-white/60" />
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Note</div>
                      <div className="text-gray-900">{note}</div>
                    </div>
                  </>
                )}
              </div>

              <div className="bg-accent-50/80 border border-accent-200/40 rounded-2xl p-4 flex gap-3">
                <span className="text-xl">⚠️</span>
                <div className="text-sm text-accent-800">
                  <div className="font-semibold mb-1">Double-check the details</div>
                  <div>Make sure the recipient information is correct. Transactions cannot be reversed.</div>
                </div>
              </div>

              <div className="bg-white/70 border border-white/60 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-gray-900">Transfer protection</div>
                  <span className="badge badge-info">Enabled</span>
                </div>
                <div className="text-sm text-gray-600">
                  Smart routing, FX Shield, and compliance checks are active for this transfer.
                </div>
              </div>

              <button
                onClick={handleSend}
                disabled={sending}
                className="w-full btn btn-primary py-4 text-lg disabled:opacity-50"
              >
                {sending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span> Sending...
                  </span>
                ) : (
                  `Send $${totalAmount.toFixed(2)}`
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 'success' && (
          <div className="card animate-slide-up text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Money sent successfully!</h2>
            <p className="text-gray-600 mb-6">
              Your money is on its way to {recipient}
            </p>

              <div className="bg-white/70 border border-white/60 rounded-2xl p-5 space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount sent</span>
                  <span className="font-semibold text-gray-900">${parseFloat(amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fees</span>
                  <span className="font-semibold text-gray-900">${fees.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">FX Shield</span>
                  <span className="font-semibold text-gray-900">{fxShield ? 'Locked' : 'Off'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">They receive</span>
                  <span className="font-semibold text-primary-700">{receivedAmount.toFixed(2)} {currencyCode}</span>
                </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate('/transactions')}
                className="flex-1 btn btn-secondary py-3"
              >
                View Receipt
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 btn btn-primary py-3"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
