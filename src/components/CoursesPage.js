import React from "react";
import "./CoursePage.css";

export default function StudentCourse({ course, onAction, buttonLabel }) {
  return (
    <div className="course-card">
      <div className="course-header">
        <span className="course-type">{course.category}</span>
        <span className={`course-price ${course.price === "Free" ? "free" : "paid"}`}>
          {course.price}
        </span>
      </div>

      <h3 className="course-title">{course.title}</h3>
      <p className="course-instructor">by {course.instructor}</p>

      <div className="course-info">
        <span>⏱ {course.durationDays} days</span>
        <span>👥 {course.studentsCount ?? course.enrolledStudents?.length ?? 0}</span>
        <span>⭐ {course.ratingAvg ?? 0}</span>
      </div>

      <span className="course-level">{course.level}</span>
      <button
        className="course-btn"
        onClick={() => onAction?.(course)}
      >
        {buttonLabel}
      </button>
    </div>
  );
}
