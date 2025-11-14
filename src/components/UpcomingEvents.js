import React, { useRef, useEffect } from "react";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { FaArrowTrendUp } from "react-icons/fa6";

const UpcomingEvents = ({ events, selectedDate }) => {
  const highlightDate = selectedDate
    ? `${selectedDate.month.slice(0, 3)} ${selectedDate.date}`
    : null;

  // refs for scroll-to
  const refs = useRef({});

  // Scroll to matching event card
  useEffect(() => {
    if (!highlightDate) return;

    const match = events.find((ev) =>
      ev.date.includes(highlightDate)
    );

    if (match && refs.current[match.id]) {
      refs.current[match.id].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [highlightDate, events]);

  return (
    <div className="right-column">
      {/* Sticky header */}
      <div className="upcoming-header">
        <h2 className="section-title">
          <FaArrowTrendUp className="icon-title" /> Upcoming Events
        </h2>
        <p className="section-subtext">
          Don't miss these important educational events
        </p>
      </div>

      {/* Scrollable content */}
      <div className="upcoming-scroll">
        {events.map((item) => (
          <div
            key={item.id}
            ref={(el) => (refs.current[item.id] = el)}
            className={`card ${
              highlightDate && item.date.includes(highlightDate)
                ? "highlighted-event"
                : ""
            }`}
          >
            <div className="header-row">
              <h3 className="event-title">{item.title}</h3>
              <span className="tag">{item.tag}</span>
            </div>

            <div className="row">
              <FaCalendarAlt className="icon" />
              <span>{item.date}</span>
            </div>

            <div className="row">
              <FaClock className="icon" />
              <span>{item.time}</span>
            </div>

            <div className="row">
              <FaMapMarkerAlt className="icon" />
              <span>{item.mode}</span>
            </div>

            {item.desc && <p className="desc">{item.desc}</p>}

            <button className="button">Register Now</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEvents;
