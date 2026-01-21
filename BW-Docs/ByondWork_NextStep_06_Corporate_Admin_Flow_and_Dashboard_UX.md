
# ByondWork – Corporate Admin Flow & Dashboard UX (MVP)

This document defines the **end-to-end corporate (HR) experience** on ByondWork.
It is critical for:
- B2B sales
- Corporate onboarding
- Revenue enablement
- Long-term retention

---

## 1. Corporate Admin Goals

A Corporate Admin (HR / Wellness Manager) should be able to:
- Onboard their company easily
- Create internal sports & wellness events
- Invite employees seamlessly
- Track participation & engagement
- Promote work-life balance initiatives

---

## 2. Corporate Admin Onboarding Flow

### Step 1: Corporate Invitation
- Admin receives an invite link from ByondWork team
- Link opens a **Corporate Signup Page**

**Data captured**
- Company Name
- Official Email Domain
- Admin Name
- Designation

---

### Step 2: Role Assignment
- Backend assigns:
  - role = CORPORATE_ADMIN
  - company = <Company Name>
- Stored as Firebase Custom Claims

---

### Step 3: Company Space Creation
A **Company Space** is auto-created:
- Internal namespace for events
- Private leaderboards
- Employee directory (future)

---

## 3. Corporate Admin Dashboard – Information Architecture

### Primary Sections (Left Navigation)

1. Overview (Home)
2. Internal Events
3. Employees
4. Leaderboards
5. Reports (Phase 2)
6. Settings

---

## 4. Dashboard Screens & UX Flow

### 4.1 Overview Screen
**Purpose:** Quick health check of engagement

**Widgets**
- Total employees onboarded
- Active events
- Participation rate
- Upcoming events

---

### 4.2 Internal Events Management

**Actions**
- Create internal-only event
- Set:
  - Sport / activity
  - Date & time
  - Venue
  - Max participants
- Visibility: Company-only

**UX Notes**
- Simple form
- Copy existing event
- Duplicate recurring events

---

### 4.3 Employee Management

**Features**
- Invite employees via:
  - Email domain auto-join
  - Shareable invite link
- View employee list
- Participation status

**MVP Rule**
- No manual approval
- Domain-based trust

---

### 4.4 Corporate Leaderboards

**Views**
- Sport-wise leaderboard
- Participation leaderboard
- Team-based (future)

**Purpose**
- Encourage friendly competition
- Drive repeat engagement

---

### 4.5 Reports (Phase 2)

(Not in MVP, but design-ready)
- Event participation over time
- Wellness activity distribution
- Export CSV / PDF

---

### 4.6 Settings

- Company details
- Admin profile
- Notification preferences

---

## 5. Employee Experience (Corporate Context)

### Joining a Corporate Event
1. Employee logs in
2. Sees "Company Events" section
3. Joins event in one click
4. Gets confirmation notification

---

## 6. Data Isolation Rules

- Corporate admins see **only their company data**
- Employees auto-linked to company via email domain
- No cross-company visibility

---

## 7. MVP UX Principles

- Zero training required
- Minimal clicks
- Clean, calm UI
- No analytics overload

---

## 8. Why This Flow Works

- HR-friendly
- Low operational overhead
- Encourages organic adoption
- Scales across companies easily

---

## 9. KPIs Enabled by This Flow

- Employees onboarded
- Events per company
- Avg participation rate
- Repeat event creation

---

## Next Logical Step

Design **End-to-End MVP UX Flow (User + Corporate)** to align all screens.
