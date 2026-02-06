import { describe, expect, it } from 'vitest';
import {
  assertTransition,
  canSendToRecipient,
  getAllowedTransitions,
  validateAmountForTier,
  validateFundingMethodForTier,
  validateModeForTier,
} from './transferMachine';
import { Recipient } from '../types';

describe('transferMachine', () => {
  it('allows documented forward transitions', () => {
    expect(getAllowedTransitions('quoted')).toContain('authorized');
    expect(assertTransition('quoted', 'authorized')).toBeNull();
  });

  it('rejects invalid transitions', () => {
    const result = assertTransition('quoted', 'completed');
    expect(result).not.toBeNull();
    expect(result?.code).toBe('INVALID_TRANSITION');
  });

  it('enforces tier mode restriction', () => {
    const result = validateModeForTier('L20', 'receive_exact');
    expect(result).not.toBeNull();
    expect(result?.code).toBe('TIER_MODE_RESTRICTED');
  });

  it('enforces tier funding method restriction', () => {
    const result = validateFundingMethodForTier('L20', 'debit_card');
    expect(result).not.toBeNull();
    expect(result?.code).toBe('TIER_FUNDING_RESTRICTED');
  });

  it('enforces amount and limits', () => {
    expect(validateAmountForTier('L30', 5, 0, 0)?.code).toBe('AMOUNT_TOO_LOW');
    expect(validateAmountForTier('L20', 1000, 0, 0)?.code).toBe('AMOUNT_TOO_HIGH');
    expect(validateAmountForTier('L20', 200, 400, 0)?.code).toBe('DAILY_LIMIT_EXCEEDED');
    expect(validateAmountForTier('L20', 200, 0, 1400)?.code).toBe('MONTHLY_LIMIT_EXCEEDED');
  });

  it('blocks cooling-off recipients', () => {
    const recipient: Recipient = {
      id: 'rec_1',
      name: 'Ana Garcia',
      email: 'ana@test.dev',
      country: 'Guatemala',
      countryFlag: '🇬🇹',
      isFavorite: false,
      state: 'validated_new',
      createdAt: new Date(),
      validatedAt: new Date(),
      coolingOffEndsAt: new Date(Date.now() + 3600000),
    };

    const result = canSendToRecipient(recipient);
    expect(result).not.toBeNull();
    expect(result?.code).toBe('RECIPIENT_COOLING_OFF');
  });
});
