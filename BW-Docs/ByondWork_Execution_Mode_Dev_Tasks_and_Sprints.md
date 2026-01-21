
# ByondWork – Execution Mode
## Development Task Breakdown & Sprint Plan (MVP)

This document converts strategy into **actionable development tasks**.
It is structured for:
- Solo founder execution OR
- Small team (2–4 devs)
- Agile, sprint-based delivery

---

## Execution Philosophy

- Build only what is required to validate
- Ship weekly
- No premature optimization
- Frontend-led execution
- Backend as an enabler, not a bottleneck

---

## Team Assumption (Lean)

- 1 Frontend Developer (Next.js)
- 1 Fullstack / Backend Developer (Firebase)
- 1 Founder / Product Owner
- (Optional) UI designer

---

## Sprint Structure

- Sprint length: **1 week**
- MVP duration: **6–8 weeks**
- Deployment: End of every sprint

---

## Sprint 0 – Project Setup & Foundation (Week 0)

### Tasks
- Initialize Next.js (App Router)
- Setup Tailwind CSS
- Setup Firebase project
- Configure Firebase Auth
- Setup Firestore
- Setup Vercel deployment
- Environment variables & secrets

### Deliverable
- App loads
- Auth works
- CI/CD pipeline active

---

## Sprint 1 – Authentication & User Profiles

### Frontend Tasks
- Login / Signup UI
- Google Sign-in
- Profile completion screen
- Protected routes

### Backend Tasks
- User profile schema
- Firestore rules for users
- Auth state handling

### Deliverable
- Users can sign up & log in
- Profiles saved successfully

---

## Sprint 2 – Event Discovery & Creation

### Frontend Tasks
- Event listing page
- Filters (city, sport)
- Create event form
- Event detail page

### Backend Tasks
- Cloud Function: create event
- Event validation logic
- Firestore event collection

### Deliverable
- Events can be created and viewed

---

## Sprint 3 – Join Event & Community Basics

### Frontend Tasks
- Join event CTA
- Community listing
- Community detail page

### Backend Tasks
- Cloud Function: join event
- Participant limit logic
- Community schema

### Deliverable
- Users can join events & communities

---

## Sprint 4 – Corporate Admin (MVP)

### Frontend Tasks
- Corporate dashboard layout
- Internal events section
- Employee invite UI

### Backend Tasks
- Role-based access (claims)
- Corporate event creation
- Company isolation logic

### Deliverable
- HR can create internal events

---

## Sprint 5 – Leaderboards & Notifications

### Frontend Tasks
- Leaderboard UI
- User stats view
- Notification UI

### Backend Tasks
- Scheduled leaderboard update
- Firebase Cloud Messaging setup
- Notification triggers

### Deliverable
- Leaderboards visible
- Notifications functional

---

## Sprint 6 – Polishing & QA

### Tasks
- Bug fixes
- UX refinements
- Mobile responsiveness
- Error handling
- Performance tuning

### Deliverable
- MVP ready for pilot launch

---

## Definition of Done (MVP)

- Auth stable
- Events flow works end-to-end
- Corporate admin usable
- No critical bugs
- Deployed on production URL

---

## Tools

- Project management: Notion / Jira / Trello
- Version control: GitHub
- Hosting: Vercel
- Backend: Firebase

---

## What NOT to Build in MVP

- Payments
- Mobile apps
- AI features
- Advanced analytics

---

## Post-MVP Next Steps

- Pilot with 1–2 corporates
- Collect feedback
- Iterate fast
- Prepare investor pitch

---

## Outcome

After this execution plan:
- You have a usable product
- You can onboard real users
- You can validate revenue conversations
