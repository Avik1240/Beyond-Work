'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useRouter } from 'next/navigation';
import { Select } from '@/components/ui/Select';

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata'];

export function CreateCommunityForm() {
  const { firebaseUser } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firebaseUser) {
      setError('You must be logged in to create a community');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/communities/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await firebaseUser.getIdToken()}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create community');
      }

      router.push(`/communities/${data.communityId}`);
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
        <label className="input-label">Community Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="input-field"
          placeholder="e.g., Bangalore Cricket Enthusiasts"
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
        <label className="input-label">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="input-field min-h-[100px]"
          rows={4}
          placeholder="Describe your community's purpose and activities..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full btn-primary"
      >
        {loading ? 'Creating Community...' : 'Create Community'}
      </button>
    </form>
  );
}
