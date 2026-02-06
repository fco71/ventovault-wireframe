import { NotificationService, ServiceResult } from '../contracts';
import { Notification, TransactionState } from '../../types';
import { appendNotification, getUserStore, updateUserStore } from './store';
import { waitForSeed } from './utils';

function buildMessage(state: TransactionState, recipientName: string, amount: number): string {
  switch (state) {
    case 'completed':
      return `Your transfer of $${amount.toFixed(2)} to ${recipientName} has completed.`;
    case 'failed':
      return `Your transfer to ${recipientName} failed. Tap to review next steps.`;
    case 'refunded':
      return `Your transfer to ${recipientName} has been refunded.`;
    default:
      return `Transfer to ${recipientName} moved to ${state.replace('_', ' ')}.`;
  }
}

class MockNotificationService implements NotificationService {
  async listNotifications(userId: string): Promise<ServiceResult<Notification[]>> {
    await waitForSeed(`notif:list:${userId}`);
    return {
      ok: true,
      data: getUserStore(userId).notifications.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      ),
    };
  }

  async markAllRead(userId: string): Promise<ServiceResult<Notification[]>> {
    await waitForSeed(`notif:mark-all:${userId}`);

    const updated = updateUserStore(userId, (store) => ({
      ...store,
      notifications: store.notifications.map((item) => ({ ...item, read: true })),
    }));

    return {
      ok: true,
      data: updated.notifications,
    };
  }

  async markRead(userId: string, notificationId: string): Promise<ServiceResult<Notification>> {
    await waitForSeed(`notif:mark:${notificationId}`);

    let updated: Notification | undefined;
    updateUserStore(userId, (store) => ({
      ...store,
      notifications: store.notifications.map((item) => {
        if (item.id !== notificationId) {
          return item;
        }

        updated = { ...item, read: true };
        return updated;
      }),
    }));

    if (!updated) {
      return {
        ok: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Notification not found.',
        },
      };
    }

    return { ok: true, data: updated };
  }

  async emitTransferNotification(
    userId: string,
    input: {
      transactionId: string;
      recipientName: string;
      amount: number;
      state: TransactionState;
    }
  ): Promise<ServiceResult<Notification>> {
    await waitForSeed(`notif:emit:${input.transactionId}:${input.state}`);

    const title =
      input.state === 'completed'
        ? 'Transfer completed'
        : input.state === 'failed'
          ? 'Transfer failed'
          : input.state === 'refunded'
            ? 'Transfer refunded'
            : 'Transfer update';

    const created = appendNotification(userId, {
      type: 'transaction',
      title,
      message: buildMessage(input.state, input.recipientName, input.amount),
      read: false,
      actionUrl: '/transactions',
      transactionId: input.transactionId,
    });

    return { ok: true, data: created };
  }
}

export const notificationService: NotificationService = new MockNotificationService();
