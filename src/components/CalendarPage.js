import React, { useState } from "react";
import Calendar from "./Calendar.js";
import UpcomingEvents from "./UpcomingEvents.js";
import "./Calendar.css";
import "./UpcomingEvents.css";

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  const events = [
    { id: "1", title: "University Fair 2026", tag: "University Fair", date: "Mon, Mar 9", time: "10:00 AM - 4:00 PM", mode: "Online", type: "Virtual", desc: "Meet representatives from top universities in Lebanon and abroad. Get information about admission requirements, scholarships, and programs"},
    { id: "2", title: "SAT Preparation Workshop", tag: "Workshop", date: "Mon, Mar 16", time: "2:00 PM - 5:00 PM", mode: "Online", type: "Virtual", desc: "Intensive SAT preparation workshop..." },
    { id: "3", title: "Career Expo - Tech Industry", tag: "Career Fair", date: "Sun, Mar 22", time: "9:00 AM - 6:00 PM", mode: "Online", type: "Virtual", desc: "Connect with leading tech companies..." },
    { id: "4", title: "Scholarship Application Deadline", tag: "Deadline", date: "Thu, Mar 26", time: "11:59 PM", mode: "Online", type: "Virtual", desc: "Final deadline for merit-based scholarship applications..." },
    { id: "5", title: "Study Abroad Information Session", tag: "Information Session", date: "Sun, Mar 29", time: "6:00 PM - 8:00 PM", mode: "Online", type: "Virtual", desc: "Learn about study abroad opportunities..." },
  ];

  return (
    <div className="page">
      <header className="page-header">
        <h1>Educational Events & Calendar</h1>
        <p>Stay updated with upcoming educational events, deadlines, and opportunities.</p>
      </header>

      <div className="container">
        <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        <UpcomingEvents events={events} />
      </div>
    </div>
  );
};

export default CalendarPage;
