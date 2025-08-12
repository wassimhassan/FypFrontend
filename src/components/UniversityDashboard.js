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
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./UniversityDashboard.css";

// ✅ Prefer env when available
const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001") + "/api/universities";

// ✅ Column config aligned to your Mongoose model
const FIELD_MAP = [
  { key: "name", label: "Name", required: true, type: "text" },
  { key: "location", label: "Location", required: true, type: "text" },
  { key: "rank", label: "Rank", required: true, type: "text" }, // e.g. "#1 Lebanon"
  { key: "acceptanceRate", label: "Acceptance Rate (%)", required: true, type: "number" },
  { key: "numberOfStudents", label: "Students", required: true, type: "number" },
  { key: "tuition", label: "Tuition (USD)", required: true, type: "number" },
  { key: "website", label: "Website", required: false, type: "text" },
];

const toNumberOrNull = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};
const formatPercent = (v) => (v === 0 || v ? `${Number(v)}%` : "-");
const formatUSD = (v) => (v === 0 || v ? `$${Number(v).toLocaleString()}` : "-");

// 🔎 Ellipsize + Tooltip helper
const Ellipsize = ({ value, lines = 1, maxWidth = 260 }) => {
  const text = value ?? "";
  const isMulti = lines > 1;
  return (
    <Tooltip title={text || ""} arrow placement="top" disableHoverListener={!text || text.length <= 0}>
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

const UniversityDashboard = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [universityToDelete, setUniversityToDelete] = useState(null);

  // Create form state
  const emptyForm = useMemo(
    () =>
      FIELD_MAP.reduce((acc, f) => {
        acc[f.key] = "";
        return acc;
      }, {}),
    []
  );
  const [newUniversity, setNewUniversity] = useState(emptyForm);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  // 🔄 Fetch all universities (safe JSON parse + clearer errors)
  const fetchUniversities = async () => {
    try {
      const res = await fetch(API_BASE, {
        headers: { Accept: "application/json" }, // add ...authHeader if GET is protected globally
      });
      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }
      if (!res.ok) {
        throw new Error(data?.message || `Failed to fetch (${res.status})`);
      }
      setUniversities(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Failed to fetch universities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, []);

  // 📝 Create
  const handleCreateUniversity = async () => {
    try {
      const missing = FIELD_MAP.filter(
        (f) => f.required && !String(newUniversity[f.key] ?? "").trim()
      );
      if (missing.length) {
        toast.warn(`Please fill: ${missing.map((m) => m.label).join(", ")}`);
        return;
      }

      const payload = { ...newUniversity };
      // trim strings
      Object.keys(payload).forEach((k) => {
        if (typeof payload[k] === "string") payload[k] = payload[k].trim();
      });
      // coerce numbers
      payload.acceptanceRate = toNumberOrNull(payload.acceptanceRate);
      payload.numberOfStudents = toNumberOrNull(payload.numberOfStudents);
      payload.tuition = toNumberOrNull(payload.tuition);

      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to create university");

      setUniversities((prev) => [data, ...prev]);
      toast.success("University created successfully");
      setOpenDialog(false);
      setNewUniversity(emptyForm);
    } catch (err) {
      toast.error(err?.message || "Failed to create university");
    }
  };

  // ✏️ Update
  const handleUpdateUniversity = async () => {
    if (!selectedUniversity?._id) return;
    try {
      const payload = { ...selectedUniversity };
      Object.keys(payload).forEach((k) => {
        if (typeof payload[k] === "string") payload[k] = payload[k].trim();
      });
      payload.acceptanceRate = toNumberOrNull(payload.acceptanceRate);
      payload.numberOfStudents = toNumberOrNull(payload.numberOfStudents);
      payload.tuition = toNumberOrNull(payload.tuition);

      const res = await fetch(`${API_BASE}/${selectedUniversity._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to update university");

      setUniversities((prev) => prev.map((u) => (u._id === data._id ? data : u)));
      toast.success("University updated successfully");
      setEditDialogOpen(false);
      setSelectedUniversity(null);
    } catch (err) {
      toast.error(err?.message || "Failed to update university");
    }
  };

  // 🗑️ Delete
  const handleDeleteUniversity = async () => {
    if (!universityToDelete?._id) return;
    try {
      const res = await fetch(`${API_BASE}/${universityToDelete._id}`, {
        method: "DELETE",
        headers: { ...authHeader },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to delete university");

      setUniversities((prev) => prev.filter((u) => u._id !== universityToDelete._id));
      toast.success("University deleted");
    } catch (err) {
      toast.error(err?.message || "Failed to delete university");
    } finally {
      setDeleteDialogOpen(false);
      setUniversityToDelete(null);
    }
  };

  return (
    <Box className="university-dashboard">
      <ToastContainer position="top-right" autoClose={3000} />
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ color: "#20438E", fontWeight: "bold" }}>
          University Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          className="university-add-btn"
        >
          Add University
        </Button>
      </Box>

      {loading ? (
        <Box className="dashboard-overview">
          <div className="loading-container">
            <div className="loading-spinner" />
            <Typography className="loading-text">Loading Universities…</Typography>
          </div>
        </Box>
      ) : (
        <TableContainer component={Paper} className="university-data-table">
          <Table>
            <TableHead>
              <TableRow>
                {FIELD_MAP.map((col) => (
                  <TableCell key={col.key}>{col.label}</TableCell>
                ))}
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {universities.map((u) => (
                <TableRow key={u._id} hover className="university-table-row">
                  {FIELD_MAP.map((col) => {
                    const value = u[col.key];

                    if (col.key === "website") {
                      return (
                        <TableCell key={col.key} sx={{ maxWidth: 260 }}>
                          {value ? (
                            <Tooltip title={value} arrow placement="top">
                              <a
                                href={/^https?:\/\//i.test(value) ? value : `https://${value}`}
                                target="_blank"
                                rel="noreferrer"
                                className="university-link"
                                style={{
                                  display: "block",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  maxWidth: 260,
                                }}
                              >
                                {value}
                              </a>
                            </Tooltip>
                          ) : (
                            <Ellipsize value="-" />
                          )}
                        </TableCell>
                      );
                    }

                    if (col.key === "acceptanceRate") {
                      return (
                        <TableCell key={col.key} sx={{ maxWidth: 160 }}>
                          <Ellipsize value={formatPercent(value)} maxWidth={160} />
                        </TableCell>
                      );
                    }
                    if (col.key === "tuition") {
                      return (
                        <TableCell key={col.key} sx={{ maxWidth: 160 }}>
                          <Ellipsize value={formatUSD(value)} maxWidth={160} />
                        </TableCell>
                      );
                    }

                    // default text fields
                    return (
                      <TableCell key={col.key} sx={{ maxWidth: 260 }}>
                        <Ellipsize value={value} maxWidth={260} />
                      </TableCell>
                    );
                  })}

                  <TableCell className="university-createdat" sx={{ maxWidth: 160 }}>
                    <Ellipsize
                      value={u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}
                      maxWidth={160}
                    />
                  </TableCell>

                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      className="university-edit-btn"
                      onClick={() => {
                        // ensure all fields exist as strings for inputs
                        const shaped = {
                          ...u,
                          ...FIELD_MAP.reduce((acc, f) => {
                            acc[f.key] = u[f.key] ?? "";
                            return acc;
                          }, {}),
                        };
                        setSelectedUniversity(shaped);
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
                        setUniversityToDelete(u);
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
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New University</DialogTitle>
        <DialogContent>
          {FIELD_MAP.map((f) => (
            <TextField
              key={f.key}
              label={f.label}
              type={f.type}
              fullWidth
              variant="outlined"
              value={newUniversity[f.key]}
              onChange={(e) =>
                setNewUniversity((prev) => ({ ...prev, [f.key]: e.target.value }))
              }
              sx={{ mb: 2 }}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateUniversity}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit University</DialogTitle>
        <DialogContent>
          {FIELD_MAP.map((f) => (
            <TextField
              key={f.key}
              label={f.label}
              type={f.type}
              fullWidth
              variant="outlined"
              value={selectedUniversity?.[f.key] ?? ""}
              onChange={(e) =>
                setSelectedUniversity((prev) =>
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
          <Button variant="contained" onClick={handleUpdateUniversity}>
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
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this university?</Typography>
          <Typography fontWeight="bold" mt={1}>
            {universityToDelete?.name}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteUniversity}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UniversityDashboard;
