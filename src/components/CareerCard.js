import React from 'react';
import './CareersTab.css'; // reuse the same CSS

const CareerCard = ({ major, jobTitle, description, salary, skills, industries, badge }) => {
  return (
    <div className="card">
      {badge && (
        <div className="card-header">
          <span className="badge">{badge}</span>
        </div>
      )}

      <button className="major-badge">{major}</button>

      <h4>{jobTitle}</h4>
      <p>{description}</p>
      <p><strong>Annual Salary:</strong> {salary}</p>

      <strong>Key Skills:</strong>
      <div className="skills-container">
        {skills.map((skill, idx) => (
          <span key={idx} className="skill-badge">{skill}</span>
        ))}
      </div>

      <p><strong>Industries:</strong> {industries.join(', ')}</p>
      <button className="enroll-btn">Learn More</button>
    </div>
  );
};

export default CareerCard;
