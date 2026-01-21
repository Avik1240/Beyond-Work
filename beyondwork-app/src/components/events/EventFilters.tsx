'use client';

import { useState } from 'react';
import { Select } from '@/components/ui/Select';

const SPORTS = ['All', 'Cricket', 'Football', 'Badminton', 'Tennis', 'Basketball', 'Volleyball', 'Yoga', 'Gym'];
const CITIES = ['All', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata'];

interface EventFiltersProps {
  onFilterChange: (filters: { city: string; sportType: string }) => void;
}

export function EventFilters({ onFilterChange }: EventFiltersProps) {
  const [city, setCity] = useState('All');
  const [sportType, setSportType] = useState('All');

  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    onFilterChange({ 
      city: newCity === 'All' ? '' : newCity, 
      sportType: sportType === 'All' ? '' : sportType 
    });
  };

  const handleSportChange = (newSport: string) => {
    setSportType(newSport);
    onFilterChange({ 
      city: city === 'All' ? '' : city, 
      sportType: newSport === 'All' ? '' : newSport 
    });
  };

  return (
    <div className="card sticky top-6">
      <h3 className="font-medium mb-4 text-text-primary">Filter Events</h3>
      
      <div className="space-y-4">
        <div>
          <label className="input-label">City</label>
          <Select
            value={city}
            onChange={(value) => handleCityChange(value)}
            options={CITIES.map(c => ({ value: c, label: c }))}
            placeholder="Select city"
            searchable={true}
          />
        </div>

        <div>
          <label className="input-label">Sport/Activity</label>
          <Select
            value={sportType}
            onChange={(value) => handleSportChange(value)}
            options={SPORTS.map(s => ({ value: s, label: s }))}
            placeholder="Select sport"
            searchable={true}
          />
        </div>
      </div>
    </div>
  );
}
