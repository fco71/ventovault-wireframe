export type VerificationTier = 'L10' | 'L20' | 'L30' | 'L40';

export type RecipientState =
  | 'pending_validation'
  | 'validated_new'
  | 'active_trusted'
  | 'flagged';

export type TransferMode = 'send_exact' | 'receive_exact';

export type FundingMethod = 'ach' | 'debit_card';

export type TransactionState =
  | 'initiated'
  | 'quoted'
  | 'authorized'
  | 'funding_pending'
  | 'funded'
  | 'under_review'
  | 'approved'
  | 'conversion'
  | 'settlement'
  | 'payout'
  | 'completed'
  | 'failed'
  | 'refunded';

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;
  createdAt: Date;
  balance: number;
  verificationTier?: VerificationTier;
  dailyLimit?: number;
  monthlyLimit?: number;
}

export interface Quote {
  id: string;
  pair: string;
  sourceCurrency: string;
  destinationCurrency: string;
  mode: TransferMode;
  sourceAmount: number;
  destinationAmount: number;
  feeAmount: number;
  networkCost: number;
  totalDebitAmount: number;
  rate: number;
  midMarketRate: number;
  expiresAt: Date;
  quoteMatched?: boolean;
}

export interface TransferTimelineEvent {
  id: string;
  state: TransactionState;
  title: string;
  subtitle?: string;
  timestamp: Date;
  actor: 'system' | 'user' | 'partner';
}

export interface TransferIntent {
  id: string;
  userId: string;
  recipientId: string;
  recipientName: string;
  recipientCountry: string;
  recipientFlag: string;
  mode: TransferMode;
  fundingMethod: FundingMethod;
  sourceAmount: number;
  destinationAmount: number;
  sourceCurrency: string;
  destinationCurrency: string;
  feeAmount: number;
  networkCost: number;
  totalDebitAmount: number;
  quoteId: string;
  quoteExpiresAt: Date;
  state: TransactionState;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
  timeline: TransferTimelineEvent[];
}

export interface TransferReceipt {
  transactionId: string;
  createdAt: Date;
  completedAt: Date;
  fromName: string;
  fromAccount: string;
  toName: string;
  toAccount: string;
  sourceAmount: number;
  destinationAmount: number;
  sourceCurrency: string;
  destinationCurrency: string;
  feeAmount: number;
  networkCost: number;
  totalPaidAmount: number;
  quotedRate: number;
  executedRate: number;
  quoteMatched: boolean;
  timeline: TransferTimelineEvent[];
  partnerReferences: {
    collectionId: string;
    settlementId: string;
    payoutId: string;
  };
}

export interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'request';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  state?: TransactionState;
  from: {
    id: string;
    name: string;
    email: string;
  };
  to: {
    id: string;
    name: string;
    email: string;
    country: string;
    flag?: string;
  };
  createdAt: Date;
  completedAt?: Date;
  note?: string;
  fees: number;
  exchangeRate?: number;
  intentId?: string;
}

export interface Notification {
  id: string;
  type: 'transaction' | 'security' | 'promotion' | 'system' | 'compliance';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
  transactionId?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'bank' | 'card' | 'crypto';
  last4: string;
  name: string;
  isDefault: boolean;
}

export interface Recipient {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  country: string;
  countryFlag: string;
  bankAccount?: string;
  isFavorite: boolean;
  state: RecipientState;
  createdAt: Date;
  validatedAt?: Date;
  coolingOffEndsAt?: Date;
  totalSentUsd?: number;
  lastSentAt?: Date;
}

export interface ReceiveRequest {
  id: string;
  fromName: string;
  amount: number;
  status: 'pending' | 'paid' | 'expired';
  note?: string;
  createdAt: Date;
}

export interface DashboardData {
  stats: DashboardStats;
  recentTransactions: Transaction[];
  monthlySpending: Array<{ month: string; amount: number }>;
}

export interface DashboardStats {
  thisMonthUsd: number;
  thisMonthDeltaPercent: number;
  totalSentUsd: number;
  recipientCount: number;
  activeRecipientCount: number;
}

export interface TierLimits {
  perTransaction: number;
  daily: number;
  monthly: number;
  allowReceiveExact: boolean;
  allowDebitCard: boolean;
  recipientLimit: number;
  coolingOffHours: number;
}
