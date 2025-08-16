
import React from "react";
import "./TeacherCourse.css";

export default function TeacherCourse({ course, onEdit, onDelete, onAction, buttonLabel }) {
  return (
    <div className="course-card">
      {(onEdit || onDelete) && (
      <div className="card-hover-buttons">
        <button className="edit-btn" onClick={onEdit}>✎</button>
        <button className="delete-btn" onClick={onDelete}>🗑</button>
      </div>
      )}
      <div className="course-header">
        <span className="course-type">{course.category}</span>
        <span className={`course-price ${course.price === "Free" ? "free" : "paid"}`}>{course.price}</span>
      </div>

      <h3 className="course-title">{course.title}</h3>
      <p className="course-instructor">by {course.instructor}</p>

      <div className="course-info">
        <span>⏱ {course.durationDays} days</span>
        <span>👥 {course.enrolledStudents?.length ?? 0}</span>
        <span>⭐ {course.ratingAvg ?? 0}/5 ({course?.ratingCount ?? 0})</span>
      </div>

      <span className="course-level">{course.level}</span>
      <button className="course-btn" onClick={() => onAction?.(course)}>{buttonLabel}</button>
    </div>
  );
}
