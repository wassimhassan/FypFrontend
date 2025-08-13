import React, { useEffect, useState } from 'react';
import './CareersTab.css';
import CareerCard from '../components/CareerCard'; // adjust the path if needed
import axios from 'axios';

export default function CareersTab() {
  const [careers, setCareers] = useState([]);

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

  return (
    <section className="tab-content">
      <h2>Career Paths</h2>
      <p>Discover potential careers for each major.</p>
      <div className="card-row">
        {careers.map((career) => (
          <CareerCard
            key={career._id}
            major={career.field}
            jobTitle={career.title}
            description={career.description}
            salary={career.salaryRange}
            skills={career.skills}
            industries={career.industries}
          />
        ))}
      </div>
    </section>
  );
}
