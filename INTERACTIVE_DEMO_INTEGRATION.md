# Interactive Demo Mode Integration Guide

## ✅ What's Different Now

The demo mode is now **fully interactive and reactive**:
- ✅ Callouts trigger based on **real user actions**
- ✅ Shows **actual data** from your app (balance, amounts, names)
- ✅ Integrates with **real component interactions**
- ✅ Updates automatically as users navigate

## 🔧 How to Integrate

### 1. Dashboard Example - Balance Card on Mount

When the dashboard loads, show a callout on the balance card with REAL balance data:

```tsx
// In src/pages/Dashboard.tsx
import { useDemoCallout } from '../hooks/useDemoCallout';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  // Trigger callout when dashboard data loads
  useDemoCallout({
    target: '[data-tour="balance-card"]',
    title: '💰 Real-Time Balance',
    content: `
      <p><strong>🖥️ Front-End:</strong> Balance updates via WebSocket connection.</p>
      <p><strong>🔧 Behind:</strong> Continuous sanctions screening (OFAC, UN, EU lists) + behavioral analytics.</p>
      <p><strong>🛡️ Security:</strong> JWT tokens (30-min expiry), IP geolocation matching, device fingerprinting.</p>
      <p><strong>⚠️ Control-Not-Custody:</strong> VentoVault NEVER has custody. We see intent, not funds.</p>
    `,
    placement: 'bottom',
    trigger: 'mount', // Auto-show when component mounts
    delay: 1000, // Wait 1 second after load
    data: {
      'Current Balance': dashboardData?.balance || '$0.00',
      'User Email': currentUser?.email || 'N/A',
    },
  });

  // Add data-tour attribute to your balance card
  return (
    <Layout>
      <div data-tour="balance-card" className="grid...">
        {/* Your balance display */}
      </div>
    </Layout>
  );
}
```

### 2. Send Button - Trigger on Click

Show callout when user clicks "Send Money" explaining stablecoin advantages:

```tsx
// In src/pages/Dashboard.tsx or wherever you have the Send button
import { useDemoCallout } from '../hooks/useDemoCallout';

export default function Dashboard() {
  const navigate = useNavigate();

  const sendButtonCallout = useDemoCallout({
    target: '[data-tour="send-button"]',
    title: '📤 Starting Transfer - Stablecoin Advantage',
    content: `
      <p><strong>💰 Cost:</strong> 1.7% + $1.50 vs 2.4% traditional banking.</p>
      <p><strong>⚡ Speed:</strong> <2 hours vs 1-2 days (SWIFT).</p>
      <p><strong>🔧 Process:</strong> Step 1 - Intent captured with 128-bit UUID for idempotency.</p>
      <p><strong>🔍 Pre-Screening:</strong> Sanctions lists (85%+ fuzzy matching), velocity checks.</p>
    `,
    placement: 'bottom',
    trigger: 'manual', // Only show when explicitly triggered
  });

  const handleSendClick = () => {
    // Show callout before navigating
    sendButtonCallout.trigger();

    // Navigate after a moment
    setTimeout(() => navigate('/send'), 2000);
  };

  return (
    <button
      data-tour="send-button"
      onClick={handleSendClick}
      className="btn btn-primary"
    >
      Send Money
    </button>
  );
}
```

### 3. Send Page - Amount Input with Real Values

Show callout when user enters amount, using their ACTUAL entered value:

```tsx
// In src/pages/Send.tsx
import { useDemoCallout } from '../hooks/useDemoCallout';

export default function Send() {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');

  const amountCallout = useDemoCallout({
    target: '[data-tour="amount-input"]',
    title: '💵 Amount Validation',
    content: `
      <p><strong>🖥️ Front-End:</strong> Min/max validation, real-time formatting.</p>
      <p><strong>🔧 Behind:</strong> Intent logged with UUID. Pre-screening: sanctions, velocity checks.</p>
      <p><strong>💰 Cost Calculation:</strong> 1.7% variable + $1.50 gas = Total cost.</p>
    `,
    placement: 'right',
    trigger: 'manual',
  });

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);

    // Trigger callout with real data when user enters amount
    if (value && parseFloat(value) > 0) {
      const numAmount = parseFloat(value);
      const cost = numAmount * 0.017 + 1.50;
      const revenue = numAmount * 0.025;
      const margin = revenue - cost;

      amountCallout.trigger({
        'Amount': `$${numAmount.toFixed(2)}`,
        'Total Cost': `$${cost.toFixed(2)} (${(cost/numAmount*100).toFixed(2)}%)`,
        'Revenue (2.5%)': `$${revenue.toFixed(2)}`,
        'VV Margin': `$${margin.toFixed(2)}`,
      });
    }
  };

  return (
    <input
      data-tour="amount-input"
      type="number"
      value={amount}
      onChange={handleAmountChange}
      placeholder="0.00"
      className="..."
    />
  );
}
```

