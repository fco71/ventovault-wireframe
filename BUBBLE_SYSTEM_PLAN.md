# Interactive Bubble System - Implementation Plan

## Reference Structure (from ventovault-map)

Each node has:
```typescript
{
  id: "stage-1-intent",
  title: "Stage 1 — Intent creation",
  plainBody: [
    "Simple explanation",
    "What user sees"
  ],
  behindScenes: [
    "Technical details",
    "How it works"
  ],
  whatCanGoWrong: ["Risk 1", "Risk 2"],
  howWePrevent: ["Control 1", "Control 2"],
  manualRefs: [{ chapter: "Ch 4.3", topic: "Intent" }]
}
```

## Bubble Behavior

1. **Main bubble**: Shows plainBody content (simple, practical)
2. **Expandable sections**: Click (+) to see:
   - Behind the Scenes (technical)
   - What Can Go Wrong (risks)
   - How We Prevent (controls)
   - Manual References (links)
3. **Positioning**: Near active element (recipient card, input, etc.)
4. **Multiple bubbles**: Some actions trigger multiple related bubbles

## Content for Each Step (from manual)

### Step 1: Recipient Selection
**plainBody:**
- "You're selecting who receives the money and how they'll get it"
- "VentoVault collects recipient details and performs KYC verification"

**behindScenes:**
- "Recipient data stored by VentoVault for orchestration"
- "KYC performed by VentoVault to verify identity"
- "Payout method must be compatible with licensed partner capabilities"
- "No funds custody - just information collection"

**whatCanGoWrong:**
- "Wrong recipient details entered"
- "Payout method incompatible with destination"
- "Fraud attempt (mule account, stolen identity)"

**howWePrevent:**
- "Recipient verification rules"
- "Risk scoring and transaction limits"
- "Payout endpoint compatibility checks"

**manualRefs:**
- Chapter 4.3: Intent Creation
- Chapter 5.2: Phase 1 Responsibility Split

### Step 2: Amount Entry & Quote
**plainBody:**
- "Enter the amount you want to send or the exact amount recipient should receive"
- "You'll get a real-time quote that's locked for 30-90 seconds"

**behindScenes:**
- "Route selection: Compliance feasibility → Reliability → Cost"
- "Quote is a time-bounded contract showing all fees"
- "Partner chain disclosed: Collection Partner + Settlement + Payout Partner"
- "Stablecoin cost structure: 1.7% + $1.50 gas (vs 2.4% traditional)"

**whatCanGoWrong:**
- "Quote expires before user accepts"
- "User disputes price changes after delay"
- "Corridor temporarily inhibited"

**howWePrevent:**
- "Visible timer shows quote validity window"
- "Quote contract captures timestamp"
- "Clear fee itemization and partner disclosure"

**manualRefs:**
- Chapter 9.1: The Quoting Contract
- Chapter 9.2: Quote Ceiling Guarantee
- Chapter 20.5: Quote timer visibility

### Step 3: The Consent Bridge (CRITICAL)
**plainBody:**
- "You're authorizing the specific partner chain to execute this transfer"
- "This is THE CONSENT BRIDGE - the legal moment that changes everything"

**behindScenes:**
- "Technical Agency Posture: VentoVault's role limited to instruction delivery"
- "Liability Transfer: Partner assumes sole responsibility for settlement"
- "30-second minimum delay proves independence (external time gate)"
- "What gets logged: UTC timestamp, IP, consent version, device fingerprint"
- "Transmitted to ALL partners via ISO 20022 messaging"

**whatCanGoWrong:**
- "Ambiguous liability if consent isn't explicit"
- "Regulatory risk if VentoVault has unilateral control"

**howWePrevent:**
- "Mandatory Consent Bridge step (FinCEN FIN-2019-G001)"
- "30-second external delay gate"
- "Explicit user authorization captured with proof"
- "Partner chain disclosure required"

**manualRefs:**
- Chapter 8.1: Technical Agency Posture
- Chapter 14.2: Absence of Independent Control Defense
- Chapter 5.2: Phase 1 Responsibility Split

