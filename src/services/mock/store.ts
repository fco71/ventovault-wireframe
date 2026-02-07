import {
  Notification,
  Recipient,
  ReceiveRequest,
  Transaction,
  TransferIntent,
  VerificationTier,
} from '../../types';
import { addHours, makeId } from './utils';

interface UserStore {
  tier: VerificationTier;
  recipients: Recipient[];
  transactions: Transaction[];
  intents: TransferIntent[];
  notifications: Notification[];
  receiveRequests: ReceiveRequest[];
}

const db: Record<string, UserStore> = {};

function seedRecipients(now: Date): Recipient[] {
  return [
    {
      id: 'rec_maria',
      name: 'Maria Rodriguez',
      email: 'maria.r@email.com',
      country: 'Dominican Republic',
      countryFlag: 'DO',
      bankAccount: 'Banco Popular ****4567',
      isFavorite: true,
      state: 'active_trusted',
      createdAt: addHours(now, -240),
      validatedAt: addHours(now, -236),
      coolingOffEndsAt: addHours(now, -230),
      totalSentUsd: 2450,
      lastSentAt: addHours(now, -48),
    },
    {
      id: 'rec_carlos',
      name: 'Carlos Mendez',
      email: 'carlos.m@email.com',
      country: 'Mexico',
      countryFlag: 'MX',
      bankAccount: 'BBVA ****9183',
      isFavorite: true,
      state: 'active_trusted',
      createdAt: addHours(now, -200),
      validatedAt: addHours(now, -194),
      coolingOffEndsAt: addHours(now, -188),
      totalSentUsd: 1820,
      lastSentAt: addHours(now, -72),
    },
    {
      id: 'rec_ana',
      name: 'Ana Garcia',
      email: 'ana.g@email.com',
      country: 'Guatemala',
      countryFlag: 'GT',
      bankAccount: 'Banrural ****7732',
      isFavorite: false,
      state: 'validated_new',
      createdAt: addHours(now, -4),
      validatedAt: addHours(now, -3),
      coolingOffEndsAt: addHours(now, 3),
      totalSentUsd: 675,
      lastSentAt: addHours(now, -96),
    },
  ];
}

function seedTransactions(now: Date): Transaction[] {
  return [
    {
      id: 'txn_1001',
      type: 'send',
      amount: 250,
      currency: 'USD',
      status: 'completed',
      state: 'completed',
      from: { id: 'me', name: 'You', email: 'you@example.com' },
      to: {
        id: 'rec_maria',
        name: 'Maria Rodriguez',
        email: 'maria.r@email.com',
        country: 'Dominican Republic',
        flag: 'DO',
      },
      createdAt: addHours(now, -50),
      completedAt: addHours(now, -49),
      fees: 5,
      exchangeRate: 58.5,
      note: 'Family support',
    },
    {
      id: 'txn_1002',
      type: 'send',
      amount: 175,
      currency: 'USD',
      status: 'pending',
      state: 'payout',
      from: { id: 'me', name: 'You', email: 'you@example.com' },
      to: {
        id: 'rec_ana',
        name: 'Ana Garcia',
        email: 'ana.g@email.com',
        country: 'Guatemala',
        flag: 'GT',
      },
      createdAt: addHours(now, -2),
      fees: 3.5,
      exchangeRate: 7.8,
      note: 'School fees',
    },
    {
      id: 'txn_1003',
      type: 'receive',
      amount: 150,
      currency: 'USD',
      status: 'completed',
      state: 'completed',
      from: { id: 'rec_carlos', name: 'Carlos Mendez', email: 'carlos.m@email.com' },
      to: {
        id: 'me',
        name: 'You',
        email: 'you@example.com',
        country: 'United States',
        flag: 'US',
      },
      createdAt: addHours(now, -76),
      completedAt: addHours(now, -75),
      fees: 0,
    },
  ];
}

function seedNotifications(now: Date): Notification[] {
  return [
    {
      id: 'n_1',
      type: 'transaction',
      title: 'Money sent successfully',
      message: 'Your transfer of $250 to Maria Rodriguez was completed.',
      read: false,
      createdAt: addHours(now, -2),
      actionUrl: '/transactions',
      transactionId: 'txn_1001',
    },
    {
      id: 'n_2',
      type: 'security',
      title: 'Login from new device',
      message: 'We detected a login from a new device in New York.',
      read: false,
      createdAt: addHours(now, -6),
      actionUrl: '/settings',
    },
    {
      id: 'n_3',
      type: 'promotion',
      title: 'Invite friends and earn $25',
      message: 'Share VentoVault with friends and get rewarded.',
      read: true,
      createdAt: addHours(now, -28),
    },
  ];
}

function seedReceiveRequests(now: Date): ReceiveRequest[] {
  return [
    {
      id: 'rq_1',
      fromName: 'Carlos J.',
      amount: 100,
      status: 'pending',
      note: 'Family groceries',
      createdAt: addHours(now, -2),
    },
    {
      id: 'rq_2',
      fromName: 'Ana S.',
      amount: 50,
      status: 'paid',
      note: 'Dinner split',
      createdAt: addHours(now, -24),
    },
  ];
}

function cloneStore(store: UserStore): UserStore {
  return {
    tier: store.tier,
    recipients: store.recipients.map((item) => ({ ...item })),
    transactions: store.transactions.map((item) => ({ ...item, from: { ...item.from }, to: { ...item.to } })),
    intents: store.intents.map((item) => ({ ...item, timeline: [...item.timeline] })),
    notifications: store.notifications.map((item) => ({ ...item })),
    receiveRequests: store.receiveRequests.map((item) => ({ ...item })),
  };
}

export function getUserStore(userId: string): UserStore {
  if (!db[userId]) {
    const now = new Date();
    db[userId] = {
      tier: 'L30',
      recipients: seedRecipients(now),
      transactions: seedTransactions(now),
      intents: [],
      notifications: seedNotifications(now),
      receiveRequests: seedReceiveRequests(now),
    };
  }

  return cloneStore(db[userId]);
}

export function updateUserStore(userId: string, updater: (store: UserStore) => UserStore): UserStore {
  const current = getUserStore(userId);
  const next = updater(current);
  db[userId] = next;
  return cloneStore(next);
}

export function appendNotification(userId: string, notification: Omit<Notification, 'id' | 'createdAt'>): Notification {
  const created: Notification = {
    ...notification,
    id: makeId('n'),
    createdAt: new Date(),
  };

  updateUserStore(userId, (store) => ({
    ...store,
    notifications: [created, ...store.notifications],
  }));

  return created;
}

export function getTierForUser(userId: string): VerificationTier {
  return getUserStore(userId).tier;
}

export function setTierForUser(userId: string, tier: VerificationTier): void {
  updateUserStore(userId, (store) => ({ ...store, tier }));
}
