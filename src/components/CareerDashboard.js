"use client";

import { useEffect, useMemo, useState } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  Chip,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CareerDashboard.css";

// API base (env override supported)
const API_BASE =
  (process.env.REACT_APP_BACKEND_URL || "http://localhost:3001") + "/api/universities";

// Ellipsize + Tooltip helper
const Ellipsize = ({ value, lines = 1, maxWidth = 260 }) => {
  const text = value ?? "";
  const isMulti = lines > 1;
  return (
    <Tooltip title={text || ""} arrow placement="top" disableHoverListener={!text}>
      <span
        style={
          isMulti
            ? {
                display: "-webkit-box",
                WebkitLineClamp: lines,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth,
                lineHeight: "1.4em",
                maxHeight: `${1.4 * lines}em`,
              }
            : {
                display: "block",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth,
              }
        }
      >
        {text || "-"}
      </span>
    </Tooltip>
  );
};

// CSV <-> Array helpers
const csvToArray = (str) =>
  String(str || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const arrayToCSV = (arr) => (Array.isArray(arr) ? arr.join(", ") : String(arr || ""));

// Chips renderer (show up to 3, then +N with tooltip)
const ChipsList = ({ items = [], max = 3 }) => {
  const arr = Array.isArray(items) ? items : [];
  const extra = arr.length - max;
  return (
    <Box className="cd-chips-wrap">
      {arr.slice(0, max).map((it, i) => (
        <Chip key={`${it}-${i}`} label={it} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
      ))}
      {extra > 0 && (
        <Tooltip title={arr.slice(max).join(", ")} arrow>
          <Chip label={`+${extra}`} size="small" variant="outlined" sx={{ mb: 0.5 }} />
        </Tooltip>
      )}
      {arr.length === 0 && <Ellipsize value="-" />}
    </Box>
  );
};

const FIELD_MAP = [
  { key: "title", label: "Title", required: true, type: "text" },
  { key: "field", label: "Field", required: true, type: "text" },
  { key: "salaryRange", label: "Salary Range", required: true, type: "text" },
  { key: "skills", label: "Skills (comma-separated)", required: true, type: "csv" },
  { key: "industries", label: "Industries (comma-separated)", required: true, type: "csv" },
  { key: "description", label: "Description", required: true, type: "multiline", clamped: true },
];

const CareerDashboard = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCareer, setSelectedCareer] = useState(null);
  const [careerToDelete, setCareerToDelete] = useState(null);

  // Form state for create
  const emptyForm = useMemo(
    () =>
      FIELD_MAP.reduce((acc, f) => {
        acc[f.key] = ""; // all strings in UI; arrays handled by CSV conversion
        return acc;
      }, {}),
    []
  );
  const [newCareer, setNewCareer] = useState(emptyForm);

  // Auth header (admin endpoints)
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  // Fetch all careers
  const fetchCareers = async () => {
    try {
      const res = await fetch(API_BASE, { headers: { Accept: "application/json" } });
      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }
      if (!res.ok) throw new Error(data?.message || `Failed to fetch (${res.status})`);
      setCareers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Failed to fetch careers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareers();
  }, []);

  // Create
  const handleCreateCareer = async () => {
    try {
      const missing = FIELD_MAP.filter(
        (f) => f.required && !String(newCareer[f.key] ?? "").trim()
      );
      if (missing.length) {
        toast.warn(`Please fill: ${missing.map((m) => m.label).join(", ")}`);
        return;
      }

      const payload = { ...newCareer };
      Object.keys(payload).forEach((k) => {
        if (typeof payload[k] === "string") payload[k] = payload[k].trim();
      });
      payload.skills = csvToArray(payload.skills);
      payload.industries = csvToArray(payload.industries);

      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to create career");

      setCareers((prev) => [data, ...prev]);
      toast.success("Career created successfully");
      setOpenDialog(false);
      setNewCareer(emptyForm);
    } catch (err) {
      toast.error(err?.message || "Failed to create career");
    }
  };

  // Update
  const handleUpdateCareer = async () => {
    if (!selectedCareer?._id) return;
    try {
      const payload = { ...selectedCareer };
      Object.keys(payload).forEach((k) => {
        if (typeof payload[k] === "string") payload[k] = payload[k].trim();
      });
      payload.skills = Array.isArray(selectedCareer.skills)
        ? selectedCareer.skills
        : csvToArray(selectedCareer.skills);
      payload.industries = Array.isArray(selectedCareer.industries)
        ? selectedCareer.industries
        : csvToArray(selectedCareer.industries);

      const res = await fetch(`${API_BASE}/${selectedCareer._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to update career");

      setCareers((prev) => prev.map((c) => (c._id === data._id ? data : c)));
      toast.success("Career updated successfully");
      setEditDialogOpen(false);
      setSelectedCareer(null);
    } catch (err) {
      toast.error(err?.message || "Failed to update career");
    }
  };

  // Delete
  const handleDeleteCareer = async () => {
    if (!careerToDelete?._id) return;
    try {
      const res = await fetch(`${API_BASE}/${careerToDelete._id}`, {
        method: "DELETE",
        headers: { ...authHeader },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to delete career");

      setCareers((prev) => prev.filter((c) => c._id !== careerToDelete._id));
      toast.success("Career deleted");
    } catch (err) {
      toast.error(err?.message || "Failed to delete career");
    } finally {
      setDeleteDialogOpen(false);
      setCareerToDelete(null);
    }
  };

  return (
    <Box className="cd-dashboard">
      <ToastContainer position="top-right" autoClose={3000} />
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ color: "#20438E", fontWeight: "bold" }}>
          Career Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          className="cd-add-btn"
        >
          Add Career
        </Button>
      </Box>

      {loading ? (
        <Box className="cd-overview">
          <div className="cd-loading-container">
            <div className="cd-spinner" />
            <Typography className="cd-loading-text">Loading Careers…</Typography>
          </div>
        </Box>
      ) : (
        <TableContainer component={Paper} className="cd-data-table">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Field</TableCell>
                <TableCell>Salary Range</TableCell>
                <TableCell>Skills</TableCell>
                <TableCell>Industries</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {careers.map((c) => (
                <TableRow key={c._id} hover className="cd-row">
                  <TableCell sx={{ maxWidth: 260 }}>
                    <Ellipsize value={c.title} maxWidth={260} />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 220 }}>
                    <Ellipsize value={c.field} maxWidth={220} />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 180 }}>
                    <Ellipsize value={c.salaryRange} maxWidth={180} />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 320 }}>
                    <ChipsList items={c.skills} />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 320 }}>
                    <ChipsList items={c.industries} />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 380 }}>
                    <Ellipsize value={c.description} lines={2} maxWidth={380} />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 160 }}>
                    <Ellipsize
                      value={c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "-"}
                      maxWidth={160}
                    />
                  </TableCell>

                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        const shaped = {
                          ...c,
                          skills: arrayToCSV(c.skills),
                          industries: arrayToCSV(c.industries),
                        };
                        setSelectedCareer(shaped);
                        setEditDialogOpen(true);
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
                        setCareerToDelete(c);
                        setDeleteDialogOpen(true);
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

      {/* Create */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        className="cd-dialog"
      >
        <DialogTitle>Add New Career</DialogTitle>
        <DialogContent>
          {FIELD_MAP.map((f) => (
            <TextField
              key={f.key}
              label={f.label}
              type={f.type === "multiline" ? "text" : f.type}
              fullWidth
              multiline={f.type === "multiline"}
              rows={f.type === "multiline" ? 3 : 1}
              variant="outlined"
              value={newCareer[f.key]}
              onChange={(e) =>
                setNewCareer((prev) => ({ ...prev, [f.key]: e.target.value }))
              }
              sx={{ mb: 2 }}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateCareer}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        className="cd-dialog"
      >
        <DialogTitle>Edit Career</DialogTitle>
        <DialogContent>
          {selectedCareer &&
            FIELD_MAP.map((f) => (
              <TextField
                key={f.key}
                label={f.label}
                type={f.type === "multiline" ? "text" : f.type}
                fullWidth
                multiline={f.type === "multiline"}
                rows={f.type === "multiline" ? 3 : 1}
                variant="outlined"
                value={selectedCareer?.[f.key] ?? ""}
                onChange={(e) =>
                  setSelectedCareer((prev) =>
                    prev ? { ...prev, [f.key]: e.target.value } : prev
                  )
                }
                slotProps={{ inputLabel: { shrink: true } }}
                sx={{ mb: 2 }}
              />
            ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateCareer}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        className="cd-dialog"
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this career?</Typography>
          <Typography fontWeight="bold" mt={1}>
            {careerToDelete?.title}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteCareer}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CareerDashboard;
