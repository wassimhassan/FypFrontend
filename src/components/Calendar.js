import React, { useState } from "react";
import "./Calendar.css";

const Calendar = ({ selectedDate, setSelectedDate }) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(2025, 7, 1));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const handleDatePress = (day) => {
    if (!day) return;
    const dateObj = new Date(year, month, day);
    const weekdayName = weekdays[dateObj.getDay()];
    setSelectedDate({
      day: weekdayName,
      month: monthNames[month],
      date: day,
      year: year,
    });
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div className="left card-box">
      <h2 className="section-title">Event Calendar</h2>
      <p className="section-subtext">Click on a date to see events for that day</p>

      <div className="calendar-box">
        <div className="calendar-header">
          <span className="month-display">{monthNames[month]} {year}</span>
          <div className="arrows">
            <button className="arrow" onClick={prevMonth}>&lt;</button>
            <button className="arrow" onClick={nextMonth}>&gt;</button>
          </div>
        </div>

        <div className="weekdays">
          {weekdays.map((day) => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>

        <div className="calendar">
          {days.map((d, i) => {
            const isToday = d && year === today.getFullYear() && month === today.getMonth() && d === today.getDate();
            return (
              <button
                key={i}
                onClick={() => handleDatePress(d)}
                className={`day-box ${d ? "" : "empty"} 
                  ${selectedDate?.date === d && selectedDate?.month === monthNames[month] && selectedDate?.year === year ? "selected" : ""} 
                  ${isToday ? "today" : ""}`}
              >
                {d || ""}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
