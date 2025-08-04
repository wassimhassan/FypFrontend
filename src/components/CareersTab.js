import React from 'react';
import './CareersTab.css';

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
    // no badge here to avoid empty space
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
  // add more if you want
];

export default function CareersTab() {
  return (
    <section className="tab-content">
      <h2>Career Paths</h2>
      <p>Discover potential careers for each major.</p>
      <div className="card-row">
        {careers.map(career => (
          <div key={career.id} className="card">
            {/* Only render this div if badge exists */}
            {career.badge && (
              <div className="card-header">
                <span className="badge">{career.badge}</span>
              </div>
            )}

            <button className="major-badge">{career.major}</button>

            <h4>{career.jobTitle}</h4>
            <p>{career.description}</p>
            <p><strong>Annual Salary:</strong> {career.salary}</p>

            <strong>Key Skills:</strong>
            <div className="skills-container">
              {career.skills.map((skill, idx) => (
                <span key={idx} className="skill-badge">{skill}</span>
              ))}
            </div>

            <p><strong>Industries:</strong> {career.industries.join(', ')}</p>
            <button className="enroll-btn">Learn More</button>
          </div>
        ))}
      </div>
    </section>
  );
}
