"use client"
import { FiClock, FiUsers, FiStar, FiEdit3, FiTrash2, FiBookOpen, FiDollarSign } from "react-icons/fi"
import "./TeacherCourse.css"

export default function TeacherCourse({ course, onEdit, onDelete, onAction, buttonLabel }) {
  return (
    <div className="modern-course-card">
      {(onEdit || onDelete) && (
        <div className="course-hover-buttons">
          <button className="course-edit-btn" onClick={onEdit}>
            <FiEdit3 />
          </button>
          <button className="course-delete-btn" onClick={onDelete}>
            <FiTrash2 />
          </button>
        </div>
      )}

      <div className="course-card-header">
        <div className="course-category">
          <FiBookOpen className="category-icon" />
          {course.category}
        </div>
        <div className={`course-pricing ${course.price === "Free" ? "free" : "paid"}`}>
          <FiDollarSign className="price-icon" />
          {course.price}
        </div>
      </div>

      <h3 className="course-card-title">{course.title}</h3>
      <p className="course-card-instructor">by {course.instructor}</p>

      <div className="course-card-stats">
        <div className="stat-item">
          <FiClock className="stat-icon" />
          <span>{course.durationDays} days</span>
        </div>
        <div className="stat-item">
          <FiUsers className="stat-icon" />
          <span>{course.enrolledStudents?.length ?? 0}</span>
        </div>
        <div className="stat-item">
          <FiStar className="stat-icon" />
          <span>
            {course.ratingAvg ?? 0}/5 ({course?.ratingCount ?? 0})
          </span>
        </div>
      </div>

      <div className="course-card-level">{course.level}</div>
      <button className="course-card-btn" onClick={() => onAction?.(course)}>
        {buttonLabel}
      </button>
    </div>
  )
}
