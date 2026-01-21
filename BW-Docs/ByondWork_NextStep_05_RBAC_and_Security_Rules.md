
# ByondWork – Role-Based Access Control (RBAC) & Security Rules (MVP)

This document defines **who can do what** in the ByondWork platform and how access is enforced using **Firebase Authentication, Custom Claims, and Firestore Security Rules**.

---

## 1. Roles Definition

### 1.1 USER
- Regular working professional
- Can discover, create, and join events
- Can join communities
- Can view leaderboards

### 1.2 CORPORATE_ADMIN
- HR / company representative
- Can create **internal-only** corporate events
- Can view company-specific leaderboards
- Can manage employees under the same company

### 1.3 SUPER_ADMIN
- Platform owner
- Full read/write access
- Can moderate users, events, facilities, and communities

---

## 2. Role Assignment Strategy

- Roles stored using **Firebase Custom Claims**
- Assigned via secure Cloud Function (never client-side)

Example:
```
{
  role: "CORPORATE_ADMIN",
  company: "TCS"
}
```

---

## 3. Permission Matrix

| Feature | USER | CORPORATE_ADMIN | SUPER_ADMIN |
|------|------|----------------|-------------|
| Create Event | ✅ | ✅ | ✅ |
| Join Event | ✅ | ✅ | ✅ |
| Create Corporate Event | ❌ | ✅ | ✅ |
| View All Events | ❌ | ❌ | ✅ |
| Join Community | ✅ | ✅ | ✅ |
| Create Community | ✅ | ✅ | ✅ |
| View Corporate Leaderboard | ❌ | ✅ | ✅ |
| Moderate Content | ❌ | ❌ | ✅ |

---

## 4. Firestore Access Strategy

### Client-Side Allowed
- Read public events
- Read facilities
- Read leaderboards
- Write own user profile

### Cloud Function Only
- Event creation
- Event joining
- Booking creation
- Corporate event creation
- Role updates

---

## 5. Firestore Security Rules (MVP)

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Events (read-only from client)
    match /events/{eventId} {
      allow read: if true;
      allow write: if false;
    }

    // Facilities (public read)
    match /facilities/{facilityId} {
      allow read: if true;
      allow write: if false;
    }

    // Communities (read-only)
    match /communities/{communityId} {
      allow read: if true;
      allow write: if false;
    }

    // Leaderboards (read-only)
    match /leaderboards/{leaderboardId} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

---

## 6. Cloud Function Role Enforcement

Every secure API checks:
- User authentication
- User role
- Company match (for corporate flows)

Example:
```
if (user.role !== "CORPORATE_ADMIN") {
  throw new Error("Unauthorized");
}
```

---

## 7. Corporate Data Isolation

- Corporate events tagged with `company`
- CORPORATE_ADMIN can only:
  - View events
  - View leaderboards
  - View users of same company

---

## 8. Security Best Practices

- Never trust frontend
- Never expose admin writes
- Always validate server-side
- Keep Firestore rules minimal
- Log sensitive actions

---

## 9. Why This Model Scales

- Simple mental model
- Minimal rule complexity
- Easy to audit
- Investor-friendly security posture

---

## Next Logical Step
Design **Corporate Admin Flow & Dashboard UX**.
