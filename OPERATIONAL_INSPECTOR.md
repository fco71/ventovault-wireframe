# Operational Inspector

## Concept

A **technical deep-dive panel** that shows investors what's happening under the hood at each step of the transaction lifecycle.

This is NOT a UI demo. This is NOT auto-play. This is a contextual technical inspector - like developer tools - that reveals the operational framework as you navigate.

## Design Philosophy

**Modern, 2026 Standards:**
- Clean, technical aesthetic (dark theme, monospace fonts)
- No emojis or retro elements
- No blocking modals or overlays
- Side panel design (like Chrome DevTools)
- Contextual updates based on user location
- Manual navigation only - user controls the flow

**What It Shows:**
- Operational procedures at each stage
- Legal architecture (Control-Not-Custody, Consent Bridge)
- Cost breakdowns and stablecoin math
- Regulatory compliance (FinCEN, FATF, ISO 20022)
- Custody positions (who holds funds when)
- Risk points and controls
- Evidence captured (IDs, timestamps, proofs)
- Failure branches and rollback responsibilities

## How It Works

1. **User navigates the app normally** - no automation
2. **Inspector panel detects location** - dashboard, recipient selection, amount entry, review, success
3. **Panel updates contextually** - shows operational details for current stage
4. **Color-coded sections**:
   - **Info** (slate): General operational information
   - **Critical** (red): Legal moments like THE CONSENT BRIDGE
   - **Technical** (blue): System architecture and procedures
   - **Financial** (emerald): Cost breakdowns and economics

## Usage

1. Click **"INSPECTOR"** button in bottom-right corner
2. Panel slides in from right side (396px width)
3. Navigate through the send flow manually
4. Watch panel update with operational details for each stage
5. Click **"HIDE"** to close panel

## Technical Architecture

### Components

- **OperationalInspectorContext.tsx**: React context managing panel state and location detection
- **OperationalInspector.tsx**: Side panel UI component (dark theme, clean design)
- **OperationalInspectorToggle.tsx**: Toggle button (modern, minimal)

### Data Structure

```typescript
interface OperationalData {
  stage: string;           // "STAGE 1", "STAGE 2", "THE CONSENT BRIDGE"
  title: string;           // Human-readable stage name
  sections: {
    label: string;         // Section header
    content: string;       // Technical explanation (supports multiline)
    type?: 'info' | 'critical' | 'technical' | 'financial';
  }[];
}
```

### Location Detection

The system maps URLs and DOM state to operational stages:

- `/dashboard` → System Overview
- `/send` + recipient cards visible → Stage 1: Intent Creation
- `/send` + amount input visible → Stage 2: Quoting & Route Selection
- `/send` + checkbox visible → Stage 3: THE CONSENT BRIDGE
- `/send` + success message → Stages 4-8: Execution & Settlement

## Content Sources

All operational details derived from:
- **moneyTrail.ts**: 8-step custody trail, failure branches, evidence schema
- **Operational Manual**: Constitutional posture, legal architecture, risk controls
- **FinCEN FIN-2019-G001**: Consent Bridge legal requirements
- **ISO 20022, FATF Rec 16**: Compliance standards

## What Makes This Different

**Previous failed approaches:**
- ❌ Auto-play demos that click buttons
- ❌ Blocking modals that cover the screen
- ❌ Static slideshows with Next/Previous
- ❌ Emoji-heavy, retro styling
- ❌ Requires manual integration with data-tour attributes

**New approach:**
- ✅ Manual navigation - user controls flow
- ✅ Non-blocking side panel
- ✅ Contextual automatic updates based on location
- ✅ Clean, modern, technical aesthetic
- ✅ Zero integration required - works automatically
- ✅ Shows comprehensive operational framework
- ✅ Reveals the system that the UI embodies

## For Investors

This tool demonstrates that VentoVault isn't just a working UI - it's the **digital embodiment of a comprehensive remittance system** with:

1. **Legal Architecture**: Control-Not-Custody eliminates MTL requirements (saves millions)
2. **The Consent Bridge**: Legal moat that isolates firm from money transmission risk
3. **Stablecoin Cost Advantage**: 30% cheaper than traditional rails
4. **Double-Validation**: Layer 1 + Layer 2 compliance screening
5. **8-Step Audit Trail**: ISO 20022, FATF, FinCEN compliance built-in
6. **Custody Transparency**: Clear money trail showing VentoVault never holds funds
7. **Failure Architecture**: Every failure point has defined rollback owner

The panel reveals the operational sophistication behind the clean interface.
