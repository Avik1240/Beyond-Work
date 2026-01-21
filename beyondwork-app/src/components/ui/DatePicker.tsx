'use client';

import { useState, useRef, useEffect } from 'react';

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
  minDate?: Date;
  placeholder?: string;
  showTime?: boolean;
  className?: string;
}

export function DatePicker({ 
  value, 
  onChange, 
  minDate, 
  placeholder = 'Select date and time',
  showTime = true,
  className = ''
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(value || new Date());
  const [viewDate, setViewDate] = useState<Date>(value || new Date());
  const [showYearPicker, setShowYearPicker] = useState(false);
  
  // Initialize with smart defaults: 6:00 PM for new events
  const getDefaultHour = () => {
    if (value) return value.getHours() % 12 || 12;
    return 6; // 6 PM default
  };
  
  const getDefaultMinute = () => {
    if (value) return value.getMinutes();
    return 0;
  };
  
  const getDefaultPeriod = () => {
    if (value) return value.getHours() >= 12 ? 'PM' : 'AM';
    return 'PM';
  };
  
  const [hour12, setHour12] = useState(getDefaultHour());
  const [minute, setMinute] = useState(getDefaultMinute());
  const [period, setPeriod] = useState<'AM' | 'PM'>(getDefaultPeriod());
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Generate time options
  const hours12 = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleDateSelect = (day: number) => {
    // Convert 12-hour to 24-hour
    let hour24 = hour12;
    if (period === 'PM' && hour12 !== 12) {
      hour24 = hour12 + 12;
    } else if (period === 'AM' && hour12 === 12) {
      hour24 = 0;
    }
    
    const newDate = new Date(
      viewDate.getFullYear(),
      viewDate.getMonth(),
      day,
      hour24,
      minute
    );
    
    if (minDate && newDate < minDate) {
      return;
    }
    
    setSelectedDate(newDate);
    // Update immediately
    onChange(newDate);
    
    // Auto-close if no time picker
    if (!showTime) {
      setIsOpen(false);
    }
  };

  // Update date whenever time changes
  useEffect(() => {
    if (!selectedDate) return;
    
    // Convert 12-hour to 24-hour
    let hour24 = hour12;
    if (period === 'PM' && hour12 !== 12) {
      hour24 = hour12 + 12;
    } else if (period === 'AM' && hour12 === 12) {
      hour24 = 0;
    }
    
    const newDate = new Date(selectedDate);
    newDate.setHours(hour24);
    newDate.setMinutes(minute);
    
    onChange(newDate);
  }, [hour12, minute, period]);

  const previousMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const previousYear = () => {
    setViewDate(new Date(viewDate.getFullYear() - 1, viewDate.getMonth(), 1));
  };

  const nextYear = () => {
    setViewDate(new Date(viewDate.getFullYear() + 1, viewDate.getMonth(), 1));
  };

  const selectYear = (year: number) => {
    setViewDate(new Date(year, viewDate.getMonth(), 1));
    setShowYearPicker(false);
  };

  const renderYearGrid = () => {
    const currentYear = viewDate.getFullYear();
    const startYear = Math.floor(currentYear / 12) * 12;
    const years = [];
    
    for (let i = 0; i < 12; i++) {
      const year = startYear + i;
      const isCurrentYear = year === new Date().getFullYear();
      const isSelected = year === currentYear;
      
      years.push(
        <button
          key={year}
          type="button"
          onClick={() => selectYear(year)}
          className={`
            py-3 px-4 rounded-lg text-sm font-medium transition-colors
            ${isSelected
              ? 'bg-accent text-white'
              : isCurrentYear
              ? 'bg-accent/20 text-accent hover:bg-accent/30'
              : 'text-text-primary hover:bg-background-subtle'
            }
          `}
        >
          {year}
        </button>
      );
    }
    
    return years;
  };

  const previousYearPage = () => {
    setViewDate(new Date(viewDate.getFullYear() - 12, viewDate.getMonth(), 1));
  };

  const nextYearPage = () => {
    setViewDate(new Date(viewDate.getFullYear() + 12, viewDate.getMonth(), 1));
  };

  const formatDisplayValue = () => {
    if (!value) return '';
    const date = value.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
    if (showTime) {
      const time = value.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
      return `${date}, ${time}`;
    }
    return date;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderCalendarDays = () => {
    const days = [];
    const totalDays = daysInMonth(viewDate);
    const firstDay = firstDayOfMonth(viewDate);
    const today = new Date();
    
    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8" />);
    }
    
    // Days of the month
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
      const isSelected = selectedDate && 
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear();
      const isToday = date.toDateString() === today.toDateString();
      const isPast = minDate && date < minDate;
      
      days.push(
        <button
          key={day}
          type="button"
          onClick={() => handleDateSelect(day)}
          disabled={isPast}
          className={`
            h-8 flex items-center justify-center rounded-lg text-sm transition-colors
            ${isSelected 
              ? 'bg-accent text-white font-medium' 
              : isPast
              ? 'text-text-secondary opacity-30 cursor-not-allowed'
              : isToday
              ? 'bg-accent/20 text-accent font-medium hover:bg-accent/30'
              : 'text-text-primary hover:bg-background-subtle'
            }
          `}
        >
          {day}
        </button>
      );
    }
    
    return days;
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="input-field text-left flex items-center justify-between"
      >
        <span className={value ? 'text-text-primary' : 'text-text-secondary'}>
          {value ? formatDisplayValue() : placeholder}
        </span>
        <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 bg-background border border-border rounded-lg shadow-xl w-[520px]">
          <div className="flex">
            {/* Left: Calendar */}
            <div className="flex-1 p-3">
              {/* Month/Year Navigation */}
              <div className="flex items-center justify-between mb-3">
                <button
                  type="button"
                  onClick={showYearPicker ? previousYearPage : previousMonth}
                  className="p-1.5 hover:bg-background-subtle rounded-lg transition-colors"
                  title={showYearPicker ? "Previous 12 years" : "Previous month"}
                >
                  <svg className="w-4 h-4 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  type="button"
                  onClick={() => setShowYearPicker(!showYearPicker)}
                  className="flex items-center gap-2 px-3 py-1 hover:bg-background-subtle rounded-lg transition-colors"
                >
                  {!showYearPicker ? (
                    <>
                      <span className="text-sm text-text-primary font-medium">
                        {monthNames[viewDate.getMonth()]}
                      </span>
                      <span className="text-sm text-text-secondary font-medium">
                        {viewDate.getFullYear()}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-text-primary font-medium">
                      {Math.floor(viewDate.getFullYear() / 12) * 12} - {Math.floor(viewDate.getFullYear() / 12) * 12 + 11}
                    </span>
                  )}
                  <svg className={`w-3 h-3 text-text-secondary transition-transform ${showYearPicker ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <button
                  type="button"
                  onClick={showYearPicker ? nextYearPage : nextMonth}
                  className="p-1.5 hover:bg-background-subtle rounded-lg transition-colors"
                  title={showYearPicker ? "Next 12 years" : "Next month"}
                >
                  <svg className="w-4 h-4 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Year Picker Grid */}
              {showYearPicker ? (
                <div className="grid grid-cols-3 gap-2 py-2">
                  {renderYearGrid()}
                </div>
              ) : (
                <>
                  {/* Day Names */}
                  <div className="grid grid-cols-7 gap-1 mb-1">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                      <div key={day} className="h-7 flex items-center justify-center text-xs font-medium text-text-secondary">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {renderCalendarDays()}
                  </div>
                </>
              )}
            </div>

            {/* Right: Time Picker */}
            {showTime && (
              <div className="w-[170px] p-3 border-l border-border">
                <div className="flex items-center gap-1.5 mb-3">
                  <svg className="w-3.5 h-3.5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs text-text-primary font-medium">Time</span>
                </div>
                
                <div className="space-y-2.5">
                  {/* Hour Select */}
                  <div>
                    <label className="text-[10px] text-text-secondary mb-0.5 block">Hour</label>
                    <select
                      value={hour12}
                      onChange={(e) => setHour12(parseInt(e.target.value))}
                      className="input-field w-full py-1.5 text-sm text-center"
                    >
                      {hours12.map(h => (
                        <option key={h} value={h}>
                          {h.toString().padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Minute Select */}
                  <div>
                    <label className="text-[10px] text-text-secondary mb-0.5 block">Minute</label>
                    <select
                      value={minute}
                      onChange={(e) => setMinute(parseInt(e.target.value))}
                      className="input-field w-full py-1.5 text-sm text-center"
                    >
                      {minutes.map(m => (
                        <option key={m} value={m}>
                          {m.toString().padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* AM/PM Toggle */}
                  <div>
                    <label className="text-[10px] text-text-secondary mb-0.5 block">Period</label>
                    <div className="flex rounded-lg border border-border overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setPeriod('AM')}
                        className={`
                          flex-1 py-1.5 text-xs font-medium transition-colors
                          ${period === 'AM' 
                            ? 'bg-accent text-white' 
                            : 'bg-background-card text-text-secondary hover:bg-background-subtle'
                          }
                        `}
                      >
                        AM
                      </button>
                      <button
                        type="button"
                        onClick={() => setPeriod('PM')}
                        className={`
                          flex-1 py-1.5 text-xs font-medium transition-colors border-l border-border
                          ${period === 'PM' 
                            ? 'bg-accent text-white' 
                            : 'bg-background-card text-text-secondary hover:bg-background-subtle'
                          }
                        `}
                      >
                        PM
                      </button>
                    </div>
                  </div>
                  
                  {/* Time Preview */}
                  <div className="pt-2 border-t border-border">
                    <div className="text-center bg-background-subtle rounded py-1.5">
                      <span className="text-[10px] text-text-secondary block mb-0.5">Selected</span>
                      <span className="text-sm font-semibold text-accent">
                        {hour12.toString().padStart(2, '0')}:{minute.toString().padStart(2, '0')} {period}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
