import React from "react";
import "./UpcomingEvents.css";

export default function UpcomingEvents({ events }) {
  // Sort events by date and take next 6 upcoming
  const upcoming = events
    .filter((e) => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 6);

  return (
    <div className="upcoming-events">
      <h3>Upcoming Events</h3>
      {upcoming.length > 0 ? (
        <div className="events-list">
          {upcoming.map((event) => (
            <div key={event.id} className="event-card">
              <h4>{event.title}</h4>
              <p>{new Date(event.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</p>
              <p>{event.time}</p>
              <p>{event.location}</p>
              <button onClick={() => window.open(event.registrationLink, "_blank")}>
                {event.type === "Deadline" ? "More Info" : "Register Now"}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No upcoming events</p>
      )}
    </div>
  );
}
