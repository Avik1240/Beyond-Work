'use client';

import { Event } from '@/types';
import Link from 'next/link';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const spotsLeft = event.maxParticipants - event.participants.length;
  const isFull = spotsLeft === 0;
  const eventDate = new Date(event.dateTime);
  
  return (
    <Link href={`/events/${event.id}`}>
      <div className="card cursor-pointer group">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-medium mb-2 text-text-primary group-hover:text-accent transition-colors">
              {event.title}
            </h3>
            <span className="inline-block px-2.5 py-1 bg-accent/10 text-accent border border-accent/20 text-xs rounded font-medium">
              {event.sportType}
            </span>
          </div>
          {isFull ? (
            <span className="px-2.5 py-1 bg-destructive-subtle text-red-400 border border-destructive text-xs rounded font-medium ml-3">
              FULL
            </span>
          ) : (
            <span className="px-2.5 py-1 bg-accent/10 text-accent border border-accent/20 text-xs rounded font-medium ml-3">
              {spotsLeft} spots left
            </span>
          )}
        </div>

        <div className="space-y-2.5 text-sm text-text-secondary">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{event.location}, {event.city}</span>
          </div>

          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>
              {eventDate.toLocaleDateString('en-IN', { 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric' 
              })}
              {' at '}
              {eventDate.toLocaleTimeString('en-IN', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{event.participants.length}/{event.maxParticipants} joined</span>
          </div>

          {event.price > 0 && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>₹{event.price} per person</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
