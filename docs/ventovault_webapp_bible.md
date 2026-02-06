# VentoVault Web App Product Bible
## Complete Functionality, Flow & Transaction Stage Reference

**Version**: 1.0  
**Date**: 2026-02-06  
**Purpose**: Comprehensive specification for web app development, mockups, and animated demos

---

## TABLE OF CONTENTS

1. [User States & Account Tiers](#user-states--account-tiers)
2. [Transaction Flow Overview](#transaction-flow-overview)
3. [Sending Money - Complete Flow](#sending-money---complete-flow)
4. [Receiving Money - Complete Flow](#receiving-money---complete-flow)
5. [The 13-State Transaction Machine](#the-13-state-transaction-machine)
6. [Under the Hood - 8 Stage Process](#under-the-hood---8-stage-process)
7. [UI Components & Interactions](#ui-components--interactions)
8. [Error States & Exception Handling](#error-states--exception-handling)
9. [Notifications & Status Updates](#notifications--status-updates)
10. [Receipts & Documentation](#receipts--documentation)
11. [Animation Sequences for Demo](#animation-sequences-for-demo)

---

## 1. USER STATES & ACCOUNT TIERS

### 1.1 Account Verification Levels

#### **L10 - Entry Tier (Unverified)**
**Status**: Email/phone verified only  
**Capabilities**:
- View app features
- Add recipient information (not yet usable)
- Browse rates
- Cannot send money

**Limits**:
- $0 transaction limit
- Must upgrade to L20 to transact

**Visual Indicators**:
- Badge: "Verify Account to Start Sending"
- Red/orange banner at top of dashboard
- Grayed-out "Send Money" button

---

#### **L20 - Basic Tier (Light KYC)**
**Status**: Name, DOB, address collected  
**Capabilities**:
- Send money with restrictions
- Add up to 3 recipients
- ACH funding only

**Limits**:
- **Per Transaction**: $500 max
- **Daily**: $500 max
- **Monthly**: $1,500 max
- **Cooling-Off Period**: 24 hours for new recipients

**Visual Indicators**:
- Badge: "Basic Account"
- Blue progress bar showing tier status
- Limit counter: "You can send $X more this month"

---

#### **L30 - Verified Tier (Full KYC)**
**Status**: ID document verified, liveness check passed  
**Capabilities**:
- Send money with higher limits
- Add unlimited recipients
- ACH + Debit card funding
- Access to Receive-Exact mode

**Limits**:
- **Per Transaction**: $5,000 max
- **Daily**: $10,000 max
- **Monthly**: $50,000 max
- **Cooling-Off Period**: 6 hours for new recipients

**Visual Indicators**:
- Badge: "Verified Account" with checkmark
- Green progress bar
- Access to "Instant Funding" option

---

#### **L40 - Business Tier (Enhanced Due Diligence)**
**Status**: Business documentation verified  
**Capabilities**:
- High-volume sending
- Multi-user access (coming soon)
- API access (Phase 2)
- Batch transfers (Phase 2)

**Limits**:
- **Per Transaction**: $25,000 max
- **Daily**: $100,000 max
- **Monthly**: Custom (negotiated)
- **Cooling-Off Period**: None for verified business contacts

**Visual Indicators**:
- Badge: "Business Account"
- Gold/premium UI theme option
- Advanced analytics dashboard

---

### 1.2 Recipient States

#### **R1 - Pending Validation**
- Recipient added but not yet validated
- Test deposit initiated
- Cannot send money yet
- Shows "Validating..." status

#### **R2 - Validated (New)**
- Test deposit confirmed
- First 24 hours after validation
- Subject to cooling-off period (tier-dependent)
- Shows "New Recipient - Verify Details" warning

#### **R3 - Active (Trusted)**
- At least one successful transfer completed
- More than 24 hours since first validation
- No additional restrictions
- Shows "Trusted Recipient" badge

#### **R4 - Flagged**
- Compliance or fraud concern
- Temporarily blocked
- User must contact support
- Shows "Unable to Send - Contact Support"

---

## 2. TRANSACTION FLOW OVERVIEW

### 2.1 High-Level User Journey - Sending Money

```
┌─────────────────────────────────────────────────────────────────┐
│                        SENDING FLOW                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. INITIATE                                                     │
│     ├─ Select "Send Money"                                       │
│     ├─ Choose/Add Recipient                                      │
│     └─ Select Corridor (auto-detected from recipient)            │
│                                                                  │
│  2. CONFIGURE                                                    │
│     ├─ Choose Mode: Send-Exact OR Receive-Exact                  │
│     ├─ Enter Amount                                              │
│     └─ System Generates Quote                                    │
│                                                                  │
│  3. REVIEW                                                       │
│     ├─ View Full Cost Breakdown                                  │
│     ├─ See Mid-Market Rate Comparison                            │
│     ├─ Review Partner Disclosure                                 │
│     └─ See Quote Expiry Timer (45 seconds)                       │
│                                                                  │
│  4. AUTHORIZE                                                    │
│     ├─ Accept Quote                                              │
│     ├─ Trigger Consent Bridge                                    │
│     └─ Choose Funding Method                                     │
│                                                                  │
│  5. FUND                                                         │
│     ├─ ACH: Link bank, authorize pull                            │
│     └─ Debit: Enter card, authorize charge                       │
│                                                                  │
│  6. MONITOR                                                      │
│     ├─ Track Status (real-time updates)                          │
│     ├─ View Under-the-Hood Stages (optional animation)           │
│     └─ Receive Push Notifications                                │
│                                                                  │
│  7. COMPLETE                                                     │
│     ├─ Receive Completion Notification                           │
│     ├─ View Final Receipt                                        │
│     └─ Download/Share Proof                                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 High-Level User Journey - Receiving Money

```
┌─────────────────────────────────────────────────────────────────┐
│                       RECEIVING FLOW                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. SETUP (One-Time)                                             │
│     ├─ Create Account                                            │
│     ├─ Verify Identity (at minimum L20)                          │
│     └─ Add Payout Bank Account                                   │
│         ├─ Enter bank details                                    │
│         ├─ Validate via test deposit (1 peso)                    │
│         └─ Confirm test amount                                   │
│                                                                  │
│  2. SHARE                                                        │
│     ├─ Generate "Request Money" Link (optional)                  │
│     └─ Share Account Details with Sender                         │
│                                                                  │
│  3. INCOMING NOTIFICATION                                        │
│     ├─ Push: "[Sender] is sending you money"                     │
│     ├─ Email: Transaction initiated notice                       │
│     └─ SMS (optional): Incoming transfer alert                   │
│                                                                  │
│  4. MONITOR                                                      │
│     ├─ View Status: "Payment En Route"                           │
│     ├─ See Estimated Arrival Time                                │
│     └─ Optional: View Sender's Receipt                           │
│                                                                  │
│  5. RECEIVE                                                      │
│     ├─ Bank Deposit Notification                                 │
│     ├─ VentoVault Confirmation                                   │
│     └─ Receipt Available                                         │
│                                                                  │
│  6. RECONCILE (Optional)                                         │
│     ├─ Compare Receipt to Bank Statement                         │
│     └─ Download/Export for Records                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. SENDING MONEY - COMPLETE FLOW

### 3.1 Screen-by-Screen Breakdown

#### **Screen S1: Dashboard**

**Elements**:
- Header: "VentoVault" logo, user avatar, notifications bell
- Hero Section: Current balance display (Phase 2 feature - greyed out in Phase 1)
- Two Primary CTAs:
  - **"Send Money"** (Large, primary blue button)
  - **"Receive Money"** (Secondary, outline button)
- Quick Stats: "3 Recent Transfers", "1 Pending"
- Recent Activity List (last 5 transactions)

**Interactions**:
- Click "Send Money" → Navigate to S2
- Click "Receive Money" → Navigate to R1 (Receive Flow)
- Click Recent Transaction → Open transaction detail modal

**State Dependencies**:
- If L10: "Send Money" is disabled with tooltip "Complete verification to send"
- If L20+: "Send Money" is enabled

---

#### **Screen S2: Select/Add Recipient**

**Elements**:
- Header: "Who are you sending to?"
- Search Bar: "Search by name or add new recipient"
- Recipient List (existing):
  - Avatar/Initials
  - Name
  - Country flag
  - Bank account (last 4 digits)
  - Badge: "Trusted" or "New" or "Validating..."
- Button: "+ Add New Recipient"

**Interactions**:
- Select Existing Recipient → Navigate to S3
- Click "+ Add New Recipient" → Navigate to S2A (Add Recipient Modal)
- Search filters recipient list in real-time

**State Dependencies**:
- L20: Max 3 recipients shown, "+ Add" disabled if at limit
- L30+: Unlimited recipients

---

#### **Screen S2A: Add New Recipient (Modal)**

**Elements**:
- Form Fields:
  - First Name (required)
  - Last Name (required)
  - Country (dropdown with flags, required)
  - Payout Method:
    - Bank Account (default)
    - Mobile Money (certain corridors only)
    - Cash Pickup (Phase 2)
  - Bank Account Details:
    - Bank Name (dropdown, populated based on country)
    - Account Number
    - Account Type (Checking/Savings)
    - Additional fields (varies by country - e.g., CLABE for Mexico, IBAN for Europe)
  - Relationship to Sender (dropdown for compliance):
    - Family
    - Friend
    - Employee/Contractor
    - Business Partner
    - Other

**Validation**:
- Real-time field validation
- Bank account number format check
- Duplicate recipient check

**Interactions**:
- "Add Recipient" → Triggers test deposit process
- Shows modal: "We're validating [Recipient Name]'s account. This may take 1-2 hours. We'll send you a notification when ready."
- Navigate back to S2 with recipient shown as "Validating..."

**State Dependencies**:
- L20: Limited to 3 total recipients
- L30+: No limit

---

#### **Screen S3: Choose Transfer Mode & Enter Amount**

**Elements**:
- Header: "Send to [Recipient Name]" with country flag
- **Mode Toggle** (prominent):
  - **Tab 1: "Send Exactly"** (default selected)
    - Input Field: "You send" (USD or source currency)
    - Display: "They receive ≈ [calculated amount] [destination currency]"
    - Tooltip: "You control what you pay. They receive whatever remains after fees."
  
  - **Tab 2: "They Receive Exactly"** (L30+ only)
    - Input Field: "They receive" (destination currency)
    - Display: "You send ≈ [calculated amount] [source currency]"
    - Tooltip: "Guarantee exact amount received. Small buffer may be charged and refunded if unused."
    - Lock Icon: "Verified accounts only"

- Amount Input:
  - Large numeric input field
  - Currency symbol prefix
  - Quick amount buttons: $50, $100, $250, $500, $1,000
  - Balance/Limit indicator: "Remaining monthly limit: $X,XXX"

- Live Quote Preview (updates as amount changes):
  - "Calculating..." spinner (appears for 0.5s after amount change)
  - Preview card:
    - Exchange Rate: "58.50 DOP/USD"
    - Mid-Market Comparison: "(Mid-market: 58.60)"
    - Estimated Fee: "~$2.50"
    - Total Cost: "~$102.50" (bold)

**Interactions**:
- Switch Mode → Recalculates amounts
- Type Amount → Live quote preview updates
- Click Quick Amount → Populates field
- "Continue" Button → Navigate to S4 (only enabled when amount is valid)

**Validation**:
- Real-time checks:
  - Amount > corridor minimum (e.g., $10)
  - Amount < per-transaction limit (tier-based)
  - Amount < daily limit remaining
  - Amount < monthly limit remaining
- Error messages appear below input:
  - "Minimum transfer: $10"
  - "Maximum per transaction: $500 (Basic tier)"
  - "You've reached your daily limit. Try again tomorrow."

**State Dependencies**:
- L20: Send-Exact only, max $500
- L30+: Both modes available, max $5,000
- L40: Both modes, max $25,000

---

#### **Screen S4: Review Quote & Breakdown**

**Elements**:
- Header: "Review Your Transfer"
- **Recipient Summary**:
  - Name, country flag, bank account
  - "Edit" button → back to S2

- **Amount Summary** (large, prominent):
  - "You Send: $100.00"
  - "They Receive: 5,798 DOP"

- **Full Cost Breakdown** (expandable, default expanded):
  - **The Stockbroker View**:
    ```
    ┌─────────────────────────────────────────┐
    │ Exchange Rate                            │
    │ 58.50 DOP/USD                           │
    │ (Mid-market: 58.60 - 0.17% difference)  │
    ├─────────────────────────────────────────┤
    │ VentoVault Fee          $2.50           │
    │ Network Costs           $0.75           │
    │ ─────────────────────────────────────── │
    │ Total Cost              $3.25           │
    ├─────────────────────────────────────────┤
    │ You Pay                 $103.25         │
    │ They Receive            5,798 DOP       │
    └─────────────────────────────────────────┘
    ```

- **Quote Expiry Timer** (prominent):
  - Circular countdown: "0:42 remaining"
  - Warning at 10s: Timer turns red
  - On expiry: "Quote expired. Click to refresh."

- **Estimated Arrival**:
  - Icon timeline showing:
    - "Funding: 1-2 business days (ACH)"
    - "Processing: ~4 hours"
    - "Total: ~28 hours"

- **Partner Disclosure** (expandable, default collapsed):
  - "Who's handling your money?"
  - Collection: Stripe (New York, USA)
  - Settlement: VentoVault Partner Network
  - Payout: Banco Popular (Dominican Republic)
  - Links to partner info

- **Legal Disclosure** (small text):
  - "By continuing, you authorize VentoVault to coordinate this transfer according to our Terms of Service."
  - Checkbox (required): "I understand that regulated partners will handle my funds and VentoVault coordinates the process."

**Interactions**:
- "Edit" (Recipient) → Back to S2
- "Edit" (Amount) → Back to S3
- "Refresh Quote" (on expiry) → Regenerates quote, resets timer
- Expand "Full Cost Breakdown" → Shows detailed line items
- Expand "Partner Disclosure" → Shows partner details
- **"Accept & Continue"** (primary CTA) → Navigate to S5 (Consent Bridge)

**Validation**:
- Checkbox must be checked
- Quote must not be expired
- If quote expires during review: Modal appears "Quote expired. Would you like a new quote?"

---

#### **Screen S5: Consent Bridge (Critical Legal Moment)**

**Elements**:
- Header: "Authorize Transfer Partners"
- Explainer Box:
  - "This is your Consent Bridge - the formal moment where you authorize our regulated partners to handle your funds."
  
- **Three-Part Authorization Visual**:
  ```
  ┌──────────────────────────────────────────────┐
  │  1. ✓ You Authorized                         │
  │     You confirmed the transfer details       │
  │                                              │
  │  2. ⏳ Partner Validating...                 │
  │     Stripe is checking compliance            │
  │                                              │
  │  3. ⏸  Awaiting Final Approval               │
  │     30-second safety delay                   │
  └──────────────────────────────────────────────┘
  ```

- **Consent Statement** (must read & scroll to bottom):
  - Scrollable box with key statements:
    - "You acknowledge that VentoVault is coordinating instructions, not holding funds"
    - "Stripe will collect your $100.00"
    - "Banco Popular will deliver 5,798 DOP to [Recipient]"
    - "VentoVault's responsibility is accurate instructions; partners are responsible for funds"
    - "You can cancel before funding completes"

- Checkbox (bottom, appears only after scroll):
  - "I have read and agree to transfer my funds to Stripe for collection and authorize the disclosed partner chain"

**Interactions**:
- User must scroll to bottom of Consent Statement
- Checkbox appears after scroll
- Once checked: "Confirm Authorization" button activates
- Click "Confirm Authorization" → API call to generate partner token
- Loading state: "Requesting partner authorization..."
- On success:
  - Partner Validating (step 2) changes to "✓ Partner Approved"
  - 30-second countdown begins (step 3)
  - Proceed automatically to S6 after 30 seconds

**Animation During 30-Second Delay**:
- Progress bar fills over 30 seconds
- Text: "Security delay: Ensures VentoVault cannot execute unilaterally"
- Countdown: "Proceeding in 0:28..."

**Edge Cases**:
- If partner rejects (rare): 
  - Modal: "Partner compliance check did not clear. Transaction cancelled. Full refund initiated."
  - Return to dashboard
- User can "Cancel" during the 30-second delay
  - Shows confirmation modal: "Are you sure? Your authorization will be revoked."

---

#### **Screen S6: Choose Funding Method**

**Elements**:
- Header: "How would you like to pay?"
- **Funding Options** (cards, radio select):

  **Option 1: Bank Account (ACH)** [Default, recommended]
  ```
  ┌────────────────────────────────────────┐
  │  🏦  Bank Account (ACH)                 │
  │                                        │
  │  Cost: Included                        │
  │  Speed: 1-2 business days              │
  │  Recommended for best price            │
  │                                        │
  │  [ Select ]                            │
  └────────────────────────────────────────┘
  ```

  **Option 2: Debit Card** [L30+ only]
  ```
  ┌────────────────────────────────────────┐
  │  💳  Debit Card                         │
  │                                        │
  │  Cost: +$1.50 fee                      │
  │  Speed: Instant                        │
  │  Total: $104.75 (instead of $103.25)   │
  │                                        │
  │  [ Select ]                            │
  └────────────────────────────────────────┘
  ```

- **Selected Method Details**:
  
  **If ACH Selected**:
  - "Link Your Bank Account"
  - Plaid integration button: "Connect with Plaid"
  - Alternative: Manual entry (account/routing number)
  - Displays linked account: "Chase Checking ****1234"
  - Authorization text: "I authorize VentoVault to debit $103.25 from this account"

  **If Debit Card Selected**:
  - Card entry form:
    - Card Number
    - Expiry Date
    - CVV
    - Billing ZIP
  - "Save card for future transfers" checkbox
  - Authorization text: "I authorize a charge of $104.75 to this card"

**Interactions**:
- Select ACH → Shows Plaid modal or manual entry
- Select Debit → Shows card entry form
- After linking/entering:
  - "Confirm & Send Money" button activates (primary CTA)
- Click "Confirm & Send Money" → 
  - Modal: "Processing..."
  - API call to initiate funding
  - On success → Navigate to S7 (Tracking)

**Validation**:
- ACH: Plaid must successfully link, or manual account must validate
- Debit: Card validation via Stripe, must pass
- Display errors: "Unable to verify bank account" or "Card declined"

**State Dependencies**:
- L20: ACH only
- L30+: ACH + Debit Card

---

#### **Screen S7: Transaction Tracking Dashboard**

**Elements**:
- Header: "Transfer to [Recipient Name]" with status badge
- **Status Banner** (changes based on state):
  - Example: "🔄 Funding in Progress - ACH clearing (1-2 days)"

- **Progress Timeline** (visual, shows current stage):
  ```
  ┌─────────────────────────────────────────────────────────┐
  │                                                          │
  │  ✓ ──── ✓ ──── ⏳ ──── ○ ──── ○ ──── ○ ──── ○          │
  │  Initiated  Funding  Converting  Settling  Payout  Done │
  │                                                          │
  └─────────────────────────────────────────────────────────┘
  ```

- **Current Status Details** (expands based on stage):
  - Shows current stage name
  - Estimated time remaining
  - "Last updated: 2 minutes ago"
  - Optional: "View detailed logs" → Shows under-the-hood animation

- **Transaction Summary** (collapsed by default):
  - Amount sent
  - Amount recipient will receive
  - Quote details
  - Partner chain

- **Actions**:
  - "Get Help" (opens support chat)
  - "View Receipt" (disabled until complete)
  - "Cancel Transfer" (enabled only during certain states)

**State-Based Display**:

| Transaction State | Status Badge | Progress Step | Actions Available |
|-------------------|--------------|---------------|-------------------|
| FUNDING_PENDING | 🔄 Funding... | Step 2 | Cancel |
| FUNDED | ✓ Funded | Step 2 Complete | - |
| UNDER_REVIEW | ⚠️ Compliance Review | Step 2.5 | Get Help |
| APPROVED | ✓ Approved | Step 2 Complete | - |
| CONVERSION | 🔄 Converting... | Step 3 | - |
| SETTLEMENT | 🔄 Settling... | Step 4 | - |
| PAYOUT | 🔄 Paying Out... | Step 5 | - |
| COMPLETED | ✅ Completed | All Done | View Receipt |
| FAILED | ❌ Failed | - | Get Help, View Details |
| REFUNDED | ↩️ Refunded | - | View Receipt |

**Interactions**:
- Click "View detailed logs" → Opens modal with 8-stage animation (see Section 11)
- Click "Cancel Transfer" → Confirmation modal → API call to cancel
- Status auto-updates via WebSocket or polling (every 15s)

**Notifications** (triggered by state changes):
- Push: "Your transfer to [Recipient] is now [status]"
- Email: Sent for major milestones (Funded, Completed, Failed)

---

#### **Screen S8: Transaction Complete**

**Elements**:
- **Success Celebration**:
  - Animated checkmark or confetti
  - Header: "Transfer Complete! 🎉"

- **Summary Card**:
  ```
  ┌────────────────────────────────────────────┐
  │  María received                            │
  │  5,798 DOP                                 │
  │                                            │
  │  Total time: 27 hours, 14 minutes          │
  │  Completed: Feb 6, 2026 at 3:42 PM EST     │
  └────────────────────────────────────────────┘
  ```

- **"View Full Receipt"** button → Opens S9

- **Quick Actions**:
  - "Send Again to María" (one-tap repeat)
  - "Send to Someone Else"
  - "Download Receipt"
  - "Share Confirmation"

**Interactions**:
- "View Full Receipt" → Navigate to S9
- "Send Again" → Pre-fills S3 with same recipient
- "Download Receipt" → PDF generation & download
- "Share" → Native share sheet (mobile) or copy link (desktop)

---

#### **Screen S9: Full Receipt View**

**Elements**:
- Header: "Transfer Receipt"
- Date: "February 6, 2026"
- Transaction ID: "TXN-20260206-A7F9B2E1"

- **Party Details**:
  ```
  From: John Doe
       Chase Checking ****1234
       New York, USA
  
  To:   María Rodríguez  
       Banco Popular ****4567
       Santo Domingo, Dominican Republic
  ```

- **Amount Summary**:
  ```
  ┌─────────────────────────────────────────┐
  │ You Sent                    $100.00     │
  │ VentoVault Fee              $2.50       │
  │ Network Costs               $0.75       │
  │ ──────────────────────────────────────  │
  │ Total Paid                  $103.25     │
  │                                         │
  │ Exchange Rate Used          58.50       │
  │ (Mid-market: 58.60)                    │
  │                                         │
  │ María Received              5,798 DOP   │
  └─────────────────────────────────────────┘
  ```

- **Quote vs Executed**:
  - "Quote Matched: ✓ Yes"
  - "Buffer Returned: $0.00" (for Receive-Exact mode)

- **Timeline**:
  ```
  Feb 6, 11:15 AM - Transfer Initiated
  Feb 6, 11:16 AM - Compliance Cleared
  Feb 6, 11:17 AM - Funding Authorized
  Feb 7, 1:23 PM  - Funds Collected (ACH cleared)
  Feb 7, 1:28 PM  - Currency Converted
  Feb 7, 1:31 PM  - Settlement Confirmed
  Feb 7, 2:15 PM  - Payout Initiated
  Feb 7, 3:42 PM  - Payout Completed ✓
  ```

- **Confirmation IDs** (for reconciliation):
  - Stripe Collection ID: ABC-123-XYZ
  - Settlement TX: DEF-456-UVW
  - Banco Popular Payout ID: GHI-789-RST

- **Partner Chain**:
  - Collection: Stripe (New York)
  - Settlement: VentoVault Network
  - Payout: Banco Popular (Dominican Republic)

**Actions**:
- "Download PDF"
- "Email to Me"
- "Print"
- "Report Issue"

**Interactions**:
- All actions trigger respective flows
- "Report Issue" → Opens support form pre-filled with transaction ID

---

### 3.2 Send-Exact vs Receive-Exact Mode Differences

#### **Send-Exact Mode** (Default, available to all tiers L20+)

**User Input**: "I want to send $100"  
**System Calculates**: "Recipient will receive ≈5,798 DOP"

**Quote Behavior**:
- User pays exactly $100 (+ fees)
- Recipient amount may vary slightly if rate moves during processing
- No buffer charged
- Simpler mental model

**Receipt Shows**:
- "You sent: $100.00"
- "They received: 5,798 DOP"
- "Quote matched: Yes" (if rate didn't move materially)

**Best For**:
- Users who care about controlling their cost
- Frequent small transfers where variance is acceptable
- First-time users (simpler to understand)

---

#### **Receive-Exact Mode** (L30+ only)

**User Input**: "I want María to receive exactly 5,850 DOP"  
**System Calculates**: "You need to send ≈$102.50 (includes buffer)"

**Quote Behavior**:
- Recipient is guaranteed exactly 5,850 DOP
- User is charged a small buffer (typically 2-5%) to protect against rate movement
- If actual cost is less, unused buffer is auto-refunded
- More complex but provides certainty

**Buffer Mechanism**:
1. User authorizes $102.50 charge
2. System actually needs only $100.75 (due to favorable rate movement)
3. Unused $1.75 is refunded automatically
4. Receipt shows: "Buffer returned: $1.75"

**Receipt Shows**:
- "You sent: $102.50 (authorized)"
- "Actual cost: $100.75"
- "Buffer returned: $1.75"
- "They received: 5,850 DOP (guaranteed)"
- "Quote matched: Yes - Favorable rate"

**Best For**:
- Users sending for specific bills (rent, tuition, etc.)
- Business payments requiring exact amounts
- Users willing to pay small premium for certainty

**UI Differences in S3**:
- Send-Exact: One input field ("You send")
- Receive-Exact: One input field ("They receive"), shows estimated charge with buffer disclosure

---

## 4. RECEIVING MONEY - COMPLETE FLOW

### 4.1 Screen-by-Screen Breakdown

#### **Screen R1: Receive Setup Dashboard**

**Elements** (First-Time Setup):
- Header: "Receive Money from Anywhere"
- Hero: "Get paid in local currency with no hidden fees"

- **Setup Checklist**:
  ```
  ☑ Create Account
  ☑ Verify Identity (L20)
  ☐ Add Bank Account
  ```

- If Bank Account Not Added:
  - Prominent CTA: "Add Bank Account to Start Receiving"
  - Click → Navigate to R2

- If Bank Account Added:
  - Shows: "You're ready to receive money!"
  - "Your Recipient Details" card:
    - Name: [User Name]
    - Country: [Country Flag]
    - Bank: [Bank Name] ****4567
  - **"Share Details"** button
  - **"Generate Request Link"** button (optional feature)

**Interactions**:
- "Add Bank Account" → Navigate to R2
- "Share Details" → Opens share sheet with formatted text
- "Generate Request Link" → Creates shareable link with pre-filled recipient info

---

#### **Screen R2: Add Payout Bank Account**

**Elements**:
- Header: "Add Your Bank Account"
- Explainer: "This is where you'll receive money. We'll validate your account with a small test deposit."

- **Form Fields**:
  - Country: [Pre-filled from user profile]
  - Bank Name: (Dropdown, populated based on country)
  - Account Holder Name: (Auto-filled, editable)
  - Account Number:
  - Account Type: Checking / Savings
  - Additional fields (country-specific):
    - Dominican Republic: ID Number (Cédula)
    - Mexico: CLABE
    - Europe: IBAN
    - India: IFSC Code

- **Visual Preview**:
  - Shows bank logo (if available)
  - Preview: "Funds will be deposited to: [Bank Name] ending in [last 4]"

- **Test Deposit Explainer**:
  - "We'll send 1 peso to verify this account"
  - "Check your bank in 1-2 hours and confirm the amount"
  - "This proves the account is yours and active"

**Interactions**:
- Fill form → Real-time validation
- "Add & Verify" button → API call to initiate test deposit
- On success:
  - Modal: "Test deposit sent! Check your bank in 1-2 hours."
  - Navigate back to R1 with status "⏳ Validating..."

**Validation**:
- Account number format check (country-specific)
- Duplicate account check
- Bank compatibility check

---

#### **Screen R3: Pending Test Deposit Validation**

**Elements**:
- Header: "Almost Ready!"
- Status: "⏳ Validating Your Account"

- **Instructions**:
  - "We sent 1 peso to [Bank Name] ****4567"
  - "Check your bank statement in 1-2 hours"
  - "Enter the exact amount below to confirm"

- **Validation Form**:
  - Input: "Amount received (in pesos):"
  - Example: "If you see 1 peso, enter: 1.00"

- **Resend Option** (if >24 hours):
  - "Didn't receive it? Send another test deposit"

**Interactions**:
- Enter amount → "Confirm" button
- Click "Confirm" → API validates amount
- On success:
  - Celebration animation
  - "✅ Account Verified!"
  - Navigate to R1 (now fully set up)
- On failure:
  - Error: "Amount doesn't match. Please try again or contact support."

---

#### **Screen R4: Incoming Transfer Notification**

**Trigger**: Sender initiates transfer to this user

**Elements**:
- **Push Notification**:
  - "[Sender Name] is sending you money"
  - "Tap to track"

- **In-App Notification**:
  - Banner at top of dashboard
  - "New incoming transfer from [Sender]"
  - "View Details"

**Interactions**:
- Tap notification → Navigate to R5 (Tracking)
- Swipe to dismiss (but transaction still visible in Activity)

---

#### **Screen R5: Incoming Transfer Tracking**

**Elements**:
- Header: "Incoming from [Sender Name]"
- **Status Banner**:
  - "🔄 Transfer in Progress"

- **Amount Display**:
  - "You'll receive: 5,798 DOP"
  - "Sender paid: $100.00 USD"

- **Progress Timeline** (receiver's view - simplified):
  ```
  ┌──────────────────────────────────────┐
  │                                       │
  │  ✓ ──── ⏳ ──── ○ ──── ○             │
  │  Sent   Processing   Payout   Done   │
  │                                       │
  └──────────────────────────────────────┘
  ```

- **Estimated Arrival**:
  - "Expected: Feb 7, 2026 around 3:00 PM"
  - "We'll notify you when it arrives"

- **Sender's Message** (if any):
  - Optional memo field from sender
  - "Message from [Sender]: 'For this month's expenses'"

**State-Based Display**:

| State | Status | Receiver Message |
|-------|--------|------------------|
| FUNDED | Processing | "Transfer confirmed, converting currency..." |
| CONVERSION | Processing | "Converting USD to DOP..." |
| SETTLEMENT | Processing | "Almost there! Preparing payout..." |
| PAYOUT | Paying Out | "Depositing to your account now..." |
| COMPLETED | Completed | "Money is in your account!" |
| FAILED | Issue | "There's an issue. We're working on it." |

**Interactions**:
- Status auto-updates (WebSocket/polling)
- "View Sender's Receipt" (if sender shared)
- "Get Help" → Support

---

#### **Screen R6: Transfer Complete (Receiver View)**

**Elements**:
- **Success Celebration**:
  - Animated checkmark
  - Header: "Money Received! 💰"

- **Amount Display**:
  ```
  ┌────────────────────────────────────┐
  │  You Received                      │
  │  5,798 DOP                         │
  │                                    │
  │  From: [Sender Name]               │
  │  Deposited: Feb 7, 2026, 3:42 PM   │
  └────────────────────────────────────┘
  ```

- **Bank Confirmation**:
  - "Deposited to: [Bank Name] ****4567"
  - "Check your bank statement for confirmation"

- **Receipt Details** (expandable):
  - Sender paid: $100.00
  - Exchange rate: 58.50 DOP/USD
  - You received: 5,798 DOP
  - Transaction ID: TXN-20260206-A7F9B2E1

**Actions**:
- "View Full Receipt"
- "Download Receipt"
- "Thank [Sender]" → Opens pre-filled message (optional social feature)

**Interactions**:
- "View Full Receipt" → Detailed receipt view (similar to S9)
- "Download Receipt" → PDF download
- "Thank Sender" → Optional messaging feature

---

### 4.2 Share/Request Features

#### **Screen R7: Share Recipient Details**

**Elements**:
- Header: "Share Your Details"
- Explainer: "Send this info to anyone who wants to send you money"

- **Formatted Text Block** (copyable):
  ```
  Send money to me via VentoVault:
  
  Name: María Rodríguez
  Country: Dominican Republic 🇩🇴
  Bank: Banco Popular ****4567
  
  → ventovault.com/send/maria-rodriguez-xyz
  ```

- **Share Options**:
  - Copy to Clipboard
  - Share via WhatsApp
  - Share via Email
  - Share via SMS
  - Generate QR Code

**Interactions**:
- Click any share option → Native share or copy
- "Generate QR Code" → Creates QR that links to pre-filled send form

---

#### **Screen R8: Generate Request Link (Optional)**

**Elements**:
- Header: "Request Money"
- Explainer: "Create a link asking someone to send you a specific amount"

- **Form**:
  - Amount to request: [Input]
  - Reason (optional): "Rent", "Dinner split", etc.
  - Message (optional): Custom note

- **Generated Link**:
  - Shows preview: "ventovault.com/pay/maria/5850DOP"
  - When sender clicks:
    - Opens VentoVault
    - Pre-fills: Recipient = María, Amount = 5,850 DOP
    - Sender can still edit

**Interactions**:
- Fill form → "Generate Link"
- Share link via any method
- Track link clicks (analytics)

---

## 5. THE 13-STATE TRANSACTION MACHINE

### 5.1 Complete State Diagram

```
                    ┌─────────────┐
                    │   CREATED   │ ← User initiates transfer
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │   QUOTED    │ ← Quote generated & displayed
                    └──────┬──────┘
                           │
                    ┌──────▼──────────┐
                    │ FUNDING_PENDING │ ← User authorized, awaiting funding
                    └──────┬──────────┘
                           │
                    ┌──────▼──────┐
                    │   FUNDED    │ ← Funds collected successfully
                    └──────┬──────┘
                           │
         ┌─────────────────┴─────────────────┐
         │                                   │
  ┌──────▼──────────┐              ┌────────▼────────┐
  │  UNDER_REVIEW   │              │    APPROVED     │
  │ (Compliance     │              │ (Auto-approved) │
  │  Hold)          │              └────────┬────────┘
  └──────┬──────────┘                       │
         │                                   │
         └──────────────┬────────────────────┘
                        │
                 ┌──────▼──────────┐
                 │   CONVERSION    │ ← USD → USDC
                 └──────┬──────────┘
                        │
                 ┌──────▼──────────┐
                 │   SETTLEMENT    │ ← USDC → Destination
                 └──────┬──────────┘
                        │
                 ┌──────▼──────────┐
                 │     PAYOUT      │ ← USDC → DOP → Bank
                 └──────┬──────────┘
                        │
                 ┌──────▼──────────┐
                 │   COMPLETED     │ ← Success! 🎉
                 └─────────────────┘

             (Terminal States - Can Exit From Any Stage)
                        
            ┌───────────┐   ┌───────────┐   ┌───────────┐
            │  FAILED   │   │ REFUNDED  │   │ CANCELED  │
            └───────────┘   └───────────┘   └───────────┘
```

### 5.2 State Definitions & User-Facing Messages

#### **STATE 1: CREATED**
**Internal**: Transaction object created in database  
**User Sees**: Nothing yet (happens during S2-S3)  
**Duration**: <1 second  
**Next**: Automatically transitions to QUOTED

---

#### **STATE 2: QUOTED**
**Internal**: Quote generated, timer started  
**User Sees**: "Review Your Transfer" (Screen S4)  
**Duration**: 0-45 seconds (until quote expires or user accepts)  
**Transitions**:
- User accepts → FUNDING_PENDING
- Timer expires → Back to S3 for new quote
- User cancels → CANCELED

**Technical Details**:
- Quote includes: Rate, fees, expiry timestamp
- Cryptographically signed
- Stored in Redis for fast retrieval

---

#### **STATE 3: FUNDING_PENDING**
**Internal**: User accepted quote, authorized funding, awaiting collection  
**User Sees**: "🔄 Funding in Progress"  
**Duration**: 
- ACH: 24-48 hours
- Debit Card: 1-5 minutes

**Substates** (internal, not shown to user):
- `funding_initiated`: Stripe ACH pull initiated
- `funding_processing`: ACH in transit
- `funding_complete`: Funds collected

**Transitions**:
- Funding succeeds → FUNDED
- Funding fails (NSF, closed account) → FAILED
- User cancels (before funding completes) → CANCELED

**User Actions Available**:
- Cancel transfer (triggers refund)
- Contact support

**Notifications**:
- Email: "Your transfer has been initiated"
- Push: None (too early)

---

#### **STATE 4: FUNDED**
**Internal**: Funds successfully collected from user  
**User Sees**: "✓ Funded - Now processing"  
**Duration**: <30 seconds (automatic transition)  
**Transitions**:
- Auto-transitions to compliance check
- If low-risk profile → APPROVED (skip review)
- If flagged → UNDER_REVIEW

**Technical Details**:
- Stripe confirmation received
- Internal balance updated
- Compliance screening begins

---

#### **STATE 5: UNDER_REVIEW**
**Internal**: Transaction flagged by automated monitoring, human review required  
**User Sees**: "⚠️ Additional Review Required"  
**Duration**: 15 minutes - 4 hours (target: <30 min)  
**Transitions**:
- Review approves → APPROVED
- Review rejects → FAILED (refund initiated)
- Auto-reject after 4 hours if no decision → FAILED

**User Message**:
```
Your transfer requires additional verification
for security and compliance.

This is a routine check and usually completes
within 30 minutes. We'll notify you as soon
as it's approved.

Estimated completion: [Time]
```

**User Actions Available**:
- View reason (generic): "Routine security check"
- Contact support
- Cannot cancel (funds already collected)

**Compliance Officer Actions**:
- View full transaction context
- Approve or Reject
- Add notes

**Notifications**:
- Push: "Your transfer is under review"
- Email: "Additional verification needed"
- On approval: "Your transfer has been approved!"

**Edge Cases**:
- If 4-hour RTO exceeded: Auto-fail, refund, notify user
- If user submits additional docs: Review timeline extends

---

#### **STATE 6: APPROVED**
**Internal**: All compliance checks passed  
**User Sees**: "✓ Approved - Converting currency"  
**Duration**: <5 seconds (automatic transition)  
**Transitions**: Auto-transitions to CONVERSION

**Technical Details**:
- Compliance logs sealed
- Transaction added to settlement queue
- Partner validation complete

---

#### **STATE 7: CONVERSION**
**Internal**: USD → USDC conversion in progress  
**User Sees**: "🔄 Converting Currency"  
**Duration**: 1-3 minutes  
**Transitions**:
- Conversion succeeds → SETTLEMENT
- Conversion fails (liquidity issue) → Retry 3x, then FAILED

**Technical Details**:
- API call to conversion partner
- Lock exchange rate
- Confirm USDC received

**User Message**:
```
Converting $100 USD → USDC

Estimated time: 2 minutes
Current rate: 58.50 DOP/USD
```

**Edge Cases**:
- Rate slippage > 1%: Auto-cancel, refund, notify user
- Partner timeout: Retry with exponential backoff

---

#### **STATE 8: SETTLEMENT**
**Internal**: USDC moving from US side to DR side  
**User Sees**: "🔄 Settling Transfer"  
**Duration**: 5-15 minutes  
**Transitions**:
- Settlement confirms → PAYOUT
- Settlement fails → Retry 3x, then reroute to backup partner

**Technical Details**:
- USDC blockchain transaction initiated
- Wait for confirmations (typically 12 blocks)
- Validate arrival on destination side

**User Message**:
```
Moving funds to Dominican Republic

Estimated time: 10 minutes
Settlement network: VentoVault IRU
```

**Edge Cases**:
- Network congestion: Extended wait time (notify user)
- Transaction stuck: Reroute to backup settlement path

---

#### **STATE 9: PAYOUT**
**Internal**: USDC → DOP, depositing to recipient's bank  
**User Sees**: "🔄 Paying Out to [Recipient]"  
**Duration**: 1-2 hours  
**Transitions**:
- Payout confirms → COMPLETED
- Payout fails → Retry 3x, then reroute to backup payout partner
- If all partners fail → FAILED (refund)

**Technical Details**:
- USDC → DOP conversion
- Payout partner API call
- Await bank confirmation

**User Message**:
```
Depositing 5,798 DOP to Banco Popular

[Recipient Name]'s account will be credited
within 2 hours.

We'll notify you when complete.
```

**Recipient Notification**:
- Push: "[Sender] is sending you money - arriving soon"
- Email: "Incoming transfer from [Sender]"

**Edge Cases**:
- Bank rejects (wrong account): FAILED, refund
- Bank temporarily unavailable: Retry with backoff
- Recipient account frozen: FAILED, refund, notify user

---

#### **STATE 10: COMPLETED**
**Internal**: All stages successful, funds delivered  
**User Sees**: "✅ Transfer Complete!"  
**Duration**: Terminal state (permanent)  
**Transitions**: None (final state)

**User Message**:
```
✅ Transfer Complete!

María received 5,798 DOP
Completed: Feb 7, 2026 at 3:42 PM

Total time: 27 hours, 14 minutes
```

**Notifications**:
- Sender Push: "Your transfer to [Recipient] is complete!"
- Sender Email: "Transfer complete - Receipt attached"
- Recipient Push: "You received 5,798 DOP from [Sender]"
- Recipient Email: "Money received from [Sender]"

**Actions Available**:
- View full receipt
- Download PDF
- Send again (one-tap repeat)
- Share confirmation

**Technical Details**:
- Final receipt generated
- All partner confirmations logged
- Evidence layer sealed
- Analytics event fired

---

#### **STATE 11: FAILED**
**Internal**: Transaction failed at some stage, refund initiated  
**User Sees**: "❌ Transfer Failed"  
**Duration**: Terminal state, but refund in progress  
**Transitions**: Can transition to REFUNDED once refund completes

**Failure Reasons** (shown to user):
- "Funding failed: Insufficient funds"
- "Compliance check did not clear"
- "Payout failed: Recipient account invalid"
- "Partner service unavailable"
- "Rate moved beyond acceptable range"

**User Message**:
```
❌ Transfer Failed

Reason: [Specific reason]

We're processing your refund now.
You'll receive $XXX back to your [funding method]
within [timeframe].

Transaction ID: [ID]
```

**Refund Details by Funding Method**:
- ACH: 3-5 business days
- Debit Card: 5-10 business days

**Refund Amount**:
- Full amount minus actual costs incurred
- Example: User paid $103.25, costs incurred $0.75, refund $102.50
- VentoVault fee ($2.50) is refunded

**Actions Available**:
- View details
- Contact support
- Try again (for fixable issues like wrong account number)

**Notifications**:
- Push: "Your transfer failed - Refund in progress"
- Email: "Transfer failed - Full details and refund timeline"

---

#### **STATE 12: REFUNDED**
**Internal**: Refund successfully processed  
**User Sees**: "↩️ Refunded"  
**Duration**: Terminal state (permanent)  
**Transitions**: None (final state)

**User Message**:
```
↩️ Refund Processed

Original amount: $103.25
Costs incurred: $0.75
Refunded: $102.50

Refund sent to: Chase ****1234
Expected arrival: [Date]

Transaction ID: [ID]
```

**Actions Available**:
- View refund receipt
- Try transfer again
- Contact support if refund not received

**Notifications**:
- Push: "Refund processed - $102.50 sent to your account"
- Email: "Refund complete - Receipt attached"

---

#### **STATE 13: CANCELED**
**Internal**: User canceled before funding completed  
**User Sees**: "🚫 Canceled"  
**Duration**: Terminal state (permanent)  
**Transitions**: None (final state)

**User Message**:
```
🚫 Transfer Canceled

You canceled this transfer on [Date] at [Time].

No charges were made.
```

**When Cancelation is Allowed**:
- QUOTED state: Always
- FUNDING_PENDING state: Only if funding hasn't completed
- FUNDED or later: Cannot cancel (must let it complete or fail)

**Actions Available**:
- Start new transfer
- View canceled transaction details

**Notifications**:
- Email: "Transfer canceled - Confirmation"

---

### 5.3 State Transition Matrix

| Current State | Possible Next States | Trigger | Duration |
|---------------|---------------------|---------|----------|
| CREATED | QUOTED | Auto | <1s |
| QUOTED | FUNDING_PENDING | User accepts | Manual |
| QUOTED | CANCELED | User cancels or timer expires | Manual |
| FUNDING_PENDING | FUNDED | Payment clears | 1m-48h |
| FUNDING_PENDING | FAILED | Payment fails | 1m-48h |
| FUNDING_PENDING | CANCELED | User cancels | Manual |
| FUNDED | APPROVED | Auto (low risk) | <30s |
| FUNDED | UNDER_REVIEW | Compliance flag | <30s |
| UNDER_REVIEW | APPROVED | Compliance approves | 15m-4h |
| UNDER_REVIEW | FAILED | Compliance rejects | 15m-4h |
| APPROVED | CONVERSION | Auto | <5s |
| CONVERSION | SETTLEMENT | Conversion succeeds | 1-3m |
| CONVERSION | FAILED | Conversion fails (3x retry) | 1-3m |
| SETTLEMENT | PAYOUT | Settlement confirms | 5-15m |
| SETTLEMENT | FAILED | Settlement fails (3x retry) | 5-15m |
| PAYOUT | COMPLETED | Payout confirms | 1-2h |
| PAYOUT | FAILED | Payout fails (all partners) | 1-2h |
| FAILED | REFUNDED | Refund processes | 3-10 days |

---

### 5.4 User-Visible vs Internal States

**User Sees** (Simplified):
1. Initiated
2. Funding
3. Processing (combines: Under Review, Approved, Conversion, Settlement)
4. Paying Out
5. Complete

**System Tracks** (Granular):
1. CREATED
2. QUOTED
3. FUNDING_PENDING
4. FUNDED
5. UNDER_REVIEW
6. APPROVED
7. CONVERSION
8. SETTLEMENT
9. PAYOUT
10. COMPLETED
11. FAILED
12. REFUNDED
13. CANCELED

**Why the Difference**:
- Users don't need to know internal substates
- Reduces cognitive load
- Maintains professional appearance (vs showing every technical step)
- But power users can expand "View Details" to see full granular log

---

## 6. UNDER THE HOOD - 8 STAGE PROCESS

This section details what happens behind the UI during transaction processing. This is what should be shown in the "View detailed logs" animation.

### 6.1 The 8 Stages (Technical Layer)

```
┌──────────────────────────────────────────────────────────────┐
│                    8-STAGE PROCESS                            │
│          (What VentoVault Does Behind the Scenes)            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Stage 1: Intent Creation & Quote Generation                │
│           ↓                                                  │
│  Stage 2: Multi-Signatory Approval Gate                     │
│           ↓                                                  │
│  Stage 3: Funding (Regulated Entry)                         │
│           ↓                                                  │
│  Stage 4: Compliance Gating (Double-Validation)             │
│           ↓                                                  │
│  Stage 5: Conversion                                         │
│           ↓                                                  │
│  Stage 6: Settlement                                         │
│           ↓                                                  │
│  Stage 7: Payout (Regulated Exit)                           │
│           ↓                                                  │
│  Stage 8: Reconciliation & Receipt                          │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 6.2 Stage-by-Stage Breakdown for Animation

#### **STAGE 1: Intent Creation & Quote Generation**

**What Happens**:
1. User inputs amount + selects recipient
2. System queries partners for current rates
3. Calculates all costs (collection, conversion, settlement, payout)
4. Generates cryptographically signed quote
5. Starts 45-second countdown timer

**Animation Visual**:
```
[User Icon] → [VentoVault Logo] → [Partner APIs]
                     ↓
              [Quote Generated]
                     ↓
              [45s Timer Starts]
```

**Data Flow**:
- IN: Amount, corridor, mode (Send-Exact/Receive-Exact)
- PROCESS: Rate lookup, fee calculation, buffer calculation
- OUT: Quote object with rate, fees, expiry timestamp

**Technical Details to Show**:
- "Querying rates from Bloomberg, Reuters..."
- "Calculating optimal route..."
- "Quote locked for 45 seconds"

**Time**: 0.5-2 seconds

---

#### **STAGE 2: Multi-Signatory Approval Gate**

**What Happens**:
1. User accepts quote (Signature 1)
2. System sends request to partner (Stripe)
3. Partner validates against their compliance engine (Signature 2)
4. Partner issues cryptographic authorization token
5. User confirms Consent Bridge (Signature 3)
6. 30-second mandatory delay enforced by external system

**Animation Visual**:
```
┌─────────────────────────────────────────────┐
│  Signature 1: ✓ User Accepted               │
│               ↓                             │
│  Signature 2: ⏳ Awaiting Partner...        │
│               → [API Call to Stripe]        │
│               ← [Token Received] ✓          │
│               ↓                             │
│  Signature 3: ✓ Consent Bridge Confirmed    │
│               ↓                             │
│  Safety Delay: [30s Countdown]              │
│                ▓▓▓▓▓▓▓░░░░░░░  15s          │
└─────────────────────────────────────────────┘
```

**Technical Details to Show**:
- "Requesting Stripe authorization..."
- "Stripe compliance check: PASSED"
- "Authorization token received: ABC-123-XYZ"
- "Enforcing 30-second control gate..."
- "Cannot be bypassed - external timer"

**Time**: 35-40 seconds total (including 30s delay)

---

#### **STAGE 3: Funding (Regulated Entry)**

**What Happens**:
1. Stripe initiates ACH pull from user's bank
2. ACH enters clearing system
3. Funds settle into Stripe's account
4. Stripe confirms collection to VentoVault

**Animation Visual**:
```
[User's Bank] → [ACH Network] → [Stripe Account]
                                      ↓
                               [Confirmation Sent]
                                      ↓
                               [VentoVault Notified]
```

**Timeline Visualization** (for ACH):
```
Day 1: 11:15 AM - ACH initiated
       11:16 AM - Pending in ACH network
       11:30 AM - User notified: "Funding in progress"

Day 2: 1:23 PM  - ACH cleared
       1:24 PM  - Stripe confirms: $100 collected
       1:24 PM  - Transaction → FUNDED state
```

**Technical Details to Show**:
- "ACH pull initiated from Chase ****1234"
- "Expected clearance: 24-48 hours"
- "Stripe monitoring clearance..."
- "✓ Funds collected: $100.00"
- "Stripe Confirmation ID: XYZ-789"

**Time**: 24-48 hours (ACH) or 1-5 minutes (Debit)

---

#### **STAGE 4: Compliance Gating (Double-Validation)**

**What Happens**:

**Layer 1 - VentoVault Internal Check**:
1. Query high-speed sanctions cache (updated every 60 mins)
2. Check John, María, Banco Popular against OFAC, Magnitsky, etc.
3. Fuzzy matching (85%+ similarity threshold)
4. Fraud pattern detection (velocity, structuring)
5. Result: PASS or FLAG

**Layer 2 - Partner Regulatory Check**:
1. Only if Layer 1 passes, send to Stripe
2. Stripe runs independent check with their databases
3. Stripe applies their own thresholds
4. Result: APPROVE or REJECT

**Animation Visual**:
```
┌───────────────────────────────────────────┐
│  LAYER 1: VentoVault Safety Net          │
│                                           │
│  [John Doe] → Sanctions DB                │
│              ✓ Clear                      │
│  [María R.] → Sanctions DB                │
│              ✓ Clear                      │
│  [Banco Pop]→ Entity Check                │
│              ✓ Clear                      │
│                                           │
│  Fraud Patterns: None detected            │
│                                           │
│  Layer 1 Result: ✓ PASS                  │
│  ────────────────────────────────────────  │
│                                           │
│  LAYER 2: Stripe Regulatory Check        │
│                                           │
│  [Transaction] → Stripe Compliance        │
│                  ✓ APPROVED               │
│                                           │
│  Layer 2 Result: ✓ APPROVED              │
└───────────────────────────────────────────┘
```

**Technical Details to Show**:
- "Layer 1 Check: Querying sanctions lists..."
- "Checking: John Doe, María Rodríguez, Banco Popular"
- "Fuzzy match threshold: 85%"
- "Fraud patterns: ✓ None detected"
- "Layer 1: ✓ PASSED in 0.2s"
- "Layer 2 Check: Sending to Stripe..."
- "Stripe compliance engine: ✓ APPROVED"
- "Layer 2: ✓ APPROVED in 3.1s"

**Edge Case Animation** (if flagged):
```
┌───────────────────────────────────────────┐
│  LAYER 1: VentoVault Safety Net          │
│                                           │
│  Fraud Patterns: ⚠️ Velocity Alert       │
│  → 5 transfers in 10 minutes              │
│                                           │
│  Layer 1 Result: ⚠️ FLAGGED              │
│  ────────────────────────────────────────  │
│                                           │
│  HUMAN REVIEW TRIGGERED                   │
│                                           │
│  Compliance Officer: Reviewing...         │
│  Estimated time: 15-30 minutes            │
│                                           │
│  [User Notification Sent]                 │
└───────────────────────────────────────────┘
```

**Time**: 3-10 seconds (auto-pass) or 15 min - 4 hours (manual review)

---

#### **STAGE 5: Conversion**

**What Happens**:
1. USD → USDC conversion initiated
2. API call to conversion partner (e.g., Circle, Coinbase)
3. Lock exchange rate (1:1 for USDC)
4. Confirm USDC received in VentoVault wallet
5. Log transaction ID on blockchain

**Animation Visual**:
```
[Stripe Account] → [Conversion Partner]
    $100 USD           ↓
                   [Conversion]
                       ↓
              [VentoVault Wallet]
                   100 USDC
                       ↓
              [Blockchain Confirmation]
              TX: 0x7a3f2e1...
```

**Technical Details to Show**:
- "Converting $100 USD → USDC..."
- "Rate: 1:1 (stablecoin peg)"
- "Conversion partner: Circle"
- "USDC received: 100.00"
- "Blockchain TX: 0x7a3f2e1d4b9c..."
- "Confirmations: 3/12"
- "✓ Conversion complete"

**Cost Savings Callout**:
```
┌────────────────────────────────────────┐
│  💰 Cost Comparison                    │
│                                        │
│  Traditional SWIFT Wire:  $25-40      │
│  VentoVault USDC:         $0.10       │
│                                        │
│  YOU SAVE: ~$35                       │
└────────────────────────────────────────┘
```

**Time**: 1-3 minutes

---

#### **STAGE 6: Settlement**

**What Happens**:
1. USDC moves from US-side wallet to DR-side wallet
2. Blockchain transaction submitted
3. Wait for confirmations (security)
4. DR-side partner confirms receipt
5. Ready for local conversion

**Animation Visual**:
```
[US Wallet] → [Blockchain Network] → [DR Wallet]
   100 USDC                             100 USDC
                ↓
        [Confirmations]
        Block 1 ✓
        Block 2 ✓
        Block 3 ✓
         ...
        Block 12 ✓
                ↓
        [Settlement Confirmed]
```

**Technical Details to Show**:
- "Initiating settlement transfer..."
- "Network: Ethereum/Polygon/Stellar" (depends on corridor)
- "TX Hash: 0x9f2a7c3..."
- "Waiting for confirmations: 3/12"
- "Estimated time: 10 minutes"
- "✓ Confirmed on block 834,291"
- "DR-side partner: ✓ USDC received"

**Time**: 5-15 minutes

---

#### **STAGE 7: Payout (Regulated Exit)**

**What Happens**:
1. USDC → DOP conversion (local exchange)
2. Payout partner (Banco Popular) receives DOP
3. Banco Popular initiates local bank transfer
4. Dominican banking system processes
5. Funds credit to María's account
6. Bank confirmation sent to VentoVault

**Animation Visual**:
```
[DR Wallet] → [Local Exchange] → [Banco Popular]
  100 USDC        ↓                    ↓
            [Conversion]          [Local Transfer]
                  ↓                    ↓
              5,798 DOP         [María's Account]
                                       ↓
                              [Confirmation Received]
```

**Technical Details to Show**:
- "Converting USDC → DOP..."
- "Rate: 57.98 DOP/USDC"
- "Amount: 5,798 DOP"
- "Payout partner: Banco Popular"
- "Initiating local transfer..."
- "Destination: Banco Popular ****4567"
- "Account holder: María Rodríguez"
- "Status: Processing (1-2 hours)"
- "✓ Payout confirmed by Banco Popular"
- "Confirmation ID: BP-2026-02-07-8291"

**Recipient Notification Trigger**:
- At initiation: "Money is on the way!"
- At completion: "5,798 DOP deposited to your account"

**Time**: 1-2 hours

---

#### **STAGE 8: Reconciliation & Receipt**

**What Happens**:
1. System collects all confirmation IDs from partners
2. Validates: Internal logs match partner confirmations
3. Compares: Quote vs actual execution
4. Calculates: Any buffer returned (Receive-Exact mode)
5. Generates final receipt
6. Sends notifications
7. Closes transaction in COMPLETED state

**Animation Visual**:
```
┌──────────────────────────────────────────┐
│  RECONCILIATION CHECKLIST                │
│                                          │
│  ✓ Stripe Collection: $100.00           │
│    ID: ABC-123                           │
│                                          │
│  ✓ Compliance: Layer 1 + 2 Passed       │
│                                          │
│  ✓ Conversion: 100 USDC                 │
│    TX: 0x7a3f2e1...                      │
│                                          │
│  ✓ Settlement: Confirmed                 │
│    TX: 0x9f2a7c3...                      │
│                                          │
│  ✓ Payout: 5,798 DOP                    │
│    ID: BP-2026-02-07-8291                │
│                                          │
│  Quote Matched: YES ✓                    │
│  Buffer Returned: $0.00                  │
│                                          │
│  [Generating Receipt...]                 │
│  [Receipt Sealed]                        │
│  [Transaction COMPLETED]                 │
└──────────────────────────────────────────┘
```

**Technical Details to Show**:
- "Collecting partner confirmations..."
- "Stripe: ✓ $100.00 (ID: ABC-123)"
- "Settlement: ✓ 100 USDC (TX: 0x7a3f...)"
- "Banco Popular: ✓ 5,798 DOP (ID: BP-...)"
- "Validating quote match..."
- "Quoted: 58.50 | Executed: 58.50 ✓"
- "Generating immutable receipt..."
- "Receipt ID: REC-2026-02-07-A7F9B"
- "✓ Transaction complete!"

**Notifications Sent**:
- Sender: "Transfer complete!" + Receipt
- Recipient: "Money received!" + Receipt

**Time**: 5-10 seconds

---

### 6.3 Total Timeline Example

**Send-Exact Mode, ACH Funding, NY → DR**

| Stage | Duration | Cumulative | State |
|-------|----------|------------|-------|
| 1. Intent/Quote | 2s | 0:02 | QUOTED |
| 2. Approval Gate | 38s | 0:40 | FUNDING_PENDING |
| 3. Funding (ACH) | 26 hours | 26:40 | FUNDED |
| 4. Compliance | 8s | 26:48 | APPROVED |
| 5. Conversion | 2 min | 28:48 | CONVERSION |
| 6. Settlement | 12 min | 40:48 | SETTLEMENT |
| 7. Payout | 1.5 hours | 2h 10m | PAYOUT |
| 8. Reconciliation | 8s | 2h 10m 08s | COMPLETED |

**Total**: ~28 hours (mostly ACH wait time)

**If Debit Card Used** (instant funding):
**Total**: ~2 hours 15 minutes

---

## 7. UI COMPONENTS & INTERACTIONS

### 7.1 Core UI Components Library

#### **Component: StatusBadge**

**Purpose**: Display current transaction state  
**Variants**:
- `processing` (blue, spinning icon)
- `success` (green, checkmark)
- `warning` (yellow, exclamation)
- `error` (red, X icon)
- `pending` (gray, clock icon)

**Props**:
- `status`: string
- `text`: string
- `icon`: optional custom icon

**Example**:
```jsx
<StatusBadge 
  status="processing" 
  text="Converting Currency"
  icon={<RefreshIcon />}
/>
```

**Visual**:
```
┌──────────────────────────┐
│ 🔄 Converting Currency   │
└──────────────────────────┘
```

---

#### **Component: ProgressTimeline**

**Purpose**: Visual representation of transaction stages  
**Props**:
- `stages`: array of stage objects
- `currentStage`: index of current stage
- `variant`: 'simple' | 'detailed'

**Stages Array**:
```javascript
[
  { id: 1, label: 'Initiated', status: 'complete' },
  { id: 2, label: 'Funding', status: 'complete' },
  { id: 3, label: 'Processing', status: 'active' },
  { id: 4, label: 'Payout', status: 'pending' },
  { id: 5, label: 'Complete', status: 'pending' }
]
```

**Simple Variant** (5 stages):
```
✓ ──── ✓ ──── ⏳ ──── ○ ──── ○
Initiated  Funding  Processing  Payout  Done
```

**Detailed Variant** (8 stages, for "under the hood" view):
```
✓ ──── ✓ ──── ✓ ──── ✓ ──── ⏳ ──── ○ ──── ○ ──── ○
Quote  Approve  Fund  Comply  Convert  Settle  Payout  Receipt
```

---

#### **Component: CostBreakdown**

**Purpose**: Itemized fee display (The Stockbroker View)  
**Props**:
- `quote`: quote object
- `variant`: 'compact' | 'expanded'
- `showComparison`: boolean (show mid-market comparison)

**Expanded View**:
```
┌─────────────────────────────────────────┐
│ Exchange Rate                            │
│ 58.50 DOP/USD                           │
│ (Mid-market: 58.60 - 0.17% difference)  │
├─────────────────────────────────────────┤
│ VentoVault Fee          $2.50           │
│ Network Costs           $0.75           │
│ ─────────────────────────────────────── │
│ Total Cost              $3.25           │
├─────────────────────────────────────────┤
│ You Pay                 $103.25         │
│ They Receive            5,798 DOP       │
└─────────────────────────────────────────┘
```

**Compact View**:
```
┌────────────────────────────┐
│ Total Cost: $3.25          │
│ Rate: 58.50 (vs 58.60)     │
│ You pay: $103.25           │
└────────────────────────────┘
```

---

#### **Component: QuoteTimer**

**Purpose**: Countdown display for quote expiry  
**Props**:
- `expiresAt`: timestamp
- `onExpire`: callback function
- `warningThreshold`: seconds (default 10)

**Visual States**:

Normal (>10s remaining):
```
┌──────────┐
│   0:42   │
└──────────┘
```

Warning (<10s):
```
┌──────────┐
│   0:08   │  [RED COLOR]
└──────────┘
```

Expired:
```
┌──────────────────────┐
│ Quote Expired        │
│ [Refresh] button     │
└──────────────────────┘
```

**Interaction**:
- Ticks down every second
- At 10s: Color changes to red
- At 0s: Triggers `onExpire` callback
- Disables "Accept" button

---

#### **Component: RecipientCard**

**Purpose**: Display recipient information  
**Props**:
- `recipient`: recipient object
- `showActions`: boolean
- `variant`: 'list' | 'detail'

**List Variant**:
```
┌────────────────────────────────────┐
│  [MR]  María Rodríguez             │
│        🇩🇴 Dominican Republic      │
│        Banco Popular ****4567       │
│        ✓ Trusted                    │
└────────────────────────────────────┘
```

**Detail Variant**:
```
┌────────────────────────────────────┐
│          María Rodríguez            │
│                                    │
│  Country: 🇩🇴 Dominican Republic   │
│  Bank: Banco Popular                │
│  Account: ****4567 (Savings)        │
│  Status: ✓ Trusted Recipient        │
│  First transfer: Jan 15, 2026       │
│  Total sent: 3 transfers            │
│                                    │
│  [Edit] [Remove]                    │
└────────────────────────────────────┘
```

---

#### **Component: FundingMethodSelector**

**Purpose**: Choose funding method  
**Props**:
- `methods`: array of available methods
- `onSelect`: callback
- `tier`: user tier (determines available methods)

**Visual**:
```
┌────────────────────────────────────┐
│  ⦿ 🏦 Bank Account (ACH)            │
│     Free • 1-2 days                 │
│     Recommended                     │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│  ○ 💳 Debit Card                    │
│     +$1.50 fee • Instant            │
│     L30+ only                       │
└────────────────────────────────────┘
```

**State Changes**:
- L20: Debit option grayed out with lock icon
- L30+: Both options available
- Selected: Radio button filled, card highlighted

---

#### **Component: NotificationBanner**

**Purpose**: In-app notifications  
**Props**:
- `type`: 'info' | 'success' | 'warning' | 'error'
- `message`: string
- `action`: optional button
- `dismissible`: boolean

**Variants**:

Info:
```
┌────────────────────────────────────┐
│ ℹ️  Your transfer is being         │
│     processed. We'll notify you    │
│     when complete.                 │
│                          [Dismiss] │
└────────────────────────────────────┘
```

Success:
```
┌────────────────────────────────────┐
│ ✅ Transfer complete! María        │
│     received 5,798 DOP.            │
│                    [View Receipt]  │
└────────────────────────────────────┘
```

Warning:
```
┌────────────────────────────────────┐
│ ⚠️  This transfer requires         │
│     additional review (30 min)     │
│                       [Learn More] │
└────────────────────────────────────┘
```

Error:
```
┌────────────────────────────────────┐
│ ❌ Transfer failed. Refund in      │
│     progress.                      │
│                       [Get Help]   │
└────────────────────────────────────┘
```

---

### 7.2 Interactive Elements

#### **Element: Amount Input with Live Preview**

**Behavior**:
- As user types, debounced quote preview updates (500ms delay)
- Shows "Calculating..." spinner during debounce
- Updates recipient amount in real-time
- Validates against limits
- Shows error messages inline

**Visual**:
```
┌────────────────────────────────────┐
│  You send                          │
│  $ [100.00]___________             │
│                                    │
│  They receive                      │
│  ≈ 5,798 DOP                       │
│                                    │
│  Mid-market rate: 58.60            │
│  [Calculating...]                  │
└────────────────────────────────────┘
```

**After calculation**:
```
┌────────────────────────────────────┐
│  You send                          │
│  $ 100.00                          │
│                                    │
│  They receive                      │
│  ≈ 5,798 DOP                       │
│                                    │
│  Rate: 58.50 (vs 58.60 mid)        │
│  Total: $103.25                    │
└────────────────────────────────────┘
```

---

#### **Element: Mode Toggle (Send-Exact vs Receive-Exact)**

**Behavior**:
- Tab-style toggle
- Switches input focus
- Recalculates amounts
- L30+ requirement for Receive-Exact shown with lock icon

**Visual**:
```
┌────────────────────────────────────┐
│ [Send Exactly] [They Receive]      │
│  ─────────────                     │
│                                    │
│  You send: $ [100.00]__            │
│  They receive: ≈ 5,798 DOP         │
└────────────────────────────────────┘
```

After switching to "They Receive":
```
┌────────────────────────────────────┐
│ [Send Exactly] [They Receive]      │
│                ──────────────       │
│                                    │
│  They receive: [5,850]__ DOP       │
│  You send: ≈ $102.50 (incl buffer) │
└────────────────────────────────────┘
```

---

#### **Element: Expandable Partner Disclosure**

**Behavior**:
- Collapsed by default
- Expands on click
- Shows partner logos and details
- Links to partner info pages

**Collapsed**:
```
┌────────────────────────────────────┐
│  Who's handling your money? ▼      │
└────────────────────────────────────┘
```

**Expanded**:
```
┌────────────────────────────────────┐
│  Who's handling your money? ▲      │
│                                    │
│  Collection (US):                  │
│  [Stripe Logo] Stripe              │
│  New York, USA                     │
│  → Learn more about Stripe         │
│                                    │
│  Settlement:                       │
│  [VV Logo] VentoVault Network      │
│  USDC via Ethereum                 │
│                                    │
│  Payout (DR):                      │
│  [BP Logo] Banco Popular           │
│  Santo Domingo, Dominican Republic │
│  → Learn more about Banco Popular  │
└────────────────────────────────────┘
```

---

#### **Element: Transaction Detail Modal (Under the Hood)**

**Trigger**: User clicks "View detailed logs" on tracking screen  
**Behavior**: Animated visualization of 8 stages  
**Animation**: See Section 11 for full animation sequences

**Visual Structure**:
```
┌──────────────────────────────────────┐
│  Transaction Details                 │
│  ID: TXN-20260206-A7F9B2E1          │
│                                      │
│  [Timeline Visualization]            │
│                                      │
│  Stage 1: Intent Creation ✓          │
│  └─ Completed in 0.8s                │
│                                      │
│  Stage 2: Approval Gate ✓            │
│  ├─ User accepted                    │
│  ├─ Partner authorized               │
│  └─ Completed in 38s                 │
│                                      │
│  Stage 3: Funding ⏳                 │
│  └─ ACH in progress (1-2 days)       │
│                                      │
│  [See Full Technical Log]            │
│                          [Close]     │
└──────────────────────────────────────┘
```

---

### 7.3 Responsive Design Considerations

#### **Mobile-First Components**

**Stack Priority** (Mobile):
1. Status banner (always visible)
2. Amount summary (prominent)
3. Actions (sticky bottom)
4. Details (collapsible)

**Desktop Enhancements**:
- Side-by-side quote breakdown
- Persistent partner disclosure
- Inline timeline (vs modal)

**Breakpoints**:
- Mobile: <640px
- Tablet: 640px-1024px
- Desktop: >1024px

---

## 8. ERROR STATES & EXCEPTION HANDLING

### 8.1 Funding Failures

#### **Error: Insufficient Funds (NSF)**

**Trigger**: ACH pull fails due to insufficient balance  
**User Message**:
```
❌ Funding Failed

Your bank account had insufficient funds
to complete this transfer.

Amount needed: $103.25
Action: Add funds to your account and try again

[Try Again]  [Contact Support]
```

**State Transition**: FUNDING_PENDING → FAILED  
**Refund**: None (no funds collected)  
**User Actions**: Retry with different funding method

---

#### **Error: Card Declined**

**Trigger**: Debit card authorization fails  
**User Message**:
```
❌ Card Declined

Your card ending in 1234 was declined.

Possible reasons:
• Insufficient funds
• Card expired
• Bank blocked international transaction

[Try Different Card]  [Use Bank Account]
```

**State Transition**: FUNDING_PENDING → FAILED  
**Refund**: None (no charge succeeded)

---

#### **Error: Bank Account Closed**

**Trigger**: ACH pull returned as "account closed"  
**User Message**:
```
❌ Funding Failed

The bank account you selected is closed.

Please remove this account and add a
different one.

[Update Bank Account]  [Contact Support]
```

**State Transition**: FUNDING_PENDING → FAILED  
**Follow-Up**: System automatically flags account for removal

---

### 8.2 Compliance Failures

#### **Error: Compliance Rejection (Sanctions Hit)**

**Trigger**: Name matches sanctions list  
**User Message**:
```
❌ Transfer Cannot Proceed

This transfer cannot be completed due
to compliance restrictions.

For security reasons, we cannot provide
specific details. If you believe this is
an error, please contact support.

Transaction ID: TXN-20260206-A7F9B2E1

[Contact Support]
```

**State Transition**: UNDER_REVIEW → FAILED → REFUNDED  
**Refund**: Full refund (including fees)  
**Timeframe**: Immediate (funds never left user's account technically, but if collected, refunded within 3-5 days)

**Important**: Message is intentionally vague to avoid "tipping off" if actual sanctions concern

---

#### **Error: Compliance Hold Timeout**

**Trigger**: Manual review not completed within 4-hour RTO  
**User Message**:
```
⚠️ Review Timeout

We were unable to complete the compliance
review within our 4-hour commitment.

For your protection, this transfer has
been automatically canceled.

Refund: $103.25 to Chase ****1234
Expected: 3-5 business days

You can try again or contact support
for assistance.

[Try Again]  [Contact Support]
```

**State Transition**: UNDER_REVIEW → FAILED → REFUNDED  
**Refund**: Full refund (including fees)

---

### 8.3 Payout Failures

#### **Error: Invalid Recipient Account**

**Trigger**: Recipient bank rejects transfer (wrong account number, name mismatch)  
**User Message**:
```
❌ Payout Failed

Banco Popular rejected the transfer to
María Rodríguez.

Reason: Account information mismatch

Possible issues:
• Account number incorrect
• Name doesn't match bank records
• Account closed

Your money is safe. We're processing
a full refund.

Refund: $103.25
Expected: 3-5 business days

[Update Recipient Info]  [Get Help]
```

**State Transition**: PAYOUT → FAILED → REFUNDED  
**Refund**: Full refund (including fees - we didn't deliver, so we don't keep service fee)  
**Follow-Up**: System flags recipient for validation

---

#### **Error: Recipient Account Frozen**

**Trigger**: Recipient's bank account is frozen/restricted  
**User Message**:
```
❌ Payout Failed

Banco Popular could not deposit funds
because the recipient's account is
restricted.

This is outside VentoVault's control.
The recipient should contact their bank.

We're processing your refund now.

Refund: $103.25
Expected: 3-5 business days

[Contact Support]  [Learn More]
```

**State Transition**: PAYOUT → FAILED → REFUNDED  
**Refund**: Full refund  
**Recipient Notification**: "Incoming transfer failed - please contact your bank"

---

#### **Error: All Payout Partners Failed**

**Trigger**: Primary and backup payout partners both unavailable  
**User Message**:
```
❌ Payout Unavailable

We're experiencing technical issues with
all payout partners in the Dominican
Republic.

Your money is safe and held securely.

We're actively working to restore service.
Expected resolution: 2-4 hours

You can wait for restoration or request
a refund.

[Wait for Restoration]  [Request Refund]
```

**State Transition**: PAYOUT → On hold (not FAILED yet)  
**Options**:
- Wait: Transaction held in PAYOUT state until partner restores
- Refund: User can request, transitions to REFUNDED

---

### 8.4 System/Network Errors

#### **Error: Partner API Timeout**

**Trigger**: Partner doesn't respond within timeout window  
**User Message**:
```
⏳ Temporary Delay

We're experiencing a brief delay with
one of our partners.

Your transaction is safe and will
automatically retry.

Current status: [Stage Name]
Next retry: In 2 minutes

No action needed from you.

[View Details]  [Get Help]
```

**Behavior**: Exponential backoff retry (3 attempts)  
**If All Retries Fail**: Escalate to next fallback option or FAILED

---

#### **Error: Quote Expired During Processing**

**Trigger**: User took too long between stages  
**User Message**:
```
⏰ Quote Expired

The exchange rate quote expired while
you were reviewing.

This ensures you always get current
rates and fees.

Please get a new quote to continue.

[Get New Quote]
```

**State Transition**: QUOTED → Back to S3 (amount entry)  
**Refund**: None (no funds collected yet)

---

#### **Error: Rate Moved Beyond Acceptable Range**

**Trigger**: Exchange rate moved >1% during processing (rare)  
**User Message**:
```
⚠️ Rate Changed Significantly

The exchange rate moved more than 1%
while processing your transfer.

Original rate: 58.50 DOP/USD
Current rate: 57.90 DOP/USD

For your protection, we've canceled
this transfer.

Refund: $103.25
Expected: 3-5 business days

You can get a new quote with the
current rate.

[Get New Quote]  [Learn More]
```

**State Transition**: CONVERSION → FAILED → REFUNDED  
**Refund**: Full refund  
**Justification**: Protects user from >1% slippage

---

### 8.5 User Errors

#### **Error: Exceeded Daily Limit**

**Trigger**: User attempts transfer that would exceed daily limit  
**User Message** (appears on S3 - amount entry):
```
⚠️ Daily Limit Reached

This transfer would exceed your daily
limit.

Daily limit: $500
Sent today: $350
Available: $150

You can:
• Send $150 now
• Wait until tomorrow
• Upgrade to Verified (L30) for
  higher limits

[Send $150]  [Upgrade Account]
```

**Prevention**: Validation before quote generation  
**State**: Never transitions to FUNDED

---

#### **Error: Exceeded Monthly Limit**

**Similar to daily limit**

**User Message**:
```
⚠️ Monthly Limit Reached

This transfer would exceed your monthly
limit.

Monthly limit: $1,500 (Basic tier)
Sent this month: $1,350
Available: $150

Limit resets: Feb 15, 2026

[Send $150]  [Upgrade Account]
```

---

#### **Error: New Recipient Cooling-Off Period**

**Trigger**: User attempts to send to newly added recipient before cooling-off expires  
**User Message**:
```
⏰ New Recipient Waiting Period

For security, new recipients have a
24-hour waiting period before you can
send money.

María Rodríguez was added: Feb 6, 11:30 AM
Available to send: Feb 7, 11:30 AM

Time remaining: 16 hours, 22 minutes

This protects you from account takeover
and fraud.

[Understood]  [Learn More]
```

**Prevention**: Recipient shown as "New - Available in X hours" in selection list  
**Override**: None for L20, reduced to 6 hours for L30+

---

### 8.6 Error Notification Matrix

| Error Type | Push Notification | Email | SMS | In-App Banner |
|------------|-------------------|-------|-----|---------------|
| Funding Failed | Yes | Yes | No | Yes |
| Compliance Rejection | Yes | Yes | No | Yes |
| Payout Failed | Yes | Yes | No | Yes |
| Partner Timeout | No | No | No | Yes (if >30min) |
| Rate Change Cancel | Yes | Yes | No | Yes |
| Limit Exceeded | No | No | No | Yes (inline) |
| Refund Processed | Yes | Yes | No | Yes |

---

## 9. NOTIFICATIONS & STATUS UPDATES

### 9.1 Notification Triggers & Templates

#### **Notification: Transfer Initiated**

**Trigger**: State transitions to FUNDING_PENDING (after Consent Bridge)  
**Channels**: Email only (not push - too early)  
**Timing**: Immediate

**Email Template**:
```
Subject: Your transfer to María Rodríguez has been initiated

Hi John,

You just initiated a transfer to María Rodríguez
in the Dominican Republic.

Amount: $100.00
Total cost: $103.25
They'll receive: 5,798 DOP

Your transfer is being processed. We'll notify
you when it's complete (typically 24-48 hours
for bank transfers).

Track your transfer: [Link]

Transaction ID: TXN-20260206-A7F9B2E1

Questions? Reply to this email or visit our
Help Center.

— VentoVault Team
```

---

#### **Notification: Funding Collected**

**Trigger**: State transitions to FUNDED (ACH cleared)  
**Channels**: Push + Email  
**Timing**: Immediate

**Push Notification**:
```
✓ Funds collected
Your $100 transfer to María is now processing
```

**Email Template**:
```
Subject: Funds collected - Transfer to María processing

Hi John,

Good news! We've collected $103.25 from your
Chase account ending in 1234.

Your transfer is now being processed. María
should receive 5,798 DOP within the next 4 hours.

Current status: Converting currency

Track your transfer: [Link]

— VentoVault Team
```

---

#### **Notification: Compliance Review**

**Trigger**: State transitions to UNDER_REVIEW  
**Channels**: Push + Email  
**Timing**: Immediate

**Push Notification**:
```
⚠️ Transfer under review
Routine security check (typically 30 min)
```

**Email Template**:
```
Subject: Your transfer is under security review

Hi John,

Your transfer to María Rodríguez requires
additional verification. This is a routine
security check.

What happens next:
Our compliance team will review this within
30 minutes. You'll be notified as soon as
it's approved.

Why this happens:
We perform random checks to ensure the
security of all transfers on our platform.

Estimated completion: 30 minutes
You'll receive an update by [Time]

Track your transfer: [Link]

— VentoVault Team
```

---

#### **Notification: Compliance Approved**

**Trigger**: State transitions from UNDER_REVIEW to APPROVED  
**Channels**: Push + Email  
**Timing**: Immediate

**Push Notification**:
```
✓ Review complete
Your transfer to María is back on track
```

**Email Template**:
```
Subject: Transfer approved and processing

Hi John,

Your transfer to María has been approved
and is now processing normally.

María should receive 5,798 DOP within the
next 2-3 hours.

Current status: Converting currency

Track your transfer: [Link]

— VentoVault Team
```

---

#### **Notification: Transfer Complete (Sender)**

**Trigger**: State transitions to COMPLETED  
**Channels**: Push + Email  
**Timing**: Immediate

**Push Notification**:
```
🎉 Transfer complete!
María received 5,798 DOP
```

**Email Template**:
```
Subject: ✓ Transfer complete - María received 5,798 DOP

Hi John,

Your transfer is complete!

María Rodríguez received:
5,798 DOP

Total time: 27 hours, 14 minutes
Completed: Feb 7, 2026 at 3:42 PM EST

Receipt:
You sent: $100.00
Fees: $3.25
Total paid: $103.25
Exchange rate: 58.50 DOP/USD

View full receipt: [Link]
Download PDF: [Link]

Want to send again? [One-tap repeat link]

— VentoVault Team
```

---

#### **Notification: Transfer Complete (Recipient)**

**Trigger**: State transitions to COMPLETED  
**Channels**: Push + Email + SMS (optional)  
**Timing**: Immediate

**Push Notification**:
```
💰 Money received!
John Doe sent you 5,798 DOP
```

**Email Template**:
```
Subject: You received 5,798 DOP from John Doe

Hi María,

You just received money!

Amount: 5,798 DOP
From: John Doe
Deposited to: Banco Popular ****4567

You should see this in your bank account
now or within the next few hours.

View receipt: [Link]

Not expecting this? Contact support immediately.

— VentoVault Team
```

**SMS** (if enabled):
```
VentoVault: You received 5,798 DOP from
John Doe. Check your Banco Popular account.
View receipt: [short link]
```

---

#### **Notification: Transfer Failed**

**Trigger**: State transitions to FAILED  
**Channels**: Push + Email  
**Timing**: Immediate

**Push Notification**:
```
❌ Transfer failed
Refund in progress - Full details in email
```

**Email Template**:
```
Subject: Transfer failed - Refund in progress

Hi John,

We're sorry, but your transfer to María
Rodríguez could not be completed.

Reason: [Specific reason - e.g., "Recipient's
bank account information could not be verified"]

What happens now:
We're processing a full refund to your
Chase account ending in 1234.

Refund amount: $103.25
Expected arrival: 3-5 business days

Transaction ID: TXN-20260206-A7F9B2E1

What you can do:
[If fixable - e.g., wrong account number]
• Update recipient information and try again

[Contact Support]

— VentoVault Team
```

---

#### **Notification: Refund Processed**

**Trigger**: State transitions to REFUNDED  
**Channels**: Push + Email  
**Timing**: Immediate

**Push Notification**:
```
↩️ Refund processed
$103.25 sent to your bank account
```

**Email Template**:
```
Subject: Refund processed - $103.25

Hi John,

Your refund has been processed.

Amount refunded: $103.25
Sent to: Chase ****1234
Expected arrival: 3-5 business days

Original transaction: TXN-20260206-A7F9B2E1

View refund receipt: [Link]

Questions? Reply to this email.

— VentoVault Team
```

---

### 9.2 In-App Status Update Intervals

**Real-Time States** (WebSocket updates):
- CONVERSION (visual progress)
- SETTLEMENT (blockchain confirmations)
- PAYOUT (when actively processing)

**Polling States** (every 30 seconds):
- FUNDING_PENDING (ACH status from Stripe)
- UNDER_REVIEW (compliance decision)

**Manual Refresh**:
- COMPLETED (cached, no need for updates)
- FAILED/REFUNDED (terminal states)

---

### 9.3 Notification Preferences (User Settings)

**Granular Controls**:
```
┌─────────────────────────────────────┐
│  Notification Preferences           │
│                                     │
│  Transfer Updates                   │
│  ☑ Initiated                        │
│  ☑ Completed                        │
│  ☑ Failed                           │
│  ☐ Every status change (verbose)    │
│                                     │
│  Compliance                         │
│  ☑ Review required                  │
│  ☑ Review complete                  │
│                                     │
│  Funding                            │
│  ☑ Funds collected                  │
│  ☐ ACH initiated                    │
│                                     │
│  Receiving                          │
│  ☑ Someone sent me money            │
│  ☑ Money deposited to my account    │
│                                     │
│  Channels                           │
│  ☑ Push notifications               │
│  ☑ Email                            │
│  ☐ SMS (+$0.05/message)             │
│                                     │
│  [Save Preferences]                 │
└─────────────────────────────────────┘
```

**Mandatory Notifications** (cannot be disabled):
- Transfer complete
- Transfer failed
- Refund processed
- Security alerts

---

## 10. RECEIPTS & DOCUMENTATION

### 10.1 Receipt Structure

#### **Full Transaction Receipt**

**Header Section**:
```
┌────────────────────────────────────────┐
│  VentoVault                            │
│  Transfer Receipt                      │
│                                        │
│  February 7, 2026                      │
│  Transaction ID: TXN-20260206-A7F9B2E1│
└────────────────────────────────────────┘
```

**Parties Section**:
```
┌────────────────────────────────────────┐
│  FROM                                  │
│  John Doe                              │
│  Chase Checking ****1234               │
│  New York, USA                         │
│                                        │
│  TO                                    │
│  María Rodríguez                       │
│  Banco Popular ****4567 (Savings)      │
│  Santo Domingo, Dominican Republic     │
└────────────────────────────────────────┘
```

**Amount Section**:
```
┌────────────────────────────────────────┐
│  AMOUNT                                │
│                                        │
│  You sent                  $100.00     │
│  VentoVault fee            $2.50       │
│  Network costs             $0.75       │
│  ──────────────────────────────────    │
│  Total paid                $103.25     │
│                                        │
│  Exchange rate             58.50       │
│  (Mid-market: 58.60 - 0.17% markup)    │
│                                        │
│  María received            5,798 DOP   │
└────────────────────────────────────────┘
```

**Quote Verification Section**:
```
┌────────────────────────────────────────┐
│  QUOTE VERIFICATION                    │
│                                        │
│  Quoted rate:           58.50          │
│  Executed rate:         58.50          │
│  Quote matched:         ✓ Yes          │
│                                        │
│  Buffer charged:        $0.00          │
│  Buffer returned:       $0.00          │
└────────────────────────────────────────┘
```

**Timeline Section**:
```
┌────────────────────────────────────────┐
│  TIMELINE                              │
│                                        │
│  Feb 6, 11:15 AM  Transfer initiated   │
│  Feb 6, 11:16 AM  Compliance cleared   │
│  Feb 6, 11:17 AM  Funding authorized   │
│  Feb 7, 1:23 PM   Funds collected      │
│  Feb 7, 1:28 PM   Currency converted   │
│  Feb 7, 1:31 PM   Settlement confirmed │
│  Feb 7, 2:15 PM   Payout initiated     │
│  Feb 7, 3:42 PM   Payout completed ✓   │
│                                        │
│  Total time: 27 hours, 14 minutes      │
└────────────────────────────────────────┘
```

**Confirmations Section**:
```
┌────────────────────────────────────────┐
│  CONFIRMATIONS                         │
│                                        │
│  Stripe Collection ID:                 │
│  ABC-123-XYZ-789                       │
│                                        │
│  Settlement TX:                        │
│  0x7a3f2e1d4b9c8f3a2e1d4b9c...       │
│                                        │
│  Banco Popular Payout ID:              │
│  BP-2026-02-07-8291                    │
└────────────────────────────────────────┘
```

**Partner Chain Section**:
```
┌────────────────────────────────────────┐
│  PARTNER CHAIN                         │
│                                        │
│  Collection:                           │
│  Stripe (New York, USA)                │
│                                        │
│  Settlement:                           │
│  VentoVault Partner Network            │
│  (USDC via Ethereum)                   │
│                                        │
│  Payout:                               │
│  Banco Popular (Santo Domingo, DR)     │
└────────────────────────────────────────┘
```

**Footer**:
```
┌────────────────────────────────────────┐
│  Questions about this transfer?        │
│  support@ventovault.com                │
│  +1 (555) 123-4567                     │
│                                        │
│  Terms of Service: ventovault.com/tos  │
│  Privacy Policy: ventovault.com/privacy│
└────────────────────────────────────────┘
```

---

### 10.2 Receipt Variants

#### **Sender Receipt** (Full details as above)

#### **Recipient Receipt** (Simplified):
```
┌────────────────────────────────────────┐
│  VentoVault - Money Received           │
│                                        │
│  FROM: John Doe                        │
│  AMOUNT: 5,798 DOP                     │
│  DATE: February 7, 2026, 3:42 PM       │
│                                        │
│  Deposited to:                         │
│  Banco Popular ****4567                │
│                                        │
│  Sender paid: $100.00 USD              │
│  Exchange rate: 58.50 DOP/USD          │
│                                        │
│  Transaction ID: TXN-20260206-A7F9B2E1│
└────────────────────────────────────────┘
```

#### **Refund Receipt**:
```
┌────────────────────────────────────────┐
│  VentoVault - Refund Receipt           │
│                                        │
│  Original Transaction:                 │
│  TXN-20260206-A7F9B2E1                │
│                                        │
│  Original amount:      $103.25         │
│  Costs incurred:       $0.75           │
│  ───────────────────────────────────   │
│  Refunded:             $102.50         │
│                                        │
│  Refunded to:                          │
│  Chase Checking ****1234               │
│                                        │
│  Refund date: Feb 7, 2026              │
│  Expected arrival: Feb 10-12, 2026     │
│                                        │
│  Reason for refund:                    │
│  Payout failed - Recipient account     │
│  information could not be verified     │
└────────────────────────────────────────┘
```

---

### 10.3 Export Formats

**Available Formats**:
- PDF (styled, print-ready)
- CSV (for accounting/spreadsheets)
- JSON (for API integrations)

**PDF Generation**:
- Full branded receipt with VentoVault logo
- QR code linking to online verification
- Printable (single page)

**CSV Format**:
```csv
Transaction ID,Date,Sender,Recipient,Amount Sent,Currency Sent,Amount Received,Currency Received,Exchange Rate,Fees,Total Cost,Status,Collection ID,Payout ID
TXN-20260206-A7F9B2E1,2026-02-07,John Doe,María Rodríguez,100.00,USD,5798.00,DOP,58.50,3.25,103.25,COMPLETED,ABC-123-XYZ,BP-2026-02-07-8291
```

**JSON Format**:
```json
{
  "transactionId": "TXN-20260206-A7F9B2E1",
  "date": "2026-02-07T15:42:00Z",
  "sender": {
    "name": "John Doe",
    "account": "Chase ****1234",
    "location": "New York, USA"
  },
  "recipient": {
    "name": "María Rodríguez",
    "account": "Banco Popular ****4567",
    "location": "Santo Domingo, DR"
  },
  "amounts": {
    "sent": { "value": 100.00, "currency": "USD" },
    "received": { "value": 5798.00, "currency": "DOP" },
    "fees": { "vv": 2.50, "network": 0.75, "total": 3.25 },
    "totalCost": 103.25
  },
  "exchange": {
    "rate": 58.50,
    "midMarket": 58.60,
    "markup": 0.17
  },
  "timeline": [
    { "stage": "initiated", "timestamp": "2026-02-06T16:15:00Z" },
    { "stage": "funded", "timestamp": "2026-02-07T18:23:00Z" },
    { "stage": "completed", "timestamp": "2026-02-07T20:42:00Z" }
  ],
  "confirmations": {
    "collection": "ABC-123-XYZ-789",
    "settlement": "0x7a3f2e1d4b9c8f3a2e1d4b9c...",
    "payout": "BP-2026-02-07-8291"
  },
  "status": "COMPLETED"
}
```

---

## 11. ANIMATION SEQUENCES FOR DEMO

### 11.1 Hero Demo Animation (Homepage)

**Purpose**: Show the complete flow in 60 seconds  
**Target**: New visitors who want to understand VentoVault

**Sequence**:

**0:00-0:05** - Setup
```
[Split screen]
Left: John (New York)
Right: María (Dominican Republic)

Text overlay: "John needs to send María $100"
```

**0:05-0:10** - Traditional Way (Problem)
```
[Animation: Money icon bouncing through 5 institutions]
Bank → Correspondent Bank → SWIFT → Correspondent Bank → Bank

Text overlay: "Traditional way: $9 in fees, 3-5 days"
Strike through with red X
```

**0:10-0:15** - VentoVault Way (Solution)
```
[Animation: Direct line with 3 clean nodes]
Bank → VentoVault → Bank

Text overlay: "VentoVault: $3.25, 1-2 days"
Green checkmark
```

**0:15-0:20** - User Action
```
[Screen recording style animation]
John opens app → Enters $100 → Sees quote

Quote display:
"You pay: $103.25
María receives: 5,798 DOP"
```

**0:20-0:30** - Under the Hood (Fast)
```
[Simplified 8-stage animation]
Icons lighting up in sequence:

✓ Quote locked
✓ Authorized
✓ Funded
✓ Compliance check
✓ Converting...
✓ Settling...
✓ Paying out...
✓ Complete!
```

**0:30-0:35** - The Difference
```
[Split screen comparison]

Traditional:          VentoVault:
$9 fees              $3.25 fees
Hidden spread        Transparent
3-5 days             1-2 days
No tracking          Live tracking
```

**0:35-0:40** - María Receives
```
[Phone notification animation]
María's phone lights up:
"You received 5,798 DOP from John"

Bank app shows deposit
```

**0:40-0:45** - Receipt
```
[Receipt animation]
Clean, transparent receipt displays:
- All fees itemized
- Mid-market rate shown
- Confirmation IDs
- Timeline

Text: "Complete transparency"
```

**0:45-0:50** - Safety
```
[Icon animation showing security layers]

🔒 Bank-grade security
🏦 Regulated partners
📊 Full audit trail
✓ Compliance certified
```

**0:50-0:55** - Scale
```
[World map with glowing corridors]
US → Latin America
US → Philippines
US → India

Text: "Growing to serve the world"
```

**0:55-1:00** - CTA
```
[App mockup with prominent button]

"Join the waitlist"
www.ventovault.com
```

---

### 11.2 Detailed "Under the Hood" Animation

**Purpose**: Educational deep-dive for transparency  
**Target**: Users who click "View detailed logs" during transaction tracking  
**Duration**: 2-3 minutes

**Stage 1: Intent Creation (0:00-0:10)**
```
[Animation sequence]

1. User types amount: "$100"
2. System queries APIs:
   - Bloomberg rate feed
   - Partner cost APIs
   - Risk calculation engine

3. Visual: Data streams converging

4. Quote appears:
   "Rate: 58.50
    Fee: $2.50
    Network: $0.75
    Total: $103.25"

5. Timer starts: "45 seconds"

Text overlay: "Quote locked with cryptographic signature"
```

**Stage 2: Approval Gate (0:10-0:25)**
```
[Three-checkpoint animation]

Checkpoint 1: User
├─ User clicks "Accept"
├─ Green checkmark appears
└─ Timestamp logged

Checkpoint 2: Partner
├─ API call to Stripe
├─ Loading spinner (2s)
├─ "Compliance check: PASSED"
├─ Token icon appears: "AUTH-XYZ-123"
└─ Green checkmark

Checkpoint 3: Consent Bridge
├─ Modal appears with consent text
├─ User scrolls and checks box
├─ "Confirm Authorization" button
├─ Green checkmark
└─ Text: "Liability transferred to partners"

Safety Delay:
├─ Clock icon: "30 seconds"
├─ Progress bar fills
└─ Text: "External control gate - cannot be bypassed"
```

**Stage 3: Funding (0:25-0:35)**
```
[Bank animation]

If ACH:
├─ Stripe → ACH Network → User's Bank
├─ Calendar icon: "1-2 days"
├─ Status updates:
│   Day 1: "Pending"
│   Day 2: "Cleared ✓"
└─ Checkmark: "$100 collected"

If Debit:
├─ Card icon → Stripe
├─ "Processing... 30 seconds"
└─ Checkmark: "$100 collected"

Text: "Funds held securely by Stripe (licensed)"
```

**Stage 4: Compliance (0:35-0:50)**
```
[Two-layer security animation]

Layer 1: VentoVault Safety Net
┌────────────────────────────┐
│ Scanning...                │
│                            │
│ John Doe                   │
│ ├─ OFAC: Clear ✓           │
│ ├─ Magnitsky: Clear ✓      │
│ └─ PEP: Clear ✓            │
│                            │
│ María Rodríguez            │
│ ├─ OFAC: Clear ✓           │
│ └─ Sanctions: Clear ✓      │
│                            │
│ Fraud patterns: None ✓     │
│                            │
│ LAYER 1: PASSED (0.3s)     │
└────────────────────────────┘

[Arrow down]

Layer 2: Stripe Regulatory
┌────────────────────────────┐
│ Independent check...       │
│                            │
│ Running Stripe compliance  │
│ engine...                  │
│                            │
│ APPROVED ✓                 │
│                            │
│ LAYER 2: PASSED (3.2s)     │
└────────────────────────────┘

Text: "Double-validation ensures safety"
```

**Stage 5: Conversion (0:50-1:05)**
```
[Currency flow animation]

$100 USD
   ↓
[Conversion Partner Icon]
   ↓
100 USDC

Visual: Dollar bills transforming into digital coins

Blockchain transaction:
├─ TX: 0x7a3f2e1...
├─ Confirmations: ▓▓▓░░░ 3/12
└─ Complete ✓

Cost comparison box:
┌──────────────────────────┐
│ SWIFT wire: $35          │
│ VentoVault: $0.10        │
│ YOU SAVE: $34.90         │
└──────────────────────────┘
```

**Stage 6: Settlement (1:05-1:20)**
```
[Network visualization]

US Wallet              DR Wallet
   100 USDC   →→→→→   100 USDC
              
              ↓
      [Blockchain Network]
              ↓
      [Confirmation Nodes]
      Node 1 ✓
      Node 2 ✓
      Node 3 ✓
      ...
      Node 12 ✓

Time elapsed: 12 minutes

Text: "Atomic settlement - no volume matching needed"
```

**Stage 7: Payout (1:20-1:35)**
```
[Final mile animation]

100 USDC
   ↓
[DR Exchange]
   ↓
5,798 DOP
   ↓
[Banco Popular Logo]
   ↓
[Bank Transfer Icon]
   ↓
[María's Account] ✓

Notification animation:
María's phone lights up
"You received 5,798 DOP from John"

Text: "Payout complete - funds in María's account"
```

**Stage 8: Reconciliation (1:35-1:50)**
```
[Checklist animation]

Reconciliation:
✓ Stripe collection confirmed
✓ Compliance logs sealed
✓ Conversion verified
✓ Settlement confirmed
✓ Payout confirmed

Quote verification:
┌──────────────────────────┐
│ Quoted:    58.50         │
│ Executed:  58.50         │
│ Match:     ✓ YES         │
│                          │
│ Buffer returned: $0.00   │
└──────────────────────────┘

[Receipt appears]
Final receipt with all details

Text: "Immutable audit trail generated"
```

**Conclusion (1:50-2:00)**
```
[Summary stats]

Total time: 27 hours, 14 minutes
(mostly ACH wait)

John paid: $103.25
María received: 5,798 DOP
Cost: $3.25 (3.15%)

vs Traditional: $9 (9%)

Savings: $5.75

[CTA]
"Want to save on your next transfer?"
[Sign Up Button]
```

---

### 11.3 Mode Comparison Animation (Send-Exact vs Receive-Exact)

**Purpose**: Explain the two modes clearly  
**Duration**: 45 seconds

**0:00-0:05** - Setup
```
Text: "Two ways to send money"
Split screen preview
```

**0:05-0:20** - Send-Exact Demo
```
[Left side animation]

Title: "Send Exactly"
Subtitle: "You control what you pay"

User enters: $100
System shows: "They receive ≈ 5,798 DOP"

[Visual: Amount locked on left, approximate on right]

Rate changes slightly during processing:
Before: 58.50 → After: 58.45

Result:
You paid: $100.00 (fixed)
They received: 5,793 DOP (slight change)

Text: "Simple, predictable cost"
```

**0:20-0:35** - Receive-Exact Demo
```
[Right side animation]

Title: "They Receive Exactly"
Subtitle: "Guarantee exact amount received"

User enters: 5,850 DOP
System shows: "You pay ≈ $102.50 (with buffer)"

[Visual: Amount locked on right, approximate on left]

Rate changes during processing:
Before: 58.50 → After: 58.70 (favorable)

Result:
They received: 5,850 DOP (guaranteed)
You paid: $102.50 authorized
Actual cost: $100.25
Buffer returned: $2.25 ✓

Text: "Perfect for bills, guaranteed delivery"
```

**0:35-0:45** - Comparison
```
[Side by side]

Send-Exact:              Receive-Exact:
✓ Simple                 ✓ Guaranteed amount
✓ Lower cost             ✓ No surprises
✓ Available to all       ✓ Perfect for bills
○ Slight variance        ○ Small buffer
                         ○ L30+ only
```

---

### 11.4 Competitive Comparison Animation

**Purpose**: Show VentoVault advantage  
**Duration**: 30 seconds

**Animation**:
```
[Three columns racing animation]

Starting line:
John sends $100 to María in DR

Column 1: Western Union
├─ Fees: $8
├─ Hidden spread: $2
├─ Total: $10
├─ María receives: $90 worth
└─ Time: 1 hour (fast but expensive)

Column 2: Wise
├─ Fees: $4
├─ Spread: $2
├─ Total: $6
├─ María receives: $94 worth
└─ Time: 1-2 days (balanced corridors only)

Column 3: VentoVault
├─ Fees: $2.50
├─ Network: $0.75
├─ Total: $3.25
├─ María receives: $96.75 worth
└─ Time: 1-2 days

[VentoVault column wins]

SAVINGS: $5.75 per $100
On $1,000/year: $57.50 saved!
```

---

## 12. CONCLUSION & IMPLEMENTATION NOTES

### 12.1 Development Priorities

**Phase 1 MVP** (Must-Have):
1. User registration & verification (L20, L30 tiers)
2. Recipient management (add, validate, edit)
3. Send-Exact flow (S1-S9)
4. ACH funding only
5. Basic state machine (13 states)
6. Email notifications
7. PDF receipts
8. One corridor: US → DR

**Phase 1.5 Enhancements**:
1. Debit card funding (L30+)
2. Receive-Exact mode (L30+)
3. Push notifications
4. In-app messaging
5. "Under the hood" animation
6. Second corridor: US → MX

**Phase 2 Advanced**:
1. Business tier (L40)
2. API access
3. Batch transfers
4. Multiple corridors
5. Mobile apps (iOS/Android)
6. Advanced analytics dashboard

---

### 12.2 Technical Stack Recommendations

**Frontend**:
- Framework: React (web), React Native (mobile)
- State Management: Redux or Zustand
- Real-time: WebSocket (socket.io) for live updates
- Animation: Framer Motion or Lottie
- Charts: Recharts or D3.js

**Backend**:
- API: Node.js + Express or Python + FastAPI
- Database: PostgreSQL (main), Redis (cache)
- State Machine: XState or custom
- Queue: Bull or RabbitMQ for async processing
- Webhooks: For partner integrations

**Infrastructure**:
- Hosting: AWS or GCP
- CDN: CloudFlare
- Monitoring: Datadog or New Relic
- Logging: ELK Stack
- Security: SOC 2 compliant from day 1

---

### 12.3 Key Metrics to Track

**User Metrics**:
- Registration → L20 verification rate
- L20 → L30 upgrade rate
- Recipient addition rate
- Transaction completion rate
- Repeat sender rate (7-day, 30-day)

**Transaction Metrics**:
- Quote → Funding conversion
- Funding → Completion rate (payout success)
- Average time in each state
- Exception rate (UNDER_REVIEW, FAILED)
- Refund rate

**Financial Metrics**:
- Average transaction size
- Revenue per transaction
- Cost per transaction (by corridor)
- Gross margin
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)

**Operational Metrics**:
- Support tickets per 100 transactions
- Average resolution time
- Partner uptime (per corridor)
- Compliance review time
- System uptime

---

### 12.4 Success Criteria (Phase 1)

**Before General Availability**:
- ✓ 100 consecutive error-free transactions
- ✓ Payout success rate > 97%
- ✓ Compliance review time < 30 minutes average
- ✓ Support tickets < 1% of transaction volume
- ✓ All-in cost at least 2% cheaper than Wise
- ✓ System uptime > 99.5%
- ✓ Zero security incidents

---

## END OF DOCUMENT

**Document Version**: 1.0  
**Last Updated**: 2026-02-06  
**Maintained By**: Product & Engineering Teams  
**Next Review**: Upon feature additions or major updates
