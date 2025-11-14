"use client"

import { useEffect, useMemo, useState } from "react"
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
  InputAdornment,
  IconButton,
  TableSortLabel,
  Tooltip,
} from "@mui/material"
import {
  Add as AddIcon,
  StarRounded as StarIcon,
  Search as SearchIcon,
} from "@mui/icons-material"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./CourseDashboard.css"

const API_BASE = process.env.REACT_APP_BACKEND_URL
const LEVELS = ["Beginner", "Intermediate", "Advanced"]

const CourseDashboard = () => {
  const [openDialog, setOpenDialog] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [courseToDelete, setCourseToDelete] = useState(null)

  const [teachers, setTeachers] = useState([])
  const [studentDialogOpen, setStudentDialogOpen] = useState(false)
  const [enrolledStudents, setEnrolledStudents] = useState([])
  const [selectedCourseTitle, setSelectedCourseTitle] = useState("")
  const [loading, setLoading] = useState(true)

  // NEW: search + sort state
  const [query, setQuery] = useState("")
  const [orderBy, setOrderBy] = useState("createdAt") // title | price | rating | durationDays | enrolled | createdAt
  const [order, setOrder] = useState("desc") // asc | desc

  // form state
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    price: "",
    instructor: "",
    durationDays: "",
    level: "Beginner",
    category: "",
  })

  // ---------- Fetchers ----------
  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/courses`)
      if (!res.ok) throw new Error("Failed to fetch courses")
      const data = await res.json()
      setCourses(data)
    } catch {
      toast.error("Failed to fetch courses")
    }
  }

  const fetchTeachers = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/users/teachers`)
      const data = await res.json()
      if (!res.ok) throw new Error("Failed to fetch teachers")
      setTeachers(data)
    } catch {
      toast.error("Failed to fetch teachers")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
    fetchTeachers()
  }, [])

  // ---------- Helpers ----------
  const getToken = () => localStorage.getItem("token")

  const priceChip = (price) => {
    const p = String(price ?? "")
    const isFree = p.toLowerCase() === "free"
    return (
      <Chip
        label={isFree ? "Free" : p}
        color={isFree ? "success" : "primary"}
        size="small"
      />
    )
  }

  // parse helpers for sorting
  const parsePrice = (p) => {
    if (p == null) return Number.POSITIVE_INFINITY
    const s = String(p).trim().toLowerCase()
    if (s === "free") return 0
    // extract digits like "150$" -> 150
    const m = s.match(/[\d.]+/)
    return m ? Number(m[0]) : Number.POSITIVE_INFINITY
  }
  const num = (v) => (v == null || v === "" ? -Infinity : Number(v))

  // ---------- Search + Sort ----------
  const displayedCourses = useMemo(() => {
    const q = query.trim().toLowerCase()

    const filtered = q
      ? courses.filter((c) => {
          const fields = [
            c.title,
            c.description,
            c.instructor,
            c.category,
            c.level,
          ]
          return fields.some((f) => String(f || "").toLowerCase().includes(q))
        })
      : courses.slice()

    filtered.sort((a, b) => {
      let va, vb
      switch (orderBy) {
        case "title":
          va = String(a.title || "").toLowerCase()
          vb = String(b.title || "").toLowerCase()
          break
        case "price":
          va = parsePrice(a.price)
          vb = parsePrice(b.price)
          break
        case "rating":
          va = Number(a.ratingAvg || 0)
          vb = Number(b.ratingAvg || 0)
          break
        case "durationDays":
          va = num(a.durationDays)
          vb = num(b.durationDays)
          break
        case "enrolled":
          va = (a.enrolledStudents?.length || 0)
          vb = (b.enrolledStudents?.length || 0)
          break
        case "createdAt":
        default:
          va = new Date(a.createdAt || 0).getTime()
          vb = new Date(b.createdAt || 0).getTime()
      }
      const cmp = va < vb ? -1 : va > vb ? 1 : 0
      return order === "asc" ? cmp : -cmp
    })

    return filtered
  }, [courses, query, orderBy, order])

  const handleSort = (prop) => {
    if (orderBy === prop) {
      setOrder((p) => (p === "asc" ? "desc" : "asc"))
    } else {
      setOrderBy(prop)
      setOrder("asc")
    }
  }

  // ---------- CRUD ----------
  const handleCreateCourse = async () => {
    try {
      const token = getToken()
      const payload = {
        ...newCourse,
        durationDays: Number(newCourse.durationDays) || 0,
      }

      if (
        !payload.title ||
        !payload.description ||
        !payload.price ||
        !payload.instructor ||
        !payload.category ||
        !payload.durationDays ||
        !payload.level
      ) {
        toast.error("Please fill all required fields")
        return
      }

      const res = await fetch(`${API_BASE}/api/courses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to create course")

      setCourses((prev) => [data, ...prev])
      toast.success("Course created successfully")
      setOpenDialog(false)
      setNewCourse({
        title: "",
        description: "",
        price: "",
        instructor: "",
        durationDays: "",
        level: "Beginner",
        category: "",
      })
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleUpdateCourse = async () => {
    try {
      if (!selectedCourse?._id) return
      const token = getToken()
      const payload = {
        ...selectedCourse,
        durationDays: Number(selectedCourse.durationDays) || 0,
      }
      const res = await fetch(`${API_BASE}/api/courses/${selectedCourse._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to update course")

      setCourses((prev) => prev.map((c) => (c._id === selectedCourse._id ? data : c)))
      toast.success("Course updated successfully")
      setEditDialogOpen(false)
      setSelectedCourse(null)
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleDeleteCourse = async () => {
    try {
      const token = getToken()
      const res = await fetch(`${API_BASE}/api/courses/${courseToDelete._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to delete course")

      setCourses((prev) => prev.filter((c) => c._id !== courseToDelete._id))
      toast.success("Course deleted successfully")
    } catch {
      toast.error("Failed to delete course")
    } finally {
      setDeleteDialogOpen(false)
      setCourseToDelete(null)
    }
  }

  const handleViewEnrolledStudents = async (course) => {
    try {
      const token = getToken()
      const res = await fetch(`${API_BASE}/api/courses/${course._id}/enrolled`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to fetch students")

      setEnrolledStudents(data.students)
      setSelectedCourseTitle(course.title)
      setStudentDialogOpen(true)
    } catch {
      toast.error("Failed to load enrolled students")
    }
  }

  // ---------- UI ----------
  return (
    <Box className="course-dashboard">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header with title + search + add */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} gap={2} flexWrap="wrap">
        <Typography variant="h4" sx={{ color: "#20438E", fontWeight: "bold" }}>
          Course Management
        </Typography>

        {/* Search */}
        <Box sx={{ flex: 1, minWidth: 260, maxWidth: 480 }}>
          <TextField
            fullWidth
            placeholder="Search title, description, instructor, category…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          className="course-add-btn"
        >
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
          <Table sx={{ tableLayout: "fixed" }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 200 }} sortDirection={orderBy === "title" ? order : false}>
                  <TableSortLabel
                    active={orderBy === "title"}
                    direction={orderBy === "title" ? order : "asc"}
                    onClick={() => handleSort("title")}
                  >
                    Title
                  </TableSortLabel>
                </TableCell>

                <TableCell sx={{ width: 440 }}>Description</TableCell>

                <TableCell sx={{ width: 100 }} sortDirection={orderBy === "price" ? order : false}>
                  <TableSortLabel
                    active={orderBy === "price"}
                    direction={orderBy === "price" ? order : "asc"}
                    onClick={() => handleSort("price")}
                  >
                    Price
                  </TableSortLabel>
                </TableCell>

                <TableCell sx={{ width: 120 }} sortDirection={orderBy === "rating" ? order : false}>
                  <TableSortLabel
                    active={orderBy === "rating"}
                    direction={orderBy === "rating" ? order : "asc"}
                    onClick={() => handleSort("rating")}
                  >
                    Rating
                  </TableSortLabel>
                </TableCell>

                <TableCell sx={{ width: 120 }} sortDirection={orderBy === "durationDays" ? order : false}>
                  <TableSortLabel
                    active={orderBy === "durationDays"}
                    direction={orderBy === "durationDays" ? order : "asc"}
                    onClick={() => handleSort("durationDays")}
                  >
                    Duration
                  </TableSortLabel>
                </TableCell>

                <TableCell
                  sx={{ width: 90, textAlign: "center", fontWeight: 700 }}
                  sortDirection={orderBy === "enrolled" ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === "enrolled"}
                    direction={orderBy === "enrolled" ? order : "asc"}
                    onClick={() => handleSort("enrolled")}
                  >
                    Enrolled
                  </TableSortLabel>
                </TableCell>

                <TableCell sx={{ width: 130 }} sortDirection={orderBy === "createdAt" ? order : false}>
                  <TableSortLabel
                    active={orderBy === "createdAt"}
                    direction={orderBy === "createdAt" ? order : "asc"}
                    onClick={() => handleSort("createdAt")}
                  >
                    Created At
                  </TableSortLabel>
                </TableCell>

                <TableCell sx={{ width: 160 }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {displayedCourses.map((course) => (
                <TableRow key={course._id} hover className="course-table-row">
                  {/* Title */}
                  <TableCell sx={{ p: 1 }}>
                    <Tooltip title={course.title} arrow placement="top">
                      <span
                        style={{
                          display: "block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          fontWeight: 600,
                        }}
                      >
                        {course.title}
                      </span>
                    </Tooltip>
                  </TableCell>

                  {/* Description */}
                  <TableCell sx={{ p: 1 }}>
                    <Tooltip title={course.description} arrow placement="top">
                      <span
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          lineHeight: "1.4em",
                          maxHeight: "2.8em",
                        }}
                      >
                        {course.description}
                      </span>
                    </Tooltip>
                  </TableCell>

                  {/* Price */}
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {priceChip(course.price)}
                  </TableCell>

                  {/* Rating */}
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <StarIcon sx={{ fontSize: 18, color: "#fbc02d" }} />
                      <Typography variant="body2">
                        {Number(course.ratingAvg || 0).toFixed(1)}
                      </Typography>
                      {course.ratingCount ? (
                        <Typography variant="body2" sx={{ color: "#777" }}>
                          ({course.ratingCount})
                        </Typography>
                      ) : null}
                    </Box>
                  </TableCell>

                  {/* Duration */}
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {course.durationDays ? `${course.durationDays} days` : "—"}
                  </TableCell>

                  {/* Enrolled */}
                  <TableCell
                    sx={{
                      width: 90,
                      textAlign: "center",
                      color: "#20438E",
                      fontWeight: 600,
                      backgroundColor: "#F5D677",
                      cursor: "pointer",
                      p: "6px 8px",
                    }}
                    onClick={() => handleViewEnrolledStudents(course)}
                  >
                    {course.enrolledStudents?.length || 0}
                  </TableCell>

                  {/* Created */}
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {new Date(course.createdAt).toLocaleDateString()}
                  </TableCell>

                  {/* Actions */}
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        const safe = {
                          title: "",
                          description: "",
                          price: "",
                          instructor: "",
                          durationDays: "",
                          level: "Beginner",
                          category: "",
                          ...course,
                        }
                        setSelectedCourse(safe)
                        setEditDialogOpen(true)
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      sx={{ ml: 1 }}
                      onClick={() => {
                        setCourseToDelete(course)
                        setDeleteDialogOpen(true)
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Course</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            variant="outlined"
            value={newCourse.title}
            onChange={(e) => setNewCourse((p) => ({ ...p, title: e.target.value }))}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Price (e.g., Free or 150$)"
            fullWidth
            variant="outlined"
            value={newCourse.price}
            onChange={(e) => setNewCourse((p) => ({ ...p, price: e.target.value }))}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Description"
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            value={newCourse.description}
            onChange={(e) => setNewCourse((p) => ({ ...p, description: e.target.value }))}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Instructor</InputLabel>
            <Select
              label="Instructor"
              value={newCourse.instructor}
              onChange={(e) => setNewCourse((p) => ({ ...p, instructor: e.target.value }))}
            >
              {teachers.map((t) => (
                <MenuItem key={t._id} value={t.username}>
                  {t.username}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Level</InputLabel>
            <Select
              label="Level"
              value={newCourse.level}
              onChange={(e) => setNewCourse((p) => ({ ...p, level: e.target.value }))}
            >
              {LEVELS.map((lvl) => (
                <MenuItem key={lvl} value={lvl}>
                  {lvl}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Duration (days)"
            type="number"
            fullWidth
            variant="outlined"
            value={newCourse.durationDays}
            onChange={(e) => setNewCourse((p) => ({ ...p, durationDays: e.target.value }))}
            sx={{ mb: 2 }}
            inputProps={{ min: 1 }}
          />

          <TextField
            label="Category"
            fullWidth
            variant="outlined"
            value={newCourse.category}
            onChange={(e) => setNewCourse((p) => ({ ...p, category: e.target.value }))}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateCourse}>Add</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
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

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Course</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            fullWidth
            variant="outlined"
            value={selectedCourse?.title || ""}
            onChange={(e) => setSelectedCourse((p) => ({ ...p, title: e.target.value }))}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Price"
            fullWidth
            variant="outlined"
            value={selectedCourse?.price || ""}
            onChange={(e) => setSelectedCourse((p) => ({ ...p, price: e.target.value }))}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Description"
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            value={selectedCourse?.description || ""}
            onChange={(e) => setSelectedCourse((p) => ({ ...p, description: e.target.value }))}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Instructor</InputLabel>
            <Select
              label="Instructor"
              value={selectedCourse?.instructor || ""}
              onChange={(e) => setSelectedCourse((p) => ({ ...p, instructor: e.target.value }))}
            >
              {teachers.map((t) => (
                <MenuItem key={t._id} value={t.username}>
                  {t.username}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Level</InputLabel>
            <Select
              label="Level"
              value={selectedCourse?.level || "Beginner"}
              onChange={(e) => setSelectedCourse((p) => ({ ...p, level: e.target.value }))}
            >
              {LEVELS.map((lvl) => (
                <MenuItem key={lvl} value={lvl}>
                  {lvl}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Duration (days)"
            type="number"
            fullWidth
            variant="outlined"
            value={selectedCourse?.durationDays ?? ""}
            onChange={(e) => setSelectedCourse((p) => ({ ...p, durationDays: e.target.value }))}
            sx={{ mb: 2 }}
            inputProps={{ min: 1 }}
          />

          <TextField
            label="Category"
            fullWidth
            variant="outlined"
            value={selectedCourse?.category || ""}
            onChange={(e) => setSelectedCourse((p) => ({ ...p, category: e.target.value }))}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateCourse}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Students Dialog */}
      <Dialog open={studentDialogOpen} onClose={() => setStudentDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Enrolled Students – {selectedCourseTitle}</DialogTitle>
        <DialogContent dividers>
          {enrolledStudents.length > 0 ? (
            enrolledStudents.map((student) => (
              <Box key={student._id} display="flex" alignItems="center" mb={2} gap={2}>
                <img
                  src={student.profilePicture || "/default-avatar.png"}
                  alt={student.username}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "1px solid #ccc",
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
