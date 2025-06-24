import React, { useState, useEffect } from 'react';
import './FestivalCalendar.css';

function getDaysInMonth(month, year) {
  return new Date(year, month + 1, 0).getDate();
}

const FestivalCalendar = ({ festivals }) => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);

  // Festivals for selected date
  const selectedFestivals = festivals.filter(
    (f) =>
      f.month - 1 === currentMonth &&
      Number(f.date) === selectedDate
  );

  // Change month handlers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate(null);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="festival-calendar-container">
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>&lt;</button>
        <h2>{monthNames[currentMonth]} {currentYear}</h2>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>

      <div className="calendar-grid">
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
          const hasFestival = festivals.some(f => f.month - 1 === currentMonth && Number(f.date) === day);
          return (
            <div
              key={day}
              className={`calendar-day ${selectedDate === day ? 'selected' : ''} ${hasFestival ? 'has-festival' : ''}`}
              onClick={() => setSelectedDate(day)}
            >
              {day}
            </div>
          );
        })}
      </div>

      <div className="festival-list">
        <h3>Events on {selectedDate ? `${monthNames[currentMonth]} ${selectedDate}` : 'Select a day'}</h3>
        {selectedDate && selectedFestivals.length === 0 && <p>No events.</p>}
        {selectedFestivals.length > 0 && (
          <ul>
            {selectedFestivals.map(f => (
              <li key={f._id}>
                <strong>{f.name_en}</strong> ({f.category})<br />
                {f.description_en || 'No description'}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FestivalCalendar;
