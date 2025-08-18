import { FiTrendingUp, FiBriefcase, FiDollarSign, FiStar } from "react-icons/fi"
import "./CareerCard.css"

const CareerCard = ({ major, jobTitle, description, salary, skills, industries, badge }) => {
  return (
    <div className="career-card">
      {badge && (
        <div className="career-badge">
          <FiStar className="badge-icon" />
          {badge}
        </div>
      )}

      <div className="career-major">
        <FiBriefcase className="major-icon" />
        {major}
      </div>

      <h4 className="career-title">{jobTitle}</h4>
      <p className="career-description">{description}</p>

      <div className="career-salary">
        <FiDollarSign className="salary-icon" />
        <span>
          <strong>Annual Salary:</strong> {salary}
        </span>
      </div>

      <div className="career-skills-section">
        <strong className="skills-label">Key Skills:</strong>
        <div className="career-skills">
          {skills.slice(0, 3).map((skill, idx) => (
            <span key={idx} className="career-skill-tag">
              {skill}
            </span>
          ))}
          {skills.length > 3 && <span className="skills-more">+{skills.length - 3} more</span>}
        </div>
      </div>

      <div className="career-industries">
        <FiTrendingUp className="industries-icon" />
        <span>
          <strong>Industries:</strong> {industries.slice(0, 2).join(", ")}
        </span>
        {industries.length > 2 && <span className="industries-more">+{industries.length - 2} more</span>}
      </div>

      <button className="career-learn-btn">Learn More</button>
    </div>
  )
}

export default CareerCard
