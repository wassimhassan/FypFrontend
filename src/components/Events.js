import React from "react";
import "./Events.css";

export default function Events({ events, selectedDate }) {
  const dateString = selectedDate.toISOString().split("T")[0];
  const dayEvents = events.filter(event => event.date === dateString);

  return (
    <div className="events-card">
      <h3 className="events-title">
        Events on {selectedDate.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric"
        })}
      </h3>

      {dayEvents.length > 0 ? (
        <div className="events-list">
          {dayEvents.map(event => (
            <div key={event.id} className="event-item">
              <div className="event-header">
                <h4 className="event-title">{event.title}</h4>
                <span className="event-type">{event.type}</span>
              </div>
              <p className="event-time">{event.time}</p>
              <p className="event-location">{event.location}</p>
              <p className="event-description">{event.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-events">No events scheduled for this date</p>
      )}
    </div>
  );
}
