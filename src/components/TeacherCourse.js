import React from "react";
import "./TeacherCourse.css";

export default function TeacherCourse({ course, onEdit, onDelete }) {
  return (
    <div className="course-card">
      <div className="card-hover-buttons">
        <button className="edit-btn" onClick={onEdit}>✎</button>
        <button className="delete-btn" onClick={onDelete}>🗑</button>
      </div>

      <div className="course-header">
        <span className="course-type">{course.type}</span>
        <span className={`course-price ${course.price === "Free" ? "free" : "paid"}`}>
          {course.price}
        </span>
      </div>
      <h3 className="course-title">{course.title}</h3>
      <p className="course-instructor">by {course.instructor}</p>
      <div className="course-info">
        <span>⏱ {course.duration}</span>
        <span>👥 {course.students}</span>
        <span>⭐ {course.rating}</span>
      </div>
      <span className="course-level">{course.level}</span>
      <button className="course-btn">Manage Course</button>
    </div>
  );
}
