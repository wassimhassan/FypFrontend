import { FiCalendar, FiUsers, FiDollarSign, FiAward } from "react-icons/fi"
import "./ScholarshipCard.css"

const ScholarshipCard = ({ badge, amount, title, description }) => {
  return (
    <div className="scholarship-card">
      <div className="scholarship-card-header">
        <div className="scholarship-badge">
          <FiAward className="badge-icon" />
          {badge}
        </div>
        <div className="scholarship-amount">
          <FiDollarSign className="amount-icon" />
          {amount}
        </div>
      </div>

      <h3 className="scholarship-title">{title}</h3>
      <p className="scholarship-description">{description}</p>

      <div className="scholarship-meta">
        <div className="meta-item">
          <FiCalendar className="meta-icon" />
          <span>Deadline Soon</span>
        </div>
        <div className="meta-item">
          <FiUsers className="meta-icon" />
          <span>Limited Spots</span>
        </div>
      </div>

      <button className="scholarship-apply-btn">Apply Now</button>
    </div>
  )
}

export default ScholarshipCard
