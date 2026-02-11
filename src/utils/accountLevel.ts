import { VerificationTier } from '../types';

interface AccountLevelCopy {
  code: VerificationTier;
  shortName: string;
  customerLabel: string;
  summary: string;
}

const accountLevels: Record<VerificationTier, AccountLevelCopy> = {
  L10: {
    code: 'L10',
    shortName: 'Starter',
    customerLabel: 'Starter account',
    summary: 'Verify your identity to start sending.',
  },
  L20: {
    code: 'L20',
    shortName: 'Basic',
    customerLabel: 'Basic account',
    summary: 'Send money with standard limits.',
  },
  L30: {
    code: 'L30',
    shortName: 'Verified',
    customerLabel: 'Verified account',
    summary: 'Higher limits and more payment options.',
  },
  L40: {
    code: 'L40',
    shortName: 'Business',
    customerLabel: 'Business account',
    summary: 'Higher limits for business needs.',
  },
};

export function getAccountLevel(tier: VerificationTier): AccountLevelCopy {
  return accountLevels[tier];
}

export function formatAccountLevel(tier: VerificationTier): string {
  const level = getAccountLevel(tier);
  return level.customerLabel;
}

