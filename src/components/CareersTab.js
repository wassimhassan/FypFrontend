import React from 'react';
import './CareersTab.css';
import CareerCard from '../components/CareerCard'; // adjust the path if needed

const careers = [
  {
    id: 1,
    major: 'Computer Science',
    jobTitle: 'Software Developer',
    description: 'Build applications, websites, and software systems',
    salary: '$40,000 - $100,000',
    skills: ['Programming', 'Problem Solving'],
    industries: ['Technology', 'Finance', 'Healthcare'],
  },
  {
    id: 2,
    major: 'Data Science',
    jobTitle: 'Data Scientist',
    description: 'Extract insights from large datasets using analytics',
    salary: '$85,000 - $165,000',
    skills: ['Python', 'Statistics', 'Machine Learning'],
    industries: ['Tech', 'Finance', 'Research'],
  },
  {
    id: 3,
    major: 'Information Technology',
    jobTitle: 'IT Support Specialist',
    description: 'Maintain and troubleshoot IT systems and networks',
    salary: '$30,000 - $70,000',
    skills: ['Networking', 'Hardware', 'Customer Service'],
    industries: ['Corporate', 'Healthcare', 'Education'],
  },
  {
    id: 4,
    major: 'Business Administration',
    jobTitle: 'Business Analyst',
    description: 'Analyze business needs and improve processes',
    salary: '$50,000 - $110,000',
    skills: ['Data Analysis', 'Communication'],
    industries: ['Finance', 'Consulting', 'Retail'],
  },
  {
    id: 5,
    major: 'Mechanical Engineering',
    jobTitle: 'Mechanical Engineer',
    description: 'Design and develop mechanical devices',
    salary: '$55,000 - $120,000',
    skills: ['CAD', 'Problem Solving', 'Mathematics'],
    industries: ['Manufacturing', 'Automotive', 'Aerospace'],
  },
  {
    id: 6,
    major: 'Marketing',
    jobTitle: 'Digital Marketer',
    description: 'Plan and execute online marketing campaigns',
    salary: '$40,000 - $90,000',
    skills: ['SEO', 'Content Creation', 'Analytics'],
    industries: ['Advertising', 'Media', 'E-commerce'],
  },
];

export default function CareersTab() {
  return (
    <section className="tab-content">
      <h2>Career Paths</h2>
      <p>Discover potential careers for each major.</p>
      <div className="card-row">
        {careers.map(career => (
          <CareerCard
            key={career.id}
            major={career.major}
            jobTitle={career.jobTitle}
            description={career.description}
            salary={career.salary}
            skills={career.skills}
            industries={career.industries}
            badge={career.badge} // optional
          />
        ))}
      </div>
    </section>
  );
}
