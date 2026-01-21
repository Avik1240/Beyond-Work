
# ByondWork – API Contracts (MVP)

This document defines **clear, unambiguous API contracts** between the Next.js frontend and backend (Firebase / Cloud Functions).
These contracts ensure:
- Predictable development
- Secure access
- Easy scaling
- Clean separation of concerns

---

## API Design Principles
- Frontend never writes directly to sensitive collections
- Business logic always runs in Cloud Functions
- Auth token is mandatory for all protected APIs
- Role-based access enforced server-side

---

## Authentication Context (Global)

All protected APIs require:
- Firebase Auth ID Token
- Token automatically attached from frontend

### Roles
- `USER`
- `CORPORATE_ADMIN`
- `SUPER_ADMIN`

Roles are stored as **Firebase Custom Claims**.

---

## 1. User APIs

### 1.1 Create / Update User Profile
**Trigger:** On first login or profile edit

**Type:** Firestore write (client-side allowed)

```
/users/{userId}
```

**Payload**
```
{
  name: string,
  email: string,
  company: string,
  role: string,
  city: string,
  interests: string[]
}
```

**Access**
- Authenticated user
- Only own profile

---

## 2. Event APIs

### 2.1 Create Event
**Type:** Cloud Function (HTTPS)

```
POST /api/events/create
```

**Request**
```
{
  title: string,
  sportType: string,
  location: string,
  city: string,
  dateTime: timestamp,
  maxParticipants: number,
  price: number
}
```

**Validation**
- User must be authenticated
- maxParticipants > 1
- dateTime must be future

**Response**
```
{
  success: true,
  eventId: string
}
```

---

### 2.2 Join Event
**Type:** Cloud Function

```
POST /api/events/join
```

**Request**
```
{
  eventId: string
}
```

**Logic**
- Check participant limit
- Prevent duplicate join

**Response**
```
{
  success: true
}
```

---

### 2.3 Get Events (Discovery)
**Type:** Firestore read (client-side)

```
GET /events?city=Delhi&sportType=Cricket
```

**Filters**
- city
- sportType
- date

---

## 3. Facility APIs

### 3.1 Get Facilities
**Type:** Firestore read

```
GET /facilities?city=Bangalore
```

**Response**
```
[
  {
    id: string,
    name: string,
    sportsSupported: string[],
    pricePerHour: number
  }
]
```

---

## 4. Booking APIs

### 4.1 Create Booking
**Type:** Cloud Function

```
POST /api/bookings/create
```

**Request**
```
{
  eventId: string,
  facilityId: string
}
```

**Logic**
- Calculate split cost
- Mark paymentStatus = PENDING

---

## 5. Community APIs

### 5.1 Create Community
**Type:** Cloud Function

```
POST /api/communities/create
```

**Request**
```
{
  name: string,
  city: string
}
```

---

### 5.2 Join Community
**Type:** Firestore update

```
POST /communities/{communityId}/join
```

---

## 6. Leaderboard APIs

### 6.1 Get Leaderboard
**Type:** Firestore read

```
GET /leaderboards?type=corporate&sportType=Cricket
```

---

## 7. Corporate Admin APIs

### 7.1 Create Corporate Event
**Access:** CORPORATE_ADMIN only

```
POST /api/corporate/events/create
```

**Extra Fields**
```
{
  company: string,
  internalOnly: true
}
```

---

## Error Response Format (Standard)

```
{
  success: false,
  errorCode: string,
  message: string
}
```

---

## Security Summary
- Sensitive writes → Cloud Functions only
- Role checks enforced server-side
- Firestore rules restrict direct access

---

## Next Logical Step
Define **Role-Based Access Control (RBAC)** in detail.
