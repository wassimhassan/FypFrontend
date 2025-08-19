import { FiDollarSign, FiAward, FiFileText, FiList } from "react-icons/fi";
import "./ScholarshipCard.css";

const formatAmount = (val) => {
  if (val === 0 || typeof val === "number") return `$${Number(val).toLocaleString()}`;
  if (!val) return "—";
  return String(val);
};

const ScholarshipCard = ({ badge, amount, title, description, requirements }) => {
  return (
    <div className="scholarship-card">
      {/* Top chips */}
      <div className="scholarship-card-header">
        <div className="scholarship-badge">
          <FiAward className="badge-icon" />
          {badge || "Scholarship"}
        </div>
        <div className="scholarship-amount">
          {formatAmount(amount)}
        </div>
      </div>

      {/* Title */}
      <h3 className="scholarship-title" title={title}>
        {title}
      </h3>

      {/* Description tile (2 lines) */}
      <div className="scholarship-tile">
        <div className="tile-ico tile-ico-desc">
          <FiFileText />
        </div>
        <div className="tile-text">
          <span className="tile-label">Description</span>
          <span className="tile-value clamp-2" title={description}>
            {description || "—"}
          </span>
        </div>
      </div>

      {/* Requirements tile (2 lines) */}
      <div className="scholarship-tile">
        <div className="tile-ico tile-ico-req">
          <FiList />
        </div>
        <div className="tile-text">
          <span className="tile-label">Requirements</span>
          <span className="tile-value clamp-2" title={requirements}>
            {requirements || "—"}
          </span>
        </div>
      </div>

      <button className="scholarship-apply-btn">View Details</button>
    </div>
  );
};

export default ScholarshipCard;
