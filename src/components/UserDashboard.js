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
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Add as AddIcon, Visibility, VisibilityOff } from "@mui/icons-material";
import "./UserDashboard.css";

const UserDashboard = () => {
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  // temp password state for edit dialog
  const [editPassword, setEditPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "student",
  });

  // Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/users");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create user");

      setUsers((prev) => [
        ...prev,
        {
          ...form,
          _id: data.userId,
          profilePicture: "https://fekra.s3.eu-north-1.amazonaws.com/default.png",
          createdAt: new Date().toISOString(),
        },
      ]);

      toast.success("User added successfully");
      setForm({ username: "", email: "", password: "", role: "student" });
      setOpenDialog(false);
    } catch (err) {
      console.error("Backend message:", err.message);
      toast.error(err.message || "Failed to create user");
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    try {
      // Build payload: only include password if a new one is provided
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

      setUsers((prev) => prev.map((u) => (u._id === selectedUser._id ? data.user : u)));

      toast.success("User updated successfully");

      setEditDialogOpen(false);
      setSelectedUser(null);
      setEditPassword(""); // clear temp password
      setShowPassword(false);
    } catch (err) {
      toast.error(err.message || "Failed to update user");
      console.error("Error updating user:", err);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const res = await fetch(`http://localhost:3001/api/users/${userToDelete._id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete user");

      setUsers((prev) => prev.filter((u) => u._id !== userToDelete._id));
      toast.success("User deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete user");
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  return (
    <Box className="user-dashboard">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ color: "#20438E", fontWeight: "bold" }}>
          User Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          className="user-add-btn"
        >
          Add User
        </Button>
      </Box>

      {loading ? (
        <Box className="dashboard-overview" display="flex" justifyContent="center" alignItems="center" minHeight={240}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading Users…</Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} className="user-data-table">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Join Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id} hover className="user-table-row">
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar src={user.profilePicture} sx={{ mr: 2 }} />
                      <Typography variant="body2" fontWeight="bold">
                        {user.username}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      color={
                        user.role === "teacher" ? "primary" : user.role === "admin" ? "secondary" : "default"
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip label="Active" color="success" size="small" />
                  </TableCell>
                  <TableCell>
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setSelectedUser(user);
                        setEditPassword(""); // reset temp password each time you open
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
                        setUserToDelete(user);
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

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onClose={() => { setEditDialogOpen(false); setEditPassword(""); setShowPassword(false); }} maxWidth="sm" fullWidth>
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

              {/* NEW: Optional new password field with show/hide */}
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

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Role</InputLabel>
                <Select
                  value={selectedUser.role}
                  label="Role"
                  onChange={(e) =>
                    setSelectedUser((prev) => ({ ...prev, role: e.target.value }))
                  }
                >
                  <MenuItem value="student">Student</MenuItem>
                  <MenuItem value="teacher">Teacher</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setEditDialogOpen(false); setEditPassword(""); setShowPassword(false); }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleUpdateUser}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New User</DialogTitle>
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
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={form.role}
              label="Role"
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="teacher">Teacher</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddUser}>Add</Button>
        </DialogActions>
      </Dialog>

      <ToastContainer position="top-right" autoClose={3000} />
    </Box>
  );
};

export default UserDashboard;
