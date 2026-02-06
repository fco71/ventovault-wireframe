import { getTierLimits } from '../../config/domain';
import {
  CreateTransferInput,
  DashboardData,
  ServiceResult,
  TransferService,
} from '../contracts';
import {
  ReceiveRequest,
  Transaction,
  TransactionState,
  TransferIntent,
  TransferReceipt,
} from '../../types';
import {
  canSendToRecipient,
  createInitialTimeline,
  transitionIntent,
} from '../../state/transferMachine';
import { appendNotification, getTierForUser, getUserStore, updateUserStore } from './store';
import { makeId, shortTimeAgo, waitForSeed } from './utils';

const intentOwnerMap = new Map<string, string>();

const autoProgressSequence: TransactionState[] = [
  'authorized',
  'funding_pending',
  'funded',
  'conversion',
  'settlement',
  'payout',
  'completed',
];

function mapStateToStatus(state: TransactionState): Transaction['status'] {
  if (state === 'completed') {
    return 'completed';
  }
  if (state === 'failed') {
    return 'failed';
  }
  if (state === 'refunded') {
    return 'cancelled';
  }
  return 'pending';
}

function findOwnerByTransactionId(transactionId: string): string | null {
  const userIds = Array.from(new Set([...intentOwnerMap.values()]));

  for (const userId of userIds) {
    const tx = getUserStore(userId).transactions.find((item) => item.id === transactionId);
    if (tx) {
      return userId;
    }
  }

  return null;
}

function computeUsage(transactions: Transaction[]): { dailySent: number; monthlySent: number } {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const sends = transactions.filter((item) => item.type === 'send' && item.status !== 'failed');

  const dailySent = sends
    .filter((item) => item.createdAt >= startOfDay)
    .reduce((sum, item) => sum + item.amount, 0);

  const monthlySent = sends
    .filter((item) => item.createdAt >= startOfMonth)
    .reduce((sum, item) => sum + item.amount, 0);

  return { dailySent, monthlySent };
}

function toDashboardData(userId: string): DashboardData {
  const store = getUserStore(userId);
  const sendTransactions = store.transactions.filter((item) => item.type === 'send');

  const thisMonthTotal = computeUsage(store.transactions).monthlySent;
  const previousMonthEstimate = Math.max(1, thisMonthTotal - 120);
  const deltaPct = Number((((thisMonthTotal - previousMonthEstimate) / previousMonthEstimate) * 100).toFixed(1));

  const stats = {
    thisMonthUsd: thisMonthTotal,
    thisMonthDeltaPercent: deltaPct,
    totalSentUsd: sendTransactions.reduce((sum, item) => sum + item.amount, 0),
    recipientCount: store.recipients.length,
    activeRecipientCount: store.recipients.filter((item) => item.state === 'active_trusted').length,
  };

  const monthlySpending = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => ({
    month,
    amount: 250 + index * 90,
  }));

  const recentTransactions = [...store.transactions]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 6);

  return {
    stats,
    recentTransactions,
    monthlySpending,
  };
}

class MockTransferService implements TransferService {
  async listTransactions(userId: string): Promise<ServiceResult<Transaction[]>> {
    await waitForSeed(`transfer:list:${userId}`);
    const store = getUserStore(userId);
    return {
      ok: true,
      data: store.transactions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    };
  }

  async getDashboardData(userId: string): Promise<ServiceResult<DashboardData>> {
    await waitForSeed(`transfer:dashboard:${userId}`);
    return {
      ok: true,
      data: toDashboardData(userId),
    };
  }

