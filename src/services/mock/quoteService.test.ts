import { describe, expect, it } from 'vitest';
import { quoteService } from './quoteService';

describe('quoteService', () => {
  it('creates send-exact quotes with totals and expiry', async () => {
    const result = await quoteService.createQuote({
      recipientCountry: 'Dominican Republic',
      sourceAmount: 100,
      mode: 'send_exact',
    });

    expect(result.ok).toBe(true);
    expect(result.data?.sourceAmount).toBe(100);
    expect(result.data?.destinationCurrency).toBe('DOP');
    expect(result.data?.totalDebitAmount).toBeGreaterThan(100);
    expect(result.data?.expiresAt.getTime()).toBeGreaterThan(Date.now());
  });

  it('creates receive-exact quotes using target amount', async () => {
    const result = await quoteService.createQuote({
      recipientCountry: 'Mexico',
      sourceAmount: 0,
      mode: 'receive_exact',
      targetAmount: 172,
    });

    expect(result.ok).toBe(true);
    expect(result.data?.destinationAmount).toBe(172);
    expect(result.data?.sourceAmount).toBeCloseTo(10, 1);
  });

  it('reports invalid quote inputs', async () => {
    const result = await quoteService.createQuote({
      recipientCountry: 'Guatemala',
      sourceAmount: 0,
      mode: 'send_exact',
    });

    expect(result.ok).toBe(false);
    expect(result.error?.code).toBe('VALIDATION_ERROR');
  });

  it('evaluates quote expiry correctly', () => {
    expect(
      quoteService.isExpired({
        id: 'q1',
        pair: 'USD/DOP',
        sourceCurrency: 'USD',
        destinationCurrency: 'DOP',
        mode: 'send_exact',
        sourceAmount: 10,
        destinationAmount: 585,
        feeAmount: 0.2,
        networkCost: 0.75,
        totalDebitAmount: 10.95,
        rate: 58.5,
        midMarketRate: 58.6,
        expiresAt: new Date(Date.now() - 1000),
      })
    ).toBe(true);
  });
});
