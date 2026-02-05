# VentoVault Wireframe App

A modern, functional wireframe application for VentoVault - the remittance orchestration platform. Built with React, TypeScript, Tailwind CSS, and Firebase.

## 🎨 Design Philosophy

**Robinhood meets Duolingo** - Clean, modern, and attractive interface with smooth animations and intuitive user flows.

## ✨ Features

- 🔐 **Authentication** - Sign up, login, and secure logout
- 💰 **Dashboard** - Balance overview, quick actions, recent transactions
- 📤 **Send Money** - Multi-step flow with recipient selection, amount entry, and confirmation
- 📥 **Receive Money** - Payment requests and QR code generation
- 📊 **Transaction History** - Filterable transaction list with status indicators
- 🔔 **Notifications** - Real-time alerts for account activity
- ⚙️ **Settings** - Account management and preferences

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- A Firebase project (free tier works fine)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable Authentication → Email/Password
4. Enable Firestore Database
5. Get your config from Project Settings → General → Your apps → Web app

6. Update `src/firebase/config.ts` with your Firebase credentials:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### 4. Demo Credentials

For quick testing, use the "Fill Demo Credentials" button on the login page, or create a new account via signup.

Demo: `demo@ventovault.com` / `demo123` (if you create this user first)

## 📁 Project Structure

```
ventovault-wireframe/
├── src/
│   ├── components/
│   │   ├── auth/          # Authentication components
│   │   ├── dashboard/     # Dashboard-specific components
│   │   ├── send/          # Send money flow components
│   │   ├── receive/       # Receive money components
│   │   ├── transactions/  # Transaction list components
│   │   ├── notifications/ # Notification components
│   │   ├── settings/      # Settings components
│   │   └── common/        # Shared components (Layout, etc.)
│   ├── contexts/
│   │   └── AuthContext.tsx # Authentication state management
│   ├── firebase/
│   │   └── config.ts      # Firebase configuration
│   ├── pages/
│   │   ├── Login.tsx      # Login page
│   │   ├── Signup.tsx     # Signup page
│   │   ├── Dashboard.tsx  # Main dashboard
│   │   ├── Send.tsx       # Send money flow
│   │   ├── Receive.tsx    # Receive/request money
│   │   ├── Transactions.tsx # Transaction history
│   │   ├── Notifications.tsx # Notifications center
│   │   └── Settings.tsx   # Settings page
│   ├── types/
│   │   └── index.ts       # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Main app component with routing
│   ├── main.tsx           # App entry point
│   └── index.css          # Global styles + Tailwind
├── public/                # Static assets
├── index.html             # HTML entry point
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── tailwind.config.js     # Tailwind CSS config
├── postcss.config.js      # PostCSS config
└── vite.config.ts         # Vite config
```

## 🎯 User Flows

### Authentication Flow
1. User arrives at app → redirected to login
2. Can sign up with email/password
3. After auth → redirected to dashboard
4. Logout returns to login page

### Send Money Flow
1. Click "Send Money" from dashboard
2. **Step 1**: Enter recipient details + select country
3. **Step 2**: Enter amount + view exchange rate + add note
4. **Step 3**: Review details + confirm
5. **Step 4**: Success confirmation with receipt

### Receive Money Flow
1. Share payment link or generate QR code
2. Create payment request with specific amount
3. View pending and completed requests

## 🎨 Design System

### Colors
- **Primary**: Blue (`#0ea5e9`) - Main brand color
- **Success**: Green (`#10b981`) - Positive actions
- **Warning**: Yellow (`#f59e0b`) - Alerts
- **Error**: Red (`#ef4444`) - Errors and sent money

### Typography
- Font: Inter (loaded from Google Fonts)
- Sizes: Responsive scale from sm to 4xl

### Components
- **Buttons**: Rounded corners (xl), smooth transitions
- **Cards**: Soft shadows, 2xl border radius
- **Inputs**: Clean, focus states with ring

## 🔒 Security Notes

This is a **wireframe/prototype** application. For production:

- [ ] Add proper form validation
- [ ] Implement rate limiting
- [ ] Add CSRF protection
- [ ] Use environment variables for all secrets
- [ ] Implement proper error handling
- [ ] Add security headers
- [ ] Enable Firebase security rules
- [ ] Add two-factor authentication
- [ ] Implement session management
- [ ] Add audit logging

## 🏗️ Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder ready for deployment.

### Deploy to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy
```

## 📱 Mobile Responsive

The app is fully responsive with a mobile-first approach:
- Mobile: Bottom navigation bar
- Desktop: Top navigation with all items visible
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

## 🐛 Known Limitations

- Mock data for transactions and notifications
- Firebase authentication only (no social logins yet)
- Exchange rates are hardcoded (not live)
- QR code is placeholder
- No actual money movement (demo only)
- Limited error handling

## 🚢 Next Steps for Production

1. **Backend Integration**
   - Connect to real payment APIs
   - Implement actual money movement logic
   - Add real-time exchange rate fetching

2. **Enhanced Security**
   - KYC/AML compliance
   - Transaction limits and monitoring
   - Fraud detection

3. **Additional Features**
   - Transaction receipts (PDF)
   - Recurring payments
   - Multi-currency support
   - Push notifications
   - In-app chat support

4. **Performance**
   - Code splitting
   - Image optimization
   - API response caching
   - Service worker for offline support

## 📄 License

This is a prototype/wireframe application for VentoVault.

## 🤝 Contributing

This is a demonstration project. For actual VentoVault development, contact the team.

---

**Built with ❤️ using React, TypeScript, Tailwind CSS, and Firebase**