  async createTransferIntent(input: CreateTransferInput): Promise<ServiceResult<TransferIntent>> {
    await waitForSeed(`transfer:create:${input.user.id}`);

    const recipientError = canSendToRecipient(input.recipient);
    if (recipientError) {
      return {
        ok: false,
        error: {
          code: 'FORBIDDEN',
          message: recipientError.message,
        },
      };
    }

    const tier = getTierForUser(input.user.id);
    const limits = getTierLimits(tier);

    if (input.quote.sourceAmount > limits.perTransaction) {
      return {
        ok: false,
        error: {
          code: 'FORBIDDEN',
          message: `Per-transfer limit exceeded for tier ${tier}.`,
        },
      };
    }

    const now = new Date();
    const intentId = makeId('intent');
    let intent: TransferIntent = {
      id: intentId,
      userId: input.user.id,
      recipientId: input.recipient.id,
      recipientName: input.recipient.name,
      recipientCountry: input.recipient.country,
      recipientFlag: input.recipient.countryFlag,
      mode: input.mode,
      fundingMethod: input.fundingMethod,
      sourceAmount: input.quote.sourceAmount,
      destinationAmount: input.quote.destinationAmount,
      sourceCurrency: input.quote.sourceCurrency,
      destinationCurrency: input.quote.destinationCurrency,
      feeAmount: input.quote.feeAmount,
      networkCost: input.quote.networkCost,
      totalDebitAmount: input.quote.totalDebitAmount,
      quoteId: input.quote.id,
      quoteExpiresAt: input.quote.expiresAt,
      state: 'initiated',
      note: input.note,
      createdAt: now,
      updatedAt: now,
      timeline: createInitialTimeline(),
    };

    intent = transitionIntent(intent, 'quoted', 'Quote accepted by user');

    const transaction: Transaction = {
      id: makeId('txn'),
      type: 'send',
      amount: input.quote.sourceAmount,
      currency: input.quote.sourceCurrency,
      status: 'pending',
      state: intent.state,
      from: {
        id: input.user.id,
        name: input.user.displayName,
        email: input.user.email,
      },
      to: {
        id: input.recipient.id,
        name: input.recipient.name,
        email: input.recipient.email,
        country: input.recipient.country,
        flag: input.recipient.countryFlag,
      },
      createdAt: now,
      fees: input.quote.feeAmount + input.quote.networkCost,
      exchangeRate: input.quote.rate,
      note: input.note,
      intentId,
    };

    updateUserStore(input.user.id, (store) => ({
      ...store,
      intents: [intent, ...store.intents],
      transactions: [transaction, ...store.transactions],
    }));

    intentOwnerMap.set(intentId, input.user.id);

    appendNotification(input.user.id, {
      type: 'transaction',
      title: 'Transfer queued',
      message: `Transfer to ${input.recipient.name} has started and is now quoted.`,
      read: false,
      actionUrl: '/transactions',
      transactionId: transaction.id,
    });

    return { ok: true, data: intent };
  }

  async advanceTransfer(input: {
    intentId: string;
    nextState: TransactionState;
    subtitle?: string;
  }): Promise<ServiceResult<TransferIntent>> {
    await waitForSeed(`transfer:advance:${input.intentId}:${input.nextState}`);

    const ownerId = intentOwnerMap.get(input.intentId);
    if (!ownerId) {
      return {
        ok: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Transfer intent not found.',
        },
      };
    }

    let updatedIntent: TransferIntent | undefined;

    updateUserStore(ownerId, (store) => {
      const intents = store.intents.map((item) => {
        if (item.id !== input.intentId) {
          return item;
        }

        updatedIntent = transitionIntent(item, input.nextState, input.subtitle);
        return updatedIntent;
      });

      const transactions = store.transactions.map((tx) => {
        if (tx.intentId !== input.intentId) {
          return tx;
        }

        return {
          ...tx,
          state: input.nextState,
          status: mapStateToStatus(input.nextState),
          completedAt: input.nextState === 'completed' ? new Date() : tx.completedAt,
        };
      });

      return {
        ...store,
        intents,
        transactions,
      };
    });

