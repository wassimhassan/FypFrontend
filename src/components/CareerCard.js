import { FiTrendingUp, FiBriefcase, FiDollarSign, FiStar } from "react-icons/fi";
import "./CareerCard.css";
import { useNavigate } from "react-router-dom";

const CareerCard = ({ _id, major, jobTitle, salary, skills = [], industries = [], badge }) => {
  const primarySkills = skills.slice(0, 3);
  const extraSkills = skills.slice(3);
  const fullSkillsText = skills.join(", ");
  const navigate = useNavigate();

  const handleLearnMore = () => {
    navigate(`/careers/${_id}`);
  };

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

      <div className="career-tile">
        <div className="tile-ico salary-ico">
          <FiDollarSign />
        </div>
        <div className="tile-text">
          <span className="tile-label">Annual Salary</span>
          <span className="tile-value">{salary || "—"}</span>
        </div>
      </div>

      {/* Key Skills – 2-line clamp + “+N more” with hover tooltip */}
      <div className="career-tile">
        <div className="tile-ico skills-ico">
          <FiStar />
        </div>
        <div className="tile-text">
          <span className="tile-label">Key Skills</span>
          <div className="skills-line">
            <span className="tile-value skills-clamp">
              {primarySkills.length ? primarySkills.join(", ") : "—"}
            </span>
            {extraSkills.length > 0 && (
              <span
                className="skills-more-badge"
                data-tooltip={fullSkillsText}
                aria-label={fullSkillsText}
              >
                +{extraSkills.length} more
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="career-tile">
        <div className="tile-ico industries-ico">
          <FiTrendingUp />
        </div>
        <div className="tile-text">
          <span className="tile-label">Industries</span>
          <span className="tile-value">
            {industries.slice(0, 2).join(", ") || "—"}
            {industries.length > 2 && ` +${industries.length - 2} more`}
          </span>
        </div>
      </div>

      <button className="career-learn-btn" onClick={handleLearnMore}>
  Learn More
</button>

    </div>
  );
};

export default CareerCard;
