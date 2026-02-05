# VentoVault Wireframe - Quick Start Guide

## ⚡ Get Running in 5 Minutes

### Step 1: Install Dependencies (1 min)

```bash
cd ventovault-wireframe
npm install
```

### Step 2: Set Up Firebase (2 min)

1. Go to https://console.firebase.google.com/
2. Click "Add project" → Enter name → Continue
3. Disable Google Analytics (optional) → Create project
4. Click "Build" → "Authentication" → "Get started" → "Email/Password" → Enable → Save
5. Click "Build" → "Firestore Database" → "Create database" → Start in test mode → Next → Enable
6. Click ⚙️ (Settings) → Project settings → Scroll down → Click "</>" (Web app)
7. Register app → Copy the config object

### Step 3: Add Your Config (1 min)

Open `src/firebase/config.ts` and replace with your values:

```typescript
const firebaseConfig = {
  apiKey: "AIza...",              // ← Your API key here
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123:web:abc123"
};
```

### Step 4: Run the App! (1 min)

```bash
npm run dev
```

🎉 **Done!** Open http://localhost:3000

---

## 🎯 Quick Test

1. Click "Sign up" → Create account
2. You'll see the dashboard with $1,000 demo balance
3. Click "Send Money" → Try the full flow
4. Check "Activity" to see transaction history
5. Click "Settings" to see your profile

---

## 🚀 What You Get

✅ Full authentication (signup/login)
✅ Beautiful dashboard with balance
✅ Complete send money flow (3 steps)
✅ Receive money / payment requests
✅ Transaction history with filters
✅ Notifications center
✅ Settings page
✅ Mobile responsive
✅ Smooth animations
✅ Modern Robinhood/Duolingo design

---

## 💡 Tips

- **Demo Mode**: Use "Fill Demo Credentials" on login page (after creating demo@ventovault.com account)
- **Mobile View**: Resize browser or open DevTools (F12) → Device toolbar
- **Test Flows**: Try sending to different countries (DR, Mexico, Guatemala)
- **Animations**: Watch the smooth slide-up animations on page load
- **Error States**: Try logging in with wrong password to see error handling

---

## 🐛 Troubleshooting

**"Failed to log in"**
- Make sure you created an account first via Sign up
- Check your Firebase config is correct
- Ensure Email/Password auth is enabled in Firebase

**"Module not found"**
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then `npm install`

**"Build failed"**
- Check Node.js version: `node --version` (should be 16+)
- Update npm: `npm install -g npm@latest`

**Firebase errors**
- Verify your Firebase project is active
- Check Firestore is in "test mode" (open rules, allow read/write)
- Make sure Authentication → Email/Password is enabled

---

## 📚 Next Steps

1. **Customize Design**: Edit `tailwind.config.js` for colors
2. **Add Features**: Check `README.md` for architecture
3. **Deploy**: See README for Firebase Hosting, Vercel, or Netlify deployment

---

**Need Help?** Check the full `README.md` for detailed documentation.
