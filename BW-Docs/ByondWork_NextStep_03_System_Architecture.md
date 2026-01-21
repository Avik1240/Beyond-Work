
# ByondWork – System Architecture Diagram (MVP)

## Architecture Philosophy
- Serverless-first
- Low cost / near-zero infra
- Horizontally scalable
- Frontend-led architecture
- Clear separation of concerns

---

## High-Level Architecture Overview

```
┌──────────────────────────┐
│        User (Web)        │
│  Desktop / Mobile (PWA)  │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│     Next.js Frontend     │
│  (Vercel – App Router)   │
│                          │
│  - Pages & Routing       │
│  - UI Components         │
│  - State Management      │
│  - Auth Guards           │
└────────────┬─────────────┘
             │
             ▼
┌───────────────────────────────────────────┐
│           Firebase Services                │
│                                           │
│  ┌─────────────────────────────────────┐ │
│  │ Firebase Authentication              │ │
│  │ - Email / Google Auth                │ │
│  │ - Role-based Claims                  │ │
│  └─────────────────────────────────────┘ │
│                                           │
│  ┌─────────────────────────────────────┐ │
│  │ Firestore Database                  │ │
│  │ - Users                             │ │
│  │ - Events                            │ │
│  │ - Facilities                       │ │
│  │ - Communities                      │ │
│  │ - Bookings                         │ │
│  │ - Leaderboards                     │ │
│  └─────────────────────────────────────┘ │
│                                           │
│  ┌─────────────────────────────────────┐ │
│  │ Cloud Functions (Serverless Logic)  │ │
│  │ - Event creation rules              │ │
│  │ - Cost splitting                   │ │
│  │ - Role validation                  │ │
│  │ - Notifications trigger            │ │
│  └─────────────────────────────────────┘ │
│                                           │
│  ┌─────────────────────────────────────┐ │
│  │ Firebase Cloud Messaging (FCM)      │ │
│  │ - Push notifications               │ │
│  └─────────────────────────────────────┘ │
│                                           │
│  ┌─────────────────────────────────────┐ │
│  │ Firebase Storage                    │ │
│  │ - Profile images                   │ │
│  │ - Event images                     │ │
│  └─────────────────────────────────────┘ │
└───────────────────────────────────────────┘
```

---

## Component-wise Breakdown

### 1. Client Layer (User)
- Access via browser or PWA
- No native mobile app in MVP
- Responsive-first UI

### 2. Frontend Layer (Next.js)
- Auth UI
- Event discovery
- Community pages
- Leaderboards
- Corporate admin dashboard

### 3. Authentication Layer
- Firebase Authentication
- Role-based access control

### 4. Backend Data Layer
- Firestore NoSQL database
- Real-time updates

### 5. Business Logic Layer
- Firebase Cloud Functions
- Secure server-side logic

### 6. Notification Layer
- Firebase Cloud Messaging

### 7. Media Storage
- Firebase Storage

---

## Data Flow Example (Event Creation)
1. User creates event
2. Frontend validates
3. Cloud Function processes
4. Firestore writes
5. Notifications triggered

---

## Security Model
- Firestore security rules
- Firebase role claims

---

## Future Extensions
- Payments
- LinkedIn OAuth
- Mobile apps
- AI recommendations
