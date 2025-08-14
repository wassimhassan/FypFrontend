import React, { useState, useEffect, useRef } from "react";
import NavBar from "./NavBar";
import "./ProfileCard.css";

const API_BASE_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ProfileCard = () => {
  const [userInfo, setUserInfo]         = useState(null);
  const [editing, setEditing]           = useState(false);
  const [updatedInfo, setUpdatedInfo]   = useState({ username: "", phoneNumber: "" });
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading]           = useState(true);
  const fileInputRef                    = useRef(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [myCourses, setMyCourses] = useState([]);

  /* ---------- Upload profile picture ----------------------------------- */
  const handleFileChangeAndUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    const formData = new FormData();
    formData.append("profilePicture", file);

    const res  = await fetch(`${API_BASE_URL}/profile/upload-profile-picture`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();

    if (res.ok) {
      alert("Profile picture uploaded successfully!");
      setUserInfo((prev) => ({ ...prev, profilePicture: data.profilePicture }));
    } else {
      alert(data.message || "Failed to upload profile picture");
    }
  };

  /* ---------- Delete profile picture ----------------------------------- */
  const deleteProfilePicture = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your profile picture?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    const res  = await fetch(`${API_BASE_URL}/profile/remove-profile-picture`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    if (res.ok) {
      alert("Profile picture removed successfully!");
      setUserInfo((prev) => ({
        ...prev,
        profilePicture: "https://fekra.s3.eu-north-1.amazonaws.com/default.png",
      }));
    } else {
      alert(data.message || "Failed to delete profile picture");
    }
  };

  /* ---------- Input change --------------------------------------------- */
  const handleChange = (e) =>
    setUpdatedInfo({ ...updatedInfo, [e.target.name]: e.target.value });

  /* ---------- Dropdown / modal toggles --------------------------------- */
  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const openImageModal  = () => setImageModalOpen(true);
  const closeImageModal = () => setImageModalOpen(false);

  /* ---------- Fetch profile on mount ----------------------------------- */
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return setLoading(false);

        const coursesRes = await fetch(`${API_BASE_URL}/courses/my`, {
        headers: { Authorization: `Bearer ${token}` },
        });
        if (coursesRes.ok) {
          const list = await coursesRes.json();
          setMyCourses(list);
        }

        const res = await fetch(`${API_BASE_URL}/profile/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok) {
          setUserInfo(data);
          setUpdatedInfo({
            username: data.username || "",
            phoneNumber: data.phoneNumber || "",
          });
        } else {
          console.error(data.message);
        }

        const picRes = await fetch(`${API_BASE_URL}/profile/profile-picture`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const picData = await picRes.json();
        if (picRes.ok) {
          setUserInfo((prev) => ({ ...prev, profilePicture: picData.profilePicture }));
        }
      } catch (err) {
        console.error(err);
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
          username:    updatedInfo.username,
          phoneNumber: updatedInfo.phoneNumber,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Profile updated successfully!");
        setUserInfo(data.user);
        setEditing(false);
      } else {
        alert(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------- Logout ---------------------------------------------------- */
  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged out successfully");
    window.location.href = "/";
  };

  /* ---------- Render ---------------------------------------------------- */
  if (loading)   return <p>Loading profile...</p>;
  if (!userInfo) return <p>No profile data available.</p>;

  const fieldsToShow = ["email", "username", "phoneNumber"];

  return (
    <>
    <NavBar /> 
    <div className="profile-container">
      {/* ---------- Avatar & dropdown ---------- */}
      <div className="profile-img-wrapper" onClick={toggleDropdown}>
        <img
          src={userInfo.profilePicture}
          alt="Profile"
          className="profile-img"
        />
        {showDropdown && (
          <div className="profile-dropdown" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => { setEditing(false); setShowDropdown(false); openImageModal(); }}>
              View Profile
            </button>

            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChangeAndUpload}
            />
            <button onClick={() => fileInputRef.current.click()} className="upload-btn">
              Change Profile Picture
            </button>
            <button onClick={deleteProfilePicture} className="delete-btn">
              Delete Picture
            </button>
          </div>
        )}

        {imageModalOpen && (
          <div className="image-modal">
            <div className="modal-content">
              <span className="close-modal" onClick={closeImageModal}>&times;</span>
              <img
                src={userInfo.profilePicture}
                alt="Profile"
              />
            </div>
          </div>
        )}
      </div>

      {/* ---------- Card ---------- */}
      <div className="profile-card">
        <div className="profile-header">
          <h2 className="profile-title">Member Profile</h2> 
        </div>

        <div className="profile-details">
          {fieldsToShow.map((field) => (
            <div key={field} className="profile-item">
              <strong>{field === "phoneNumber" ? "Phone Number" : field.charAt(0).toUpperCase() + field.slice(1)}:</strong>{" "}
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
            <button onClick={handleSave} className="save-btn">Save</button>
          ) : (
            <button onClick={() => setEditing(true)} className="edit-btn">Edit</button>
          )}
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>
    
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
    {/* header pills: category + price */}
    <div className="rc-card-top">
      <span className="rc-type">{c.category}</span>
      <span className={`rc-badge ${c.price?.toLowerCase() === 'free' ? 'free' : 'paid'}`}>
        {c.price}
      </span>
    </div>

    <h4 className="rc-title">{c.title}</h4>
    <p className="rc-instructor">by {c.instructor}</p>

    {/* quick facts row */}
    <div className="rc-info">
      <span title={`${c.durationDays} days`}>⏱ {c.durationDays} d</span>
      <span>👥 {(c.enrolledStudents?.length ?? 0)}</span>
      <span>⭐ {c.ratingAvg ?? 0}</span>
    </div>

    {/* level pill */}
    <span className="rc-level">{c.level}</span>

    {/* description */}
    <p className="rc-desc" title={c.description}>
      {c.description?.length > 110 ? c.description.slice(0, 110) + "…" : c.description}
    </p>

    {/* meta */}
    <div className="rc-meta">
      <span className="rc-date" title={new Date(c.createdAt).toLocaleString()}>
        Joined: {new Date(c.createdAt).toLocaleDateString()}
      </span>
      <span className="rc-enrolled">
        {(c.enrolledStudents?.length ?? 0)} enrolled
      </span>
    </div>
  </article>
))}

    </div>
  )}
</div>
</div>
  </>
  )};

export default ProfileCard;
