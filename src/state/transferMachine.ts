import {
  FundingMethod,
  Recipient,
  RecipientState,
  TransactionState,
  TransferIntent,
  TransferMode,
  TransferTimelineEvent,
  VerificationTier,
} from '../types';
import { getTierLimits, minTransferAmountUsd } from '../config/domain';

export type TransferMachineErrorCode =
  | 'INVALID_TRANSITION'
  | 'TIER_MODE_RESTRICTED'
  | 'TIER_FUNDING_RESTRICTED'
  | 'AMOUNT_TOO_LOW'
  | 'AMOUNT_TOO_HIGH'
  | 'DAILY_LIMIT_EXCEEDED'
  | 'MONTHLY_LIMIT_EXCEEDED'
  | 'RECIPIENT_COOLING_OFF'
  | 'RECIPIENT_FLAGGED';

export interface TransferMachineError {
  code: TransferMachineErrorCode;
  message: string;
}

const transitionMap: Record<TransactionState, TransactionState[]> = {
  initiated: ['quoted', 'failed'],
  quoted: ['authorized', 'failed'],
  authorized: ['funding_pending', 'failed'],
  funding_pending: ['funded', 'failed', 'refunded'],
  funded: ['under_review', 'conversion', 'failed'],
  under_review: ['approved', 'failed', 'refunded'],
  approved: ['conversion', 'failed'],
  conversion: ['settlement', 'failed'],
  settlement: ['payout', 'failed'],
  payout: ['completed', 'failed', 'refunded'],
  completed: [],
  failed: ['refunded'],
  refunded: [],
};

export function getAllowedTransitions(from: TransactionState): TransactionState[] {
  return transitionMap[from];
}

export function isTerminalState(state: TransactionState): boolean {
  return state === 'completed' || state === 'refunded';
}

export function canTransition(from: TransactionState, to: TransactionState): boolean {
  return transitionMap[from].includes(to);
}

export function assertTransition(from: TransactionState, to: TransactionState): TransferMachineError | null {
  if (canTransition(from, to)) {
    return null;
  }

  return {
    code: 'INVALID_TRANSITION',
    message: `Cannot transition transfer from ${from} to ${to}.`,
  };
}

function buildEvent(state: TransactionState, subtitle?: string): TransferTimelineEvent {
  return {
    id: `evt_${state}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    state,
    title: prettifyState(state),
    subtitle,
    timestamp: new Date(),
    actor: 'system',
  };
}

export function transitionIntent(
  intent: TransferIntent,
  nextState: TransactionState,
  subtitle?: string
): TransferIntent {
  const error = assertTransition(intent.state, nextState);
  if (error) {
    throw new Error(error.message);
  }

  const event = buildEvent(nextState, subtitle);
  return {
    ...intent,
    state: nextState,
    updatedAt: new Date(),
    timeline: [...intent.timeline, event],
  };
}

export function createInitialTimeline(): TransferTimelineEvent[] {
  return [
    {
      id: `evt_initiated_${Date.now()}`,
      state: 'initiated',
      title: 'Transfer Initiated',
      subtitle: 'Intent created and awaiting quote',
      timestamp: new Date(),
      actor: 'user',
    },
  ];
}

function prettifyState(state: TransactionState): string {
  return state
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function validateModeForTier(
  tier: VerificationTier,
  mode: TransferMode
): TransferMachineError | null {
  const limits = getTierLimits(tier);
  if (mode === 'receive_exact' && !limits.allowReceiveExact) {
    return {
      code: 'TIER_MODE_RESTRICTED',
      message: 'Setting an exact delivery amount requires a Verified or Business account.',
    };
  }
  return null;
}

export function validateFundingMethodForTier(
  tier: VerificationTier,
  fundingMethod: FundingMethod
): TransferMachineError | null {
  const limits = getTierLimits(tier);
  if (fundingMethod === 'debit_card' && !limits.allowDebitCard) {
    return {
      code: 'TIER_FUNDING_RESTRICTED',
      message: 'Paying with a debit card requires a Verified or Business account.',
    };
  }
  return null;
}

export function validateAmountForTier(
  tier: VerificationTier,
  amount: number,
  usedDaily: number,
  usedMonthly: number
): TransferMachineError | null {
  const limits = getTierLimits(tier);

  if (amount < minTransferAmountUsd) {
    return {
      code: 'AMOUNT_TOO_LOW',
      message: `Minimum transfer amount is $${minTransferAmountUsd.toFixed(2)}.`,
    };
  }

  if (amount > limits.perTransaction) {
    return {
      code: 'AMOUNT_TOO_HIGH',
      message: `Maximum per-transfer limit for your current account level is $${limits.perTransaction.toFixed(2)}.`,
    };
  }

  if (usedDaily + amount > limits.daily) {
    return {
      code: 'DAILY_LIMIT_EXCEEDED',
      message: 'This transfer exceeds your remaining daily limit.',
    };
  }

  if (usedMonthly + amount > limits.monthly) {
    return {
      code: 'MONTHLY_LIMIT_EXCEEDED',
      message: 'This transfer exceeds your remaining monthly limit.',
    };
  }

  return null;
}

export function canSendToRecipient(recipient: Recipient): TransferMachineError | null {
  if (recipient.state === 'flagged') {
    return {
      code: 'RECIPIENT_FLAGGED',
      message: 'This person is temporarily restricted. Please contact support.',
    };
  }

  if (recipient.state === 'pending_validation') {
    return {
      code: 'RECIPIENT_COOLING_OFF',
      message: 'We\'re still setting up this person. This usually takes a few minutes.',
    };
  }

  if (
    recipient.state === 'validated_new' &&
    recipient.coolingOffEndsAt &&
    new Date(recipient.coolingOffEndsAt).getTime() > Date.now()
  ) {
    return {
      code: 'RECIPIENT_COOLING_OFF',
      message: 'This person was just added. You can send to them shortly.',
    };
  }

  return null;
}

export function canUseRecipientState(state: RecipientState): boolean {
  return state === 'active_trusted' || state === 'validated_new';
}
