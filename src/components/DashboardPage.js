import React, { useState } from "react";
import Calendar from "./Calendar";
import Events from "./Events";
import UpcomingEvents from "./UpcomingEvents";
import { events as eventsData } from "./eventsData";

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="dashboard-page" style={{ display: "flex", gap: "24px" }}>
      {/* Left: Calendar + Events */}
      <div style={{ flex: 1 }}>
        <Calendar events={eventsData} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        <Events events={eventsData} selectedDate={selectedDate} />
      </div>

      {/* Right: Upcoming Events */}
      <div style={{ flex: 1 }}>
        <UpcomingEvents events={eventsData} />
      </div>
    </div>
  );
}
