# ByondWork - Sports & Wellness Platform

B2B2C platform for corporate professionals to organize sports & wellness activities.

## Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend:** Firebase (Auth, Firestore, Cloud Functions)
- **State:** Zustand
- **Data Fetching:** TanStack Query

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.local.example` to `.env.local` and add your Firebase credentials

3. Run development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # Reusable UI components
├── lib/             # Utilities and configurations
│   ├── firebase/    # Firebase setup
│   └── stores/      # Zustand state stores
└── types/           # TypeScript types
```

## MVP Features

- Authentication (Email + Google)
- User Profiles
- Event Creation & Discovery
- Community Formation
- Corporate Admin Dashboard
- Leaderboards
- Notifications
