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
  InputAdornment,
  TableSortLabel,
} from "@mui/material";
import { Add as AddIcon, Search as SearchIcon } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./EventDashboard.css";

// API base (env override supported)
const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api/events`;

// Ellipsize + Tooltip helper
const Ellipsize = ({ value, lines = 1, maxWidth = 260 }) => {
  const text = value ?? "";
  const isMulti = lines > 1;
  return (
    <Tooltip
      title={text || ""}
      arrow
      placement="top"
      disableHoverListener={!text}
    >
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

/* -------- helpers for location & date fields -------- */
const locationToText = (loc) => {
  if (!loc) return "";
  if (typeof loc === "string") return loc;
  const { venue, address, city, country, onlineLink } = loc || {};
  const s = [venue, address, city, country].filter(Boolean).join(", ");
  return s || onlineLink || "";
};

const toISOStringOrNull = (v) => {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
};

const formatLocalInput = (d) => {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const mi = pad(date.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
};

// Fields
const FIELD_MAP = [
  { key: "title", label: "Title", required: true, type: "text" },
  {
    key: "mode",
    label: "Mode (Online/In-Person/Hybrid)",
    required: true,
    type: "text",
  },
  { key: "tag", label: "Tag", required: false, type: "text" },
  { key: "type", label: "Type", required: false, type: "text" },
  { key: "location", label: "Location", required: false, type: "text" },
  { key: "link", label: "Link (URL)", required: false, type: "text" },
  {
    key: "startsAt",
    label: "Starts At",
    required: true,
    type: "datetime-local",
  },
  { key: "endsAt", label: "Ends At", required: false, type: "datetime-local" },
  {
    key: "description",
    label: "Description",
    required: false,
    type: "multiline",
    clamped: true,
  },
];

const EventDashboard = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventToDelete, setEventToDelete] = useState(null);

  // NEW: search + sort state
  const [query, setQuery] = useState("");
  const [orderBy, setOrderBy] = useState("createdAt"); // title | mode | startsAt | createdAt
  const [order, setOrder] = useState("desc"); // asc | desc

  // Form state (create)
  const emptyForm = useMemo(
    () =>
      FIELD_MAP.reduce((acc, f) => {
        acc[f.key] = "";
        return acc;
      }, {}),
    []
  );
  const [newEvent, setNewEvent] = useState(emptyForm);

  // Auth header (admin endpoints)
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  // Fetch events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_BASE, {
        headers: { Accept: "application/json" },
      });
      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }
      if (!res.ok)
        throw new Error(data?.message || `Failed to fetch (${res.status})`);
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.items)
        ? data.items
        : [];
      setEvents(list);
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // ------- filter + sort (client) -------
  const displayedEvents = useMemo(() => {
    const q = query.trim().toLowerCase();

    const filtered = q
      ? events.filter((e) => {
          const fields = [
            e.title,
            e.mode,
            e.tag,
            e.type,
            locationToText(e.location),
            e.description,
          ];
          return fields.some((f) =>
            String(f || "")
              .toLowerCase()
              .includes(q)
          );
        })
      : events.slice();

    filtered.sort((a, b) => {
      const val = (x) => {
        switch (orderBy) {
          case "title":
          case "mode":
            return String(x?.[orderBy] || "").toLowerCase();
          case "startsAt":
            return new Date(x?.startsAt || 0).getTime();
          case "createdAt":
          default:
            return new Date(x?.createdAt || 0).getTime();
        }
      };
      const va = val(a);
      const vb = val(b);
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return order === "asc" ? cmp : -cmp;
    });

    return filtered;
  }, [events, query, orderBy, order]);

  const handleSort = (prop) => {
    if (orderBy === prop) setOrder((p) => (p === "asc" ? "desc" : "asc"));
    else {
      setOrderBy(prop);
      setOrder("asc");
    }
  };

  // Create
  const handleCreateEvent = async () => {
    try {
      const missing = FIELD_MAP.filter(
        (f) => f.required && !String(newEvent[f.key] ?? "").trim()
      );
      if (missing.length) {
        toast.warn(`Please fill: ${missing.map((m) => m.label).join(", ")}`);
        return;
      }

      const payload = { ...newEvent };
      Object.keys(payload).forEach((k) => {
        if (typeof payload[k] === "string") payload[k] = payload[k].trim();
      });

      if (payload.location?.trim?.().startsWith("{")) {
        try {
          payload.location = JSON.parse(payload.location);
        } catch {}
      }

      payload.startsAt = toISOStringOrNull(payload.startsAt);
      payload.endsAt = toISOStringOrNull(payload.endsAt);

      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to create event");

      setEvents((prev) => [data, ...prev]);
      toast.success("Event created successfully");
      setOpenDialog(false);
      setNewEvent(emptyForm);
    } catch (err) {
      toast.error(err?.message || "Failed to create event");
    }
  };

  // Update
  const handleUpdateEvent = async () => {
    if (!selectedEvent?._id) return;
    try {
      const payload = { ...selectedEvent };
      Object.keys(payload).forEach((k) => {
        if (typeof payload[k] === "string") payload[k] = payload[k].trim();
      });

      if (payload.location?.trim?.().startsWith("{")) {
        try {
          payload.location = JSON.parse(payload.location);
        } catch {}
      }

      payload.startsAt = toISOStringOrNull(payload.startsAt);
      payload.endsAt = toISOStringOrNull(payload.endsAt);

      const res = await fetch(`${API_BASE}/${selectedEvent._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to update event");

      setEvents((prev) => prev.map((e) => (e._id === data._id ? data : e)));
      toast.success("Event updated successfully");
      setEditDialogOpen(false);
      setSelectedEvent(null);
    } catch (err) {
      toast.error(err?.message || "Failed to update event");
    }
  };

  // Delete
  const handleDeleteEvent = async () => {
    if (!eventToDelete?._id) return;
    try {
      const res = await fetch(`${API_BASE}/${eventToDelete._id}`, {
        method: "DELETE",
        headers: { ...authHeader },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to delete event");

      setEvents((prev) => prev.filter((e) => e._id !== eventToDelete._id));
      toast.success("Event deleted");
    } catch (err) {
      toast.error(err?.message || "Failed to delete event");
    } finally {
      setDeleteDialogOpen(false);
      setEventToDelete(null);
    }
  };

  return (
    <Box className="cd-dashboard">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header: title + search + add */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        gap={2}
        flexWrap="wrap"
      >
        <Typography variant="h4" sx={{ color: "#20438E", fontWeight: "bold" }}>
          Event Management
        </Typography>

        <Box sx={{ flex: 1, minWidth: 260, maxWidth: 520 }}>
          <TextField
            fullWidth
            placeholder="Search title, mode, tag, type, location, description…"
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
          Add Event
        </Button>
      </Box>

      {loading ? (
        <Box className="cd-overview">
          <div className="cd-loading-container">
            <div className="cd-spinner" />
            <Typography className="cd-loading-text">Loading Events…</Typography>
          </div>
        </Box>
      ) : (
        <TableContainer component={Paper} className="cd-data-table">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sortDirection={orderBy === "title" ? order : false}>
                  <TableSortLabel
                    active={orderBy === "title"}
                    direction={orderBy === "title" ? order : "asc"}
                    onClick={() => handleSort("title")}
                  >
                    Title
                  </TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === "mode" ? order : false}>
                  <TableSortLabel
                    active={orderBy === "mode"}
                    direction={orderBy === "mode" ? order : "asc"}
                    onClick={() => handleSort("mode")}
                  >
                    Mode
                  </TableSortLabel>
                </TableCell>
                <TableCell>Tag</TableCell>
                <TableCell>Type</TableCell>
                <TableCell
                  sortDirection={orderBy === "startsAt" ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === "startsAt"}
                    direction={orderBy === "startsAt" ? order : "asc"}
                    onClick={() => handleSort("startsAt")}
                  >
                    Starts At
                  </TableSortLabel>
                </TableCell>
                <TableCell>Ends At</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Description</TableCell>
                <TableCell
                  sortDirection={orderBy === "createdAt" ? order : false}
                >
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
              {displayedEvents.map((e) => (
                <TableRow key={e._id} hover className="cd-row">
                  <TableCell sx={{ maxWidth: 260 }}>
                    <Ellipsize value={e.title} maxWidth={260} />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 140 }}>
                    <Ellipsize value={e.mode} maxWidth={140} />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 160 }}>
                    <Ellipsize value={e.tag} maxWidth={160} />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 160 }}>
                    <Ellipsize value={e.type} maxWidth={160} />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 200 }}>
                    <Ellipsize
                      value={
                        e.startsAt ? new Date(e.startsAt).toLocaleString() : "-"
                      }
                      maxWidth={200}
                    />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 200 }}>
                    <Ellipsize
                      value={
                        e.endsAt ? new Date(e.endsAt).toLocaleString() : "-"
                      }
                      maxWidth={200}
                    />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 220 }}>
                    <Ellipsize
                      value={locationToText(e.location)}
                      maxWidth={220}
                    />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 380 }}>
                    <Ellipsize value={e.description} lines={2} maxWidth={380} />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 160 }}>
                    <Ellipsize
                      value={
                        e.createdAt
                          ? new Date(e.createdAt).toLocaleDateString()
                          : "-"
                      }
                      maxWidth={160}
                    />
                  </TableCell>

                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        const shaped = {
                          ...e,
                          startsAt: formatLocalInput(e.startsAt),
                          endsAt: formatLocalInput(e.endsAt),
                          location: locationToText(e.location),
                          link: e.link || "",
                        };
                        setSelectedEvent(shaped);
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
                        setEventToDelete(e);
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
        <DialogTitle>Add New Event</DialogTitle>
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
              value={newEvent[f.key]}
              onChange={(e) =>
                setNewEvent((prev) => ({ ...prev, [f.key]: e.target.value }))
              }
              InputLabelProps={
                f.type === "datetime-local" ? { shrink: true } : undefined
              }
              sx={{ mb: 2 }}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateEvent}>
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
        <DialogTitle>Edit Event</DialogTitle>
        <DialogContent>
          {selectedEvent &&
            FIELD_MAP.map((f) => (
              <TextField
                key={f.key}
                label={f.label}
                type={f.type === "multiline" ? "text" : f.type}
                fullWidth
                multiline={f.type === "multiline"}
                rows={f.type === "multiline" ? 3 : 1}
                variant="outlined"
                value={selectedEvent?.[f.key] ?? ""}
                onChange={(e) =>
                  setSelectedEvent((prev) =>
                    prev ? { ...prev, [f.key]: e.target.value } : prev
                  )
                }
                InputLabelProps={
                  f.type === "datetime-local" ? { shrink: true } : undefined
                }
                sx={{ mb: 2 }}
              />
            ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateEvent}>
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
          <Typography>Are you sure you want to delete this event?</Typography>
          <Typography fontWeight="bold" mt={1}>
            {eventToDelete?.title}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteEvent}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EventDashboard;
