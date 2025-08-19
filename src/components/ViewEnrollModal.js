// ===============================
// ViewEnrollModal.jsx
// ===============================
import React, { useEffect } from "react";
import "./ViewEnrollModal.css";


export default function ViewEnrollModal({ open, course, onClose, onEnroll, loading=false, error="" }) {
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
        <header className="enroll-header">
          <h3 className="enroll-title">{course.title || "Course"}</h3>
          <button className="enroll-close" onClick={onClose} aria-label="Close">×</button>
        </header>

        <section className="enroll-body">
          <div className="enroll-row">
            <span className="enroll-label">Level</span>
            <span className="enroll-pill">{course.level || "All levels"}</span>
          </div>

          <div className="enroll-row">
            <span className="enroll-label">Description</span>
            <p className="enroll-desc">{course.description || "No description."}</p>
          </div>

          {Boolean(error) && (
            <div className="enroll-row">
              <p style={{margin:0, color:"#c02626", fontWeight:600}}>{error}</p>
            </div>
          )}
        </section>

        <footer className="enroll-footer">
          <button className="enroll-btn ghost" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="enroll-btn primary" onClick={() => onEnroll?.(course)} disabled={loading}>
            {loading ? "Enrolling..." : "Enroll"}
          </button>
        </footer>
      </div>
    </div>
  );
}