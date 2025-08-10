
import React, { useEffect, useState } from 'react';
import ScholarshipCard from './ScholarshipCard';
import axios from 'axios';

const ScholarshipsTab = () => {
  const [scholarships, setScholarships] = useState([]);

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/scholarships`);
        console.log("Fetched scholarships:", response.data);
        setScholarships(response.data);
      } catch (error) {
        console.error("Error fetching scholarships:", error);
      }
    };

    fetchScholarships();
  }, []);

  return (
    <div className="tab-content">
      <h2>Scholarship Opportunities</h2>
      <p>
        Find and apply for scholarships that match your academic achievements and career goals.
      </p>
      <div className="card-grid">
        {scholarships.map((sch) => (
          <ScholarshipCard
            key={sch._id}
            badge={sch.scholarship_type}
            amount={sch.scholarship_value}
            title={sch.scholarship_title}
            description={sch.scholarship_description}
          />
        ))}
      </div>
    </div>
  );
};

export default ScholarshipsTab;
