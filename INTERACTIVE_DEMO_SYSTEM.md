# Interactive Demo System

## Overview

A **presentation-ready interactive demo** that shows investors the operational framework behind VentoVault's clean interface.

**Four synchronized components:**
1. **Interactive Spotlight** - Highlights current UI element with glowing ring
2. **Stage Progress Tracker** - 8-stage lifecycle progress at top
3. **Floating Callout Bubbles** - Draggable hi-tech cards with operational details
4. **Inspector Panel** (optional) - Side panel with technical reference

## Component Details

### 1. Interactive Spotlight (InteractiveHighlighter)

**What it does:**
- Dims the page with 20% overlay (subtle, doesn't block)
- Highlights active element with animated blue glowing ring
- Shows floating label identifying the element
- Pulsing animation draws attention
- Connecting line from element to callout

**Design:**
- Modern, clean, professional
- Smooth 500ms transitions
- Blue accent color (red for Consent Bridge)
- Non-intrusive visual cues

---

### 2. Stage Progress Tracker (StageProgressTracker)

**Location:** Top center of screen

**What it shows:**
- 8 numbered circles representing transaction lifecycle:
  1. Intent → 2. Quote → 3. Consent → 4. Fund → 5. Comply → 6. Settle → 7. Payout → 8. Receipt
- **Active stage** glows blue (Stage 3 glows red for Consent Bridge)
- **Completed stages** show green checkmark
- **Upcoming stages** shown in gray
- Connecting lines show flow progression

**Design:**
- Frosted glass background (slate-900/95 with backdrop blur)
- Monospace font for stage names
- Clean, technical aesthetic
- Fixed position, always visible

---

### 3. Floating Callout Bubbles (FloatingCallout) ⭐ **PRIMARY DISPLAY**

**The centerpiece of the demo system.**

**Design Philosophy:**
- Hi-tech "bubble" aesthetic
- Square with rounded corners (12px radius)
- Semi-transparent frosted glass background
- Courier/monospace font (technical feel)
- **DRAGGABLE** - click and drag to reposition
- Smart positioning - avoids blocking highlighted elements

**Visual Features:**
- **Frosted glass effect** - backdrop-blur with 85% opacity
- **Color-coded borders** based on section type:
  - Blue: General info
  - Red: Critical legal moments (Consent Bridge)
  - Cyan: Technical procedures
  - Emerald: Financial data
- **Glowing shadows** - subtle outer glow matching border color
- **Animated pulse dot** in header showing active status
- **Navigation controls** - Previous/Next buttons, section dots

**Content Structure:**
- **Header**: Stage identifier (e.g., "STAGE 2") + section counter
- **Label**: Section name in monospace (e.g., "Route Selection Logic")
- **Content**: Detailed operational text, multi-line, scrollable
- **Footer**: Navigation between sections (if multiple sections)

**Smart Positioning Logic:**
- Detects highlighted element position
- If element is on right half → callout appears on left
- If element is on left half → callout appears on right (avoiding Inspector panel)
- If element is in bottom half → callout appears near top
- If element is in top half → callout appears below element
- User can override by dragging

**Draggable Functionality:**
- Click and hold header/border to drag
- Cursor changes to grabbing icon
- Slight scale-up (105%) when dragging
- Smooth position updates
- Content area remains selectable (can't accidentally drag when selecting text)

**Width:** Fixed at 420px (readable but not overwhelming)

---

### 4. Inspector Panel (OperationalInspector) - OPTIONAL

**Purpose:** Side reference panel (not primary display)

**Toggle:** Click "INSPECTOR" button to show/hide

**Design:**
- Dark theme (slate-900)
- Right side panel (396px width)
- Shows all sections at once (no pagination)
- Technical reference for deep dives

**When to use:**
- Optional secondary display
- Users who want all info visible at once
- Technical deep-dive during Q&A

---

## How to Use for Presentations

### Setup (30 seconds)
1. Navigate to VentoVault app
2. Click **"INSPECTOR"** button (bottom-right corner)
3. Navigate to `/send` page
4. Demo system activates automatically

### Flow (2-3 minutes)

**Stage 1: Recipient Selection**
- **Spotlight** highlights recipient card
- **Progress** shows Stage 1 (Intent)
- **Callout** appears explaining:
  - Control-Not-Custody validation
  - Risk controls (fraud prevention)
  - Evidence captured (recipient_id, timestamps)
- Navigate through sections with NEXT button
- Select a recipient to proceed

**Stage 2: Amount Entry**
- **Spotlight** moves to amount input field
- **Progress** shows Stage 2 (Quote)
- **Callout** updates with new content:
  - Route selection logic (Compliance → Reliability → Cost)
  - Live cost breakdown: "$1,000 × 1.7% + $1.50 = $18.50 (vs $24 traditional = 23% savings)"
  - Regulatory disclosure requirements (FinCEN FIN-2019-G001)
  - Quote validity windows
- Type $1,000 and proceed to review

**Stage 3: THE CONSENT BRIDGE** 🔥
- **Spotlight** highlights authorization checkbox (RED GLOW)
- **Progress** shows Stage 3 in RED (critical moment)
- **Callout** displays THE LEGAL MOAT:
  - Orchestration Termination
  - Liability Transfer to named partners
  - 30-second mandatory delay proving independence
  - Why this eliminates MTL requirements = millions saved
  - Evidence captured and transmitted to all partners
- **This is the climax of the demo**
- Check box and complete transfer

**Stages 4-8: Execution**
- **Progress** advances through remaining stages
- **Callout** shows comprehensive execution details:
  - Stage 4: Funding through regulated Collection Partner
  - Stage 5: Double-validation (Layer 1 + Layer 2 compliance)
  - Stage 6: Stablecoin conversion and settlement
  - Stage 7: Payout through regulated endpoint
  - Stage 8: Reconciliation, receipts, idempotency
- **Callout** also shows:
  - Custody trail (who holds funds at each step)
  - Failure branches (what happens when things go wrong)
  - Rollback responsibilities

---

## What Makes This Presentation-Ready

### Visual Impact
- **Spotlight** creates focus - investors' eyes go exactly where you want
- **Progress tracker** provides narrative structure - clear beginning/middle/end
- **Floating callouts** feel high-tech and modern - not boring slides
- **Smooth animations** maintain professional polish

### Interactive Engagement
- **Manual navigation** - you control pacing, can pause for questions
- **Draggable callouts** - reposition for screen sharing or different displays
- **Section navigation** - dive deeper on specific points during Q&A
- **Live UI** - shows working product, not mockups

### Technical Depth
- **Operational procedures** from actual system documentation
- **Regulatory citations** (FinCEN, FATF, ISO 20022)
- **Cost breakdowns** with real math
- **Legal architecture** showing the moat (Consent Bridge)
- **Failure modes** demonstrating system maturity

### Presentation Advantages
1. **Not a PPT** - Shows actual working product
2. **Not auto-play** - You control flow, adapt to questions
3. **Not blocking** - Can still use the app if needed
4. **Not static** - Dynamic, interactive, engaging
5. **Not shallow** - Deep operational detail when needed

---

## Technical Architecture

### Context Provider: OperationalInspectorContext
- Manages demo state (isOpen, currentData)
- Detects user location (URL + DOM state)
- Maps location to operational stage
- Provides stage data to all components

### Stage Detection Logic
```typescript
/dashboard → System Overview
/send + .vv-choice-card → Stage 1 (Intent Creation)
/send + input[inputMode="decimal"] → Stage 2 (Quoting)
/send + input[type="checkbox"] → Stage 3 (THE CONSENT BRIDGE)
/send + success message → Stages 4-8 (Execution)
```

### Data Structure
Each stage has multiple sections:
```typescript
{
  stage: "STAGE 2",
  title: "Quoting & Route Selection",
  sections: [
    {
      label: "Route Selection Logic",
      content: "Priority: Compliance → Reliability → Cost...",
      type: "technical"
    },
    {
      label: "Cost Breakdown",
      content: "$1,000 × 1.7% + $1.50 = $18.50...",
      type: "financial"
    },
    // ... more sections
  ]
}
```

### Component Coordination
All components read from same context:
- `isOpen` → Show/hide all components together
- `currentData` → All display same stage info
- Location changes → All update synchronously

---

## Content Sources

All operational details derived from:
- **moneyTrail.ts**: 8-step custody trail, failure branches, evidence schema
- **Operational Manual**: Constitutional posture, legal architecture, risk controls
- **FinCEN FIN-2019-G001**: Consent Bridge legal requirements
- **ISO 20022, FATF Rec 16**: Compliance standards

---

## For Investors

After a 2-3 minute walkthrough, investors will understand:

1. ✅ **VentoVault is orchestration layer** - NOT bank, transmitter, custodian
2. ✅ **The Consent Bridge is the legal moat** - No MTL = millions saved
3. ✅ **Stablecoin cost advantage** - 30% cheaper than traditional
4. ✅ **Double-validation compliance** - Layer 1 + Layer 2 screening
5. ✅ **8-step audit trail** - ISO 20022, FATF, FinCEN built-in
6. ✅ **Custody transparency** - VentoVault never holds funds
7. ✅ **Failure architecture** - Every failure point has rollback owner
8. ✅ **App embodies comprehensive system** - Not just UI, but operational framework

The demo proves that VentoVault is **product-first, regulation-ready, cost-competitive**.
