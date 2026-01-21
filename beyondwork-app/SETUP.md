# ByondWork - Setup Instructions

## ✅ Development Progress (Sprint 1-3 Complete!)

### Completed Features:
1. ✅ Project structure with Next.js 14 + TypeScript + Tailwind
2. ✅ Firebase configuration (Auth, Firestore, Storage, Messaging)
3. ✅ Authentication system (Email + Google OAuth)
4. ✅ User profile management
5. ✅ Events system (Create, Browse, Join)
6. ✅ Protected routes & state management (Zustand)

---

## 🚀 Quick Start

### 1. Firebase Setup (Required before running app)

**Create Firebase Project:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Name it "beyondwork" (or your choice)
4. Disable Google Analytics (optional for MVP)

**Enable Authentication:**
1. In Firebase Console → Authentication → Get Started
2. Enable "Email/Password" provider
3. Enable "Google" provider (add your email as test user)

**Create Firestore Database:**
1. In Firebase Console → Firestore Database → Create Database
2. Start in **Test Mode** (for development)
3. Choose location: `asia-south1` (Mumbai) or closest

**Get Firebase Config:**
1. Project Settings → General → Your apps
2. Click Web app icon (</>) → Register app
3. Copy the config values

### 2. Environment Setup

Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Firebase credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
beyondwork-app/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── page.tsx                 # Landing page
│   │   ├── login/page.tsx           # Login page
│   │   ├── signup/page.tsx          # Signup page
│   │   ├── dashboard/page.tsx       # User dashboard
│   │   ├── profile/setup/page.tsx   # Profile completion
│   │   ├── events/                  # Events module
│   │   │   ├── page.tsx            # Browse events
│   │   │   ├── create/page.tsx     # Create event
│   │   │   └── [id]/page.tsx       # Event details
│   │   └── api/events/             # API routes (MVP)
│   │       ├── create/route.ts     # Create event API
│   │       └── join/route.ts       # Join event API
│   ├── components/
│   │   ├── auth/                    # Auth components
│   │   │   ├── AuthProvider.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupForm.tsx
│   │   └── events/                  # Event components
│   │       ├── CreateEventForm.tsx
│   │       ├── EventCard.tsx
│   │       └── EventFilters.tsx
│   ├── lib/
│   │   ├── firebase/                # Firebase setup
│   │   │   ├── config.ts           # Firebase init
│   │   │   ├── auth.ts             # Auth functions
│   │   │   └── firestore.ts        # DB functions
│   │   └── stores/                  # State management
│   │       └── auth-store.ts       # Auth state (Zustand)
│   └── types/
│       └── index.ts                 # TypeScript types
```

---

## 🧪 Testing the App

### 1. Test Authentication
1. Go to http://localhost:3000
2. Click "Sign Up"
3. Create account with email/password OR Google
4. Complete profile (name, company, city, interests)
5. Should redirect to dashboard

### 2. Test Events
1. From dashboard, click "Browse events"
2. Click "Create Event"
3. Fill form and submit
4. Browse events list
5. Click an event to view details
6. Click "Join Event"

---

## 🔧 Troubleshooting

### Firebase initialization error:
- Check `.env.local` has correct values
- Restart dev server after changing .env

### "Cannot find module" errors:
- Run `npm install` again
- Delete `node_modules` and `.next` folders
- Run `npm install` and `npm run dev`

### Firestore permission denied:
- Ensure Firestore is in **Test Mode**
- Or deploy security rules (coming in Sprint 4)

---

## 📋 Next Steps (Remaining MVP Features)

### Sprint 4: Communities
- Create/join communities
- Community member list
- City-based communities

### Sprint 5: Corporate Admin
- Corporate admin dashboard
- Internal-only events
- Employee management
- Company leaderboards

### Sprint 6: RBAC & Security
- Firestore security rules
- Role-based access control
- Firebase custom claims

### Sprint 7: Leaderboards & Notifications
- Global & corporate leaderboards
- Event notifications
- Firebase Cloud Messaging

---

## ⚠️ Important Notes

1. **MVP Scope**: This is MVP code. Some features use simplified auth (API routes instead of Cloud Functions). Will be upgraded post-MVP.

2. **Security**: Currently using Firestore Test Mode. Deploy security rules before production.

3. **Cloud Functions**: API routes in `/api/*` will be migrated to Firebase Cloud Functions for production.

4. **Database Indexes**: Firestore may require composite indexes for complex queries. Firebase will auto-suggest these.

---

## 🎯 Current Status

**Working:**
- ✅ Full authentication flow
- ✅ User profiles
- ✅ Event creation
- ✅ Event browsing with filters
- ✅ Event joining
- ✅ Protected routes

**TODO (Next Sprints):**
- Communities
- Corporate admin dashboard
- Security rules
- Leaderboards
- Notifications

---

## 💡 Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

---

**Ready to continue development!** The foundation is solid. Next: Communities module.
