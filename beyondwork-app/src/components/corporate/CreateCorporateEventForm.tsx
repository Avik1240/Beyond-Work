'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useRouter } from 'next/navigation';

const SPORTS = ['Cricket', 'Football', 'Badminton', 'Tennis', 'Basketball', 'Volleyball', 'Yoga', 'Gym'];
const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata'];

export function CreateCorporateEventForm() {
  const { firebaseUser, userProfile } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    sportType: '',
    location: '',
    city: userProfile?.city || '',
    dateTime: '',
    maxParticipants: 20,
    price: 0,
    isInternal: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firebaseUser || !userProfile) {
      setError('You must be logged in as corporate admin');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/corporate/events/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await firebaseUser.getIdToken()}`,
        },
        body: JSON.stringify({
          ...formData,
          dateTime: new Date(formData.dateTime).toISOString(),
          company: userProfile.company,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create corporate event');
      }

      router.push(`/events/${data.eventId}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded p-4">
        <p className="text-sm text-blue-800">
          <strong>Internal Event:</strong> Only employees from {userProfile?.company} can view and join this event.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Event Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="e.g., Company Cricket Tournament"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Sport/Activity *</label>
        <select
          value={formData.sportType}
          onChange={(e) => setFormData({ ...formData, sportType: e.target.value })}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
        >
          <option value="">Select sport</option>
          {SPORTS.map(sport => (
            <option key={sport} value={sport}>{sport}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">City *</label>
        <select
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
        >
          <option value="">Select city</option>
          {CITIES.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Location/Venue *</label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="e.g., Office Sports Complex"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Date & Time *</label>
        <input
          type="datetime-local"
          value={formData.dateTime}
          onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Max Participants *</label>
        <input
          type="number"
          min="2"
          max="200"
          value={formData.maxParticipants}
          onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Price per Person (₹)</label>
        <input
          type="number"
          min="0"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <p className="text-xs text-gray-500 mt-1">Leave as 0 for free events</p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary-600 text-white py-3 rounded hover:bg-primary-700 disabled:opacity-50 font-medium"
      >
        {loading ? 'Creating Internal Event...' : 'Create Internal Event'}
      </button>
    </form>
  );
}
