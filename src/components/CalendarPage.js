// CalendarPage.js
import React, { useState, useEffect, useMemo } from "react";
import Calendar from "./Calendar";
import UpcomingEvents from "./UpcomingEvents";
import "./Calendar.css";
import "./UpcomingEvents.css";
import axios from "axios";

function fmtDateRange(startsAt, endsAt) {
  const s = new Date(startsAt);
  const e = endsAt ? new Date(endsAt) : null;

  const dateStr = s.toLocaleDateString(undefined, {
    weekday: "short", month: "short", day: "numeric"
  });

  const timeStart = s.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  const timeEnd   = e ? e.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }) : null;
  const timeStr   = timeEnd ? `${timeStart} - ${timeEnd}` : timeStart;

  return { dateStr, timeStr };
}

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const API = `${process.env.REACT_APP_BACKEND_URL}/api/events`;

    axios.get(API)
      .then(res => {
        const items = res.data.items || res.data; // depends on your controller return
        const mapped = items.map(ev => {
          const { dateStr, timeStr } = fmtDateRange(ev.startsAt, ev.endsAt);
          return {
            id: ev._id,
            title: ev.title,
            tag: ev.tag || "",
            date: dateStr,
            time: timeStr,
            mode: ev.mode || "Online",
            type: ev.type || "",
            desc: ev.description || ""
          };
        });
        setEvents(mapped);
      })
      .catch(err => console.error("Failed to load events:", err));
  }, []);
  // ➤ Find events happening TODAY
  const today = new Date();
  const todayFormatted = today.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const todayEvents = useMemo(() => {
    return events.filter(ev =>
      ev.date.includes(todayFormatted.slice(4)) // matches "Nov 14"
    );
  }, [events]);

  const filtered = useMemo(() => {
    if (!selectedDate) return events;
    return events.filter(ev =>
      ev.date.includes(`${selectedDate.month.slice(0,3)} ${selectedDate.date}`)
    );
  }, [events, selectedDate]);

  return (
    <div className="page">
      <header className="page-header">
        <h1>Educational Events & Calendar</h1>
        <p>Stay updated with upcoming educational events, deadlines, and opportunities.</p>
      </header>

      <div className="container">

  {/* LEFT SIDE */}
  <div style={{ flex: 1 }}>
    <Calendar
  selectedDate={selectedDate}
  setSelectedDate={setSelectedDate}
  events={events}
/>

    {/* ➤ NEW Today's Events Box */}
    <div className="today-events-box card-box">
      <h3 className="section-title">Today's Events</h3>

      {todayEvents.length === 0 ? (
        <p className="no-event">No events today.</p>
      ) : (
        todayEvents.map(ev => (
          <div key={ev.id} className="today-event-item">
            <h4 className="today-event-title">{ev.title}</h4>
            <p className="today-event-time">{ev.time}</p>
          </div>
        ))
      )}
    </div>
  </div>

  {/* RIGHT SIDE */}
  <UpcomingEvents events={events} selectedDate={selectedDate} />

</div>

    </div>
  );
};

export default CalendarPage;
