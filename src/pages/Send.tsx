import { useEffect, useMemo, useState, type ChangeEvent, type ClipboardEvent, type KeyboardEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CircleCheck, Loader2, Lock, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useOperationalInspector } from '../contexts/OperationalInspectorContext';
import Layout from '../components/common/Layout';
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
import { toCountryCode } from '../utils/country';
import { getAccountLevel } from '../utils/accountLevel';

// --- NEW IMPORTS FOR SIMULATOR MODE ---
import { useOperationalIntel } from '../hooks/useOperationalIntel';
import { OpsInspectorPanel } from '../components/operational/OpsInspectorPanel';

type Step = 'recipient' | 'amount' | 'review' | 'success';

interface LocationState {
  recipientId?: string;
  presetAmount?: number;
  presetNote?: string;
  focusStep?: Exclude<Step, 'success'>;
  resetFlow?: boolean;
  resetToken?: number;
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
  const { reportStage, isOpen: isDemoMode } = useOperationalInspector();
  const navigate = useNavigate();
  const location = useLocation();
  const tier: VerificationTier = currentUser?.verificationTier || 'L30';
  const limits = getTierLimits(tier);
  const accountLevel = getAccountLevel(tier);
  const amountFormatter = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    []
  );

  const decimalSeparator = useMemo(
    () => amountFormatter.formatToParts(1.1).find((part) => part.type === 'decimal')?.value || '.',
    [amountFormatter]
  );

  const selectedRecipient = useMemo(
    () => recipients.find((item) => item.id === recipientId) || null,
    [recipientId, recipients]
  );
  
  // --- NEW: INTELLIGENCE LAYER INTEGRATION ---
  // This hook calculates the "Truth" based on the current form state
  const operationalIntel = useOperationalIntel({
    currentRecipient: selectedRecipient,
    amount: Number(mode === 'send_exact' ? sourceAmount : quote?.sourceAmount || 0),
    mode,
    fundingMethod,
    quote,
    userTier: tier,
    usageStats: { daily: dailySent, monthly: monthlySent }
  });

  const selectedRecipientCountryCode = toCountryCode(selectedRecipient?.country);
  const hasRecipients = recipients.length > 0;

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

  const parseLocaleAmount = (value: string): number | null => {
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }

    const prefersLocaleDecimal = decimalSeparator !== '.' && trimmed.includes(decimalSeparator);
    const decimalCandidates = new Set([decimalSeparator]);
    if (!prefersLocaleDecimal) {
      decimalCandidates.add('.');
    }

    let normalized = '';
    let seenDecimal = false;

    for (const char of trimmed) {
      if (/\d/u.test(char)) {
        normalized += char;
        continue;
      }

      if (!seenDecimal && decimalCandidates.has(char)) {
        normalized += '.';
        seenDecimal = true;
      }
    }

    if (!normalized || normalized === '.') {
      return null;
    }

    const parsed = Number.parseFloat(normalized);
    if (!Number.isFinite(parsed) || parsed < 0) {
      return null;
    }

    return Math.round(parsed * 100) / 100;
  };

  const formatMaskedAmount = (value: string): string => {
    if (!value) {
      return '';
    }

    const parsed = Number.parseFloat(value);
    if (!Number.isFinite(parsed)) {
      return '';
    }

    return amountFormatter.format(parsed);
  };

  const setActiveAmount = (value: string) => {
    if (mode === 'send_exact') {
      setSourceAmount(value);
    } else {
      setTargetAmount(value);
    }
  };

  const activeAmountValue = mode === 'send_exact' ? sourceAmount : targetAmount;
  const activeAmountDisplay = formatMaskedAmount(activeAmountValue);

  const handleMaskedAmountKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }

    if (
      ['Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'Escape', 'Enter'].includes(
        event.key
      )
    ) {
      return;
    }

    const current = Number.parseFloat(activeAmountValue || '0');
    const wholeUnits = Number.isFinite(current) ? Math.max(0, Math.trunc(current)) : 0;

    if (/^[0-9]$/.test(event.key)) {
      event.preventDefault();
      const nextWholeUnits = wholeUnits * 10 + Number.parseInt(event.key, 10);
      setActiveAmount(nextWholeUnits > 0 ? nextWholeUnits.toString() : '');
      return;
    }

    if (event.key === 'Backspace') {
      event.preventDefault();
      const nextWholeUnits = Math.floor(wholeUnits / 10);
      setActiveAmount(nextWholeUnits > 0 ? nextWholeUnits.toString() : '');
      return;
    }

    if (event.key === 'Delete') {
      event.preventDefault();
      setActiveAmount('');
      return;
    }

    event.preventDefault();
  };

  const handleMaskedAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    const parsed = parseLocaleAmount(event.target.value);
    if (parsed === null) {
      if (!event.target.value.trim()) {
        setActiveAmount('');
      }
      return;
    }

    setActiveAmount(parsed.toFixed(2));
  };

  const handleMaskedAmountPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData('text');
    const parsed = parseLocaleAmount(pasted);
    if (parsed === null) {
      return;
    }

    setActiveAmount(parsed.toFixed(2));
  };

  // Report current stage to demo system
  useEffect(() => {
    reportStage(step);
  }, [step, reportStage]);

  useEffect(() => {
    let mounted = true;

    async function loadSendContext() {
      if (!currentUser) {
        return;
      }

      const routeState = location.state as LocationState | null;
      const shouldResetFlow = !!routeState?.resetFlow;

      if (shouldResetFlow) {
        setStep('recipient');
        setRecipientSearch('');
        setRecipientId('');
        setSourceAmount('');
        setTargetAmount('');
        setNote('');
        setQuote(null);
        setQuoteError('');
        setValidationMessage('');
        setAcceptDisclosure(false);
        setLastIntentId(null);
        setMode('send_exact');
        setFundingMethod('ach');
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
        if (routeState?.recipientId) {
          setRecipientId(routeState.recipientId);
        } else if (recipientResult.data.length > 0) {
          setRecipientId(recipientResult.data[0].id);
        }
      }

      if (!shouldResetFlow && routeState?.presetAmount && routeState.presetAmount > 0) {
        setMode('send_exact');
        setSourceAmount(routeState.presetAmount.toFixed(2));
      }

      if (!shouldResetFlow && routeState?.presetNote) {
        setNote(routeState.presetNote);
      }

      if (!shouldResetFlow && routeState?.focusStep === 'amount' && routeState?.recipientId) {
        setStep('amount');
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
        fundingMethod,
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

  const validationError = useMemo(() => {
    if (!selectedRecipient) {
      return 'Select a recipient to start this transfer.';
    }

    const recipientError = canSendToRecipient(selectedRecipient, isDemoMode);
    if (recipientError) {
      return recipientError.message;
    }

    const modeError = validateModeForTier(tier, mode, isDemoMode);
    if (modeError) {
      return modeError.message;
    }

    const fundingError = validateFundingMethodForTier(tier, fundingMethod, isDemoMode);
    if (fundingError) {
      return fundingError.message;
    }

    const amountToValidate = quote?.sourceAmount || Number(sourceAmount || 0);
    const amountError = validateAmountForTier(tier, amountToValidate, dailySent, monthlySent, isDemoMode);
    if (amountError) {
      return amountError.message;
    }

    if (quote && quote.totalDebitAmount > (currentUser?.balance || 0)) {
      return 'Insufficient balance for this transfer.';
    }

    return '';
  }, [currentUser?.balance, dailySent, fundingMethod, isDemoMode, mode, monthlySent, quote, selectedRecipient, sourceAmount, tier]);

  const refreshQuote = async () => {
    if (!selectedRecipient) {
      return;
    }

    const result = await quoteService.refreshQuote({
      recipientCountry: selectedRecipient.country,
      mode,
      sourceAmount: Number(sourceAmount || 0),
      targetAmount: Number(targetAmount || 0),
      fundingMethod,
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

  const goToAmountStep = (recipient?: Recipient | null) => {
    const activeRecipient = recipient ?? selectedRecipient;

    if (!activeRecipient) {
      setValidationMessage('Select a recipient to start.');
      return;
    }

    setRecipientId(activeRecipient.id);

    const recipientError = canSendToRecipient(activeRecipient, isDemoMode);
    if (recipientError) {
      setValidationMessage(recipientError.message);
      return;
    }

    setValidationMessage('');
    setStep('amount');
  };

  const goToRequestStep = (recipient: Recipient) => {
    setRecipientId(recipient.id);
    navigate('/receive', {
      state: {
        suggestedContact: recipient.name,
        suggestedNote: `Request from ${recipient.name}`,
      },
    });
  };

  const goToReviewStep = () => {
    if (!quote) {
      setValidationMessage('Enter an amount to generate a quote.');
      return;
    }

    if (quoteExpired) {
      setValidationMessage('Quote expired. Refresh quote before review.');
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
    { key: 'amount', label: 'Amount & Quote' },
    { key: 'review', label: 'Confirm' },
  ];

  const activeStepIndex =
    step === 'success'
      ? progressSteps.length
      : progressSteps.findIndex((item) => item.key === step);

  return (
    <Layout>
      {/* --- NEW: RENDER THE INSPECTOR PANEL --- */}
      {/* This component manages its own visibility/animation based on the isOpen prop */}
      <OpsInspectorPanel intel={operationalIntel} isOpen={isDemoMode} />

      <div className="max-w-3xl mx-auto pb-20 md:pb-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-[1.35rem] md:text-[1.6rem] font-bold text-gray-950 font-display tracking-tight">
              Send money
            </h1>
            <p className="text-[13px] text-gray-500 mt-0.5">
              See the exact cost before you confirm.
            </p>
          </div>
          <span className="vv-chip">{accountLevel.shortName}</span>
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
                  const blocked = canSendToRecipient(recipient, isDemoMode);
                  const isSelected = recipientId === recipient.id;
                  return (
                    <motion.div
                      key={recipient.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setRecipientId(recipient.id)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          setRecipientId(recipient.id);
                        }
                      }}
                      whileHover={{ scale: 1.005 }}
                      className={`vv-choice-card group ${isSelected ? 'vv-choice-card-active' : ''}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="vv-country-badge h-10 w-10 rounded-xl text-xs">
                            {toCountryCode(recipient.country)}
                          </span>
                          <div className="min-w-0">
                            <div className="font-semibold text-gray-900">{recipient.name}</div>
                            <div className="text-sm text-gray-500 truncate">{recipient.email}</div>
                            <div className="text-xs text-gray-400">{recipient.country}</div>
                            {blocked && (
                              <div className="text-[11px] text-amber-700 mt-1 truncate">
                                {blocked.message}
                              </div>
                            )}
                          </div>
                        </div>

                        <div
                          className={`flex items-center gap-2 shrink-0 transition-all duration-200 ${
                            isSelected
                              ? 'opacity-100 translate-x-0'
                              : 'opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              goToAmountStep(recipient);
                            }}
                            disabled={!!blocked}
                            className="rounded-lg border border-primary-300/70 bg-white/72 text-primary-900 text-xs font-semibold px-3 py-2 backdrop-blur-sm shadow-[0_8px_18px_-14px_rgba(12,74,110,0.28)] transition-all duration-200 hover:bg-primary-50/86 hover:border-primary-400/80 hover:shadow-[0_10px_20px_-14px_rgba(12,74,110,0.36)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 disabled:border-gray-200 disabled:bg-gray-100/90 disabled:text-gray-400 disabled:opacity-100 disabled:shadow-none"
                          >
                            Send
                          </button>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              goToRequestStep(recipient);
                            }}
                            className="rounded-lg border border-gray-200 bg-white text-gray-700 text-xs font-semibold px-3 py-2 transition-colors hover:bg-gray-50"
                          >
                            Request
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                {filteredRecipients.length === 0 && (
                  <>
                    {!hasRecipients && !recipientSearch.trim() ? (
                      <div className="vv-surface-soft text-sm text-gray-600">
                        <p className="font-semibold text-gray-900">No recipients yet</p>
                        <p className="mt-1">
                          Add your first recipient to start a transfer.
                        </p>
                        <button
                          type="button"
                          onClick={() => navigate('/connections')}
                          className="mt-3 btn btn-secondary inline-flex items-center gap-2 text-sm"
                        >
                          <UserPlus className="h-4 w-4" />
                          Add recipient
                        </button>
                      </div>
                    ) : (
                      <div className="vv-surface-soft text-sm text-gray-500">
                        No recipients match that search.
                      </div>
                    )}
                  </>
                )}
              </div>

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
              Set amount and delivery preference
            </h2>

            <div className="space-y-5">
              <div className="vv-segment">
                <button
                  type="button"
                  onClick={() => setMode('send_exact')}
                  className={`vv-segment-btn ${mode === 'send_exact' ? 'vv-segment-btn-active' : ''}`}
                >
                  Set Sent Amount
                </button>
                <button
                  type="button"
                  onClick={() => setMode('receive_exact')}
                  disabled={!limits.allowReceiveExact}
                  className={`vv-segment-btn ${mode === 'receive_exact' ? 'vv-segment-btn-active' : ''} ${
                    !limits.allowReceiveExact ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <span className="inline-flex items-center justify-center gap-1.5">
                    Set Delivered Amount
                    {!limits.allowReceiveExact && <Lock className="h-3.5 w-3.5" />}
                  </span>
                </button>
              </div>
              <p className="text-xs text-gray-500">
                {mode === 'send_exact'
                  ? 'You choose exactly how much leaves your account.'
                  : 'Your recipient gets the exact amount. Your total adjusts based on the exchange rate and fees.'}
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {mode === 'send_exact' ? 'You send (USD)' : `They receive (${quote?.destinationCurrency || 'Local'})`}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-2xl font-semibold">$</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={activeAmountDisplay}
                    onKeyDown={handleMaskedAmountKeyDown}
                    onChange={handleMaskedAmountChange}
                    onPaste={handleMaskedAmountPaste}
                    className="input pl-12 text-2xl font-semibold"
                    placeholder="0.00"
                    aria-label="Transfer amount"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[50, 100, 250, 500].map((value) => (
                  <motion.button
                    type="button"
                    key={value}
                    onClick={() => {
                      setActiveAmount(value.toString());
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
                {quoteLoading && <div className="text-sm text-gray-500">Fetching live quote...</div>}
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
                      <span className="text-gray-600">Market rate</span>
                      <span className="font-semibold text-gray-900">{quote.midMarketRate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">You send</span>
                      <span className="font-semibold text-gray-900">${quote.sourceAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Fees</span>
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
                      <span className="font-bold text-lg text-primary-700 inline-flex items-center gap-2">
                        <span className="vv-country-badge h-6 w-8 rounded-md text-[10px]">
                          {selectedRecipientCountryCode}
                        </span>
                        {quote.destinationAmount.toFixed(2)} {quote.destinationCurrency}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Quote valid for {secondsRemaining}s {quoteExpired && '• expired'}
                    </div>
                  </>
                )}
              </div>

              {quote && (
                <FxTicker
                  pair={`USD → ${quote.destinationCurrency}`}
                  baseRate={quote.rate}
                  label="Exchange rate"
                  className="mt-4"
                />
              )}

              <div className="vv-surface-soft">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-gray-500">Payment method</div>
                    <div className="font-semibold text-gray-900">Choose how you want to pay</div>
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
                    <div className="font-semibold text-gray-900">Bank Account (ACH)</div>
                    <div className="text-xs text-gray-500">Regulated collection through licensed partner</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => limits.allowDebitCard && setFundingMethod('debit_card')}
                    disabled={!limits.allowDebitCard}
                    className={`vv-choice-card ${
                      fundingMethod === 'debit_card' ? 'vv-choice-card-active' : ''
                    } ${!limits.allowDebitCard ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="font-semibold text-gray-900 inline-flex items-center gap-1.5">
                      Debit Card
                      {!limits.allowDebitCard && <Lock className="h-3.5 w-3.5" />}
                    </div>
                    <div className="text-xs text-gray-500">Card-based collection</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Note (optional)</label>
                <textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  className="input"
                  rows={3}
                  placeholder="e.g., Family support for February"
                />
              </div>

              <div className="vv-surface-soft border-accent-200/40 bg-accent-50/80 text-sm text-accent-800">
                Remaining today: ${(limits.daily - dailySent).toFixed(2)} · Remaining this month: ${
                  (limits.monthly - monthlySent).toFixed(2)
                }
              </div>

              <button
                type="button"
                onClick={goToReviewStep}
                disabled={!quote || !!validationError}
                className="w-full btn btn-primary py-3 text-lg disabled:opacity-50"
              >
                {validationError || quoteExpired ? 'Resolve issues to review' : 'Review transfer'}
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
                    <span className="vv-country-badge h-8 w-10 rounded-lg text-[10px]">
                      {selectedRecipientCountryCode}
                    </span>
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
                  <span className="text-gray-600">Payment method</span>
                  <span className="font-semibold text-gray-900">{fundingMethod === 'ach' ? 'Bank transfer' : 'Debit Card'}</span>
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
                  I authorize VentoVault and its regulated partners to process this transfer.
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
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending transfer...
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
            className="vv-hero"
          >
            <div className="text-center mb-6">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-success-50 text-success-600">
                <CircleCheck className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 font-display">
                Transfer Complete
              </h2>
              <p className="text-gray-600">Immutable Receipt · Transaction Lifecycle</p>
            </div>

            {/* Transaction Summary */}
            <div className="vv-surface-soft space-y-3 mb-4 text-left">
              <div className="font-semibold text-sm text-gray-500 mb-2">Transaction Summary</div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Transaction ID</span>
                <span className="font-mono text-xs text-gray-900">{lastIntentId || 'TXN-20240215-A1B2C3D4'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Sent</span>
                <span className="font-semibold text-gray-900">${quote.sourceAmount.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Received</span>
                <span className="font-semibold text-primary-700">
                  {quote.destinationAmount.toFixed(2)} {quote.destinationCurrency}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Exchange Rate (Executed)</span>
                <span className="font-mono text-xs text-gray-900">{quote.rate.toFixed(4)}</span>
              </div>
            </div>

            {/* Transaction Lifecycle - 8 Stages */}
            <div className="vv-surface-soft space-y-2 mb-4 text-left">
              <div className="font-semibold text-sm text-gray-500 mb-3">Transaction Lifecycle</div>

              {[
                { stage: 'Stage 1: Intent Created', time: new Date().toISOString(), status: 'complete' },
                { stage: 'Stage 2: Quote Generated', time: new Date().toISOString(), status: 'complete' },
                { stage: 'Stage 3: User Consent', time: new Date().toISOString(), status: 'complete' },
                { stage: 'Stage 4: Funds Collected', partner: 'Collection Partner (US)', confirmId: 'CP-US-240215-A1B2', status: 'complete' },
                { stage: 'Stage 5: Compliance Approved', check: 'VV Layer 1 + Partner Layer 2', status: 'complete' },
                { stage: 'Stage 6: Settlement', partner: 'Settlement Partner', confirmId: 'STL-240215-C3D4', status: 'complete' },
                { stage: 'Stage 7: Payout Executed', partner: 'Payout Partner (DR)', confirmId: 'PP-DR-240215-E5F6', status: 'complete' },
                { stage: 'Stage 8: Receipt Issued', time: new Date().toISOString(), status: 'complete' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs pb-2 border-b border-gray-100 last:border-0">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{item.stage}</div>
                    {item.partner && (
                      <div className="text-gray-500">Partner: {item.partner}</div>
                    )}
                    {item.check && (
                      <div className="text-gray-500">Validation: {item.check}</div>
                    )}
                    {item.confirmId && (
                      <div className="text-gray-500 font-mono text-[10px]">Confirmation ID: {item.confirmId}</div>
                    )}
                    {item.time && (
                      <div className="text-gray-400 text-[10px] mt-0.5">
                        {new Date(item.time).toLocaleString('en-US', {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Simulation Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-xs text-amber-900">
              <div className="font-semibold mb-1">Demo Mode - Simulated Process</div>
              <div>This is a demonstration of the transaction lifecycle. Actual partner names, confirmation IDs, and compliance checks are simulated. Real transactions require external KYC validation through licensed partners and strict regulatory compliance procedures per corridor requirements.</div>
            </div>

            {/* Fee Breakdown */}
            <div className="vv-surface-soft space-y-3 mb-4 text-left text-sm">
              <div className="font-semibold text-sm text-gray-500">Fee Breakdown</div>

              <div className="flex justify-between items-start">
                <span className="text-gray-700">You send</span>
                <span className="font-mono text-gray-900">${quote.sourceAmount.toFixed(2)} USD</span>
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <div className="text-gray-700">VentoVault fee</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">2.5% of send amount · min $2.50, max $10.00</div>
                </div>
                <span className="font-mono text-gray-900">+ ${quote.feeAmount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <div className="text-gray-700">Collection cost</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    {fundingMethod === 'debit_card'
                      ? 'Debit card — pass-through from collection partner'
                      : 'ACH bank transfer — no charge to sender'}
                  </div>
                </div>
                <span className="font-mono text-gray-900">
                  {quote.networkCost === 0 ? '$0.00' : `+ $${quote.networkCost.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="font-semibold text-gray-900">Total debited</span>
                <span className="font-semibold text-gray-900">${quote.totalDebitAmount.toFixed(2)} USD</span>
              </div>

              <div className="flex justify-between text-xs text-gray-500">
                <span>Recipient receives</span>
                <span className="font-mono">{quote.destinationAmount.toFixed(2)} {quote.destinationCurrency}</span>
              </div>
            </div>

            {/* Forensic Proof Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-xs text-blue-900">
              <div className="font-semibold mb-1">Forensic Proof</div>
              <div>This receipt contains partner confirmation IDs that can be forensically reconstructed by a bank auditor. The executed rate matches the quoted promise.</div>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => navigate('/transactions')} className="flex-1 btn btn-secondary py-3">
                View Full Receipt
              </button>
              <button type="button" onClick={() => navigate('/dashboard')} className="flex-1 btn btn-primary py-3">
                Back to Home
              </button>
            </div>
          </motion.div>
        )}

        <p className="text-[10px] text-gray-400 text-center mt-8 uppercase tracking-[0.14em]">
          {accountLevel.customerLabel} · Up to ${limits.perTransaction.toFixed(2)} per transfer · Daily limit ${limits.daily.toFixed(2)}
        </p>
      </div>
    </Layout>
  );
}