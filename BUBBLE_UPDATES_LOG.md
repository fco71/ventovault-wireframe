# Bubble System Updates - Feb 2026

## What I Did

### 1. Thoroughly Reviewed the Operational Manual
- Read Chapter 9.1 (The Quoting Contract) and 9.2 (Quote Ceiling Guarantee)
- Read Chapter 4.3 (The 8-stage lifecycle)
- Studied the exact quote mechanics and liability transfer

### 2. Fixed Critical Content Errors in BubbleManager.tsx

**Stage 1: Intent Creation** (Recipient Selection)
- Changed title from "Recipient Selection" to "Intent Creation" (matches manual)
- Added detail about TransferIntent creation
- Clarified "Phase 1: Information collection only, no funds custody"
- Updated manual references to be more specific

**Stage 2: Amount & Quote** (THE BIG FIX)
- **CRITICAL FIX**: Removed misleading "rate lock" language
- **Correctly explained**: Quote is a CEILING, not a rate lock
- **Added**: Auto-Cancel Rule - transaction cancelled if ceiling would be violated
- **Added**: 5-10% buffer built into quote
- **Added**: "Pleasant surprise model" - final cost often lower than quote
- Updated subtitle to clearly state: "Quote is a CEILING: if rate would exceed it, transaction auto-cancels"
- Added Chapter 9.3 reference

**Stage 3: The Consent Bridge**
- Enhanced technical details about the 30-second delay
- Added "Money transmitter classification" risk
- Clarified "Documentation shifts to forensic proof of partner execution"
- Added more explicit consent scope details
- Updated manual references to include all three key chapters

### 3. Fixed Positioning Issues in CompactBubble.tsx
- Changed `bottom-20` to `bottom-24` (96px from bottom instead of 80px)
- Changed `z-40` from `z-50` to ensure toggle button is always clickable
- Added explicit `pointer-events-auto` to ensure bubble itself is clickable
- This prevents any potential conflict with OperationalInspectorToggle at `bottom-6`

## Key Learnings from the Manual

### Quote Mechanics (Chapter 9.1, 9.2)
1. **Quote is a time-bounded contract** (30-90 seconds validity)
2. **Quote includes buffer** (5-10% above expected costs)
3. **Quote is a CEILING, not a floor**
4. **Auto-Cancel Rule**: If market conditions would violate the ceiling, transaction is CANCELLED (not executed at higher rate)
5. This creates "pleasant surprise" - final cost often lower than quote
6. No silent repricing - executed receipt shows truth vs quote

### The 8 Stages (Chapter 4.3)
1. Intent Creation (recipient + corridor)
2. Quoting & Counterparty Disclosure
3. The Multi-Signatory Approval Gate (Consent Bridge)
4. Funding (regulated entry)
5. Compliance Gating (Double-Validation)
6. Conversion + Settlement
7. Payout (regulated exit)
8. Reconciliation & Idempotency

### The Consent Bridge (Chapter 8.1, 14.2)
- This is THE legal firewall
- VentoVault role ends here (limited to instruction delivery)
- Partner assumes sole responsibility
- 30-second delay proves independence (no unilateral control)
- Prevents money transmitter classification

## Outstanding Issue: "Stuck at Recipient Selection"

### What I've Checked
1. ✅ No pointer-events blocking overlays (InteractiveHighlighter removed)
2. ✅ StageProgressTracker positioned at top (z-40) - shouldn't block center content
3. ✅ CompactBubble positioned bottom-right (z-40) - shouldn't block center content
4. ✅ OperationalInspectorToggle positioned bottom-right (z-50) - shouldn't block center content
5. ✅ No console blocking layers in OperationalInspectorContext
6. ✅ Build compiles successfully (only dist cleanup permission error)

### What Might Be Wrong
Based on Send.tsx code analysis, the flow is:
1. User clicks recipient card → `setRecipientId` (card gets selected/highlighted)
2. User clicks "Send" button within card → `goToAmountStep` → advances to next step

The "Send" button appears when:
- Card is selected (opacity-100), OR
- User hovers over card (group-hover)

**Possible issues:**
1. The "Send" button might not be appearing as expected?
2. There might be a validation error preventing progression?
3. The UI might not make it clear that the button needs to be clicked?
4. Could be a timing issue with the 200ms setTimeout in BubbleManager?

### Next Steps for Debugging
1. Test clicking on recipient cards in the browser with demo mode ON
2. Check browser console for JavaScript errors
3. Verify the "Send" button appears and is clickable
4. Check if there's a validation message preventing progression
5. Test with a single recipient vs multiple recipients

## Files Changed
- `src/components/demo/BubbleManager.tsx` - Content fixes for all 3 stages
- `src/components/demo/CompactBubble.tsx` - Positioning adjustments
