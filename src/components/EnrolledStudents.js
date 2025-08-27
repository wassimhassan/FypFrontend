import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EnrolledStudents.css';

export default function EnrolledStudents({ courseId, onUpdate }) {
  const [enrolled, setEnrolled]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');

  const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

  const fetchEnrolled = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API}/courses/${courseId}/enrolled`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEnrolled(data.students || []);
      setError('');
    } catch (err) {
      console.error('Error fetching enrolled students:', err);
      setError(err.response?.data?.message || 'Failed to load enrolled students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) fetchEnrolled();
  }, [courseId]);

  const handleRemove = async (studentId) => {
    if (!window.confirm('Remove this student from the course?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API}/courses/${courseId}/enrolled/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEnrolled(prev => prev.filter(s => s._id !== studentId));
      if (onUpdate) onUpdate();
      alert('Student removed.');
    } catch (err) {
      console.error('Error removing student:', err);
      alert(err.response?.data?.message || 'Failed to remove student');
    }
  };

  if (loading) return <div className="enrollment-requests-loading">Loading enrolled students...</div>;
  if (error)   return <div className="enrollment-requests-error">Error: {error}</div>;

  return (
    <div className="enrolled-students">
      <h3>Enrolled Students ({enrolled.length})</h3>

      {enrolled.length === 0 ? (
        <p className="no-pending">No enrolled students yet.</p>
      ) : (
        <div className="pending-students-list">
          {enrolled.map((student) => (
            <div key={student._id} className="pending-student-card">
              <div className="student-info">
                <div className="student-avatar">
                  <img
                    src={student.profilePicture || 'https://fekra.s3.eu-north-1.amazonaws.com/default.png'}
                    alt={student.username}
                    onError={(e) => { e.target.src = 'https://fekra.s3.eu-north-1.amazonaws.com/default.png'; }}
                  />
                </div>
                <div className="student-details">
                  <h4>{student.username}</h4>
                  <p>{student.email}</p>
                </div>
              </div>

              <div className="student-actions">
                <button className="reject-btn" onClick={() => handleRemove(student._id)}>
                  ✕ Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
