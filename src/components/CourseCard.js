import React from 'react';
import './CoursesTab.css'; // Reuse the same CSS

const CourseCard = ({ title, description, badge }) => {
  return (
    <div className="card">
      <div className="card-header">
        <span className="badge">{badge}</span>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <button className="enroll-btn">Enroll Now</button>
    </div>
  );
};

export default CourseCard;
