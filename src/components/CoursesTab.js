import React from 'react';
import './CoursesTab.css';

const courses = [
  { id: 1, title: 'SAT Course', description: 'Prepare for your SAT exam.', badge: 'free' },
  { id: 2, title: 'Java Course', description: 'Learn Java programming.', badge: '15$' },
  { id: 3, title: 'Python Basics', description: 'Start coding with Python.', badge: 'free' },
  { id: 4, title: 'Web Development', description: 'Build websites from scratch.', badge: 'free' },
];

export default function CoursesTab() {
  return (
    <section className="tab-content">
      <h2>Available Courses</h2>
      <p>Explore our featured courses to boost your skills.</p>
      <div className="card-row">
        {courses.map(course => (
          <div key={course.id} className="card">
            <div className="card-header">
              <span className="badge">{course.badge}</span>
            </div>
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <button className="enroll-btn">Enroll Now</button>
          </div>
        ))}
      </div>
    </section>
  );
}

