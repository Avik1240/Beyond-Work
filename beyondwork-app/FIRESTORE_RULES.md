# Firestore Security Rules Deployment Guide

## Overview
This file contains production-ready Firestore security rules for ByondWork MVP.

## Rules Structure

### Authentication Required
All collections require authentication (`request.auth != null`)

### Role-Based Access Control (RBAC)

**Roles:**
- `USER` - Regular users (default)
- `CORPORATE_ADMIN` - HR/Company admins
- `SUPER_ADMIN` - Platform administrators

**Roles are stored as Firebase Custom Claims** in user tokens.

---

## Collection-wise Rules

### Users Collection (`/users/{userId}`)
- ✅ Read: Own profile OR admins
- ✅ Create/Update: Own profile only
- ❌ Delete: Super admin only

### Events Collection (`/events/{eventId}`)
- ✅ Read: All authenticated users
- ✅ Create: All authenticated users
- ✅ Update: Event creator OR admins
- ❌ Delete: Event creator OR super admin

### Communities Collection (`/communities/{communityId}`)
- ✅ Read: All authenticated users
- ✅ Create: All authenticated users
- ✅ Update: Community creator OR admins
- ❌ Delete: Community creator OR super admin

### Facilities Collection (`/facilities/{facilityId}`)
- ✅ Read: All authenticated users
- ❌ Write: Admins only

### Bookings Collection (`/bookings/{bookingId}`)
- ✅ Read: Booking owner OR admins
- ✅ Create: Authenticated users
- ✅ Update: Booking owner OR admins
- ❌ Delete: Super admin only

### Leaderboards Collection (`/leaderboards/{leaderboardId}`)
- ✅ Read: All authenticated users
- ❌ Write: None (updated by Cloud Functions only)

---

## Deployment Instructions

### Method 1: Firebase Console (Easy)
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to: **Firestore Database** → **Rules** tab
4. Copy contents of `firestore.rules` and paste
5. Click **Publish**

### Method 2: Firebase CLI (Recommended for Production)
```bash
# Install Firebase CLI (if not installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project (if not done)
firebase init firestore

# Deploy rules
firebase deploy --only firestore:rules
```

---

## Testing Rules

### Test in Firebase Console
1. Go to Firestore → Rules tab
2. Click **Rules Playground**
3. Test different scenarios:
   - Authenticated user reading own profile
   - User trying to read another user's profile
   - Creating events
   - Admin operations

### Test Scenarios

**Scenario 1: User reads own profile**
```
Location: /users/user123
Auth: user123
Operation: read
Expected: Allow ✅
```

**Scenario 2: User reads another profile**
```
Location: /users/user456
Auth: user123
Operation: read
Expected: Deny ❌
```

**Scenario 3: Create event**
```
Location: /events/event123
Auth: user123
Operation: create
Expected: Allow ✅
```

---

## Security Considerations

### ✅ Implemented
- Authentication required for all operations
- Role-based access control
- Owner-only write access for sensitive data
- Admin escalation paths
- Protection against unauthorized deletes

### 🔒 Production Recommendations
1. **Enable App Check** - Prevent abuse from unauthorized apps
2. **Rate Limiting** - Implement on Cloud Functions
3. **Data Validation** - Add field-level validation in rules
4. **Audit Logs** - Monitor suspicious activity
5. **Regular Review** - Update rules as features evolve

---

## MVP Notes

- For MVP, some writes go through Next.js API routes
- In production, migrate to Cloud Functions for better security
- Custom claims (roles) must be set via Cloud Functions
- Leaderboards should only be written by scheduled functions

---

## Setting User Roles (Admin Task)

Roles must be set using Firebase Admin SDK (Cloud Function):

```typescript
import * as admin from 'firebase-admin';

// Set user as CORPORATE_ADMIN
await admin.auth().setCustomUserClaims(userId, {
  role: 'CORPORATE_ADMIN',
  company: 'CompanyName'
});

// Set user as SUPER_ADMIN
await admin.auth().setCustomUserClaims(userId, {
  role: 'SUPER_ADMIN'
});
```

Default users automatically get `USER` role (no custom claim needed).

---

## Troubleshooting

**Error: "Missing or insufficient permissions"**
- Check if user is authenticated
- Verify user has required role
- Check if custom claims are set correctly

**Error: "False for 'create' @ ..."**
- Ensure user is authenticated
- Check collection-specific rules

**Testing Mode vs Production**
- ❌ Never use Test Mode in production
- ✅ Always deploy proper rules before launch

---

## Next Steps

1. Deploy these rules to Firestore
2. Test authentication flows
3. Set up Cloud Functions for role assignment
4. Monitor Firestore logs for denied requests
