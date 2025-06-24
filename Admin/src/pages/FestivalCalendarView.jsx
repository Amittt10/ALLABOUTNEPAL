import React, { useEffect, useState } from 'react';
import FestivalCalendar from '../components/FestivalCalendar';
import { fetchFestivals } from '../api/festivalApi';
import '../components/FestivalCalendar.css';

const FestivalCalendarView = () => {
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFestivals = async () => {
      setLoading(true);
      try {
        const data = await fetchFestivals();
        setFestivals(data);
        setError(null);
      } catch (err) {
        setError('Failed to load festivals.');
      } finally {
        setLoading(false);
      }
    };
    loadFestivals();
  }, []);

  if (loading) return <p>Loading festivals...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h1>Festival Calendar</h1>
      <FestivalCalendar festivals={festivals} />
    </div>
  );
};

export default FestivalCalendarView;
