"use client"
import { FiMapPin, FiUsers, FiTrendingUp, FiDollarSign, FiExternalLink, FiAward } from "react-icons/fi"
import "./UniversityCard.css"

const UniversityCard = ({ icon, name, location, rank, acceptanceRate, students, tuition, website }) => {
  return (
    <div className="university-card">
      <div className="university-header">
        <div className="university-icon">{icon}</div>
        <div className="university-rank">
          <FiAward className="rank-icon" />
          {rank}
        </div>
      </div>

      <h3 className="university-name">{name}</h3>

      <div className="university-location">
        <FiMapPin className="location-icon" />
        <span>{location}</span>
      </div>

      <div className="university-stats">
        <div className="stat-item">
          <FiTrendingUp className="stat-icon" />
          <div className="stat-content">
            <span className="stat-label">Acceptance Rate</span>
            <span className="stat-value">{acceptanceRate}</span>
          </div>
        </div>

        <div className="stat-item">
          <FiUsers className="stat-icon" />
          <div className="stat-content">
            <span className="stat-label">Students</span>
            <span className="stat-value">{students}</span>
          </div>
        </div>
      </div>

      <div className="university-tuition">
        <FiDollarSign className="tuition-icon" />
        <div className="tuition-content">
          <span className="tuition-label">Annual Tuition</span>
          <span className="tuition-value">{tuition}</span>
        </div>
      </div>

      <button className="university-learn-btn" onClick={() => window.open(website, "_blank")}>
        <span>Learn More</span>
        <FiExternalLink className="external-icon" />
      </button>
    </div>
  )
}

export default UniversityCard
