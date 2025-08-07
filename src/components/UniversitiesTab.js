import React, { useEffect, useState } from 'react';
import './UniversitiesTab.css';
import UniversityCard from '../components/UniversityCard'; // Adjust path if needed
import axios from 'axios';

export default function UniversitiesTab() {
  const [universities, setUniversities] = useState([]);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/universities`);
        setUniversities(response.data);
      } catch (error) {
        console.error("Error fetching universities:", error);
      }
    };

    fetchUniversities();
  }, []);

  return (
    <section className="tab-content">
      <h2>Universities in Lebanon</h2>
      <p>Explore top universities and their key details.</p>
      <div className="card-row">
        {universities.map((uni, index) => (
          <UniversityCard
            key={index}
            icon="🏛️"
            name={uni.name}
            location={uni.location}
            rank={uni.rank}
            acceptanceRate={`${uni.acceptanceRate}%`}
            students={uni.numberOfStudents.toLocaleString()}
            tuition={`$${uni.tuition.toLocaleString()}`}
            website={uni.website || "#"}
          />
        ))}
      </div>
    </section>
  );
}
