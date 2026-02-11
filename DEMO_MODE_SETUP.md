# Demo Mode Setup Guide

## ✅ What's Already Done

I've created an **animated guided tour system** that:
- Highlights UI elements with a spotlight effect
- Shows animated callout bubbles pointing at elements
- Allows step-by-step navigation with Next/Previous buttons
- Automatically scrolls elements into view
- Has progress dots showing current step

## 🎯 What You Need to Do

Add `data-tour` attributes to your existing components so the tour knows what to highlight.

### Dashboard Page (`src/pages/Dashboard.tsx`)

#### 1. Add to Balance/Stats Card
Find the KPI cards section (around line 284) and add `data-tour="balance-card"`:

```tsx
// BEFORE
<motion.div
  variants={staggerContainer}
  initial="hidden"
  animate="show"
  className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 mb-5"
>

// AFTER
<motion.div
  data-tour="balance-card"  // ← ADD THIS
  variants={staggerContainer}
  initial="hidden"
  animate="show"
  className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 mb-5"
>
```

#### 2. Add to Send Money Button
In the EmptyDashboard component (around line 100), add `data-tour="send-button"`:

```tsx
// BEFORE
<motion.button
  onClick={() => navigate('/send')}
  className="btn btn-secondary px-4 py-2.5 text-[13px] inline-flex items-center gap-2"
  whileHover={{ scale: 1.01 }}
  whileTap={{ scale: 0.97 }}
>

// AFTER
<motion.button
  data-tour="send-button"  // ← ADD THIS
  onClick={() => navigate('/send')}
  className="btn btn-secondary px-4 py-2.5 text-[13px] inline-flex items-center gap-2"
  whileHover={{ scale: 1.01 }}
  whileTap={{ scale: 0.97 }}
>
```

#### 3. Add to Transaction List
Find the activity/spending panel (around line 312) and add `data-tour="transactions"`:

```tsx
// BEFORE
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, delay: 0.25, ease: smoothEase }}
  className="vv-panel"
>

// AFTER
<motion.div
  data-tour="transactions"  // ← ADD THIS
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, delay: 0.25, ease: smoothEase }}
  className="vv-panel"
>
```

### Send Page (`src/pages/Send.tsx`)

You'll need to add these attributes to the Send page form elements:

```tsx
data-tour="amount-input"       // Amount input field
data-tour="recipient-input"    // Recipient selection/input
data-tour="exchange-rate"      // FX rate display
data-tour="fee-breakdown"      // Fee breakdown section
data-tour="consent-button"     // Final confirmation button
```

**Example for amount input:**
```tsx
<input
  data-tour="amount-input"  // ← ADD THIS
  type="number"
  placeholder="0.00"
  // ... rest of props
/>
```

## 🚀 Testing the Demo Mode

1. **Start your app:**
   ```bash
   npm run dev
   ```

2. **Click the "Demo Mode" toggle** in the bottom-right corner

3. **Navigate pages** - the tour automatically shows callouts for Dashboard and Send pages

4. **Click "Next"** to progress through steps, highlighting each element

5. **See the magic:**
   - Element gets highlighted with blue glow and spotlight
   - Rest of page dims (50% black overlay)
   - Callout bubble points at the element with an arrow
   - Shows: Front-end, Behind-the-scenes, Regulatory details
   - Progress dots at bottom

## 🎨 Customizing Tour Content

Edit `src/components/common/GuidedTour.tsx` to change callout content:

```typescript
const TOUR_STEPS: Record<string, TourStep[]> = {
  '/dashboard': [
    {
      target: '[data-tour="balance-card"]',  // CSS selector
      title: '💰 Balance Overview',           // Callout title
      content: 'Your explanation here...',    // Callout content
      placement: 'bottom',                    // Where bubble appears
      highlight: true,                        // Whether to spotlight
    },
    // ... more steps
  ],
};
```

## ✨ Features

### Current Functionality
- ✅ Spotlight highlight with dimmed background
- ✅ Animated callout bubbles with arrows
- ✅ Next/Previous navigation
- ✅ Progress indicator (Step 1 of 5)
- ✅ Progress dots visualization
- ✅ Smooth animations
- ✅ Auto-scroll to elements
- ✅ Close button (X)
- ✅ Finish button on last step

### Placement Options
- `'top'` - Bubble appears above element, arrow points down
- `'bottom'` - Bubble appears below element, arrow points up
- `'left'` - Bubble appears left of element, arrow points right
- `'right'` - Bubble appears right of element, arrow points left

## 🎯 Tour Flow Example

**Dashboard Tour (3 steps):**
1. **Balance Card** → Explains real-time sync, sanctions screening
2. **Send Button** → Explains stablecoin advantage (1.7% + $1.50 vs 2.4%)
3. **Transactions** → Explains audit trail, ISO 20022 compliance

**Send Flow Tour (5 steps):**
1. **Amount Input** → Intent capture, 128-bit UUID
2. **Recipient** → Fuzzy matching, OFAC screening
3. **Exchange Rate** → Real-time FX, on-ramp costs
4. **Fee Breakdown** → Transparent pricing (6 components)
5. **Consent Button** → The legal firewall (FinCEN compliance)

## 📝 Adding More Tours

To add tours for other pages, edit `GuidedTour.tsx`:

```typescript
const TOUR_STEPS: Record<string, TourStep[]> = {
  '/dashboard': [ /* existing steps */ ],
  '/send': [ /* existing steps */ ],

  // Add new page:
  '/transactions': [
    {
      target: '[data-tour="filter-bar"]',
      title: '🔍 Filter Transactions',
      content: 'Filter by date, status, amount...',
      placement: 'bottom',
      highlight: true,
    },
  ],
};
```

## 🐛 Troubleshooting

**Tour doesn't start:**
- Make sure you clicked the "Demo Mode" toggle button
- Check console for errors
- Verify page has tour steps defined in `TOUR_STEPS`

**Element not highlighting:**
- Check that `data-tour` attribute matches the CSS selector in `target`
- Make sure element exists in DOM when tour starts
- Try adding a small delay if element loads asynchronously

**Callout positioned wrong:**
- Try different `placement` values (top/bottom/left/right)
- Element might be too close to screen edge
- Adjust positioning logic in `GuidedTour.tsx` if needed

## 🎬 Recording Demo for Investors

1. Open app in full-screen browser
2. Turn ON demo mode
3. Screen record with OBS/Loom while clicking through
4. Narrate each step explaining the stablecoin advantage
5. Share video async for investor outreach

---

**Your demo mode is ready - just add the `data-tour` attributes!** 🚀
