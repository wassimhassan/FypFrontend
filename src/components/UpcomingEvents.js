import React from "react";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { FaArrowTrendUp } from "react-icons/fa6";

const UpcomingEvents = ({ events }) => {
  return (
    <div className="right card-box">
      <h2 className="section-title">
        <FaArrowTrendUp className="icon-title" /> Upcoming Events
      </h2>
      <p className="section-subtext">Don't miss these important educational events</p>

      {events.map((item) => (
        <div key={item.id} className="card">
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
            <span className="badge">{item.type}</span>
          </div>

          <p className="desc">{item.desc}</p>
          <button className="button">Register Now</button>
        </div>
      ))}
    </div>
  );
};

export default UpcomingEvents;
