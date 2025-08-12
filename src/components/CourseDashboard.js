"use client"

import { useEffect, useState } from "react"
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
    CircularProgress,

} from "@mui/material"
import { Add as AddIcon } from "@mui/icons-material"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./CourseDashboard.css"
import { Tooltip } from "@mui/material"

const CourseDashboard = () => {
  const [openDialog, setOpenDialog] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [courseToDelete, setCourseToDelete] = useState(null)
  const [teachers, setTeachers] = useState([])
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    price: "",
    teacherId: "",
  })
  const [studentDialogOpen, setStudentDialogOpen] = useState(false);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [selectedCourseTitle, setSelectedCourseTitle] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/courses")
      if (!res.ok) throw new Error("Failed to fetch courses")
      const data = await res.json()
      setCourses(data)
    } catch (err) {
      toast.error("Failed to fetch courses")
    }
  }

  const fetchTeachers = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/users/teachers")
      const data = await res.json()
      if (!res.ok) throw new Error("Failed to fetch teachers")
      setTeachers(data)
    } catch (err) {
      toast.error("Failed to fetch teachers")
    } finally {
      setLoading(false);
    }  }

  useEffect(() => {
    fetchCourses()
    fetchTeachers()
  }, [])

  const handleUpdateCourse = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:3001/api/courses/${selectedCourse._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(selectedCourse),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to update course")

      toast.success("Course updated successfully")
      setCourses((prev) => prev.map((course) => (course._id === selectedCourse._id ? data : course)))
      setEditDialogOpen(false)
      setSelectedCourse(null)
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleDeleteCourse = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:3001/api/courses/${courseToDelete._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to delete course")

      setCourses((prev) => prev.filter((c) => c._id !== courseToDelete._id))
      toast.success("Course deleted successfully")
    } catch (err) {
      toast.error("Failed to delete course")
    } finally {
      setDeleteDialogOpen(false)
      setCourseToDelete(null)
    }
  }

  const handleCreateCourse = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:3001/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCourse),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to create course")

      setCourses((prev) => [data, ...prev])
      toast.success("Course created successfully")
      setOpenDialog(false)
      setNewCourse({ title: "", description: "", price: "", teacherId: "" })
    } catch (err) {
      toast.error(err.message)
    }
  }
  const handleViewEnrolledStudents = async (course) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:3001/api/courses/${course._id}/enrolled`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch students");

      setEnrolledStudents(data.students); // ✅ not the full response
      setSelectedCourseTitle(course.title);
      setStudentDialogOpen(true);
    } catch (err) {
      toast.error("Failed to load enrolled students");
    }
  };

  return (
    <Box className="course-dashboard">
      <ToastContainer position="top-right" autoClose={3000} />
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ color: "#20438E", fontWeight: "bold" }}>
          Course Management
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)} className="course-add-btn">
          Add Course
        </Button>
      </Box>
      {loading ? (
      <Box className="dashboard-overview">
        <div className="loading-container">
          <div className="loading-spinner" />
          <Typography className="loading-text">Loading Courses…</Typography>
        </div>
      </Box>
      ) : (
      <TableContainer component={Paper} className="course-data-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Enrolled Students</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course._id} hover className="course-table-row">
                <TableCell><Typography fontWeight="bold">{course.title}</Typography></TableCell>
                <TableCell sx={{ maxWidth: 350, p: 1 }}>
                  <Tooltip title={course.description} arrow placement="top">
                    <span
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,       // 👈 show up to 2 lines
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        lineHeight: '1.4em',
                        maxHeight: '2.8em',       // 👈 must match lineClamp * lineHeight
                      }}
                    >
                      {course.description}
                    </span>
                  </Tooltip>
                </TableCell>

                <TableCell>
                  <Chip label={course.price} color={course.price.toLowerCase() === "free" ? "success" : "primary"} size="small" />
                </TableCell>
                <TableCell
                  sx={{ maxWidth: 99, cursor: "pointer", color: "#20438E", fontWeight: 600, backgroundColor: "#F5D677", textAlign: 'center' }}
                  onClick={() => handleViewEnrolledStudents(course)}
                >
                  {course.enrolledStudents?.length || 0}
                </TableCell>
                <TableCell>{new Date(course.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button size="small" variant="outlined" onClick={() => { setSelectedCourse(course); setEditDialogOpen(true); }}>Edit</Button>
                  <Button size="small" variant="outlined" color="error" sx={{ ml: 1 }} onClick={() => { setCourseToDelete(course); setDeleteDialogOpen(true); }}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      )}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Course</DialogTitle>
        <DialogContent>
          <TextField label="Title" fullWidth variant="outlined" value={newCourse.title} onChange={(e) => setNewCourse((prev) => ({ ...prev, title: e.target.value }))} sx={{ mb: 2 }} />
          <TextField label="Price" fullWidth variant="outlined" value={newCourse.price} onChange={(e) => setNewCourse((prev) => ({ ...prev, price: e.target.value }))} sx={{ mb: 2 }} />
          <TextField label="Description" multiline rows={3} fullWidth variant="outlined" value={newCourse.description} onChange={(e) => setNewCourse((prev) => ({ ...prev, description: e.target.value }))} sx={{ mb: 2 }} />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Teacher</InputLabel>
            <Select label="Teacher" value={newCourse.teacherId} onChange={(e) => setNewCourse((prev) => ({ ...prev, teacherId: e.target.value }))}>
              {teachers.map((t) => (
                <MenuItem key={t._id} value={t._id}>{t.username}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateCourse}>Add</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this course?</Typography>
          <Typography fontWeight="bold" mt={1}>{courseToDelete?.title}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteCourse}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Course</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Title" fullWidth variant="outlined" value={selectedCourse?.title || ""} onChange={(e) => setSelectedCourse((prev) => ({ ...prev, title: e.target.value }))} slotProps={{ inputLabel: { shrink: true }, }} sx={{ mb: 2 }} />
          <TextField label="Price" fullWidth variant="outlined" value={selectedCourse?.price || ""} onChange={(e) => setSelectedCourse((prev) => ({ ...prev, price: e.target.value }))} sx={{ mb: 2 }} />
          <TextField label="Description" multiline rows={3} fullWidth variant="outlined" value={selectedCourse?.description || ""} onChange={(e) => setSelectedCourse((prev) => ({ ...prev, description: e.target.value }))} sx={{ mb: 2 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateCourse}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={studentDialogOpen} onClose={() => setStudentDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Enrolled Students – {selectedCourseTitle}</DialogTitle>
        <DialogContent dividers>
          {enrolledStudents.length > 0 ? (
            enrolledStudents.map((student) => (
              <Box key={student._id} display="flex" alignItems="center" mb={2} gap={2}>
                <img
                  src={student.profilePicture}
                  alt={student.username}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "1px solid #ccc"
                  }}
                />
                <Typography>{student.username}</Typography>
              </Box>
            ))
          ) : (
            <Typography>No students enrolled.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStudentDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

    </Box>
  )
}

export default CourseDashboard
