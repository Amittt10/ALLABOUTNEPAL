// Importing the components from your local components folder
import { useState, useEffect } from "react";
import { Calendar as CalIcon, ChevronLeft, ChevronRight } from "lucide-react";
import Input from "../Component/ui/input";
import Spinner from "../Component/ui/spinner";
import { Dialog} from "../Component/ui/Dialogs";


import "./Festivals.css";

const nepaliMonths = [
  "Baisakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin",
  "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra",
];

export default function Festivals() {
  const [selectedMonth, setSelectedMonth] = useState("Ashwin");
  const [currentMonthIndex, setCurrentMonthIndex] = useState(5);
  const [events, setEvents] = useState([]);
  const [calendarId, setCalendarId] = useState("primary");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const nextMonth = () => {
    const next = (currentMonthIndex + 1) % nepaliMonths.length;
    setCurrentMonthIndex(next);
    setSelectedMonth(nepaliMonths[next]);
  };
  const prevMonth = () => {
    const prev = (currentMonthIndex + nepaliMonths.length - 1) % nepaliMonths.length;
    setCurrentMonthIndex(prev);
    setSelectedMonth(nepaliMonths[prev]);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const start = new Date();
        const end = new Date(start);
        end.setMonth(end.getMonth() + 1);

        const res = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=YOUR_API_KEY_HERE&timeMin=${start.toISOString()}&timeMax=${end.toISOString()}&maxResults=50`
        );
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        setEvents(data.items || []);
      } catch (err) {
        setError(err.message);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [calendarId, currentMonthIndex]);

  return (
    <div className="festivals-container">
      <header className="header">
        <h1>Nepal Festivals Calendar</h1>
        <p>नेपाली पर्व तथा चाडपर्वहरू</p>
        <Input
          value={calendarId}
          onChange={(e) => setCalendarId(e.target.value)}
          placeholder="Enter calendar ID (e.g., primary or public ID)"
        />
      </header>

      <div className="nav-month">
        <button onClick={prevMonth}><ChevronLeft /></button>
        <h2>{selectedMonth}</h2>
        <button onClick={nextMonth}><ChevronRight /></button>
      </div>

      {loading && <Spinner className="spinner" />}
      {error && <p className="error">Error: {error}</p>}

      <div className="events-list">
        {!loading && !error && events.length > 0 ? (
          events.map((ev) => (
            <Dialog.Dialog key={ev.id} open={selectedEvent?.id === ev.id} onClose={() => setSelectedEvent(null)}>
              <Dialog.DialogTrigger asChild>
                <div className="event-card" onClick={() => setSelectedEvent(ev)}>
                  <h3>{ev.summary}</h3>
                  <div className="event-meta">
                    <CalIcon />
                    <span>{new Date(ev.start.date || ev.start.dateTime).toDateString()}</span>
                  </div>
                </div>
              </Dialog.DialogTrigger>
              <Dialog.DialogContent>
                <Dialog.DialogHeader>
                  <Dialog.DialogTitle>{ev.summary}</Dialog.DialogTitle>
                </Dialog.DialogHeader>
                <p><strong>Date:</strong> {new Date(ev.start.date || ev.start.dateTime).toString()}</p>
                {ev.location && <p><strong>Location:</strong> {ev.location}</p>}
                {ev.description && <p><strong>Description:</strong> {ev.description}</p>}
              </Dialog.DialogContent>
            </Dialog.Dialog>
          ))
        ) : !loading && !error && (
          <p>No events this month.</p>
        )}
      </div>
    </div>
  );
}
