'use client';

import { useState } from 'react';

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
          <select
            value={city}
            onChange={(e) => handleCityChange(e.target.value)}
            className="input-field"
          >
            {CITIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="input-label">Sport/Activity</label>
          <select
            value={sportType}
            onChange={(e) => handleSportChange(e.target.value)}
            className="input-field"
          >
            {SPORTS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
