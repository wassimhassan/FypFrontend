import React from "react";
import "./Calendar.css";

export default function Calendar({ events, selectedDate, setSelectedDate }) {
  const month = selectedDate.getMonth();
  const year = selectedDate.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

  const days = [];
  const currentDate = new Date(startDate);

  for (let i = 0; i < 42; i++) {
    const dateCopy = new Date(currentDate);
    const isCurrentMonth = dateCopy.getMonth() === month;
    const isToday = dateCopy.toDateString() === new Date().toDateString();
    const hasEvents = events.some(e => e.date === dateCopy.toISOString().split("T")[0]);

    days.push(
      <button
        key={dateCopy.toISOString()}
        onClick={() => setSelectedDate(new Date(dateCopy))}
        className={`calendar-day ${isCurrentMonth ? "" : "other-month"} ${
          isToday ? "today" : ""
        } ${selectedDate.toDateString() === dateCopy.toDateString() ? "selected" : ""}`}
      >
        <span className="date-number">{dateCopy.getDate()}</span>
        {hasEvents && <span className="event-dot"></span>}
      </button>
    );

    currentDate.setDate(currentDate.getDate() + 1);
  }

  const prevMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setSelectedDate(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setSelectedDate(newDate);
  };

  return (
    <div className="calendar-card">
      <div className="calendar-header">
        <button onClick={prevMonth}>←</button>
        <h3>{selectedDate.toLocaleString("en-US", { month: "long", year: "numeric" })}</h3>
        <button onClick={nextMonth}>→</button>
      </div>

      <div className="calendar-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
          <div key={d} className="calendar-weekday">{d}</div>
        ))}
        {days}
      </div>
    </div>
  );
}
