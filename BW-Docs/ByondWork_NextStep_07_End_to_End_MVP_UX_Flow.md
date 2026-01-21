
# ByondWork – End-to-End MVP UX Flow

This document defines the **complete user experience flow** across all roles in the MVP.
It acts as a **single source of truth** for frontend, product, and business teams.

---

## Roles Covered
- Guest User
- Registered User (Professional)
- Corporate Employee
- Corporate Admin (HR)
- Super Admin (Platform)

---

## 1. Guest User Flow (Pre-login)

### Entry Points
- Landing Page
- Shared Event Link
- Corporate Invite Link

### Actions
1. View platform value proposition
2. Browse sample events (read-only)
3. Click **Sign Up / Login**

**CTA Goal:** Convert to registered user

---

## 2. User Onboarding Flow

### Step 1: Authentication
- Email / Google Sign-in

### Step 2: Profile Setup (Mandatory)
- Name
- Company
- City
- Interests (sports/wellness)

### Step 3: Role Detection
- If email domain matches corporate → auto-tag as employee
- Else → regular user

---

## 3. Regular User Flow (Individual Professional)

### Home Dashboard
- Nearby events
- Recommended sports
- Communities

### Core Actions
- Create event
- Join event
- Join community
- View leaderboard

### Event Journey
1. Discover event
2. View details
3. Join event
4. Receive confirmation
5. Attend offline
6. Post-event status update

---

## 4. Corporate Employee Flow

### Entry
- Login via corporate email
- Auto-linked to company space

### Home Experience
- Company events highlighted
- Company leaderboard visible
- Public events optional

### Actions
- Join internal events
- Join public events
- View personal stats

---

## 5. Corporate Admin (HR) Flow

### Admin Login
- Redirected to Corporate Dashboard

### Dashboard Sections
- Overview
- Internal Events
- Employees
- Leaderboards
- Settings

### Admin Actions
1. Create internal event
2. Invite employees
3. Monitor participation
4. Promote wellness initiatives

---

## 6. Super Admin Flow

### Access
- Restricted platform login

### Capabilities
- Moderate users
- Approve facilities
- View platform analytics
- Assign corporate admins

---

## 7. Notifications Flow

### Triggered Events
- Event join
- Event reminder
- Event update/cancellation

### Channels
- Push notifications
- Email (optional)

---

## 8. Error & Edge Case UX

- Event full → disable join CTA
- Unauthorized access → graceful message
- Network failure → retry + toast

---

## 9. MVP UX Principles

- Minimal screens
- Zero confusion
- Mobile-first responsive design
- Fast load times

---

## 10. UX Success Metrics

- Signup completion rate
- Event join rate
- Repeat participation
- Corporate activation rate

---

## Why This Flow Works

- Clear separation of roles
- Low learning curve
- Supports B2B & B2C simultaneously
- Designed for real-world usage

---

## Next Logical Step

Define **Monetization, Pricing & Scaling Strategy**.
