import React, { useEffect, useState } from "react";
import ScholarshipCard from "./ScholarshipCard";
import ScholarshipDetailsModal from "./ScholarshipDetailsModal";
import axios from "axios";
import "./ScholarshipsTab.css";

const ScholarshipsTab = () => {
  const [scholarships, setScholarships] = useState([]);
  const [selectedScholarship, setSelectedScholarship] = useState(null); // 🆕 track which scholarship is selected
  const [modalOpen, setModalOpen] = useState(false); // 🆕 track modal open/close

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/scholarships`
        );
        setScholarships(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching scholarships:", error);
      }
    };
    fetchScholarships();
  }, []);

  // 🆕 Handler when "View Details" is clicked
  const handleViewDetails = (scholarship) => {
    setSelectedScholarship(scholarship);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedScholarship(null);
  };

  return (
    <div className="tab-content">
      <h2>Scholarship Opportunities</h2>
      <p>Find and apply for scholarships that match your goals.</p>

      <div className="card-grid">
        {scholarships.map((sch) => (
          <ScholarshipCard
            key={sch._id}
            badge={sch.scholarship_type}
            amount={sch.scholarship_value}
            title={sch.scholarship_title}
            description={sch.scholarship_description}
            requirements={sch.scholarship_requirements}
            onViewDetails={() => handleViewDetails(sch)} // 🆕 pass selected scholarship
          />
        ))}
      </div>

      {/* 🆕 Render the modal */}
      <ScholarshipDetailsModal
        open={modalOpen}
        scholarship={selectedScholarship}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default ScholarshipsTab;
