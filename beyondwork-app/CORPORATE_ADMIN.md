# Corporate Admin Portal - Documentation

## Overview
The Corporate Admin Portal enables CORPORATE_ADMIN users to manage internal company wellness events, track employee engagement, and view company leaderboards.

## Features Implemented

### 1. Corporate Admin Dashboard (`/corporate`)
- **Stats Overview**: Display widgets for:
  - Total Events (company-specific)
  - Upcoming Events
  - Total Employees
  - Active Participants
- **Quick Actions**: 
  - Create Internal Event
  - Manage Employees
  - View Company Leaderboard
- **Recent Events**: List of recent internal events

### 2. Internal Event Creation (`/corporate/events/create`)
- **Company-Only Events**: 
  - `isInternal: true` flag ensures only company employees can see/join
  - Automatically tagged with company name
  - Isolated from public events
- **Event Form Fields**:
  - Title (e.g., "Company Cricket Tournament")
  - Sport/Activity (Cricket, Football, Badminton, etc.)
  - City
  - Location/Venue
  - Date & Time
  - Max Participants (2-200)
  - Price per Person (₹)
- **API Route**: `/api/corporate/events/create`
  - Validates event data
  - Enforces future dates only
  - Creates event with `isInternal: true` and company tag

### 3. Employee Management (`/corporate/employees`)
- **Invite via Email Domain**:
  - Generate company-specific signup link
  - Employees with matching email domain auto-link to company
  - Copy shareable link: `https://beyondwork.app/signup?company={company}`
- **Employee List**:
  - View all registered employees
  - Track participation status
  - Monitor engagement

### 4. Company Leaderboard (`/corporate/leaderboard`)
- **Rankings**: Company-only leaderboard
- **Sport Filters**: Overall, Cricket, Football, Badminton tabs
- **Metrics**: Events attended, participation score
- **Privacy**: Data isolated to company employees only

## Access Control

### Role-Based Access
Only users with `role: 'CORPORATE_ADMIN'` can access:
- `/corporate/*` routes
- Corporate event creation API
- Employee management features

### Dashboard Integration
Corporate Admin card appears on main dashboard ONLY if:
```typescript
userProfile?.role === 'CORPORATE_ADMIN'
```

## Data Isolation

### Firestore Security Rules
Internal events are filtered by:
```javascript
// In firestore.rules
match /events/{eventId} {
  // Corporate admins can only see their company's internal events
  allow read: if isAuthenticated() && 
    (resource.data.isInternal == false || 
     resource.data.company == request.auth.token.company);
}
```

### Event Visibility
- **Public Events** (`isInternal: false`): Visible to all users
- **Internal Events** (`isInternal: true`): Only visible to employees of the same company

## User Flow

### Corporate Admin Onboarding
1. Admin receives invite link from ByondWork team
2. Admin signs up with corporate email
3. ByondWork team assigns `CORPORATE_ADMIN` role
4. Admin logs in → sees "Corporate Admin" card on dashboard
5. Admin clicks → enters Corporate Portal
6. Admin creates company space and internal events

### Employee Experience
1. Employee receives signup link from Corporate Admin
2. Employee signs up (email domain auto-links to company)
3. Employee browses events → sees both public + internal company events
4. Employee joins internal events (restricted to company only)

## API Routes

### Corporate Event Creation
**Endpoint**: `POST /api/corporate/events/create`

**Headers**:
```
Authorization: Bearer {firebase-token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "title": "Company Cricket Match",
  "sportType": "Cricket",
  "location": "Office Sports Complex",
  "city": "Mumbai",
  "dateTime": "2024-03-15T10:00:00.000Z",
  "maxParticipants": 20,
  "price": 0,
  "company": "TechCorp",
  "isInternal": true
}
```

**Response**:
```json
{
  "success": true,
  "eventId": "abc123xyz"
}
```

## Technical Implementation

