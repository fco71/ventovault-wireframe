import { getCorridorByCountry } from '../../config/domain';
import { Quote } from '../../types';
import { CreateQuoteInput, QuoteService, ServiceResult } from '../contracts';
import { featureFlags } from '../../config/flags';
import { makeId, waitForSeed } from './utils';

const baseNetworkCost = 0.75;
const platformFeeRate = 0.02;

function buildQuote(input: CreateQuoteInput): Quote {
  const corridor = getCorridorByCountry(input.recipientCountry);
  const sourceAmount = input.mode === 'receive_exact'
    ? Number((Number(input.targetAmount ?? 0) / corridor.rate).toFixed(2))
    : Number(input.sourceAmount.toFixed(2));

  const destinationAmount = input.mode === 'receive_exact'
    ? Number((input.targetAmount ?? 0).toFixed(2))
    : Number((sourceAmount * corridor.rate).toFixed(2));

  const feeAmount = Number((sourceAmount * platformFeeRate).toFixed(2));
  const totalDebitAmount = Number((sourceAmount + feeAmount + baseNetworkCost).toFixed(2));

  return {
    id: makeId('q'),
    pair: `USD/${corridor.destinationCurrency}`,
    sourceCurrency: 'USD',
    destinationCurrency: corridor.destinationCurrency,
    mode: input.mode,
    sourceAmount,
    destinationAmount,
    feeAmount,
    networkCost: baseNetworkCost,
    totalDebitAmount,
    rate: corridor.rate,
    midMarketRate: Number((corridor.rate + 0.1).toFixed(4)),
    expiresAt: new Date(Date.now() + 45 * 1000),
    quoteMatched: true,
  };
}

class MockQuoteService implements QuoteService {
  async createQuote(input: CreateQuoteInput): Promise<ServiceResult<Quote>> {
    if (featureFlags.enableDeterministicLatency) {
      await waitForSeed(`quote:create:${input.recipientCountry}:${input.mode}`);
    }

    if (input.mode === 'receive_exact' && (!input.targetAmount || input.targetAmount <= 0)) {
      return {
        ok: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Target amount is required for Receive-Exact mode.',
        },
      };
    }

    if (input.mode === 'send_exact' && input.sourceAmount <= 0) {
      return {
        ok: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Source amount must be greater than zero.',
        },
      };
    }

    return {
      ok: true,
      data: buildQuote(input),
    };
  }

  async refreshQuote(input: CreateQuoteInput): Promise<ServiceResult<Quote>> {
    return this.createQuote(input);
  }

  isExpired(quote: Quote): boolean {
    if (!featureFlags.enableQuoteExpiry) {
      return false;
    }

    return quote.expiresAt.getTime() <= Date.now();
  }
}

export const quoteService: QuoteService = new MockQuoteService();