### Step 4: Funding
**plainBody:**
- "Licensed Collection Partner charges your funding method locally"
- "VentoVault never takes custody of your funds"

**behindScenes:**
- "Regulated entry: Identity linkage becomes enforceable"
- "Funding confirmation references captured"
- "Chargeback risk accounted for by policy"

**whatCanGoWrong:**
- "Payment fails or times out"
- "Chargeback risk (credit card)"
- "Identity mismatch"

**howWePrevent:**
- "Funding method policies"
- "Step-up verification for high-risk instruments"
- "Clear status states and retry logic"

**manualRefs:**
- Chapter 4.3: Stage 4 - Funding
- Chapter 17.1: Managing Funding Latency

### Step 5: Double Validation
**plainBody:**
- "Two compliance checks happen in sequence"
- "VentoVault screens first, then partner validates independently"

**behindScenes:**
- "Layer 1: VentoVault sanctions check (fuzzy/phonetic matching)"
- "Layer 2: Partner validation under their regulatory program"
- "Pre-screening protects partner licenses"

**whatCanGoWrong:**
- "Watchlist match triggers block"
- "Suspicious pattern requires review"

**howWePrevent:**
- "Two-tier screening with real-time API for high-risk"
- "Review workflow with clear user messaging"

**manualRefs:**
- Chapter 4.3: Stage 5 - Compliance Gating
- Chapter 11.3: Sanctions & KYC Requirements

### Step 6: Conversion & Settlement
**plainBody:**
- "Value converted to settlement instrument and routed across border"
- "This efficiency stays invisible - you're buying remittance, not learning crypto"

**behindScenes:**
- "USD → USDC → blockchain → destination fiat"
- "Settlement leg auditable and tied to accepted quote"
- "Fallback routing handles partner outages"

**whatCanGoWrong:**
- "Liquidity failure"
- "Partner outage"
- "Timing drift against quote window"

**howWePrevent:**
- "Fallback routes and retry policies"
- "Auto-cancel if promise can't be kept"

**manualRefs:**
- Chapter 4.3: Stage 6 - Settlement
- PITCH_5: Phase 2 & 3

### Step 7: Payout
**plainBody:**
- "Licensed Payout Partner delivers funds to recipient's bank account"
- "This is the 'moment of truth' - payout must land correctly"

**behindScenes:**
- "Regulated exit through licensed partner"
- "Payout confirmations captured as first-class events"

**whatCanGoWrong:**
- "Payout failures kill user trust"
- "Recipient bank rejects transfer"

**howWePrevent:**
- "Partner SLAs and retries"
- "Clear failure states with actionable guidance"

**manualRefs:**
- Chapter 4.3: Stage 7 - Payout

### Step 8: Receipt & Reconciliation
**plainBody:**
- "You receive an immutable receipt showing executed truth"
- "Not promised outcomes - actual executed rate and fees"

**behindScenes:**
- "128-bit UUID ensures idempotency"
- "Partner confirmation IDs captured"
- "ISO 20022 mapping ensures STP"
- "FATF Travel Rule compliance"

**whatCanGoWrong:**
- "Mismatched receipts trigger disputes"

**howWePrevent:**
- "Deterministic event logs"
- "Verifiable History layer with immutable records"

**manualRefs:**
- Chapter 9.5: Receipts and Reconstruction
- Chapter 4.3: Stage 8 - Reconciliation

## Implementation Steps

### Phase 1: Single Bubble (Recipient Selection)
1. Create bubble component with expand/collapse
2. Position near recipient card
3. Show plainBody by default
4. Expand to show behindScenes/whatCanGoWrong/howWePrevent
5. Test and refine

### Phase 2: Add More Bubbles
1. Amount entry bubble
2. Consent Bridge bubble (special red styling)
3. Complete flow through all 8 stages

### Phase 3: Polish
1. Smooth animations
2. Clean typography
3. Professional styling
4. Test full flow
