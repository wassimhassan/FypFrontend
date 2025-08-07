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
  Badge,
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
import { Add as AddIcon, Assignment } from "@mui/icons-material"
import "./ScholarshipDashboard.css"

const mockScholarships = [
  {
    id: 1,
    title: "Merit Excellence Scholarship",
    amount: 25000,
    applicants: 156,
    status: "Active",
    deadline: "2024-06-30",
    category: "Merit-Based",
  },
  {
    id: 2,
    title: "STEM Innovation Grant",
    amount: 15000,
    applicants: 89,
    status: "Active",
    deadline: "2024-07-15",
    category: "STEM",
  },
  {
    id: 3,
    title: "Community Leader Award",
    amount: 10000,
    applicants: 234,
    status: "Closed",
    deadline: "2024-05-20",
    category: "Leadership",
  },
  {
    id: 4,
    title: "Need-Based Support",
    amount: 8000,
    applicants: 67,
    status: "Active",
    deadline: "2024-08-10",
    category: "Need-Based",
  },
]

const ScholarshipDashboard = () => {
  const [openDialog, setOpenDialog] = useState(false)

  return (
    <Box className="scholarship-dashboard">
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

      <TableContainer component={Paper} className="scholarship-data-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Applicants</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockScholarships.map((scholarship) => (
              <TableRow key={scholarship.id} hover className="scholarship-table-row">
                <TableCell>
                  <Typography variant="body2" fontWeight="bold" className="scholarship-title">
                    {scholarship.title}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{ color: "#4CAF50", fontWeight: "bold" }}
                    className="scholarship-amount"
                  >
                    ${scholarship.amount.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Badge badgeContent={scholarship.applicants} color="primary" className="scholarship-applicants-badge">
                    <Assignment />
                  </Badge>
                </TableCell>
                <TableCell>
                  <Chip label={scholarship.category} size="small" className="scholarship-category-chip" />
                </TableCell>
                <TableCell>
                  <Chip
                    label={scholarship.status}
                    color={scholarship.status === "Active" ? "success" : "error"}
                    size="small"
                    className="scholarship-status-chip"
                  />
                </TableCell>
                <TableCell className="scholarship-deadline">{scholarship.deadline}</TableCell>
                <TableCell>
                  <Button size="small" variant="outlined" className="scholarship-edit-btn">
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Scholarship Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        className="scholarship-dialog"
      >
        <DialogTitle>Add New Scholarship</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Title" fullWidth variant="outlined" sx={{ mb: 2 }} />
          <TextField margin="dense" label="Amount" type="number" fullWidth variant="outlined" sx={{ mb: 2 }} />
          <TextField
            margin="dense"
            label="Deadline"
            type="date"
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select label="Category">
              <MenuItem value="merit-based">Merit-Based</MenuItem>
              <MenuItem value="need-based">Need-Based</MenuItem>
              <MenuItem value="stem">STEM</MenuItem>
              <MenuItem value="leadership">Leadership</MenuItem>
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

export default ScholarshipDashboard
