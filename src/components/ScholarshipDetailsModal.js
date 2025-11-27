import React, { useEffect } from 'react';
import { FiX, FiCalendar, FiGlobe, FiDollarSign, FiUnlock } from 'react-icons/fi';
import './ScholarshipDetailsModal.css';

const formatAmount = (val) => {
  if (val === 0 || typeof val === "number") return `$${Number(val).toLocaleString()}`;
  if (!val) return "—";
  return String(val);
};

export default function ScholarshipDetailsModal({ open, scholarship, onClose }) {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [open, onClose]);

  if (!open || !scholarship) return null;

  // ---- map backend field names to UI-friendly values ----
  const badge = scholarship.scholarship_type || 'Scholarship';
  const title = scholarship.scholarship_title;
  const amount = scholarship.scholarship_value;

  const websiteUrl = scholarship.scholarship_link || '#';
  const deadlineStr = scholarship.scholarship_deadline
    ? new Date(scholarship.scholarship_deadline).toLocaleDateString()
    : 'N/A';

  const requirements = Array.isArray(scholarship.scholarship_requirements)
    ? scholarship.scholarship_requirements
    : scholarship.scholarship_requirements
      ? scholarship.scholarship_requirements
          .split('\n')
          .map(r => r.trim())
          .filter(Boolean)
      : [];

  const benefits = Array.isArray(scholarship.scholarship_benefits)
    ? scholarship.scholarship_benefits
    : scholarship.scholarship_benefits
      ? scholarship.scholarship_benefits
          .split('\n')
          .map(b => b.trim())
          .filter(Boolean)
      : [];

  return (
    <div className="modal-overlay-scholarship" onClick={onClose}>
      <div className="modal-content-scholarship" onClick={(e) => e.stopPropagation()}>
        {/* --- Top Header --- */}
        <header className="modal-header-scholarship">
          <div className="top-info">
            <span className="modal-badge">{badge}</span>
            <h2 className="modal-title">{title}</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}><FiX /></button>
        </header>

        {/* --- Info Grid (Deadline, Website, Award) --- */}
        <div className="modal-info-grid">
          <div className="info-item">
            <FiCalendar className="info-icon" />
            <div>
              <span className="info-label">Application Deadline</span>
              <span className="info-value">{deadlineStr}</span>
            </div>
          </div>
          <div className="info-item">
            <FiGlobe className="info-icon" />
            <div>
              <span className="info-label">Official Website</span>
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="info-link"
              >
                Visit Website
              </a>
            </div>
          </div>
          <div className="info-item">
            <FiDollarSign className="info-icon" />
            <div>
              <span className="info-label">Award Amount</span>
              <span className="info-value">{formatAmount(amount)}</span>
            </div>
          </div>
        </div>

        {/* --- Scrollable Body --- */}
        <div className="modal-body-scholarship">
          <div className="section">
            <h3 className="section-title">Requirements</h3>
            <ul className="requirements-list">
              {requirements.length > 0
                ? requirements.map((req, index) => <li key={index}>{req}</li>)
                : <li>No requirements listed.</li>}
            </ul>
          </div>

          <div className="section benefits-section">
            <h3 className="section-title">Benefits & Opportunities</h3>
            <ul className="benefits-list">
              {benefits.length > 0
                ? benefits.map((ben, index) => (
                    <li key={index}>
                      <FiUnlock className="benefit-icon" /> {ben}
                    </li>
                  ))
                : <li>No benefits listed.</li>}
            </ul>
          </div>
        </div>

        {/* --- Footer Buttons --- */}
        <footer className="modal-footer-scholarship">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-apply"
          >
            Apply Now
          </a>
        </footer>
      </div>
    </div>
  );
}
