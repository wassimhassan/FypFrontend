import React from "react";
import "./CareerDetails.css";

export default function CareerDetails({ career, onClose }) {
  if (!career) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content career-details-container"
        onClick={(e) => e.stopPropagation()} // prevent closing on inner click
      >
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>

        <h2 className="career-details-title">{career.jobTitle}</h2>

        <p className="career-details-field">
          <strong>Field:</strong> {career.major}
        </p>

        <p className="career-details-salary">
          <strong>Salary Range:</strong> {career.salary}
        </p>

        <div className="career-details-section">
          <h4>Description</h4>
          <p className="career-details-desc">{career.description || "No description available."}</p>
        </div>

        <div className="career-details-section">
          <h4>Key Skills</h4>
          <ul>
            {career.skills?.length > 0
              ? career.skills.map((skill, index) => <li key={index}>{skill}</li>)
              : <li>No skills listed</li>}
          </ul>
        </div>

        <div className="career-details-section">
          <h4>Industries</h4>
          <ul>
            {career.industries?.length > 0
              ? career.industries.map((ind, index) => <li key={index}>{ind}</li>)
              : <li>No industries listed</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
