import React, { useEffect, useState } from 'react';
import './CoursesTab.css';
import CourseCard from '../components/CourseCard';
import axios from 'axios';

export default function CoursesTab() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/courses`);
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <section className="tab-content">
      <h2>Available Courses</h2>
      <p>Explore our featured courses to boost your skills.</p>
      <div className="card-row">
        {courses.map((course) => (
          <CourseCard
            key={course._id}
            title={course.title}
            description={course.description}
            badge={course.price}
          />
        ))}
      </div>
    </section>
  );
}
