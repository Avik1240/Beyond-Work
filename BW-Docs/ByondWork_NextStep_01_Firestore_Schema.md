
# ByondWork – Firestore Schema (MVP)

## Users Collection
/users/{userId}
- name
- email
- company
- role
- city
- interests[]
- createdAt

## Events Collection
/events/{eventId}
- title
- sportType
- location
- city
- dateTime
- createdBy
- maxParticipants
- participants[]
- price
- status

## Facilities Collection
/facilities/{facilityId}
- name
- sportsSupported[]
- address
- city
- pricePerHour
- contactInfo

## Bookings Collection
/bookings/{bookingId}
- userId
- eventId
- facilityId
- amount
- paymentStatus
- createdAt

## Communities Collection
/communities/{communityId}
- name
- city
- createdBy
- members[]

## Leaderboards Collection
/leaderboards/{leaderboardId}
- type (corporate/global)
- sportType
- rankings[]
