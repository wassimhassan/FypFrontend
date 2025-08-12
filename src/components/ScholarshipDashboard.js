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
  CircularProgress,
  Tooltip,
} from "@mui/material"
import { Add as AddIcon } from "@mui/icons-material"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./ScholarshipDashboard.css"

const API_BASE = "http://localhost:3001/api/scholarships"

const ScholarshipDashboard = () => {
  const [openDialog, setOpenDialog] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const [scholarships, setScholarships] = useState([])
  const [selectedScholarship, setSelectedScholarship] = useState(null)
  const [scholarshipToDelete, setScholarshipToDelete] = useState(null)

  const [loading, setLoading] = useState(true)

  // Applicants dialog state
  const [applicantDialogOpen, setApplicantDialogOpen] = useState(false)
  const [applicants, setApplicants] = useState([])
  const [selectedScholarshipTitle, setSelectedScholarshipTitle] = useState("")

  // Create form state
  const [newScholarship, setNewScholarship] = useState({
    scholarship_title: "",
    scholarship_value: "",
    scholarship_type: "",
    scholarship_CreatedBy: "",
    scholarship_description: "",
    scholarship_requirements: "",
  })

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {}

  const fetchScholarships = async () => {
    try {
      const res = await fetch(API_BASE, { headers: { ...authHeader } })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to fetch scholarships")
      setScholarships(data)
    } catch (err) {
      toast.error(err.message || "Failed to fetch scholarships")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchScholarships()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCreateScholarship = async () => {
    try {
      const {
        scholarship_title,
        scholarship_value,
        scholarship_type,
        scholarship_CreatedBy,
        scholarship_description,
        scholarship_requirements,
      } = newScholarship

      if (
        !scholarship_title ||
        !scholarship_value ||
        !scholarship_type ||
        !scholarship_description ||
        !scholarship_requirements
      ) {
        toast.warn("Please fill Title, Value, Type, Description, and Requirements")
        return
      }

      const payload = {
        scholarship_title: scholarship_title.trim(),
        scholarship_value: Number(scholarship_value),
        scholarship_type: scholarship_type.trim(),
        scholarship_CreatedBy: scholarship_CreatedBy.trim(),
        scholarship_description: scholarship_description.trim(),
        scholarship_requirements: scholarship_requirements.trim(), // schema expects string
      }

      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to create scholarship")

      setScholarships((prev) => [data, ...prev])
      toast.success("Scholarship created successfully")
      setOpenDialog(false)
      setNewScholarship({
        scholarship_title: "",
        scholarship_value: "",
        scholarship_type: "",
        scholarship_CreatedBy: "",
        scholarship_description: "",
        scholarship_requirements: "",
      })
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleUpdateScholarship = async () => {
    try {
      const res = await fetch(`${API_BASE}/${selectedScholarship._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeader,
        },
        body: JSON.stringify({
          ...selectedScholarship,
          scholarship_value: Number(selectedScholarship.scholarship_value),
          scholarship_description: (selectedScholarship.scholarship_description || "").trim(),
          scholarship_requirements: (selectedScholarship.scholarship_requirements || "").toString().trim(),
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to update scholarship")

      setScholarships((prev) => prev.map((s) => (s._id === data._id ? data : s)))
      toast.success("Scholarship updated successfully")
      setEditDialogOpen(false)
      setSelectedScholarship(null)
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleDeleteScholarship = async () => {
    try {
      const res = await fetch(`${API_BASE}/${scholarshipToDelete._id}`, {
        method: "DELETE",
        headers: { ...authHeader },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to delete scholarship")

      setScholarships((prev) => prev.filter((s) => s._id !== scholarshipToDelete._id))
      toast.success("Scholarship deleted")
    } catch (err) {
      toast.error(err.message || "Failed to delete scholarship")
    } finally {
      setDeleteDialogOpen(false)
      setScholarshipToDelete(null)
    }
  }

  // View applicants
  const handleViewApplicants = async (sch) => {
    try {
      const res = await fetch(`${API_BASE}/${sch._id}/applicants`, {
        headers: { ...authHeader },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to fetch applicants")

      const list = Array.isArray(data?.applicants) ? data.applicants : data
      setApplicants(list || [])
      setSelectedScholarshipTitle(sch.scholarship_title)
      setApplicantDialogOpen(true)
    } catch (err) {
      toast.error("Failed to load applicants")
    }
  }

  // helper for clamped cell with tooltip
  const ClampedCell = ({ text, lines = 2 }) => (
    <Tooltip title={text || ""} arrow placement="top">
      <span
        style={{
          display: "-webkit-box",
          WebkitLineClamp: lines,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
          lineHeight: "1.4em",
          maxHeight: `${1.4 * lines}em`,
        }}
      >
        {text || "-"}
      </span>
    </Tooltip>
  )

  return (
    <Box className="scholarship-dashboard">
      <ToastContainer position="top-right" autoClose={3000} />

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ color: "#20438E", fontWeight: "bold" }}>
          Scholarship Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          className="scholarship-add-btn"
        >
          Add Scholarship
        </Button>
      </Box>

      {loading ? (
              <Box className="dashboard-overview">
        <div className="loading-container">
          <div className="loading-spinner" />
          <Typography className="loading-text">Loading Scholarships…</Typography>
        </div>
      </Box>
      ) : (
        <TableContainer component={Paper} className="scholarship-data-table">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Requirements</TableCell>
                <TableCell>Applicants</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {scholarships.map((sch) => {
                const reqText = sch.scholarship_requirements || ""
                return (
                  <TableRow key={sch._id} hover className="scholarship-table-row">
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold" className="scholarship-title">
                        {sch.scholarship_title}
                      </Typography>
                    </TableCell>

                    {/* NEW: Description (2 lines + tooltip) */}
                    <TableCell sx={{ maxWidth: 350, p: 1 }}>
                      <ClampedCell text={sch.scholarship_description} lines={2} />
                    </TableCell>

                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ color: "#4CAF50", fontWeight: "bold" }}
                        className="scholarship-amount"
                      >
                        ${Number(sch.scholarship_value).toLocaleString()}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip label={sch.scholarship_type} size="small" className="scholarship-category-chip" />
                    </TableCell>

                    {/* NEW: Requirements (clamped + tooltip) */}
                    <TableCell sx={{ maxWidth: 280, p: 1 }}>
                      <ClampedCell text={reqText} lines={2} />
                    </TableCell>

                    <TableCell
                      sx={{
                        maxWidth: 99,
                        cursor: "pointer",
                        color: "#20438E",
                        fontWeight: 600,
                        backgroundColor: "#F5D677",
                        textAlign: "center",
                      }}
                      onClick={() => handleViewApplicants(sch)}
                    >
                      {sch.applicants?.length || 0}
                    </TableCell>

                    <TableCell>{sch.scholarship_CreatedBy || "-"}</TableCell>

                    <TableCell className="scholarship-createdat">
                      {sch.createdAt ? new Date(sch.createdAt).toLocaleDateString() : "-"}
                    </TableCell>

                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        className="scholarship-edit-btn"
                        onClick={() => {
                          // include description & requirements into edit state
                          setSelectedScholarship({
                            ...sch,
                            scholarship_value: sch.scholarship_value ?? "",
                            scholarship_type: sch.scholarship_type ?? "",
                            scholarship_description: sch.scholarship_description ?? "",
                            scholarship_requirements: sch.scholarship_requirements ?? "",
                          })
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
                          setScholarshipToDelete(sch)
                          setDeleteDialogOpen(true)
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Scholarship</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            variant="outlined"
            value={newScholarship.scholarship_title}
            onChange={(e) => setNewScholarship((p) => ({ ...p, scholarship_title: e.target.value }))}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Value (USD)"
            type="number"
            fullWidth
            variant="outlined"
            value={newScholarship.scholarship_value}
            onChange={(e) => setNewScholarship((p) => ({ ...p, scholarship_value: e.target.value }))}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Type"
            fullWidth
            variant="outlined"
            value={newScholarship.scholarship_type}
            onChange={(e) => setNewScholarship((p) => ({ ...p, scholarship_type: e.target.value }))}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Created By"
            fullWidth
            variant="outlined"
            value={newScholarship.scholarship_CreatedBy}
            onChange={(e) => setNewScholarship((p) => ({ ...p, scholarship_CreatedBy: e.target.value }))}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            value={newScholarship.scholarship_description}
            onChange={(e) =>
              setNewScholarship((p) => ({ ...p, scholarship_description: e.target.value }))
            }
            sx={{ mb: 2 }}
          />
          <TextField
            label="Requirements (comma or new line separated)"
            multiline
            rows={2}
            fullWidth
            variant="outlined"
            value={newScholarship.scholarship_requirements}
            onChange={(e) =>
              setNewScholarship((p) => ({ ...p, scholarship_requirements: e.target.value }))
            }
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateScholarship}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Scholarship</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            fullWidth
            variant="outlined"
            value={selectedScholarship?.scholarship_title || ""}
            onChange={(e) =>
              setSelectedScholarship((prev) => ({ ...prev, scholarship_title: e.target.value }))
            }
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Value (USD)"
            type="number"
            fullWidth
            variant="outlined"
            value={selectedScholarship?.scholarship_value || ""}
            onChange={(e) =>
              setSelectedScholarship((prev) => ({ ...prev, scholarship_value: e.target.value }))
            }
            sx={{ mb: 2 }}
          />
          <TextField
            label="Type"
            fullWidth
            variant="outlined"
            value={selectedScholarship?.scholarship_type || ""}
            onChange={(e) =>
              setSelectedScholarship((prev) => ({ ...prev, scholarship_type: e.target.value }))
            }
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            value={selectedScholarship?.scholarship_description || ""}
            onChange={(e) =>
              setSelectedScholarship((prev) => ({ ...prev, scholarship_description: e.target.value }))
            }
            sx={{ mb: 2 }}
          />
          <TextField
            label="Requirements (comma or new line separated)"
            multiline
            rows={2}
            fullWidth
            variant="outlined"
            value={selectedScholarship?.scholarship_requirements || ""}
            onChange={(e) =>
              setSelectedScholarship((prev) => ({ ...prev, scholarship_requirements: e.target.value }))
            }
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateScholarship}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this scholarship?</Typography>
          <Typography fontWeight="bold" mt={1}>
            {scholarshipToDelete?.scholarship_title}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteScholarship}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Applicants dialog */}
      <Dialog open={applicantDialogOpen} onClose={() => setApplicantDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Applicants – {selectedScholarshipTitle}</DialogTitle>
        <DialogContent dividers>
          {applicants?.length > 0 ? (
            applicants.map((u) => (
              <Box key={u._id} display="flex" alignItems="center" mb={2} gap={2}>
                <img
                  src={u.profilePicture}
                  alt={u.username}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "1px solid #ccc",
                  }}
                />
                <Typography>{u.username}</Typography>
              </Box>
            ))
          ) : (
            <Typography>No applicants yet.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApplicantDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ScholarshipDashboard
