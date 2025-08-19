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
  // ---- Safe formatting (prevents NaN / undefined showing) ----
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
    <div className="modern-course-card">
      {(onEdit || onDelete) && (
        <div className="course-hover-buttons">
          {onEdit && (
            <button className="course-edit-btn" onClick={onEdit} aria-label="Edit">
              <FiEdit3 />
            </button>
          )}
          {onDelete && (
            <button className="course-delete-btn" onClick={onDelete} aria-label="Delete">
              <FiTrash2 />
            </button>
          )}
        </div>
      )}

      {/* Header chips */}
      <div className="course-card-header">
        <div className="course-category">
          <FiBookOpen className="category-icon" />
          {course?.category || "General"}
        </div>

        <div
          className={`course-pricing ${
            priceDisplay === "Free" ? "free" : "paid"
          }`}
          title={`Price: ${priceDisplay}`}
        >
          <FiDollarSign className="price-icon" />
          {priceDisplay}
        </div>
      </div>

      {/* Title + Instructor */}
      <h3 className="course-card-title">{course?.title || "Untitled course"}</h3>
      <p className="course-card-instructor">
        by {course?.instructor || "Unknown"}
      </p>

      {/* Stats tiles (uniform height & aligned like universities) */}
      <div className="course-card-stats">
        <div className="stat-tile">
          <div className="stat-ico">
            <FiClock />
          </div>
          <div className="stat-text">
            <span className="stat-label">Duration</span>
            <span className="stat-value">{durationDays} days</span>
          </div>
        </div>

        <div className="stat-tile">
          <div className="stat-ico">
            <FiUsers />
          </div>
          <div className="stat-text">
            <span className="stat-label">Students</span>
            <span className="stat-value">{enrolled.toLocaleString()}</span>
          </div>
        </div>

        <div className="stat-tile">
          <div className="stat-ico">
            <FiStar />
          </div>
          <div className="stat-text">
            <span className="stat-label">Rating</span>
            <span className="stat-value">
              {ratingAvg}/5 ({ratingCount})
            </span>
          </div>
        </div>
      </div>

     

      {/* CTA pinned to bottom */}
      <button
        className="course-card-btn"
        onClick={() => onAction?.(course)}
        aria-label={buttonLabel}
      >
        {buttonLabel}
      </button>
    </div>
  );
}
