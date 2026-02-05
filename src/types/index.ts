export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;
  createdAt: Date;
  balance: number;
}

export interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'request';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
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
  };
  createdAt: Date;
  completedAt?: Date;
  note?: string;
  fees: number;
  exchangeRate?: number;
}

export interface Notification {
  id: string;
  type: 'transaction' | 'security' | 'promotion' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
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
  bankAccount?: string;
  isFavorite: boolean;
}
