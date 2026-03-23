import { getCorridorByCountry } from '../../config/domain';
import { Quote } from '../../types';
import { CreateQuoteInput, QuoteService, ServiceResult } from '../contracts';
import { featureFlags } from '../../config/flags';
import { makeId, waitForSeed } from './utils';

// ─── Fee structure — sourced from technical spec Section 3.3 ──────────────────
// VentoVault fee: percentage-based, 2.5%, with a floor and ceiling.
const VV_FEE_RATE = 0.025;   // 2.5%  (spec: corridor.pricing.vvFeePercent)
const VV_FEE_MIN  = 2.50;    // $2.50 (spec: corridor.pricing.vvFeeMin)
const VV_FEE_MAX  = 10.00;   // $10   (spec: corridor.pricing.vvFeeMax)

// Network cost is the user-facing portion of the collection-partner fee.
// ACH (bank transfer) is free to the user; debit card carries a pass-through cost.
// Internal partner costs (collection $0.30 + conversion $0.10 +
// settlement $0.10 + payout $0.25 = $0.75) are VentoVault's margin line
// and must NEVER appear on a user-facing receipt.
const NETWORK_COST_ACH   = 0.00;  // ACH  — spec: fundingMethod.costPerTransaction
const NETWORK_COST_DEBIT = 1.50;  // Debit — spec: fundingMethod.costPerTransaction

function buildQuote(input: CreateQuoteInput): Quote {
  const corridor = getCorridorByCountry(input.recipientCountry);

  const sourceAmount = input.mode === 'receive_exact'
    ? Number((Number(input.targetAmount ?? 0) / corridor.rate).toFixed(2))
    : Number(input.sourceAmount.toFixed(2));

  const destinationAmount = input.mode === 'receive_exact'
    ? Number((input.targetAmount ?? 0).toFixed(2))
    : Number((sourceAmount * corridor.rate).toFixed(2));

  // VentoVault fee: 2.5% with $2.50 floor and $10 ceiling (spec § 3.3)
  const rawFee   = sourceAmount * VV_FEE_RATE;
  const feeAmount = Number(Math.min(Math.max(rawFee, VV_FEE_MIN), VV_FEE_MAX).toFixed(2));

  // Network cost shown to user — default to ACH ($0.00) for demo
  // In production this comes from the user's chosen fundingMethod.
  const networkCost = input.fundingMethod === 'debit_card'
    ? NETWORK_COST_DEBIT
    : NETWORK_COST_ACH;

  const totalDebitAmount = Number((sourceAmount + feeAmount + networkCost).toFixed(2));

  return {
    id: makeId('q'),
    pair: `USD/${corridor.destinationCurrency}`,
    sourceCurrency: 'USD',
    destinationCurrency: corridor.destinationCurrency,
    mode: input.mode,
    sourceAmount,
    destinationAmount,
    feeAmount,
    networkCost,
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
