import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EnrolledStudents.css';
import { toast } from 'react-toastify';

// MUI dialog bits
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from '@mui/material';

export default function EnrolledStudents({ courseId, onUpdate }) {
  const [enrolled, setEnrolled]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');

  // delete dialog state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toRemove, setToRemove] = useState(null);

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

  const handleRemove = (studentId) => {
    const student = enrolled.find((s) => s._id === studentId);
    setToRemove(student || { _id: studentId });
    setDeleteOpen(true);
  };

  // confirmed removal
  const confirmRemove = async () => {
    if (!toRemove?._id) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API}/courses/${courseId}/enrolled/${toRemove._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEnrolled(prev => prev.filter(s => s._id !== toRemove._id));
      if (onUpdate) onUpdate();
      toast.success('Student removed.');
    } catch (err) {
      console.error('Error removing student:', err);
      toast.error(err.response?.data?.message || 'Failed to remove student');
    } finally {
      setDeleteOpen(false);
      setToRemove(null);
    }
  };

  // ⬇️ Same loading UI classes as the dashboard
  if (loading) {
    return (
      <div className="cd-overview">
        <div className="cd-loading-container">
          <div className="cd-spinner" />
          <div className="cd-loading-text">Loading enrolled students…</div>
        </div>
      </div>
    );
  }

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

      {/* Delete confirm dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Remove Student</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to remove this student from the course?</Typography>
          <Typography fontWeight="bold" mt={1}>
            {toRemove?.username || toRemove?.email || 'Selected student'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmRemove}>
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
