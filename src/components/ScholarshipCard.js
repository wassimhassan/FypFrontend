import React from 'react';
import { FiCalendar, FiUsers } from 'react-icons/fi';
import "./HomePage.css";

const ScholarshipCard = ({ badge, amount, title, description }) => {
  return (
    <div className="card">
      <div className="card-header">
        <div className="badge">{badge}</div>
        <div className="amount">${amount}</div>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="card-icons">
        <span><FiCalendar /></span>
        <span><FiUsers /></span>
      </div>
      <button className="btn-primary">Apply Now</button>
    </div>
  );
};

export default ScholarshipCard;
