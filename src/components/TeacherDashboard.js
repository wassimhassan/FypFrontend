"use client";

import { useState, useEffect } from "react";
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
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Add as AddIcon, Visibility, VisibilityOff } from "@mui/icons-material";
import "./TeacherDashboard.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TeacherDashboard = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [selectedUser, setSelectedUser] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  // 🔐 temp password state for edit dialog (like UserDashboard)
  const [editPassword, setEditPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const fetchTeachers = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/users/teachers");
      if (!res.ok) throw new Error("Failed to fetch teachers");
      const data = await res.json();
      setTeachers(data);
    } catch (err) {
      console.error("Error fetching teachers:", err.message);
      toast.error("Failed to load teachers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const res = await fetch(`http://localhost:3001/api/users/${userToDelete._id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete user");

      setTeachers((prev) => prev.filter((u) => u._id !== userToDelete._id));
      toast.success("User deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete user");
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      // only include password if user typed a new one
      const payload = { ...selectedUser };
      if (editPassword.trim()) {
        payload.password = editPassword.trim();
      } else {
        delete payload.password;
      }

      const res = await fetch(`http://localhost:3001/api/users/${selectedUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update user");

      setTeachers((prev) => prev.map((u) => (u._id === selectedUser._id ? data.user : u)));
      toast.success("User updated successfully");

      setEditDialogOpen(false);
      setSelectedUser(null);
      setEditPassword("");
      setShowPassword(false);
    } catch (err) {
      toast.error(err.message || "Failed to update user");
      console.error("Error updating user:", err);
    }
  };

  const handleAddTeacher = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          role: "teacher", // always teacher
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create teacher");

      setTeachers((prev) => [
        ...prev,
        {
          ...form,
          role: "teacher",
          _id: data.userId,
          createdAt: new Date().toISOString(),
        },
      ]);

      setForm({ username: "", email: "", password: "" });
      setOpenDialog(false);
      toast.success("Teacher added successfully");
    } catch (err) {
      console.error("Backend message:", err.message);
      toast.error(err.message || "Failed to create user");
    }
  };

  return (
    <Box className="teacher-dashboard">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ color: "#20438E", fontWeight: "bold" }}>
          Teacher Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          className="teacher-add-btn"
        >
          Add Teacher
        </Button>
      </Box>

      {loading ? (
        <Box
          className="dashboard-overview"
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={240}
        >
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading Teachers…</Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} className="teacher-data-table">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Join Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teachers.map((teacher) => (
                <TableRow key={teacher._id} hover className="teacher-table-row">
                  <TableCell>
                    <Typography fontWeight="bold">{teacher.username}</Typography>
                  </TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>
                    <Chip label="teacher" size="small" color="primary" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={teacher.status || "Active"}
                      color={teacher.status === "On Leave" ? "warning" : "success"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {teacher.createdAt ? new Date(teacher.createdAt).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setSelectedUser(teacher);
                        setEditPassword("");
                        setShowPassword(false);
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
                        setUserToDelete(teacher);
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

      {/* Edit Teacher Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setEditPassword("");
          setShowPassword(false);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <>
              <TextField
                margin="dense"
                label="Username"
                fullWidth
                variant="outlined"
                value={selectedUser.username}
                onChange={(e) =>
                  setSelectedUser((prev) => ({ ...prev, username: e.target.value }))
                }
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                label="Email"
                fullWidth
                variant="outlined"
                value={selectedUser.email}
                onChange={(e) =>
                  setSelectedUser((prev) => ({ ...prev, email: e.target.value }))
                }
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                label="Phone Number"
                fullWidth
                variant="outlined"
                value={selectedUser.phoneNumber || ""}
                onChange={(e) =>
                  setSelectedUser((prev) => ({ ...prev, phoneNumber: e.target.value }))
                }
                sx={{ mb: 2 }}
              />

              {/* ✅ Optional new password with show/hide, not bound to selectedUser */}
              <TextField
                margin="dense"
                label="New Password (leave blank to keep current)"
                fullWidth
                variant="outlined"
                type={showPassword ? "text" : "password"}
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword((v) => !v)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setEditDialogOpen(false);
              setEditPassword("");
              setShowPassword(false);
            }}
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={handleUpdateUser}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete <strong>{userToDelete?.username}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteUser} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Teacher Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Teacher</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Username"
            fullWidth
            variant="outlined"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            variant="outlined"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Password"
            fullWidth
            variant="outlined"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddTeacher}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer position="top-right" autoClose={3000} />
    </Box>
  );
};

export default TeacherDashboard;
