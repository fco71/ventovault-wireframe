import { useMemo } from 'react';
import { useOperationalInspector } from '../../contexts/OperationalInspectorContext';
import CompactBubble from './CompactBubble';

/**
 * Bubble Manager
 *
 * Shows contextual help bubble based on actual app state (not DOM detection).
 * Content comes from technical spec and shows what's happening at each stage.
 */

interface BubbleData {
  title: string;
  subtitle: string;
  behindScenes?: string[];
  whatCanGoWrong?: string[];
  howWePrevent?: string[];
  manualRefs?: { chapter: string; topic: string }[];
  type?: 'default' | 'critical';
}

export default function BubbleManager() {
  const { isOpen, currentStage } = useOperationalInspector();

  // Get bubble content based on current stage
  const bubbleData = useMemo((): BubbleData | null => {
    if (!currentStage) return null;

    switch (currentStage) {
      case 'recipient':
        return {
          title: 'State: CREATED',
          subtitle: "Select recipient. Transaction object will be created with immutable references.",
          behindScenes: [
            'Transaction ID format: TXN-YYYYMMDD-XXXXXXXX',
            'User references (senderId, recipientId) become IMMUTABLE',
            'Corridor determined by recipient country',
            'Mode and corridor IMMUTABLE after QUOTED state',
            'Payout method validated against licensed partners',
          ],
          whatCanGoWrong: [
            'Wrong recipient selected (cannot change after QUOTED)',
            'Payout method incompatible with corridor',
            'Corridor suspended or degraded',
          ],
          howWePrevent: [
            'Clear country indicators on recipient cards',
            'Corridor status checked before quote generation',
            'Recipient verification enforced',
          ],
          manualRefs: [
            { chapter: 'Section 2.1', topic: 'Transaction Object Schema' },
            { chapter: 'Section 2.3', topic: 'Corridor Object' },
          ],
        };

      case 'amount':
        return {
          title: 'State: QUOTED',
          subtitle: 'Enter amount. Quote valid for exactly 45 seconds. SEND_EXACT (fees on top) or RECEIVE_EXACT (2% buffer).',
          behindScenes: [
            'Quote expiry: EXACTLY 45 seconds from creation',
            'Rate source: Bloomberg → Reuters → Partner (failover)',
            'Spread applied: Mid-market rate minus basis points',
            'Fee calc: VV fee (% with min/max) + network costs',
            'HMAC-SHA256 signature prevents tampering',
            'Quote cached in Redis (60-second TTL)',
          ],
          whatCanGoWrong: [
            'Quote expires (strict 45-second window)',
            'All rate sources fail',
            'Signature validation fails',
          ],
          howWePrevent: [
            'Visible countdown timer',
            'Multi-source failover for rates',
            'Refresh quote button',
            'Cryptographic signature validation',
          ],
          manualRefs: [
            { chapter: 'Section 3', topic: 'Quoting System Algorithm' },
            { chapter: 'Section 3.2', topic: 'Exchange Rate Fetching' },
            { chapter: 'Section 3.6', topic: 'Quote Signature' },
          ],
        };

      case 'review':
        return {
          title: 'Transition: QUOTED → FUNDING_PENDING',
          subtitle: 'Accept quote. Validation: not expired, signature valid, not already accepted.',
          behindScenes: [
            'Validation: 3 checks must pass',
            'Sets quote.acceptedAt timestamp',
            'State transitions to FUNDING_PENDING',
            'Partner funding initiated',
            'StateTransition record created',
            'User notification: "TRANSFER_INITIATED"',
          ],
          whatCanGoWrong: [
            'Quote expired (>45 seconds)',
            'Signature invalid (tampering)',
            'Quote already accepted (double-submit)',
          ],
          howWePrevent: [
            'validateQuote() runs 3 checks',
            'HMAC verification',
            'Database constraint prevents double-acceptance',
            'Timer warns of impending expiry',
          ],
          manualRefs: [
            { chapter: 'Section 3.7', topic: 'Quote Validation' },
            { chapter: 'Section 4.2', topic: 'Valid State Transitions' },
            { chapter: 'Section 4.3', topic: 'State Transition Function' },
          ],
          type: 'critical',
        };

      case 'success':
        return {
          title: 'States: FUNDING_PENDING → COMPLETED',
          subtitle: 'Transaction submitted. Processing through: Fund → Comply → Convert → Settle → Payout → Receipt.',
          behindScenes: [
            'FUNDED: Funds collected from user',
            'APPROVED: Double-validation (Layer 1 + Layer 2)',
            'CONVERSION: USD → USDC',
            'SETTLEMENT: USDC cross-border transfer',
            'PAYOUT: USDC → destination currency',
            'COMPLETED: Receipt generated',
          ],
          whatCanGoWrong: [
            'Funding fails (NSF, card declined)',
            'Compliance flags transaction',
            'Conversion/settlement fails',
            'Payout partner unavailable',
          ],
          howWePrevent: [
            'Funding method pre-validation',
            'Layer 1 sanctions screening',
            'Retry logic with fallback partners',
            'State timeout monitoring',
          ],
          manualRefs: [
            { chapter: 'Section 4.1', topic: 'State Enumeration' },
            { chapter: 'Section 4.4', topic: 'State Preconditions' },
            { chapter: 'Section 4.6', topic: 'State Timeout Handling' },
          ],
        };

      default:
        return null;
    }
  }, [currentStage]);

  if (!isOpen || !bubbleData) {
    return null;
  }

  return (
    <CompactBubble
      title={bubbleData.title}
      subtitle={bubbleData.subtitle}
      behindScenes={bubbleData.behindScenes}
      whatCanGoWrong={bubbleData.whatCanGoWrong}
      howWePrevent={bubbleData.howWePrevent}
      manualRefs={bubbleData.manualRefs}
      type={bubbleData.type}
    />
  );
}
