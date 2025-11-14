"use client";
import {
  FiClock,
  FiUsers,
  FiStar,
  FiEdit3,
  FiTrash2,
  FiBookOpen,
  FiDollarSign,
} from "react-icons/fi";
import "./TeacherCourse.css";

export default function TeacherCourse({
  course,
  onEdit,
  onDelete,
  onAction,
  buttonLabel,
}) {
  const durationDays =
    typeof course?.durationDays === "number"
      ? course.durationDays
      : Number(course?.durationDays) || 0;

  const enrolled =
    Array.isArray(course?.enrolledStudents)
      ? course.enrolledStudents.length
      : Number(course?.enrolledStudents) || 0;

  const ratingAvg =
    typeof course?.ratingAvg === "number"
      ? course.ratingAvg
      : Number(course?.ratingAvg) || 0;

  const ratingCount =
    typeof course?.ratingCount === "number"
      ? course.ratingCount
      : Number(course?.ratingCount) || 0;

  const priceRaw = course?.price;
  const priceDisplay =
    priceRaw === "Free" || priceRaw === 0
      ? "Free"
      : typeof priceRaw === "number"
      ? `$${priceRaw.toLocaleString()}`
      : String(priceRaw || "—");

  return (
    <div className="course-card">
      <div className="course-top-strip"></div>

      {(onEdit || onDelete) && (
        <div className="hover-buttons">
          {onEdit && (
            <button className="edit-btn" onClick={onEdit}>
              <FiEdit3 />
            </button>
          )}
          {onDelete && (
            <button className="delete-btn" onClick={onDelete}>
              <FiTrash2 />
            </button>
          )}
        </div>
      )}

      {/* Chips */}
      <div className="chips-row">
        <span className="chip category-chip">
          <FiBookOpen /> {course?.category || "General"}
        </span>

        <span
          className={`chip price-chip ${
            priceDisplay === "Free" ? "free" : "paid"
          }`}
        >
          <FiDollarSign /> {priceDisplay}
        </span>
      </div>

      <h3 className="course-title">{course?.title || "Untitled Course"}</h3>
      <p className="course-instructor">by {course?.instructor || "Unknown"}</p>

      <div className="stats-container">
        <div className="stat-block">
          <FiClock className="stat-icon" />
          <div>
            <div className="stat-label">Duration</div>
            <div className="stat-value">{durationDays} days</div>
          </div>
        </div>

        <div className="stat-block">
          <FiUsers className="stat-icon" />
          <div>
            <div className="stat-label">Students</div>
            <div className="stat-value">{enrolled}</div>
          </div>
        </div>

        <div className="stat-block">
          <FiStar className="stat-icon" />
          <div>
            <div className="stat-label">Rating</div>
            <div className="stat-value">
              ⭐ {ratingAvg}/5 ({ratingCount})
            </div>
          </div>
        </div>
      </div>

      <button className="manage-btn" onClick={() => onAction?.(course)}>
        {buttonLabel}
      </button>
    </div>
  );
}
