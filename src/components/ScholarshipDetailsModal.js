import React, { useEffect } from 'react';
import { FiX, FiCalendar, FiGlobe, FiTarget, FiDollarSign, FiUnlock } from 'react-icons/fi';
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

  return (
    <div className="modal-overlay-scholarship" onClick={onClose}>
      <div className="modal-content-scholarship" onClick={(e) => e.stopPropagation()}>
        {/* --- Top Header --- */}
        <header className="modal-header-scholarship">
          <div className="top-info">
            <span className="modal-badge">{scholarship.badge || 'Full Scholarship'}</span>
            <h2 className="modal-title">{scholarship.title}</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}><FiX /></button>
        </header>

        {/* --- Info Grid (Deadline, Website, Eligibility, Award) --- */}
        <div className="modal-info-grid">
          <div className="info-item">
            <FiCalendar className="info-icon" />
            <div>
              <span className="info-label">Application Deadline</span>
              <span className="info-value">{scholarship.deadline || 'N/A'}</span>
            </div>
          </div>
          <div className="info-item">
            <FiGlobe className="info-icon" />
            <div>
              <span className="info-label">Official Website</span>
              <a
                href={scholarship.websiteUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="info-link"
              >
                Visit Website
              </a>
            </div>
          </div>
          <div className="info-item">
            <FiTarget className="info-icon" />
            <div>
              <span className="info-label">Eligibility</span>
              <span className="info-value">{scholarship.eligibility || 'All'}</span>
            </div>
          </div>
          <div className="info-item">
            <FiDollarSign className="info-icon" />
            <div>
              <span className="info-label">Award Amount</span>
              <span className="info-value">{formatAmount(scholarship.amount)}</span>
            </div>
          </div>
        </div>

        {/* --- Scrollable Body --- */}
        <div className="modal-body-scholarship">
          <div className="section">
            <h3 className="section-title">Requirements</h3>
            <ul className="requirements-list">
              {scholarship.requirements?.map((req, index) => <li key={index}>{req}</li>) || <li>No requirements listed.</li>}
            </ul>
          </div>

          <div className="section benefits-section">
            <h3 className="section-title">Benefits & Opportunities</h3>
            <ul className="benefits-list">
              {scholarship.benefits?.map((ben, index) => (
                <li key={index}><FiUnlock className="benefit-icon" /> {ben}</li>
              )) || <li>No benefits listed.</li>}
            </ul>
          </div>
        </div>

        {/* --- Footer Buttons --- */}
        <footer className="modal-footer-scholarship">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <a
            href={scholarship.websiteUrl || '#'}
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
