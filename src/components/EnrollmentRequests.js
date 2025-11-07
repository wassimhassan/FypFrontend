import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EnrollmentRequests.css';
import { toast } from 'react-toastify';

export default function EnrollmentRequests({ courseId, onUpdate }) {
  const [pendingStudents, setPendingStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

  const fetchPendingEnrollments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/courses/${courseId}/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingStudents(response.data.students);
      setError('');
    } catch (err) {
      console.error('Error fetching pending enrollments:', err);
      setError(err.response?.data?.message || 'Failed to load pending enrollments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchPendingEnrollments();
    }
  }, [courseId]);

  const handleApprove = async (studentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API}/courses/${courseId}/approve`,
        { studentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPendingStudents(prev => prev.filter(student => student._id !== studentId));
      if (onUpdate) onUpdate();
      toast.success('Enrollment approved successfully!');
    } catch (err) {
      console.error('Error approving enrollment:', err);
      toast.error(err.response?.data?.message || 'Failed to approve enrollment');
    }
  };

  const handleReject = async (studentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API}/courses/${courseId}/reject`,
        { studentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPendingStudents(prev => prev.filter(student => student._id !== studentId));
      if (onUpdate) onUpdate();
      toast.info('Enrollment rejected successfully!');
    } catch (err) {
      console.error('Error rejecting enrollment:', err);
      toast.error(err.response?.data?.message || 'Failed to reject enrollment');
    }
  };

  if (loading) {
    return <div className="enrollment-requests-loading">Loading pending enrollments...</div>;
  }

  if (error) {
    return <div className="enrollment-requests-error">Error: {error}</div>;
  }

  return (
    <div className="enrollment-requests">
      <h3>Pending Enrollment Requests ({pendingStudents.length})</h3>

      {pendingStudents.length === 0 ? (
        <p className="no-pending">No pending enrollment requests.</p>
      ) : (
        <div className="pending-students-list">
          {pendingStudents.map((student) => (
            <div key={student._id} className="pending-student-card">
              <div className="student-info">
                <div className="student-avatar">
                  <img
                    src={student.profilePicture || 'https://fekra.s3.eu-north-1.amazonaws.com/default.png'}
                    alt={student.username}
                    onError={(e) => {
                      e.target.src = 'https://fekra.s3.eu-north-1.amazonaws.com/default.png';
                    }}
                  />
                </div>
                <div className="student-details">
                  <h4>{student.username}</h4>
                  <p>{student.email}</p>
                </div>
              </div>

              <div className="student-actions">
                <button
                  className="approve-btn"
                  onClick={() => handleApprove(student._id)}
                >
                  ✓ Approve
                </button>
                <button
                  className="reject-btn"
                  onClick={() => handleReject(student._id)}
                >
                  ✕ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
