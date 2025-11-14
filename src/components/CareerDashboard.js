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
  InputAdornment,
  TableSortLabel,
} from "@mui/material";
import { Add as AddIcon, Search as SearchIcon } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CareerDashboard.css";

// API base (env override supported)
const API_BASE =
  (process.env.REACT_APP_BACKEND_URL || "http://localhost:3001") + "/api/careers";

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
  { key: "title", label: "Title", required: true, type: "text", sortable: true },
  { key: "field", label: "Field", required: true, type: "text", sortable: true },
  { key: "salaryRange", label: "Salary Range", required: true, type: "text", sortable: true },
  { key: "skills", label: "Skills (comma-separated)", required: true, type: "csv", sortable: false },
  { key: "industries", label: "Industries (comma-separated)", required: true, type: "csv", sortable: false },
  { key: "description", label: "Description", required: true, type: "multiline", clamped: true, sortable: false },
];

const CareerDashboard = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCareer, setSelectedCareer] = useState(null);
  const [careerToDelete, setCareerToDelete] = useState(null);

  // NEW: search + sort state
  const [query, setQuery] = useState("");
  const [orderBy, setOrderBy] = useState("createdAt"); // title | field | salaryRange | createdAt
  const [order, setOrder] = useState("desc"); // asc | desc

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

  // ---------- filter + sort ----------
  const displayedCareers = useMemo(() => {
    const q = query.trim().toLowerCase();

    const filtered = q
      ? careers.filter((c) => {
          const fields = [
            c.title,
            c.field,
            c.salaryRange,
            Array.isArray(c.skills) ? c.skills.join(", ") : c.skills,
            Array.isArray(c.industries) ? c.industries.join(", ") : c.industries,
            c.description,
          ];
          return fields.some((f) => String(f || "").toLowerCase().includes(q));
        })
      : careers.slice();

    const salaryToTuple = (s) => {
      // Try to parse ranges like "$50k - $80k", "3000–4000", "80k+", "5000"
      const str = String(s || "").replace(/[\$,]/g, "").toLowerCase();
      const nums = str.match(/\d+(\.\d+)?/g);
      if (!nums) return [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY];
      const first = parseFloat(nums[0]);
      const second = nums[1] ? parseFloat(nums[1]) : first;
      return [first, second];
    };

    filtered.sort((a, b) => {
      let va, vb;

      switch (orderBy) {
        case "title":
        case "field":
          va = String(a[orderBy] || "").toLowerCase();
          vb = String(b[orderBy] || "").toLowerCase();
          break;
        case "salaryRange": {
          const [amin, amax] = salaryToTuple(a.salaryRange);
          const [bmin, bmax] = salaryToTuple(b.salaryRange);
          // primary by min, secondary by max
          va = amin; vb = bmin;
          if (va === vb) { va = amax; vb = bmax; }
          break;
        }
        case "createdAt":
        default:
          va = new Date(a.createdAt || 0).getTime();
          vb = new Date(b.createdAt || 0).getTime();
      }

      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return order === "asc" ? cmp : -cmp;
    });

    return filtered;
  }, [careers, query, orderBy, order]);

  const handleSort = (prop) => {
    if (orderBy === prop) setOrder((p) => (p === "asc" ? "desc" : "asc"));
    else {
      setOrderBy(prop);
      setOrder("asc");
    }
  };

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

      {/* Header: title + search + add */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} gap={2} flexWrap="wrap">
        <Typography variant="h4" sx={{ color: "#20438E", fontWeight: "bold" }}>
          Career Management
        </Typography>

        <Box sx={{ flex: 1, minWidth: 260, maxWidth: 520 }}>
          <TextField
            fullWidth
            placeholder="Search title, field, salary, skills, industries, description…"
            size="small"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
                {FIELD_MAP.map((col) => {
                  if (!col.sortable) return <TableCell key={col.key}>{col.label}</TableCell>;
                  return (
                    <TableCell key={col.key} sortDirection={orderBy === col.key ? order : false}>
                      <TableSortLabel
                        active={orderBy === col.key}
                        direction={orderBy === col.key ? order : "asc"}
                        onClick={() => handleSort(col.key)}
                      >
                        {col.label}
                      </TableSortLabel>
                    </TableCell>
                  );
                })}
                <TableCell sortDirection={orderBy === "createdAt" ? order : false}>
                  <TableSortLabel
                    active={orderBy === "createdAt"}
                    direction={orderBy === "createdAt" ? order : "asc"}
                    onClick={() => handleSort("createdAt")}
                  >
                    Created At
                  </TableSortLabel>
                </TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {displayedCareers.map((c) => (
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
