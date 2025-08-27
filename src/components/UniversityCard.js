"use client";
import {
  FaMapMarkerAlt,
  FaUsers,
  FaChartLine,
  FaDollarSign,
  FaExternalLinkAlt,
  FaMedal,
  FaUniversity,
} from "react-icons/fa";
import "./UniversityCard.css";

const UniversityCard = ({
  icon,                // optional custom emoji/string
  name,
  location,
  rank,                // number or string
  acceptanceRate,      // number or string (e.g., 5 or "5%")
  students,            // number
  tuition,             // number or "$.."
  website = "#",
}) => {
  // formatters with guards (no NaN)
  const fmtRate =
    acceptanceRate === 0 || acceptanceRate === "0"
      ? "0%"
      : acceptanceRate || acceptanceRate === 0
      ? `${String(acceptanceRate).includes("%") ? acceptanceRate : `${acceptanceRate}%`}`
      : "—";

  const fmtStudents =
    students === 0 || typeof students === "number"
      ? Number(students).toLocaleString()
      : students
      ? String(students)
      : "—";

  const fmtTuition =
    tuition === 0 || tuition
      ? String(tuition).startsWith("$")
        ? String(tuition)
        : `$${Number(tuition).toLocaleString()}`
      : "—";

  return (
    <div className="university-card">
      {/* Header */}
      <div className="university-header">
        <div className="university-icon" aria-hidden="true">
          {icon || <FaUniversity />}
        </div>

        {rank ? (
          <div className="university-rank" title={`Rank ${rank}`}>
            <FaMedal className="rank-icon" />
            <span>{String(rank).startsWith("#") ? rank : `# ${rank}`}</span>
          </div>
        ) : <div className="rank-spacer" /> }
      </div>

      {/* Title */}
      <h3 className="university-name" title={name}>{name}</h3>

      {/* Location */}
      <div className="university-location" title={location}>
        <FaMapMarkerAlt className="location-icon" />
        <span>{location || "—"}</span>
      </div>

      {/* Stats (uniform tiles) */}
      <div className="university-stats">
        <div className="stat-tile">
          <div className="stat-ico">
            <FaChartLine />
          </div>
          <div className="stat-text">
            <span className="stat-label">Acceptance Rate</span>
            <span className="stat-value">{fmtRate}</span>
          </div>
        </div>

        <div className="stat-tile">
          <div className="stat-ico">
            <FaUsers />
          </div>
          <div className="stat-text">
            <span className="stat-label">Students</span>
            <span className="stat-value">{fmtStudents}</span>
          </div>
        </div>
      </div>

      {/* Tuition */}
      <div className="tuition-tile" aria-label="Annual Tuition">
        <div className="tuition-ico">
          <FaDollarSign />
        </div>
        <div className="tuition-text">
          <span className="tuition-label">Annual Tuition</span>
          <span className="tuition-value">{fmtTuition}</span>
        </div>
      </div>

      {/* CTA pinned to bottom */}
      <button
        className="learn-btn"
        onClick={() => window.open(website, "_blank", "noopener,noreferrer")}
      >
        <span>Learn More</span>
        <FaExternalLinkAlt className="btn-ext" />
      </button>
    </div>
  );
};

export default UniversityCard;
