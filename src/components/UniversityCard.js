import React from 'react';
import './UniversitiesTab.css'; // Reuse same CSS for styles

const UniversityCard = ({ icon, name, location, rank, acceptanceRate, students, tuition, website }) => {
  return (
    <div className="card">
      <div className="card-icon">{icon}</div>

      <div className="card-header">
        <span className="badge rank-badge">{rank}</span>
      </div>

      <h3>{name}</h3>
      <p className="location">{location}</p>

      <div className="stats-row">
        <div className="stat-item">
          <strong>Acceptance Rate:</strong> {acceptanceRate}
        </div>
        <div className="stat-item">
          <strong>Students:</strong> {students}
        </div>
      </div>

      <p className="tuition">
        <strong>Annual Tuition:</strong> {tuition}
      </p>

      <button
        className="learnmore-btn"
        onClick={() => window.open(website, '_blank')}
      >
        Learn More
      </button>
    </div>
  );
};

export default UniversityCard;
