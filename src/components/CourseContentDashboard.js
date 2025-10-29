"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Add as AddIcon,
  CloudUpload as CloudUploadIcon,
  InsertDriveFile as FileIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  Audiotrack as AudioIcon,
  Movie as VideoIcon,
  Code as CodeIcon,
  DeleteOutline as DeleteIcon,
  OpenInNew as OpenIcon,
} from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CourseContentDashboard.css";

const API_BASE = "http://localhost:3001";

function humanSize(bytes) {
  if (!bytes && bytes !== 0) return "-";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = bytes ? Math.floor(Math.log(bytes) / Math.log(1024)) : 0;
  const v = bytes / Math.pow(1024, i);
  return `${v >= 10 ? v.toFixed(0) : v.toFixed(1)} ${units[i]}`;
}

function iconFor(mime = "") {
  if (mime.startsWith("image/")) return <ImageIcon fontSize="small" />;
  if (mime === "application/pdf") return <PdfIcon fontSize="small" />;
  if (mime.startsWith("audio/")) return <AudioIcon fontSize="small" />;
  if (mime.startsWith("video/")) return <VideoIcon fontSize="small" />;
  if (mime.includes("javascript") || mime.includes("json") || mime.includes("xml") || mime.includes("text/")) {
    return <CodeIcon fontSize="small" />;
  }
  return <FileIcon fontSize="small" />;
}

/**
 * Props:
 * - courseId (string)  : required
 * - ownerMode (bool)   : if true use owner endpoints and show Delete/Upload
 */
