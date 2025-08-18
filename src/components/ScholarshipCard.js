import { FiCalendar, FiUsers, FiDollarSign, FiAward } from "react-icons/fi";
import "./ScholarshipCard.css";

const formatAmount = (amount) => {
  if (!amount && amount !== 0) return "—";
  if (typeof amount === "number") return `$${amount.toLocaleString()}`;
  // strings like "55000 - 95000" or "$55,000 - $95,000"
  return String(amount);
};

const ScholarshipCard = ({ badge, amount, title, description }) => {
  return (
    <div className="scholarship-card">
      {/* chips */}
      <div className="scholarship-card-header">
        {badge ? (
          <div className="scholarship-badge">
            <FiAward className="badge-icon" />
            {badge}
          </div>
        ) : (
          <div className="badge-spacer" />
        )}
        <div className="scholarship-amount">
          <FiDollarSign className="amount-icon" />
          {formatAmount(amount)}
        </div>
      </div>

      {/* title */}
      <h3 className="scholarship-title" title={title}>
        {title}
      </h3>


      {/* meta tiles */}
      <div className="scholarship-tiles">
        <div className="scholarship-tile">
          <div className="tile-ico tile-ico-deadline">
            <FiCalendar />
          </div>
          <div className="tile-text">
            <span className="tile-label">Deadline</span>
            <span className="tile-value">Soon</span>
          </div>
        </div>

        <div className="scholarship-tile">
          <div className="tile-ico tile-ico-spots">
            <FiUsers />
          </div>
          <div className="tile-text">
            <span className="tile-label">Availability</span>
            <span className="tile-value">Limited Spots</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <button className="scholarship-apply-btn">Apply Now</button>
    </div>
  );
};

export default ScholarshipCard;
