import React, { useEffect, useState } from 'react';
import './CareersTab.css';
import CareerCard from '../components/CareerCard'; // adjust the path if needed
import CareerDetails from '../components/CareerDetails'; // 👈 import the existing details component
import axios from 'axios';

export default function CareersTab() {
  const [careers, setCareers] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState(null); // 👈 modal state

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/careers`);
        setCareers(response.data);
      } catch (error) {
        console.error("Error fetching careers:", error);
      }
    };

    fetchCareers();
  }, []);

  // 👇 Handler to trigger the modal
  const handleLearnMore = (career) => {
    setSelectedCareer(career);
  };

  // 👇 Handler to close the modal
  const closeModal = () => {
    setSelectedCareer(null);
  };

  return (
    <section className="tab-content">
      <h2>Career Paths</h2>
      <p>Discover potential careers for each major.</p>
      <div className="card-row">
        {careers.map((career) => (
          <CareerCard
            key={career._id}
            _id={career._id}
            major={career.field}
            jobTitle={career.title}
            description={career.description}
            salary={career.salaryRange}
            skills={career.skills}
            industries={career.industries}
            onLearnMore={handleLearnMore} // 👈 pass handler to card
          />
        ))}
      </div>

      {/* 👇 Show modal when a career is selected */}
      {selectedCareer && (
        <CareerDetails 
          career={selectedCareer} 
          onClose={closeModal} 
        />
      )}
    </section>
  );
}