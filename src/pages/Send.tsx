import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/common/Layout';
import Toggle from '../components/ui/Toggle';
import FxTicker from '../components/ui/FxTicker';
import { Quote, Recipient, TransferMode, VerificationTier, FundingMethod } from '../types';
import { autoAdvanceTransfer, quoteService, recipientService, transferService } from '../services';
import {
  canSendToRecipient,
  validateAmountForTier,
  validateFundingMethodForTier,
  validateModeForTier,
} from '../state/transferMachine';
import { getTierLimits } from '../config/domain';
import { toast } from '../components/ui/Toast';

type Step = 'recipient' | 'amount' | 'review' | 'success';

interface LocationState {
  recipientId?: string;
}

export default function Send() {
  const [step, setStep] = useState<Step>('recipient');
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [recipientSearch, setRecipientSearch] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [sourceAmount, setSourceAmount] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [note, setNote] = useState('');
  const [sending, setSending] = useState(false);
  const [fxShield, setFxShield] = useState(true);
  const [mode, setMode] = useState<TransferMode>('send_exact');
  const [fundingMethod, setFundingMethod] = useState<FundingMethod>('ach');
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState('');
  const [dailySent, setDailySent] = useState(0);
  const [monthlySent, setMonthlySent] = useState(0);
  const [validationMessage, setValidationMessage] = useState('');
  const [acceptDisclosure, setAcceptDisclosure] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [lastIntentId, setLastIntentId] = useState<string | null>(null);

  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const tier: VerificationTier = currentUser?.verificationTier || 'L30';
  const limits = getTierLimits(tier);

  const selectedRecipient = useMemo(
    () => recipients.find((item) => item.id === recipientId) || null,
    [recipientId, recipients]
  );

  const filteredRecipients = useMemo(
    () =>
      recipients.filter((item) => {
        const q = recipientSearch.trim().toLowerCase();
        if (!q) {
          return true;
        }
        return (
          item.name.toLowerCase().includes(q) ||
          item.email.toLowerCase().includes(q) ||
          item.country.toLowerCase().includes(q)
        );
      }),
    [recipientSearch, recipients]
  );

  useEffect(() => {
    let mounted = true;

    async function loadSendContext() {
      if (!currentUser) {
        return;
      }

      const [recipientResult, usageResult] = await Promise.all([
        recipientService.listRecipients(currentUser.id),
        transferService.getUsage(currentUser.id),
      ]);

      if (!mounted) {
        return;
      }

      if (recipientResult.ok && recipientResult.data) {
        setRecipients(recipientResult.data);
        const routeState = location.state as LocationState | null;
        if (routeState?.recipientId) {
          setRecipientId(routeState.recipientId);
        } else if (recipientResult.data.length > 0) {
          setRecipientId(recipientResult.data[0].id);
        }
      }

      if (usageResult.ok && usageResult.data) {
        setDailySent(usageResult.data.dailySent);
        setMonthlySent(usageResult.data.monthlySent);
      }
    }

    void loadSendContext();

    return () => {
      mounted = false;
    };
  }, [currentUser, location.state]);

  useEffect(() => {
    if (!limits.allowReceiveExact && mode === 'receive_exact') {
      setMode('send_exact');
    }

    if (!limits.allowDebitCard && fundingMethod === 'debit_card') {
      setFundingMethod('ach');
    }
  }, [fundingMethod, limits.allowDebitCard, limits.allowReceiveExact, mode]);

  useEffect(() => {
    let cancelled = false;

    async function runQuote() {
      if (!selectedRecipient) {
        setQuote(null);
        return;
      }

      const numericSource = Number(sourceAmount || 0);
      const numericTarget = Number(targetAmount || 0);

      if (mode === 'send_exact' && numericSource <= 0) {
        setQuote(null);
        return;
      }

      if (mode === 'receive_exact' && numericTarget <= 0) {
        setQuote(null);
        return;
      }

      setQuoteLoading(true);
      setQuoteError('');

      const result = await quoteService.createQuote({
        recipientCountry: selectedRecipient.country,
        mode,
        sourceAmount: numericSource,
        targetAmount: numericTarget,
      });

      if (cancelled) {
        return;
      }

      if (!result.ok || !result.data) {
        setQuoteError(result.error?.message || 'Unable to generate quote');
        setQuote(null);
      } else {
        setQuote(result.data);
      }

      setQuoteLoading(false);
    }

    const timeoutId = setTimeout(() => {
      void runQuote();
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [mode, selectedRecipient, sourceAmount, targetAmount]);

  useEffect(() => {
    if (!quote) {
      setSecondsRemaining(0);
      return;
    }

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((quote.expiresAt.getTime() - Date.now()) / 1000));
      setSecondsRemaining(remaining);
    }, 1000);

    setSecondsRemaining(Math.max(0, Math.floor((quote.expiresAt.getTime() - Date.now()) / 1000)));

    return () => {
      clearInterval(interval);
    };
  }, [quote]);

  const quoteExpired = quote ? quoteService.isExpired(quote) : false;

  const canProceedRecipient = !!selectedRecipient;

  const validationError = useMemo(() => {
    if (!selectedRecipient) {
      return 'Select a recipient to continue.';
    }

    const recipientError = canSendToRecipient(selectedRecipient);
    if (recipientError) {
      return recipientError.message;
    }

    const modeError = validateModeForTier(tier, mode);
    if (modeError) {
      return modeError.message;
    }

    const fundingError = validateFundingMethodForTier(tier, fundingMethod);
    if (fundingError) {
      return fundingError.message;
    }

    const amountToValidate = quote?.sourceAmount || Number(sourceAmount || 0);
    const amountError = validateAmountForTier(tier, amountToValidate, dailySent, monthlySent);
    if (amountError) {
      return amountError.message;
    }

    if (quote && quote.totalDebitAmount > (currentUser?.balance || 0)) {
      return 'Insufficient balance for this transfer.';
    }

    return '';
  }, [currentUser?.balance, dailySent, fundingMethod, mode, monthlySent, quote, selectedRecipient, sourceAmount, tier]);

  const refreshQuote = async () => {
    if (!selectedRecipient) {
      return;
    }

    const result = await quoteService.refreshQuote({
      recipientCountry: selectedRecipient.country,
      mode,
      sourceAmount: Number(sourceAmount || 0),
      targetAmount: Number(targetAmount || 0),
    });

    if (!result.ok || !result.data) {
      toast.error(result.error?.message || 'Unable to refresh quote');
      return;
    }

    setQuote(result.data);
    toast.success('Quote refreshed');
  };

  const handleSend = async () => {
    if (!currentUser || !selectedRecipient || !quote) {
      return;
    }

    if (quoteExpired) {
      toast.error('Quote expired. Refresh quote before sending.');
      return;
    }

    if (validationError) {
      setValidationMessage(validationError);
      toast.error(validationError);
      return;
    }

    if (!acceptDisclosure) {
      toast.error('You must accept the transfer disclosure before sending.');
      return;
    }

    setSending(true);
    setValidationMessage('');

    const createResult = await transferService.createTransferIntent({
      user: currentUser,
      recipient: selectedRecipient,
      mode,
      fundingMethod,
      note: note || undefined,
      quote,
    });

    if (!createResult.ok || !createResult.data) {
      setSending(false);
      toast.error(createResult.error?.message || 'Unable to create transfer intent');
      return;
    }

    const intentId = createResult.data.id;
    setLastIntentId(intentId);

    await autoAdvanceTransfer(intentId, async (id, state, subtitle) => {
      const result = await transferService.advanceTransfer({ intentId: id, nextState: state, subtitle });
      if (!result.ok) {
        throw new Error(result.error?.message || `Unable to transition to ${state}`);
      }
    });

    const usageResult = await transferService.getUsage(currentUser.id);
    if (usageResult.ok && usageResult.data) {
      setDailySent(usageResult.data.dailySent);
      setMonthlySent(usageResult.data.monthlySent);
    }

    setSending(false);
    setStep('success');
    toast.success('Transfer completed');
  };

  const goToAmountStep = () => {
    if (!canProceedRecipient) {
      setValidationMessage('Select a recipient before continuing.');
      return;
    }

    if (selectedRecipient) {
      const recipientError = canSendToRecipient(selectedRecipient);
      if (recipientError) {
        setValidationMessage(recipientError.message);
        return;
      }
    }

    setValidationMessage('');
    setStep('amount');
  };

  const goToReviewStep = () => {
    if (!quote) {
      setValidationMessage('Enter an amount to generate a quote.');
      return;
    }

    if (quoteExpired) {
      setValidationMessage('Quote expired. Refresh quote before continuing.');
      return;
    }

    if (validationError) {
      setValidationMessage(validationError);
      return;
    }

    setValidationMessage('');
    setStep('review');
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto pb-20 md:pb-6">
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center justify-between mb-2">
            {['recipient', 'amount', 'review'].map((item, index) => (
              <div key={item} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center font-semibold transition-all ${
                    step === item || (step === 'success' && index < 3)
                      ? 'bg-primary-600 text-white shadow-glow'
                      : 'bg-white/70 text-gray-600 border border-white/70'
                  }`}
                >
                  {index + 1}
                </div>
                {index < 2 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all ${
                      (step === 'amount' && index === 0) || (step === 'review' && index < 2) || step === 'success'
                        ? 'bg-primary-600'
                        : 'bg-white/60'
                    }`}
                  />
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

        {validationMessage && (
          <div className="mb-4 p-3 text-sm rounded-xl border border-amber-200 bg-amber-50 text-amber-800">
            {validationMessage}
          </div>
        )}

        {step === 'recipient' && (
          <div className="card animate-slide-up">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Who are you sending to?</h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Recipient</label>
                <input
                  type="text"
                  value={recipientSearch}
                  onChange={(event) => setRecipientSearch(event.target.value)}
                  className="input"
                  placeholder="Search by name, email, or country"
                />
              </div>

              <div className="space-y-3">
                {filteredRecipients.map((recipient) => {
                  const blocked = canSendToRecipient(recipient);
                  return (
                    <button
                      type="button"
                      key={recipient.id}
                      onClick={() => setRecipientId(recipient.id)}
                      className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
                        recipientId === recipient.id
                          ? 'border-primary-500 bg-primary-50/80'
                          : 'border-white/70 bg-white/70 hover:border-white/90'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{recipient.countryFlag}</span>
                          <div>
                            <div className="font-semibold text-gray-900">{recipient.name}</div>
                            <div className="text-sm text-gray-500">{recipient.email}</div>
                            <div className="text-xs text-gray-400">{recipient.country}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">
                            {blocked ? blocked.message : 'Eligible to send'}
                          </div>
                          {recipientId === recipient.id && <span className="text-primary-600 text-xl">✓</span>}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="bg-accent-50/70 border border-accent-200/40 rounded-2xl p-4 text-sm text-accent-800">
                Tier: {tier} · Recipient limit: {limits.recipientLimit === 999 ? 'Unlimited' : limits.recipientLimit} ·
                Cooling-off window: {limits.coolingOffHours}h
              </div>

              <button
                type="button"
                onClick={goToAmountStep}
                disabled={!canProceedRecipient}
                className="w-full btn btn-primary py-3 text-lg disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 'amount' && (
          <div className="card animate-slide-up">
            <button type="button" onClick={() => setStep('recipient')} className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2">
              ← Back
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Configure transfer</h2>

            <div className="space-y-5">
              <div className="flex items-center gap-2 bg-gray-100/80 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setMode('send_exact')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold ${
                    mode === 'send_exact' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  Send Exactly
                </button>
                <button
                  type="button"
                  onClick={() => setMode('receive_exact')}
                  disabled={!limits.allowReceiveExact}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold ${
                    mode === 'receive_exact' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                  } ${!limits.allowReceiveExact ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  They Receive Exactly {!limits.allowReceiveExact && '🔒'}
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {mode === 'send_exact' ? 'You send (USD)' : `They receive (${quote?.destinationCurrency || 'Local'})`}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-2xl font-semibold">$</span>
                  <input
                    type="number"
                    value={mode === 'send_exact' ? sourceAmount : targetAmount}
                    onChange={(event) => {
                      if (mode === 'send_exact') {
                        setSourceAmount(event.target.value);
                      } else {
                        setTargetAmount(event.target.value);
                      }
                    }}
                    className="input pl-12 text-2xl font-semibold"
                    placeholder="0.00"
                    min="1"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[50, 100, 250, 500].map((value) => (
                  <button
                    type="button"
                    key={value}
                    onClick={() => {
                      if (mode === 'send_exact') {
                        setSourceAmount(value.toString());
                      } else {
                        setTargetAmount(value.toString());
                      }
                    }}
                    className="py-2 px-3 rounded-xl border border-white/70 bg-white/60 hover:border-primary-400 hover:bg-primary-50/80 transition-all font-semibold text-gray-900"
                  >
                    ${value}
                  </button>
                ))}
              </div>

              <div className="bg-white/70 border border-white/60 rounded-2xl p-4 space-y-2 shadow-sm">
                {quoteLoading && <div className="text-sm text-gray-500">Calculating live quote...</div>}
                {quoteError && <div className="text-sm text-error-600">{quoteError}</div>}

                {quote && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Rate</span>
                      <span className="font-semibold text-gray-900">
                        {quote.rate} {quote.destinationCurrency}/USD
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Mid-market</span>
                      <span className="font-semibold text-gray-900">{quote.midMarketRate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">You send</span>
                      <span className="font-semibold text-gray-900">${quote.sourceAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Fees + network</span>
                      <span className="font-semibold text-gray-900">
                        ${(quote.feeAmount + quote.networkCost).toFixed(2)}
                      </span>
                    </div>
                    <div className="h-px bg-white/60" />
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-900">Total deducted</span>
                      <span className="font-bold text-lg text-gray-900">${quote.totalDebitAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-900">They receive</span>
                      <span className="font-bold text-lg text-primary-700">
                        {selectedRecipient?.countryFlag} {quote.destinationAmount.toFixed(2)} {quote.destinationCurrency}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Quote expires in {secondsRemaining}s {quoteExpired && '• expired'}
                    </div>
                  </>
                )}
              </div>

              {quote && (
                <FxTicker
                  pair={`USD → ${quote.destinationCurrency}`}
                  baseRate={quote.rate}
                  label="Live FX"
                  className="mt-4"
                />
              )}

              <div className="bg-white/70 border border-white/60 rounded-2xl p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-gray-500">Funding Method</div>
                    <div className="font-semibold text-gray-900">Choose payment rail</div>
                  </div>
                </div>
                <div className="mt-3 grid sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFundingMethod('ach')}
                    className={`rounded-xl border p-3 text-left ${
                      fundingMethod === 'ach' ? 'border-primary-400 bg-primary-50/70' : 'border-white/70 bg-white/70'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">ACH</div>
                    <div className="text-xs text-gray-500">1-2 business days · included</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => limits.allowDebitCard && setFundingMethod('debit_card')}
                    disabled={!limits.allowDebitCard}
                    className={`rounded-xl border p-3 text-left ${
                      fundingMethod === 'debit_card' ? 'border-primary-400 bg-primary-50/70' : 'border-white/70 bg-white/70'
                    } ${!limits.allowDebitCard ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="font-semibold text-gray-900">Debit Card {!limits.allowDebitCard && '🔒'}</div>
                    <div className="text-xs text-gray-500">Instant funding · +$1.50</div>
                  </button>
                </div>
                <div className="mt-4 flex items-center justify-between gap-4">
                  <div className="text-sm text-gray-600">FX Shield locks rate for quote window.</div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">FX Shield</span>
                    <Toggle checked={fxShield} onChange={setFxShield} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Note (optional)</label>
                <textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  className="input"
                  rows={3}
                  placeholder="What's this for?"
                />
              </div>

              <div className="bg-accent-50/70 border border-accent-200/40 rounded-2xl p-4 text-sm text-accent-800">
                Remaining daily limit: ${(limits.daily - dailySent).toFixed(2)} · Remaining monthly limit: ${
                  (limits.monthly - monthlySent).toFixed(2)
                }
              </div>

              <button
                type="button"
                onClick={goToReviewStep}
                disabled={!quote || !!validationError}
                className="w-full btn btn-primary py-3 text-lg disabled:opacity-50"
              >
                {validationError || quoteExpired ? 'Resolve Issues to Continue' : 'Continue'}
              </button>
            </div>
          </div>
        )}

        {step === 'review' && quote && (
          <div className="card animate-slide-up">
            <button type="button" onClick={() => setStep('amount')} className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2">
              ← Back
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Review and confirm</h2>

            <div className="space-y-6">
              <div className="bg-white/70 border border-white/60 rounded-2xl p-5 space-y-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Sending to</div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{selectedRecipient?.countryFlag}</span>
                    <span className="font-semibold text-lg text-gray-900">{selectedRecipient?.name}</span>
                  </div>
                </div>

                <div className="h-px bg-white/60" />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">You send</div>
                    <div className="font-semibold text-xl text-gray-900">${quote.sourceAmount.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">They receive</div>
                    <div className="font-semibold text-xl text-primary-700">
                      {quote.destinationAmount.toFixed(2)} {quote.destinationCurrency}
                    </div>
                  </div>
                </div>

                <div className="h-px bg-white/60" />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total deducted</span>
                  <span className="font-semibold text-gray-900">${quote.totalDebitAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Funding method</span>
                  <span className="font-semibold text-gray-900">{fundingMethod === 'ach' ? 'ACH' : 'Debit Card'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Quote expiry</span>
                  <span className={`font-semibold ${quoteExpired ? 'text-error-600' : 'text-gray-900'}`}>
                    {secondsRemaining}s remaining
                  </span>
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

              {quoteExpired && (
                <div className="bg-error-50 border border-error-200 rounded-2xl p-4 flex items-center justify-between gap-4">
                  <div className="text-sm text-error-700">Quote expired. Refresh quote before sending.</div>
                  <button type="button" onClick={() => void refreshQuote()} className="btn btn-secondary text-sm">
                    Refresh Quote
                  </button>
                </div>
              )}

              <label className="flex items-start gap-3 bg-white/70 border border-white/60 rounded-2xl p-4">
                <input
                  type="checkbox"
                  checked={acceptDisclosure}
                  onChange={(event) => setAcceptDisclosure(event.target.checked)}
                  className="mt-1 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">
                  I authorize regulated partners to process this transfer and I acknowledge VentoVault coordinates the
                  instruction flow.
                </span>
              </label>

              <button
                type="button"
                onClick={() => void handleSend()}
                disabled={sending || quoteExpired}
                className="w-full btn btn-primary py-4 text-lg disabled:opacity-50"
              >
                {sending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span> Processing transfer machine...
                  </span>
                ) : (
                  `Send $${quote.totalDebitAmount.toFixed(2)}`
                )}
              </button>
            </div>
          </div>
        )}

        {step === 'success' && quote && (
          <div className="card animate-slide-up text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Money sent successfully!</h2>
            <p className="text-gray-600 mb-6">Your transfer is complete and fully tracked across all stages.</p>

            <div className="bg-white/70 border border-white/60 rounded-2xl p-5 space-y-3 mb-6 text-left">
              <div className="flex justify-between">
                <span className="text-gray-600">Intent ID</span>
                <span className="font-semibold text-gray-900">{lastIntentId || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount sent</span>
                <span className="font-semibold text-gray-900">${quote.sourceAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total paid</span>
                <span className="font-semibold text-gray-900">${quote.totalDebitAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">They received</span>
                <span className="font-semibold text-primary-700">
                  {quote.destinationAmount.toFixed(2)} {quote.destinationCurrency}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => navigate('/transactions')} className="flex-1 btn btn-secondary py-3">
                View Receipt
              </button>
              <button type="button" onClick={() => navigate('/dashboard')} className="flex-1 btn btn-primary py-3">
                Back to Home
              </button>
            </div>
          </div>
        )}

        <p className="text-[10px] text-gray-300 text-center mt-8">
          Tier {tier} · Per transfer up to ${limits.perTransaction.toFixed(2)} · Daily cap ${limits.daily.toFixed(2)}
        </p>
      </div>
    </Layout>
  );
}