    if (!updatedIntent) {
      return {
        ok: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Transfer intent not found.',
        },
      };
    }

    const relatedTransaction = getUserStore(ownerId).transactions.find(
      (item) => item.intentId === input.intentId
    );

    if (relatedTransaction) {
      appendNotification(ownerId, {
        type: 'transaction',
        title: `Transfer ${input.nextState.replace('_', ' ')}`,
        message: `Transfer to ${updatedIntent.recipientName} is now ${input.nextState.replace('_', ' ')}.`,
        read: false,
        actionUrl: '/transactions',
        transactionId: relatedTransaction.id,
      });
    }

    return { ok: true, data: updatedIntent };
  }

  async getTransferIntent(intentId: string): Promise<ServiceResult<TransferIntent>> {
    await waitForSeed(`transfer:get-intent:${intentId}`);

    const ownerId = intentOwnerMap.get(intentId);
    if (!ownerId) {
      return {
        ok: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Transfer intent not found.',
        },
      };
    }

    const intent = getUserStore(ownerId).intents.find((item) => item.id === intentId);
    if (!intent) {
      return {
        ok: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Transfer intent not found.',
        },
      };
    }

    return { ok: true, data: intent };
  }

  async getReceipt(transactionId: string): Promise<ServiceResult<TransferReceipt>> {
    await waitForSeed(`transfer:receipt:${transactionId}`);

    const ownerId = findOwnerByTransactionId(transactionId);
    if (!ownerId) {
      return {
        ok: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Transaction not found.',
        },
      };
    }

    const store = getUserStore(ownerId);
    const transaction = store.transactions.find((item) => item.id === transactionId);

    if (!transaction) {
      return {
        ok: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Transaction not found.',
        },
      };
    }

    const intent = transaction.intentId
      ? store.intents.find((item) => item.id === transaction.intentId)
      : undefined;

    const receipt: TransferReceipt = {
      transactionId: transaction.id,
      createdAt: transaction.createdAt,
      completedAt: transaction.completedAt || new Date(),
      fromName: transaction.from.name,
      fromAccount: 'Chase Checking ****1234',
      toName: transaction.to.name,
      toAccount: `${transaction.to.country} payout account`,
      sourceAmount: transaction.amount,
      destinationAmount: intent?.destinationAmount ?? transaction.amount,
      sourceCurrency: transaction.currency,
      destinationCurrency: intent?.destinationCurrency ?? transaction.currency,
      feeAmount: intent?.feeAmount ?? transaction.fees,
      networkCost: intent?.networkCost ?? 0,
      totalPaidAmount: intent?.totalDebitAmount ?? transaction.amount + transaction.fees,
      quotedRate: transaction.exchangeRate ?? 1,
      executedRate: transaction.exchangeRate ?? 1,
      quoteMatched: true,
      timeline: intent?.timeline ?? [],
      partnerReferences: {
        collectionId: makeId('col'),
        settlementId: makeId('set'),
        payoutId: makeId('pay'),
      },
    };

    return { ok: true, data: receipt };
  }

  async listReceiveRequests(userId: string): Promise<ServiceResult<ReceiveRequest[]>> {
    await waitForSeed(`receive:list:${userId}`);

    return {
      ok: true,
      data: getUserStore(userId).receiveRequests,
    };
  }

  async createReceiveRequest(
    userId: string,
    fromName: string,
    amount: number,
    note?: string
  ): Promise<ServiceResult<ReceiveRequest>> {
    await waitForSeed(`receive:create:${userId}`);

    if (amount <= 0) {
      return {
        ok: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Amount must be greater than zero.',
        },
      };
    }

    const request: ReceiveRequest = {
      id: makeId('rq'),
      fromName,
      amount,
      status: 'pending',
      note,
      createdAt: new Date(),
    };

    updateUserStore(userId, (store) => ({
      ...store,
      receiveRequests: [request, ...store.receiveRequests],
    }));

    appendNotification(userId, {
      type: 'system',
      title: 'Payment request created',
      message: `Request for $${amount.toFixed(2)} is now shareable.`,
      read: false,
      actionUrl: '/receive',
    });

    return { ok: true, data: request };
  }

  async getUsage(userId: string): Promise<ServiceResult<{ dailySent: number; monthlySent: number }>> {
    await waitForSeed(`transfer:usage:${userId}`);

    const usage = computeUsage(getUserStore(userId).transactions);
    return {
      ok: true,
      data: usage,
    };
  }
}

export const transferService: TransferService = new MockTransferService();

export async function autoAdvanceTransfer(
  intentId: string,
  advance: (intentId: string, state: TransactionState, subtitle?: string) => Promise<void>
): Promise<void> {
  for (const state of autoProgressSequence) {
    await advance(intentId, state, `Auto advanced to ${state.replace('_', ' ')}`);
  }
}

export function buildTransferTimelinePreview(intent: TransferIntent): Array<{
  title: string;
  subtitle?: string;
  time: string;
  tone: 'primary' | 'success' | 'warning' | 'neutral';
}> {
  return intent.timeline.map((event) => ({
    title: event.title,
    subtitle: event.subtitle,
    time: shortTimeAgo(event.timestamp),
    tone:
      event.state === 'completed'
        ? 'success'
        : event.state === 'failed' || event.state === 'refunded'
          ? 'warning'
          : 'primary',
  }));
}