export default function CourseContentManager({ courseId, ownerMode = true }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [uploadOpen, setUploadOpen] = useState(false);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const auth = token ? { Authorization: `Bearer ${token}` } : {};

  const listUrl = ownerMode
    ? `${API_BASE}/api/courses/${courseId}/content`
    : `${API_BASE}/api/courses/${courseId}/content/public`;

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch(listUrl, { headers: { ...auth } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load content");
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(e.message || "Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!courseId) return;
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, ownerMode]);

  const onChooseFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    if (files.length > 10) {
      toast.warn("Select up to 10 files.");
    }
    setPendingFiles(files.slice(0, 10));
  };

  const handleUpload = async () => {
    if (!pendingFiles.length) {
      toast.warn("Choose files first.");
      return;
    }
    try {
      setIsUploading(true);
      const fd = new FormData();
      // IMPORTANT: field name must match your multer field name (commonly "files")
      pendingFiles.forEach((f) => fd.append("files", f));
      // Optional: a single title; backend falls back to originalname
      // fd.append("title", "Course Files");

      const res = await fetch(`${API_BASE}/api/courses/${courseId}/content`, {
        method: "POST",
        headers: { ...auth }, // DO NOT set Content-Type; browser sets multipart boundary
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");

      toast.success(`Uploaded ${data.length || pendingFiles.length} file(s)`);
      setUploadOpen(false);
      setPendingFiles([]);
      fetchItems();
    } catch (e) {
      toast.error(e.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const confirmDelete = (item) => {
    setToDelete(item);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      const res = await fetch(`${API_BASE}/api/courses/content/${toDelete._id}`, {
        method: "DELETE",
        headers: { ...auth },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");
      toast.success("Deleted");
      setItems((prev) => prev.filter((x) => x._id !== toDelete._id));
    } catch (e) {
      toast.error(e.message || "Delete failed");
    } finally {
      setDeleteOpen(false);
      setToDelete(null);
    }
  };

  return (
    <Box className="content-dashboard">
      <ToastContainer position="top-right" autoClose={3000} />

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ color: "#20438E", fontWeight: "bold" }}>
          Course Content
        </Typography>
        {ownerMode && (
          <Button
            variant="contained"
            startIcon={<CloudUploadIcon />}
            onClick={() => setUploadOpen(true)}
            className="content-add-btn"
          >
            Upload Files
          </Button>
        )}
      </Box>

      <TableContainer component={Paper} className="content-data-table">
        <Table sx={{ tableLayout: "fixed" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 360 }}>File</TableCell>
              <TableCell sx={{ width: 150 }}>Type</TableCell>
              <TableCell sx={{ width: 120 }}>Size</TableCell>
              <TableCell sx={{ width: 160 }}>Uploaded</TableCell>
              <TableCell sx={{ width: 180 }}>Uploaded By</TableCell>
              <TableCell sx={{ width: 160 }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: "center", py: 4 }}>
                  Loading…
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: "center", py: 4 }}>
                  No files yet.
                </TableCell>
              </TableRow>
            ) : (
              items.map((it) => (
                <TableRow key={it._id} hover className="content-table-row">
                  {/* File (icon + title, 1-line ellipsis + tooltip) */}
                  <TableCell sx={{ p: 1 }}>
                    <Box display="flex" alignItems="center" gap={1.25}>
                      {iconFor(it.mimeType)}
                      <Tooltip title={it.title || it.fileKey} arrow placement="top">
                        <a
                          href={it.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="one-line-ellipsis content-file-link"
                        >
                          {it.title || it.fileKey}
                        </a>
                      </Tooltip>
                    </Box>
                  </TableCell>

                  {/* Type */}
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    <Chip
                      size="small"
                      className="content-type-chip"
                      label={it.mimeType || "-"}
                    />
                  </TableCell>

                  {/* Size */}
                  <TableCell sx={{ whiteSpace: "nowrap" }}>{humanSize(it.size)}</TableCell>

                  {/* Uploaded */}
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {it.createdAt ? new Date(it.createdAt).toLocaleString() : "-"}
                  </TableCell>

                  {/* Uploaded By (1-line + tooltip) — only present in owner GET */}
                  <TableCell sx={{ p: 1 }}>
                    <Tooltip title={it.uploadedBy?.username || it.uploadedBy || ""} arrow placement="top">
                      <span className="one-line-ellipsis">
                        {it.uploadedBy?.username || it.uploadedBy || "—"}
                      </span>
                    </Tooltip>
                  </TableCell>

                  {/* Actions: inline */}
                  <TableCell className="actions-cell">
                    <Box display="flex" alignItems="center" gap={1} sx={{ flexWrap: "nowrap" }}>
                      <Button
                        size="small"
                        variant="outlined"
                        endIcon={<OpenIcon />}
                        component="a"
                        href={it.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View
                      </Button>
                      {ownerMode && (
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          endIcon={<DeleteIcon />}
                          onClick={() => confirmDelete(it)}
                        >
                          Delete
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Upload dialog */}
      <Dialog
        open={uploadOpen}
        onClose={() => !isUploading && setUploadOpen(false)}
        maxWidth="sm"
        fullWidth
        className="content-dialog"
      >
        <DialogTitle>Upload Files</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            You can select up to 10 files. Titles will default to the original file names.
          </Typography>
          <Button
            variant="outlined"
            component="label"
            startIcon={<AddIcon />}
            sx={{ mb: 2 }}
          >
            Choose Files
            <input
              type="file"
              hidden
              multiple
              onChange={onChooseFiles}
            />
          </Button>

          {pendingFiles.length > 0 && (
            <Box sx={{ maxHeight: 220, overflowY: "auto", border: "1px solid #eee", borderRadius: 1, p: 1 }}>
              {pendingFiles.map((f, i) => (
                <Box key={i} display="flex" justifyContent="space-between" alignItems="center" py={0.5}>
                  <Typography className="one-line-ellipsis" sx={{ maxWidth: "70%" }}>
                    {f.name}
                  </Typography>
                  <Typography sx={{ color: "#666" }}>{humanSize(f.size)}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadOpen(false)} disabled={isUploading}>Cancel</Button>
          <Button variant="contained" onClick={handleUpload} disabled={isUploading || pendingFiles.length === 0}>
            {isUploading ? "Uploading…" : "Upload"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete File</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this file?</Typography>
          <Typography fontWeight="bold" mt={1}>{toDelete?.title || toDelete?.fileKey}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
