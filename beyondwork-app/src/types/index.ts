// User Types
export type UserRole = 'USER' | 'CORPORATE_ADMIN' | 'SUPER_ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  role: UserRole;
  city: string;
  interests: string[];
  createdAt: Date;
}

// Event Types
export type EventStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';

export interface Event {
  id: string;
  title: string;
  sportType: string;
  location: string;
  city: string;
  dateTime: Date;
  createdBy: string;
  maxParticipants: number;
  participants: string[];
  price: number;
  status: EventStatus;
  isInternal?: boolean;
  company?: string;
}

// Facility Types
export interface Facility {
  id: string;
  name: string;
  sportsSupported: string[];
  address: string;
  city: string;
  pricePerHour: number;
  contactInfo: string;
}

// Booking Types
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface Booking {
  id: string;
  userId: string;
  eventId: string;
  facilityId: string;
  amount: number;
  paymentStatus: PaymentStatus;
  createdAt: Date;
}

// Community Types
export interface Community {
  id: string;
  name: string;
  city: string;
  description?: string;
  createdBy: string;
  members: string[];
  createdAt: Date;
}

// Leaderboard Types
export type LeaderboardType = 'CORPORATE' | 'GLOBAL';

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  score: number;
  eventsAttended: number;
  company?: string;
}

export interface Leaderboard {
  id: string;
  type: LeaderboardType;
  sportType: string;
  rankings: LeaderboardEntry[];
  lastUpdated: Date;
}