### 4. Consent Bridge - Critical Legal Moment

Show dramatic callout on the consent button:

```tsx
// In your Send flow confirmation step
const consentCallout = useDemoCallout({
  target: '[data-tour="consent-button"]',
  title: '⚖️ THE CONSENT BRIDGE (Legal Firewall)',
  content: `
    <p><strong>🔥 CRITICAL:</strong> This is the legal disengagement point.</p>
    <p><strong>⚖️ FinCEN FIN-2019-G001:</strong> User independently authorizes partners (NOT VentoVault).</p>
    <p><strong>🛡️ Protection:</strong> We're software/orchestration, not money transmitter. No MTL required.</p>
    <p><strong>📝 What happens:</strong> Timestamp + IP logged. Consent transmitted to ALL 5 partners.</p>
  `,
  placement: 'top',
  trigger: 'mount',
  delay: 500,
});

return (
  <button
    data-tour="consent-button"
    onClick={handleConfirm}
    className="btn btn-primary"
  >
    Authorize Transfer
  </button>
);
```

### 5. Transaction List - Show Audit Trail

Auto-show when viewing transactions:

```tsx
// In src/pages/Transactions.tsx
useDemoCallout({
  target: '[data-tour="transaction-list"]',
  title: '📊 Complete Audit Trail',
  content: `
    <p><strong>🔧 10-Step Process:</strong> Intent → Quote → Consent → Funding → Compliance → Settlement → Payout → Reconciliation → Truth → Revenue</p>
    <p><strong>📋 ISO 20022:</strong> All messages compliant (pacs.008, pacs.002).</p>
    <p><strong>🌍 FATF Travel Rule:</strong> Sender/recipient data transmitted per Rec 16.</p>
    <p><strong>🗄️ Retention:</strong> Immutable audit trail, 5-year retention for regulatory compliance.</p>
  `,
  placement: 'bottom',
  trigger: 'mount',
  delay: 800,
});

return (
  <div data-tour="transaction-list" className="space-y-4">
    {/* Your transaction list */}
  </div>
);
```

## 🎯 Pattern Summary

### Auto-Show on Mount
```tsx
useDemoCallout({
  target: '[data-tour="element"]',
  title: 'Title',
  content: 'HTML content...',
  trigger: 'mount', // Shows automatically
  delay: 1000, // Optional delay
});
```

### Trigger on User Action
```tsx
const { trigger } = useDemoCallout({
  target: '[data-tour="element"]',
  title: 'Title',
  content: 'HTML content...',
  trigger: 'manual', // Only when triggered
});

const handleClick = () => {
  trigger({ 'Real Data': actualValue }); // Pass real-time data
};
```

### Show Real Data
```tsx
useDemoCallout({
  // ... other config
  data: {
    'User Email': currentUser?.email,
    'Amount': `$${amount}`,
    'Cost': `$${calculateCost(amount)}`,
  },
});
```

## 🚀 Testing

1. Start app: `npm run dev`
2. Turn ON demo mode (toggle in bottom-right)
3. Interact with the app normally
4. Callouts appear automatically based on your actions!

## 📝 Benefits

✅ **Contextual**: Shows info at the exact moment it's relevant
✅ **Data-Driven**: Uses actual app data, not dummy values
✅ **Non-Intrusive**: Doesn't block interaction, users can continue
✅ **Auto-Updates**: New callout replaces old one as users navigate
✅ **Investor-Ready**: Explains stablecoin advantage, compliance, margins

## 🎨 Styling

Callouts automatically:
- Highlight target element with blue glow
- Dim rest of page (60% overlay)
- Position bubble with arrow pointing at element
- Scroll element into view
- Animate entrance/exit

No additional styling needed!

---

**Your demo mode is now fully interactive!** Add the hooks to your components and it will react to real user behavior. 🎯
