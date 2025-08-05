import React from 'react';
import './UniversitiesTab.css';
import UniversityCard from '../components/UniversityCard'; // Adjust path if needed

const universities = [
  {
    id: 1,
    name: 'American University of Beirut',
    location: 'Beirut, Lebanon',
    rank: '#1 Lebanon',
    acceptanceRate: '70%',
    students: '9,100',
    tuition: '$22,000',
    website: 'https://www.aub.edu.lb',
    icon: '🏛️',
  },
  {
    id: 2,
    name: 'Lebanese American University',
    location: 'Beirut, Lebanon',
    rank: '#2 Lebanon',
    acceptanceRate: '65%',
    students: '7,000',
    tuition: '$18,000',
    website: 'https://www.lau.edu.lb',
    icon: '🏛️',
  },
  {
    id: 3,
    name: 'Beirut Arab University',
    location: 'Beirut, Lebanon',
    rank: '#3 Lebanon',
    acceptanceRate: '60%',
    students: '14,000',
    tuition: '$12,000',
    website: 'https://www.bau.edu.lb',
    icon: '🏛️',
  },
  {
    id: 4,
    name: 'Holy Spirit University of Kaslik',
    location: 'Jounieh, Lebanon',
    rank: '#4 Lebanon',
    acceptanceRate: '55%',
    students: '6,000',
    tuition: '$14,000',
    website: 'https://www.usek.edu.lb',
    icon: '🏛️',
  },
];

export default function UniversitiesTab() {
  return (
    <section className="tab-content">
      <h2>Universities in Lebanon</h2>
      <p>Explore top universities and their key details.</p>
      <div className="card-row">
        {universities.map(uni => (
          <UniversityCard
            key={uni.id}
            icon={uni.icon}
            name={uni.name}
            location={uni.location}
            rank={uni.rank}
            acceptanceRate={uni.acceptanceRate}
            students={uni.students}
            tuition={uni.tuition}
            website={uni.website}
          />
        ))}
      </div>
    </section>
  );
}
