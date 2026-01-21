'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useRouter } from 'next/navigation';
import { DatePicker } from '@/components/ui/DatePicker';
import { Select } from '@/components/ui/Select';

const SPORTS = ['Cricket', 'Football', 'Badminton', 'Tennis', 'Basketball', 'Volleyball', 'Yoga', 'Gym'];
const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata'];

export function CreateEventForm() {
  const { firebaseUser } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    sportType: '',
    location: '',
    city: '',
    dateTime: null as Date | null,
    maxParticipants: 10,
    price: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firebaseUser) {
      setError('You must be logged in to create an event');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create event directly in Firestore (client-side)
      const { db } = await import('@/lib/firebase/config');
      const { collection, addDoc, Timestamp } = await import('firebase/firestore');
      
      if (!formData.dateTime) {
        throw new Error('Please select a date and time for the event');
      }

      if (formData.dateTime <= new Date()) {
        throw new Error('Event date must be in the future');
      }

      const eventsRef = collection(db, 'events');
      const eventDoc = await addDoc(eventsRef, {
        title: formData.title,
        sportType: formData.sportType,
        location: formData.location,
        city: formData.city,
        dateTime: Timestamp.fromDate(formData.dateTime),
        createdBy: firebaseUser.uid,
        maxParticipants: parseInt(String(formData.maxParticipants)),
        participants: [],
        price: parseInt(String(formData.price)) || 0,
        status: 'UPCOMING',
        createdAt: Timestamp.now(),
      });

      router.push(`/events/${eventDoc.id}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-destructive-subtle border border-destructive rounded-lg text-sm">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <div>
        <label className="input-label">Event Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="input-field"
          placeholder="e.g., Evening Cricket Match"
          required
        />
      </div>

      <div>
        <label className="input-label">Sport/Activity *</label>
        <Select
          value={formData.sportType}
          onChange={(value) => setFormData({ ...formData, sportType: value })}
          options={[
            { value: '', label: 'Select sport' },
            ...SPORTS.map(sport => ({ value: sport, label: sport }))
          ]}
          placeholder="Select sport"
          searchable={true}
          required
        />
      </div>

      <div>
        <label className="input-label">City *</label>
        <Select
          value={formData.city}
          onChange={(value) => setFormData({ ...formData, city: value })}
          options={[
            { value: '', label: 'Select city' },
            ...CITIES.map(city => ({ value: city, label: city }))
          ]}
          placeholder="Select city"
          searchable={true}
          required
        />
      </div>

      <div>
        <label className="input-label">Location/Venue *</label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="input-field"
          placeholder="e.g., Nehru Stadium"
          required
        />
      </div>

      <div>
        <label className="input-label">Date & Time *</label>
        <DatePicker
          value={formData.dateTime}
          onChange={(date) => setFormData({ ...formData, dateTime: date })}
          minDate={new Date()}
          placeholder="Select event date and time"
          showTime={true}
        />
      </div>

      <div>
        <label className="input-label">Max Participants *</label>
        <input
          type="number"
          min="2"
          max="100"
          value={formData.maxParticipants}
          onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
          className="input-field"
          required
        />
      </div>

      <div>
        <label className="input-label">Price per Person ({'₹'})</label>
        <input
          type="number"
          min="0"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
          className="input-field"
        />
        <p className="text-xs text-text-secondary mt-1">Leave as 0 for free events</p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full btn-primary"
      >
        {loading ? 'Creating Event...' : 'Create Event'}
      </button>
    </form>
  );
}
