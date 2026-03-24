import { TierLimits, VerificationTier } from '../types';

export interface Corridor {
  code: string;
  name: string;
  flag: string;
  destinationCurrency: string;
  rate: number;
}

// Fallback rates used only if the live rate fetch fails at runtime.
// These are overridden by liveRateService.ts in normal operation.
// Reference: Q1 2025 mid-market approximations.
export const corridors: Corridor[] = [
  {
    code: 'DR',
    name: 'Dominican Republic',
    flag: 'DO',
    destinationCurrency: 'DOP',
    rate: 60.15,   // USD/DOP — Q1 2025 reference
  },
  {
    code: 'MX',
    name: 'Mexico',
    flag: 'MX',
    destinationCurrency: 'MXN',
    rate: 20.10,   // USD/MXN — Q1 2025 reference
  },
  {
    code: 'GT',
    name: 'Guatemala',
    flag: 'GT',
    destinationCurrency: 'GTQ',
    rate: 7.76,    // USD/GTQ — Q1 2025 reference
  },
  {
    code: 'HN',
    name: 'Honduras',
    flag: 'HN',
    destinationCurrency: 'HNL',
    rate: 25.30,   // USD/HNL — Q1 2025 reference
  },
];

export const tierLimits: Record<VerificationTier, TierLimits> = {
  L10: {
    perTransaction: 0,
    daily: 0,
    monthly: 0,
    allowReceiveExact: false,
    allowDebitCard: false,
    recipientLimit: 0,
    coolingOffHours: 9999,
  },
  L20: {
    perTransaction: 500,
    daily: 500,
    monthly: 1500,
    allowReceiveExact: false,
    allowDebitCard: false,
    recipientLimit: 3,
    coolingOffHours: 24,
  },
  L30: {
    perTransaction: 5000,
    daily: 10000,
    monthly: 50000,
    allowReceiveExact: true,
    allowDebitCard: true,
    recipientLimit: 999,
    coolingOffHours: 6,
  },
  L40: {
    perTransaction: 25000,
    daily: 100000,
    monthly: 500000,
    allowReceiveExact: true,
    allowDebitCard: true,
    recipientLimit: 9999,
    coolingOffHours: 0,
  },
};

export const minTransferAmountUsd = 10;

export function getTierLimits(tier: VerificationTier): TierLimits {
  return tierLimits[tier];
}

export function getCorridorByCountry(country: string): Corridor {
  const match = corridors.find((item) => item.name.toLowerCase() === country.toLowerCase());
  if (match) {
    return match;
  }
  return corridors[0];
}
