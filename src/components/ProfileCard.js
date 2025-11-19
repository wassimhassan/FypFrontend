import React, { useState, useEffect, useRef } from "react";
import NavBar from "./NavBar";
import "./ProfileCard.css";

import {
  Avatar,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";

import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GroupIcon from "@mui/icons-material/Group";
import StarIcon from "@mui/icons-material/Star";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ProfileCard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [editing, setEditing] = useState(false);
  const [updatedInfo, setUpdatedInfo] = useState({
    username: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(true);

  const [myCourses, setMyCourses] = useState([]);

  // profile picture
  const fileInputRef = useRef(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  // delete picture dialog
  const [deleteOpen, setDeleteOpen] = useState(false);

  // MUI Menu (dropdown) anchor
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleOpenMenu = (e) => setAnchorEl(e.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const openImageModal = () => setImageModalOpen(true);
  const closeImageModal = () => setImageModalOpen(false);

  /* ---------- Upload profile picture ----------------------------------- */
  const handleFileChangeAndUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }

    const formData = new FormData();
    formData.append("profilePicture", file);

    const res = await fetch(`${API_BASE_URL}/profile/upload-profile-picture`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();

    if (res.ok) {
      toast.success("Profile picture uploaded successfully!");
      setUserInfo((prev) => ({ ...prev, profilePicture: data.profilePicture }));
    } else {
      toast.error(data.message || "Failed to upload profile picture");
    }
    handleCloseMenu();
  };

  /* ---------- Delete profile picture (via dialog) ----------------------- */
  const deleteProfilePicture = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/profile/remove-profile-picture`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Profile picture removed successfully!");
        setUserInfo((prev) => ({
          ...prev,
          profilePicture: "https://fekra.s3.eu-north-1.amazonaws.com/default.png",
        }));
      } else {
        toast.error(data.message || "Failed to delete profile picture");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete profile picture");
    } finally {
      setDeleteOpen(false);
      handleCloseMenu();
    }
  };

  /* ---------- Input change --------------------------------------------- */
  const handleChange = (e) =>
    setUpdatedInfo({ ...updatedInfo, [e.target.name]: e.target.value });

  /* ---------- Fetch profile on mount ----------------------------------- */
 useEffect(() => {
  (async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      // 1) My courses
      const coursesRes = await fetch(`${API_BASE_URL}/courses/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (coursesRes.ok) {
        const list = await coursesRes.json();
        setMyCourses(list);
      }

      // 2) Profile (make sure we pull profilePicture from here)
      const res = await fetch(`${API_BASE_URL}/profile/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        // some backends return { user: {...} }, some return the user directly
        const user = data.user || data;

        const finalUser = {
          ...user,
          profilePicture:
            user.profilePicture ||
            "https://fekra.s3.eu-north-1.amazonaws.com/default.png",
        };

        setUserInfo(finalUser);
        setUpdatedInfo({
          username: finalUser.username || "",
          phoneNumber: finalUser.phoneNumber || "",
        });
      } else {
        console.error(data.message);
      }

      // 🔥 we don’t need the extra /profile-picture fetch anymore
    } catch (err) {
      console.error(err);
      toast.error("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  })();
}, []);

  /* ---------- Save edits ----------------------------------------------- */
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/profile/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: updatedInfo.username,
          phoneNumber: updatedInfo.phoneNumber,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Profile updated successfully!");
        setUserInfo(data.user);
        setEditing(false);
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while updating.");
    }
  };

  /* ---------- Logout ---------------------------------------------------- */
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.info("Logged out.");
    setTimeout(() => (window.location.href = "/"), 600);
  };

  /* ---------- Render ---------------------------------------------------- */
  // ⬇️ Same loading UI as the dashboard
  if (loading) {
    return (
      <>
        <NavBar />
        <ToastContainer position="top-right" autoClose={2000} />
        <div className="cd-overview">
          <div className="cd-loading-container">
            <div className="cd-spinner" />
            <div className="cd-loading-text">Loading profile…</div>
          </div>
        </div>
      </>
    );
  }

  if (!userInfo) return <p>No profile data available.</p>;

  const fieldsToShow = ["email", "username", "phoneNumber"];

  return (
    <>
      <NavBar />
      <div className="profile-container">
        {/* Toasts */}
        <ToastContainer position="top-right" autoClose={2000} />

        {/* ---------- Avatar & dropdown ---------- */}
        <div className="profile-img-wrapper">
          <Tooltip title="Profile options">
            <Avatar
              src={userInfo.profilePicture}
              alt="Profile"
              sx={{
                width: 150,
                height: 150,
                border: "4px solid #1009eb",
                boxShadow: "0px 4px 8px rgba(35, 3, 177, 0.4)",
                cursor: "pointer",
              }}
              onClick={handleOpenMenu}
            />
          </Tooltip>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChangeAndUpload}
          />

          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleCloseMenu}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            transformOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <MenuItem
              onClick={() => {
                handleCloseMenu();
                openImageModal();
              }}
            >
              <VisibilityOutlinedIcon fontSize="small" style={{ marginRight: 8 }} />
              View Profile
            </MenuItem>
            <MenuItem onClick={() => fileInputRef.current?.click()}>
              <PhotoCameraIcon fontSize="small" style={{ marginRight: 8 }} />
              Change Profile Picture
            </MenuItem>
            <MenuItem
              onClick={() => {
                setDeleteOpen(true); // open confirm dialog
              }}
            >
              <DeleteOutlineIcon fontSize="small" style={{ marginRight: 8 }} />
              Delete Picture
            </MenuItem>
          </Menu>

          <Dialog open={imageModalOpen} onClose={closeImageModal} maxWidth="sm" fullWidth>
            <DialogContent sx={{ display: "flex", justifyContent: "center" }}>
              <img
                src={userInfo.profilePicture}
                alt="Profile large"
                style={{ width: "100%", height: "auto", borderRadius: 12 }}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* ---------- Card ---------- */}
        <Card className="profile-card">
          <CardContent>
            <div className="profile-header">
              <h2 className="profile-title">Member Profile</h2>
            </div>

            <div className="profile-details">
              {fieldsToShow.map((field) => (
                <div key={field} className="profile-item">
                  <strong>
                    {field === "phoneNumber"
                      ? "Phone Number"
                      : field.charAt(0).toUpperCase() + field.slice(1)}
                    :
                  </strong>{" "}
                  {field === "email" ? (
                    <span>{userInfo.email ?? " Not set"}</span>
                  ) : editing ? (
                    <input
                      type="text"
                      name={field}
                      value={updatedInfo[field] || ""}
                      onChange={handleChange}
                      className="profile-input"
                    />
                  ) : (
                    <span>{userInfo[field] ? " " + userInfo[field] : " Not set"}</span>
                  )}
                </div>
              ))}
            </div>

            <div className="profile-actions">
              {editing ? (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<SaveOutlinedIcon />}
                  onClick={handleSave}
                  className="save-btn"
                >
                  Save
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<EditOutlinedIcon />}
                  onClick={() => setEditing(true)}
                  className="edit-btn"
                >
                  Edit
                </Button>
              )}

              <Button
                variant="outlined"
                color="error"
                startIcon={<LogoutOutlinedIcon />}
                onClick={handleLogout}
                className="logout-btn"
              >
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ---------- Registered Courses ---------- */}
        <div className="registered-courses">
          <div className="rc-header">
            <h3>Registered Courses</h3>
            {myCourses?.length ? (
              <span className="rc-count">{myCourses.length}</span>
            ) : null}
          </div>

          {!myCourses?.length ? (
            <p className="rc-empty">You haven’t registered for any course yet.</p>
          ) : (
            <div className="rc-grid">
              {myCourses.map((c) => (
                <article key={c._id} className="rc-card">
                  <div className="rc-card-top">
                    <span className="rc-type">{c.category}</span>
                    <span
                      className={`rc-badge ${
                        c.price?.toLowerCase() === "free" ? "free" : "paid"
                      }`}
                    >
                      {c.price}
                    </span>
                  </div>

                  <h4 className="rc-title">{c.title}</h4>
                  <p className="rc-instructor">by {c.instructor}</p>

                  <div className="rc-info">
                    <span className="rc-info-chip" title={`${c.durationDays} days`}>
                      <AccessTimeIcon fontSize="small" /> {c.durationDays} d
                    </span>
                    <span className="rc-info-chip">
                      <GroupIcon fontSize="small" /> {c.enrolledStudents?.length ?? 0}
                    </span>
                    <span className="rc-info-chip">
                      <StarIcon fontSize="small" /> {c.ratingAvg ?? 0}/5 (
                      {c?.ratingCount ?? 0})
                    </span>
                  </div>

                  <span className="rc-level">{c.level}</span>

                  <p className="rc-desc" title={c.description}>
                    {c.description?.length > 110
                      ? c.description.slice(0, 110) + "…"
                      : c.description}
                  </p>

                  <div className="rc-meta">
                    <span
                      className="rc-date"
                      title={new Date(c.createdAt).toLocaleString()}
                    >
                      Joined: {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                    <span className="rc-enrolled">
                      {c.enrolledStudents?.length ?? 0} enrolled
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete picture confirm dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Profile Picture</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete your profile picture?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={deleteProfilePicture}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProfileCard;
