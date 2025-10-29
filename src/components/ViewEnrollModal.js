import React, { useEffect } from "react";
import "./ViewEnrollModal.css";

// --- SVGs for icons ---
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.41-1.412A6.972 6.972 0 0010 11.5c-2.25 0-4.337.894-5.95 2.411a1.232 1.232 0 00-.585.582z" />
  </svg>
);

const TeacherIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z" clipRule="evenodd" />
  </svg>
);


export default function ViewEnrollModal({ open, course, onClose, onEnroll, loading = false, error = "" }) {
  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !course) return null;

  return (
    <div className="enroll-overlay" onClick={onClose}>
      <div className="enroll-card" onClick={(e) => e.stopPropagation()}>
        <button className="enroll-close" onClick={onClose} aria-label="Close">×</button>

        <div className="enroll-content">
          <span className="enroll-tag">{course.category || "Academic"}</span>

          <h1>{course.title || "Course Title"}</h1>
          <p className="enroll-subtitle">{course.profName || "by Prof. David Lee"}</p>

          <div className="enroll-info-section">
            <div className="icon-wrapper"><UserIcon /></div>
            <div>
              <strong>Level</strong>
              <p>{course.level || "Beginner"}</p>
            </div>
          </div>

          <div className="enroll-info-section">
            <div>
              <strong>Description</strong>
              <p className="enroll-desc">{course.description || "No description available."}</p>
            </div>
          </div>
          
          <div className="notice-box">
            <div className="icon-wrapper"><TeacherIcon /></div>
            <div className="notice-text">
              <strong>Teacher Approval Required</strong>
              <p>Your enrollment request will be reviewed by the course instructor before you can access the course content.</p>
            </div>
          </div>

          {Boolean(error) && (
            <div className="enroll-error">
              <p>{error}</p>
            </div>
          )}
        </div>

        <footer className="enroll-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={() => onEnroll?.(course)} disabled={loading}>
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </footer>
      </div>
    </div>
  );
}