"use client"

import { useState } from "react"
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material"
import { Add as AddIcon, Star } from "@mui/icons-material"
import "./CourseDashboard.css"

const mockCourses = [
  {
    id: 1,
    title: "SAT Preparation",
    instructor: "Dr. Sarah Johnson",
    students: 234,
    price: "Free",
    rating: 4.8,
    status: "Active",
  },
  {
    id: 2,
    title: "Java Programming",
    instructor: "Prof. Ahmed Hassan",
    students: 189,
    price: "$15",
    rating: 4.9,
    status: "Active",
  },
  {
    id: 3,
    title: "Python Basics",
    instructor: "Ms. Emily Chen",
    students: 156,
    price: "Free",
    rating: 4.7,
    status: "Active",
  },
  {
    id: 4,
    title: "Web Development",
    instructor: "Dr. Michael Brown",
    students: 201,
    price: "$25",
    rating: 4.6,
    status: "Draft",
  },
]

const CourseDashboard = () => {
  const [openDialog, setOpenDialog] = useState(false)

  return (
    <Box className="course-dashboard">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ color: "#20438E", fontWeight: "bold" }}>
          Course Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          className="course-add-btn"
        >
          Add Course
        </Button>
      </Box>

      <TableContainer component={Paper} className="course-data-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Instructor</TableCell>
              <TableCell>Students</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockCourses.map((course) => (
              <TableRow key={course.id} hover className="course-table-row">
                <TableCell>
                  <Typography variant="body2" fontWeight="bold" className="course-title">
                    {course.title}
                  </Typography>
                </TableCell>
                <TableCell className="course-instructor">{course.instructor}</TableCell>
                <TableCell>
                  <Typography variant="body2" className="course-students">
                    {course.students}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={course.price}
                    color={course.price === "Free" ? "success" : "primary"}
                    size="small"
                    className="course-price-chip"
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" className="course-rating">
                    <Star sx={{ color: "#FED784", fontSize: 16, mr: 0.5 }} />
                    <Typography variant="body2">{course.rating}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={course.status}
                    color={course.status === "Active" ? "success" : "warning"}
                    size="small"
                    className="course-status-chip"
                  />
                </TableCell>
                <TableCell>
                  <Button size="small" variant="outlined" className="course-edit-btn">
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Course Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth className="course-dialog">
        <DialogTitle>Add New Course</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Title" fullWidth variant="outlined" sx={{ mb: 2 }} />
          <TextField margin="dense" label="Instructor" fullWidth variant="outlined" sx={{ mb: 2 }} />
          <TextField margin="dense" label="Price" fullWidth variant="outlined" sx={{ mb: 2 }} />
          <TextField
            margin="dense"
            label="Description"
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select label="Status">
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="archived">Archived</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenDialog(false)}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default CourseDashboard
