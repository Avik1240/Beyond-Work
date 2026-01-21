
# ByondWork – GitHub Copilot (GPT‑5.1) Prompt Playbook
## End‑to‑End Prompt Sequence for Building the MVP

This document is designed for **VS Code + GitHub Copilot Chat (GPT‑5.1)**.
It converts product, architecture, and execution docs into a **prompt-driven build system**.

---

## 0. Can Copilot + GPT‑5.1 Build This Project?

**Yes — with very high confidence**, because:
- You already have clear architecture, APIs, RBAC, UX flows, and sprint plans
- Copilot excels when scope and constraints are explicit
- This project is modular and MVP-bounded

Copilot should be treated as a **junior engineer with infinite stamina**, not an architect.

---

## Usage Rules (Important)

- Use **Copilot Chat**, not inline suggestions
- Run prompts **one at a time**
- Commit after every completed module
- Never ask Copilot to “build everything”

---

# PROMPT SEQUENCE (USE IN ORDER)

---

## PROMPT 1 – Project Context Lock

```
You are a senior full‑stack engineer.

We are building an MVP called “ByondWork”.
It is a B2B2C sports & wellness platform for corporate professionals.

Frontend:
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui

Backend:
- Firebase Authentication
- Firestore
- Firebase Cloud Functions

Core MVP Features:
- Auth (email + Google)
- User profiles
- Event creation & joining
- Communities
- Corporate admin dashboard
- Leaderboards

Constraints:
- MVP only
- No payments
- No mobile app
- Security‑first
- Cost‑friendly

Confirm understanding before writing any code.
```

---

## PROMPT 2 – Folder Architecture

```
Design a production‑ready Next.js App Router folder structure.

Requirements:
- Auth‑aware routing
- Clean separation of concerns
- Simple but scalable

Output:
- Folder tree
- Explanation of each folder
- Naming conventions

Do NOT generate code yet.
```

---

## PROMPT 3 – Firebase Initialization

```
Generate Firebase setup code for Next.js App Router.

Include:
- Firebase config (env‑safe)
- Auth setup
- Firestore init
- Explanation
- Common errors & fixes
```

---

## PROMPT 4 – Authentication Flow

```
Implement authentication.

Requirements:
- Email + Google login
- Auth provider
- Protected routes
- Logout

Edge cases:
- Loading state
- Session refresh
- Invalid token

Include:
- Code
- Folder placement
- Test checklist
```

---

## PROMPT 5 – User Profile System

```
Build user profile management.

Rules:
- Firestore users collection
- Users edit only their own profile
- Required fields: name, company, city, interests

Include:
- Schema
- UI form
- Validation
- Error handling
```

---

## PROMPT 6 – Events Module

```
Implement Events feature.

Features:
- Create event (Cloud Function)
- List events (Firestore)
- Join event (Cloud Function)

Constraints:
- Participant limit
- Prevent duplicates

Include:
- Backend logic
- Frontend UI
- Failure cases
```

---

## PROMPT 7 – Communities Module

```
Build Communities.

Features:
- Create community
- Join community
- View members

Include:
- Firestore structure
- Security rules
- UI
```

---

## PROMPT 8 – Corporate Admin Dashboard

```
Implement Corporate Admin dashboard.

Role:
- CORPORATE_ADMIN only

Features:
- Internal events
- Employee invites
- Company isolation

Include:
- Role checks
- UX flow
- Edge cases
```

---

## PROMPT 9 – RBAC & Security Rules

```
Generate Firestore security rules.

Roles:
- USER
- CORPORATE_ADMIN
- SUPER_ADMIN

Rules:
- No direct event writes
- Profile self‑write only

Include:
- rules.firestore
- Explanation
- Security test cases
```

---

## PROMPT 10 – Leaderboards

```
Implement Leaderboards.

Types:
- Corporate
- Global

Include:
- Firestore schema
- Scheduled Cloud Function
- UI component
```

---

## PROMPT 11 – Notifications

```
Implement Firebase Cloud Messaging notifications.

Triggers:
- Event join
- Event reminder

Include:
- Backend triggers
- Frontend handling
- Permission UX
```

---

## PROMPT 12 – Error Handling & UX Polish

```
Audit the app for errors and UX gaps.

Focus on:
- Network errors
- Unauthorized access
- Empty states

Provide improvements and snippets.
```

---

## PROMPT 13 – Testing Checklist

```
Generate a full MVP testing checklist.

Include:
- Auth tests
- Event flow tests
- Corporate admin tests
- Security tests
```

---

## PROMPT 14 – Production Readiness

```
Prepare the app for production.

Include:
- Env vars checklist
- Firebase setup steps
- Vercel deployment
- Performance tips
```

---

## Golden Rules

- One prompt = one responsibility
- Always ask Copilot to explain
- Commit frequently
- Reject scope creep

---

## Final Outcome

Following this playbook will produce:
- A working MVP
- Clean architecture
- Secure backend
- Investor‑ready product
