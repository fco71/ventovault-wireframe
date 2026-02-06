import { getCorridorByCountry, getTierLimits } from '../../config/domain';
import { RecipientService, ServiceResult } from '../contracts';
import { Recipient, VerificationTier } from '../../types';
import { getTierForUser, getUserStore, updateUserStore } from './store';
import { makeId, waitForSeed } from './utils';

class MockRecipientService implements RecipientService {
  async listRecipients(userId: string): Promise<ServiceResult<Recipient[]>> {
    await waitForSeed(`recipient:list:${userId}`);
    const store = getUserStore(userId);
    return { ok: true, data: store.recipients };
  }

  async addRecipient(
    userId: string,
    input: Pick<Recipient, 'name' | 'email' | 'country'>
  ): Promise<ServiceResult<Recipient>> {
    await waitForSeed(`recipient:add:${userId}`);

    const tier = getTierForUser(userId);
    const limits = getTierLimits(tier);
    const store = getUserStore(userId);

    if (store.recipients.length >= limits.recipientLimit) {
      return {
        ok: false,
        error: {
          code: 'FORBIDDEN',
          message: `Recipient limit reached for tier ${tier}.`,
        },
      };
    }

    const exists = store.recipients.some(
      (item) => item.email.toLowerCase() === input.email.toLowerCase()
    );

    if (exists) {
      return {
        ok: false,
        error: {
          code: 'CONFLICT',
          message: 'A recipient with this email already exists.',
        },
      };
    }

    const corridor = getCorridorByCountry(input.country);
    const now = new Date();

    const recipient: Recipient = {
      id: makeId('rec'),
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      country: corridor.name,
      countryFlag: corridor.flag,
      isFavorite: false,
      state: 'validated_new',
      createdAt: now,
      validatedAt: now,
      coolingOffEndsAt: new Date(now.getTime() + limits.coolingOffHours * 60 * 60 * 1000),
      totalSentUsd: 0,
    };

    updateUserStore(userId, (next) => ({
      ...next,
      recipients: [recipient, ...next.recipients],
    }));

    return { ok: true, data: recipient };
  }

  async toggleFavorite(userId: string, recipientId: string): Promise<ServiceResult<Recipient>> {
    await waitForSeed(`recipient:fav:${recipientId}`);

    let updated: Recipient | null = null;

    updateUserStore(userId, (store) => {
      const recipients = store.recipients.map((item) => {
        if (item.id !== recipientId) {
          return item;
        }

        updated = {
          ...item,
          isFavorite: !item.isFavorite,
        };
        return updated;
      });

      return {
        ...store,
        recipients,
      };
    });

    if (!updated) {
      return {
        ok: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Recipient not found.',
        },
      };
    }

    return { ok: true, data: updated };
  }

  async getRecipient(userId: string, recipientId: string): Promise<ServiceResult<Recipient>> {
    await waitForSeed(`recipient:get:${recipientId}`);

    const recipient = getUserStore(userId).recipients.find((item) => item.id === recipientId);
    if (!recipient) {
      return {
        ok: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Recipient not found.',
        },
      };
    }

    return { ok: true, data: recipient };
  }

  getTierLimits(tier: VerificationTier) {
    return getTierLimits(tier);
  }
}

export const recipientService: RecipientService = new MockRecipientService();
