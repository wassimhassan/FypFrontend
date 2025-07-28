import React from 'react';
import ScholarshipCard from './ScholarshipCard';

const ScholarshipsTab = () => {
  const scholarships = [
    {
      badge: 'Full Tuition',
      amount: 25000,
      title: 'Merit Excellence Scholarship',
      description: 'Outstanding academic performance and leadership potential',
    },
    {
      badge: 'Renewable',
      amount: 15000,
      title: 'STEM Innovation Grant',
      description: 'Supporting students pursuing Science, Technology, Engineering, and Mathematics',
    },
    {
      badge: 'Need-Based',
      amount: 10000,
      title: 'Community Leader Award',
      description: 'Recognizing students who have made significant community impact',
    },
  ];

  return (
    <div className="tab-content">
      <h2>Scholarship Opportunities</h2>
      <p>
        Find and apply for scholarships that match your academic achievements and career goals.
      </p>
      <div className="card-grid">
        {scholarships.map((sch, index) => (
          <ScholarshipCard
            key={index}
            badge={sch.badge}
            amount={sch.amount}
            title={sch.title}
            description={sch.description}
          />
        ))}
      </div>
    </div>
  );
};

export default ScholarshipsTab;
