import { describe, expect, it } from 'vitest';
import { transferService } from './transferService';
import { quoteService } from './quoteService';
import { recipientService } from './recipientService';
import { User } from '../../types';

function buildUser(id: string): User {
  return {
    id,
    email: `${id}@example.com`,
    displayName: 'Demo User',
    createdAt: new Date(),
    balance: 2000,
    verificationTier: 'L30',
    dailyLimit: 10000,
    monthlyLimit: 50000,
  };
}

describe('transferService', () => {
  it('creates and advances an intent through states', async () => {
    const user = buildUser('test_user_transfer');

    const recipients = await recipientService.listRecipients(user.id);
    expect(recipients.ok).toBe(true);
    expect(recipients.data?.length).toBeGreaterThan(0);

    const recipient = recipients.data![0];

    const quoteResult = await quoteService.createQuote({
      recipientCountry: recipient.country,
      sourceAmount: 50,
      mode: 'send_exact',
    });

    expect(quoteResult.ok).toBe(true);

    const createResult = await transferService.createTransferIntent({
      user,
      recipient,
      mode: 'send_exact',
      fundingMethod: 'ach',
      quote: quoteResult.data!,
      note: 'Test transfer',
    });

    expect(createResult.ok).toBe(true);
    expect(createResult.data?.state).toBe('quoted');

    const advanceResult = await transferService.advanceTransfer({
      intentId: createResult.data!.id,
      nextState: 'authorized',
      subtitle: 'Approved for funding',
    });

    expect(advanceResult.ok).toBe(true);
    expect(advanceResult.data?.state).toBe('authorized');
  });

  it('creates receive requests and returns usage totals', async () => {
    const userId = 'test_user_receive';

    const requestResult = await transferService.createReceiveRequest(
      userId,
      'Family Member',
      120,
      'Support'
    );

    expect(requestResult.ok).toBe(true);
    expect(requestResult.data?.status).toBe('pending');

    const listResult = await transferService.listReceiveRequests(userId);
    expect(listResult.ok).toBe(true);
    expect(listResult.data?.some((item) => item.id === requestResult.data?.id)).toBe(true);

    const usageResult = await transferService.getUsage(userId);
    expect(usageResult.ok).toBe(true);
    expect(usageResult.data?.dailySent).toBeGreaterThanOrEqual(0);
    expect(usageResult.data?.monthlySent).toBeGreaterThanOrEqual(0);
  });
});
