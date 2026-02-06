import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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

  const progressSteps: Array<{ key: Exclude<Step, 'success'>; label: string }> = [
    { key: 'recipient', label: 'Recipient' },
    { key: 'amount', label: 'Amount' },
    { key: 'review', label: 'Review' },
  ];

  const activeStepIndex =
    step === 'success'
      ? progressSteps.length
      : progressSteps.findIndex((item) => item.key === step);

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
            <span className="vv-chip vv-chip-hot">Live quote engine</span>
            <span className="vv-chip">Tier {tier}</span>
            <span className="vv-chip vv-chip-accent">
              Balance ${(currentUser?.balance || 0).toFixed(2)}
            </span>
          </div>
          <h1 className="text-3xl md:text-[2.2rem] font-bold text-gray-950 font-display leading-tight">
            Send with deterministic confidence
          </h1>
          <p className="text-sm text-gray-600 mt-3 max-w-2xl">
            Build the transfer, lock the quote, and push it through the full machine with
            transparent state progression.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="vv-flow-shell"
        >
          <div className="vv-flow-track mb-3">
            {progressSteps.map((item, index) => {
              const isComplete = activeStepIndex > index;
              const isActive = activeStepIndex === index;
              return (
                <div key={item.key} className="flex items-center flex-1">
                  <div
                    className={`vv-flow-node ${isComplete ? 'vv-flow-node-done' : ''} ${
                      isActive ? 'vv-flow-node-active' : ''
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < progressSteps.length - 1 && (
                    <div
                      className={`vv-flow-link mx-2 ${
                        activeStepIndex > index ? 'vv-flow-link-active' : ''
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[11px] uppercase tracking-[0.14em] text-gray-500">
            {progressSteps.map((item) => (
              <span key={item.key}>{item.label}</span>
            ))}
          </div>
        </motion.div>

        {validationMessage && (
          <div className="vv-surface-soft border-amber-200 bg-amber-50/85 text-amber-800 text-sm">
            {validationMessage}
          </div>
        )}

        {step === 'recipient' && (
          <motion.div
            key="send-recipient"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32 }}
            className="vv-panel"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-display">
              Who are you sending to?
            </h2>

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
                    <motion.button
                      type="button"
                      key={recipient.id}
                      onClick={() => setRecipientId(recipient.id)}
                      whileHover={{ scale: 1.005 }}
                      whileTap={{ scale: 0.995 }}
                      className={`vv-choice-card ${recipientId === recipient.id ? 'vv-choice-card-active' : ''}`}
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
                    </motion.button>
                  );
                })}
                {filteredRecipients.length === 0 && (
                  <div className="vv-surface-soft text-sm text-gray-500">
                    No recipients match that search.
                  </div>
                )}
              </div>

              <div className="vv-surface-soft border-accent-200/40 bg-accent-50/80 text-sm text-accent-800">
                Tier: {tier} · Recipient limit:{' '}
                {limits.recipientLimit === 999 ? 'Unlimited' : limits.recipientLimit} · Cooling-off
                window: {limits.coolingOffHours}h
              </div>

              <button
                type="button"
                onClick={goToAmountStep}
                disabled={!canProceedRecipient}
                className="w-full btn btn-primary py-3 text-lg disabled:opacity-50"
              >
                Continue to Amount
              </button>
            </div>
          </motion.div>
        )}

        {step === 'amount' && (
          <motion.div
            key="send-amount"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32 }}
            className="vv-panel"
          >
            <button
              type="button"
              onClick={() => setStep('recipient')}
              className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2 text-sm font-semibold"
            >
              ← Back
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-display">
              Configure transfer
            </h2>

            <div className="space-y-5">
              <div className="vv-segment">
                <button
                  type="button"
                  onClick={() => setMode('send_exact')}
                  className={`vv-segment-btn ${mode === 'send_exact' ? 'vv-segment-btn-active' : ''}`}
                >
                  Send Exactly
                </button>
                <button
                  type="button"
                  onClick={() => setMode('receive_exact')}
                  disabled={!limits.allowReceiveExact}
                  className={`vv-segment-btn ${mode === 'receive_exact' ? 'vv-segment-btn-active' : ''} ${
                    !limits.allowReceiveExact ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
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
                  <motion.button
                    type="button"
                    key={value}
                    onClick={() => {
                      if (mode === 'send_exact') {
                        setSourceAmount(value.toString());
                      } else {
                        setTargetAmount(value.toString());
                      }
                    }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="vv-amount-pill"
                  >
                    ${value}
                  </motion.button>
                ))}
              </div>

              <div className="vv-surface-soft space-y-2">
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

              <div className="vv-surface-soft">
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
                    className={`vv-choice-card ${
                      fundingMethod === 'ach' ? 'vv-choice-card-active' : ''
                    }`}
                  >
                    <div className="font-semibold text-gray-900">ACH</div>
                    <div className="text-xs text-gray-500">1-2 business days · included</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => limits.allowDebitCard && setFundingMethod('debit_card')}
                    disabled={!limits.allowDebitCard}
                    className={`vv-choice-card ${
                      fundingMethod === 'debit_card' ? 'vv-choice-card-active' : ''
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

              <div className="vv-surface-soft border-accent-200/40 bg-accent-50/80 text-sm text-accent-800">
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
          </motion.div>
        )}

        {step === 'review' && quote && (
          <motion.div
            key="send-review"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32 }}
            className="vv-panel"
          >
            <button
              type="button"
              onClick={() => setStep('amount')}
              className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2 text-sm font-semibold"
            >
              ← Back
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-display">Review and confirm</h2>

            <div className="space-y-6">
              <div className="vv-surface-soft space-y-4">
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
                <div className="vv-surface-soft bg-error-50 border-error-200 flex items-center justify-between gap-4">
                  <div className="text-sm text-error-700">Quote expired. Refresh quote before sending.</div>
                  <button type="button" onClick={() => void refreshQuote()} className="btn btn-secondary text-sm">
                    Refresh Quote
                  </button>
                </div>
              )}

              <label className="vv-surface-soft flex items-start gap-3">
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
          </motion.div>
        )}

        {step === 'success' && quote && (
          <motion.div
            key="send-success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32 }}
            className="vv-hero text-center"
          >
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 font-display">
              Money sent successfully!
            </h2>
            <p className="text-gray-600 mb-6">Your transfer is complete and fully tracked across all stages.</p>

            <div className="vv-surface-soft space-y-3 mb-6 text-left">
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
          </motion.div>
        )}

        <p className="text-[10px] text-gray-400 text-center mt-8 uppercase tracking-[0.14em]">
          Tier {tier} · Per transfer up to ${limits.perTransaction.toFixed(2)} · Daily cap ${limits.daily.toFixed(2)}
        </p>
      </div>
    </Layout>
  );
}
