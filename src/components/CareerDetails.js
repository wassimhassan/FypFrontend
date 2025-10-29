import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./CareerDetails.css";

export default function CareerDetails() {
  const { id } = useParams();
  const [career, setCareer] = useState(null);

  useEffect(() => {
    const fetchCareer = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/careers/${id}`);
        setCareer(res.data);
      } catch (err) {
        console.error("Error fetching career details:", err);
      }
    };
    fetchCareer();
  }, [id]);

  if (!career) return <p className="career-loading">Loading career details...</p>;

  return (
    <div className="career-details-container">
      <h2 className="career-details-title">{career.title}</h2>
      <p className="career-details-field"><strong>Field:</strong> {career.field}</p>
      <p className="career-details-salary"><strong>Salary Range:</strong> {career.salaryRange}</p>
      <p className="career-details-desc">{career.description}</p>

      <div className="career-details-section">
        <h4>Key Skills</h4>
        <ul>
          {career.skills?.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </div>

      <div className="career-details-section">
        <h4>Industries</h4>
        <ul>
          {career.industries?.map((ind, index) => (
            <li key={index}>{ind}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
