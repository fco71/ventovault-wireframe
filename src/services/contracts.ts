import {
  DashboardStats,
  Notification,
  Recipient,
  ReceiveRequest,
  Quote,
  TierLimits,
  Transaction,
  TransactionState,
  TransferIntent,
  TransferMode,
  User,
  VerificationTier,
  FundingMethod,
  TransferReceipt,
} from '../types';

export type ServiceErrorCode =
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'RATE_LIMITED'
  | 'FORBIDDEN'
  | 'EXPIRED'
  | 'CONFLICT'
  | 'INTERNAL';

export interface ServiceError {
  code: ServiceErrorCode;
  message: string;
}

export interface ServiceResult<T> {
  ok: boolean;
  data?: T;
  error?: ServiceError;
}

export interface CreateQuoteInput {
  recipientCountry: string;
  sourceAmount: number;
  mode: TransferMode;
  targetAmount?: number;
}

export interface CreateTransferInput {
  user: User;
  recipient: Recipient;
  mode: TransferMode;
  fundingMethod: FundingMethod;
  note?: string;
  quote: Quote;
}

export interface AdvanceTransferInput {
  intentId: string;
  nextState: TransactionState;
  subtitle?: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentTransactions: Transaction[];
  monthlySpending: Array<{ month: string; amount: number }>;
}

export interface QuoteService {
  createQuote(input: CreateQuoteInput): Promise<ServiceResult<Quote>>;
  refreshQuote(input: CreateQuoteInput): Promise<ServiceResult<Quote>>;
  isExpired(quote: Quote): boolean;
}

export interface TransferService {
  listTransactions(userId: string): Promise<ServiceResult<Transaction[]>>;
  getDashboardData(userId: string): Promise<ServiceResult<DashboardData>>;
  createTransferIntent(input: CreateTransferInput): Promise<ServiceResult<TransferIntent>>;
  advanceTransfer(input: AdvanceTransferInput): Promise<ServiceResult<TransferIntent>>;
  getTransferIntent(intentId: string): Promise<ServiceResult<TransferIntent>>;
  getReceipt(transactionId: string): Promise<ServiceResult<TransferReceipt>>;
  listReceiveRequests(userId: string): Promise<ServiceResult<ReceiveRequest[]>>;
  createReceiveRequest(
    userId: string,
    fromName: string,
    amount: number,
    note?: string
  ): Promise<ServiceResult<ReceiveRequest>>;
  getUsage(userId: string): Promise<ServiceResult<{ dailySent: number; monthlySent: number }>>;
}

export interface RecipientService {
  listRecipients(userId: string): Promise<ServiceResult<Recipient[]>>;
  addRecipient(
    userId: string,
    input: Pick<Recipient, 'name' | 'email' | 'country'>
  ): Promise<ServiceResult<Recipient>>;
  toggleFavorite(userId: string, recipientId: string): Promise<ServiceResult<Recipient>>;
  getRecipient(userId: string, recipientId: string): Promise<ServiceResult<Recipient>>;
  getTierLimits(tier: VerificationTier): TierLimits;
}

export interface NotificationService {
  listNotifications(userId: string): Promise<ServiceResult<Notification[]>>;
  markAllRead(userId: string): Promise<ServiceResult<Notification[]>>;
  markRead(userId: string, notificationId: string): Promise<ServiceResult<Notification>>;
  emitTransferNotification(
    userId: string,
    input: {
      transactionId: string;
      recipientName: string;
      amount: number;
      state: TransactionState;
    }
  ): Promise<ServiceResult<Notification>>;
}