### File Structure
```
src/
├── app/
│   ├── corporate/
│   │   ├── page.tsx                    # Dashboard
│   │   ├── events/
│   │   │   └── create/
│   │   │       └── page.tsx           # Event creation
│   │   ├── employees/
│   │   │   └── page.tsx               # Employee management
│   │   └── leaderboard/
│   │       └── page.tsx               # Company leaderboard
│   └── api/
│       └── corporate/
│           └── events/
│               └── create/
│                   └── route.ts        # Event creation API
└── components/
    └── corporate/
        └── CreateCorporateEventForm.tsx
```

### Component Details

#### CreateCorporateEventForm
- Client-side validation
- Fetches auth token for API calls
- Automatically includes company from userProfile
- Redirects to event detail page on success

#### Corporate Dashboard
- Protected route (redirects to `/login` if unauthenticated)
- Displays role-specific stats
- Quick action cards with hover effects
- Recent events section (populated from Firestore)

## MVP vs Production

### MVP Simplifications
- ✅ Simplified auth (no token verification in API)
- ✅ No email domain validation (manual company assignment)
- ✅ Stats placeholders (will need Cloud Functions for aggregation)
- ✅ Role assignment manual (requires ByondWork team intervention)

### Production Requirements
1. **Cloud Functions**:
   - Verify Firebase tokens in API routes
   - Check CORPORATE_ADMIN role from custom claims
   - Aggregate stats (events count, employee count)
   - Scheduled leaderboard updates

2. **Email Domain Validation**:
   - Validate employee email matches company domain
   - Auto-assign company based on email domain
   - Prevent unauthorized company access

3. **Role Management**:
   - Admin panel for ByondWork team to assign roles
   - Self-service corporate admin registration flow
   - Approval workflow for new corporate accounts

4. **Enhanced Features**:
   - Employee invitation emails (via SendGrid/Mailgun)
   - Event duplication & recurring events
   - CSV export for reports
   - Analytics dashboard with charts

## Security Considerations

### Current Implementation
- Protected routes redirect to login
- Role checks on dashboard card visibility
- Company tag on all internal events
- Firestore rules enforce data isolation

### Production Enhancements Needed
1. Verify JWT tokens in API routes
2. Check custom claims for CORPORATE_ADMIN role
3. Rate limiting on event creation
4. Audit logging for admin actions
5. Encrypted employee data at rest

## Testing Checklist

### Manual Testing
- [ ] Corporate Admin card appears for CORPORATE_ADMIN users
- [ ] Non-admin users cannot see corporate admin card
- [ ] Create internal event form works
- [ ] Internal events tagged with correct company
- [ ] Employee list displays correctly
- [ ] Company leaderboard filters work
- [ ] Redirect to login when unauthenticated

### Integration Testing
- [ ] API route creates events in Firestore
- [ ] Events have correct `isInternal` flag
- [ ] Company field matches user profile
- [ ] Date validation prevents past events
- [ ] Max participants enforced (2-200)

## Next Steps

### Immediate (Post-MVP)
1. Implement token verification in API routes
2. Add real stats aggregation (Cloud Functions)
3. Connect employee list to Firestore query
4. Populate company leaderboard with real data
5. Add email invitation system

### Future Enhancements
1. Recurring events (weekly/monthly patterns)
2. Event templates (copy existing events)
3. Employee onboarding workflow
4. Corporate analytics dashboard
5. Custom company branding
6. Multi-admin support per company
7. Employee activity reports
8. Integration with corporate SSO

## Monetization Integration
Per ByondWork_NextStep_08_Monetization_and_Scaling_Strategy.md:
- **Pricing**: ₹99-₹199 per employee per month
- **Payment Collection**: Corporate admin provides employee count
- **Billing**: Monthly invoices (Razorpay/Stripe integration)
- **Free Trial**: 14-day trial for new corporate accounts

## Support & Documentation
For corporate admin onboarding and support:
1. Check [SETUP.md](./SETUP.md) for Firebase configuration
2. Review [FIRESTORE_RULES.md](./FIRESTORE_RULES.md) for security rules
3. See [README.md](./README.md) for overall project architecture
