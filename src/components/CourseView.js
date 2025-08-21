import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./CourseView.css";
import NavBar from "./NavBar";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function CourseView() {
  const { courseId } = useParams();

  // existing files state
  const [files, setFiles] = useState([]);

  // rating summary
  const [avg, setAvg] = useState(0);
  const [count, setCount] = useState(0);
  const [myRating, setMyRating] = useState(0);
  const [saving, setSaving] = useState(false);


  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    // load files (existing)
    axios.get(`${API}/courses/${courseId}/content/public`, { headers })
      .then(res => setFiles(res.data))
      .catch(console.error);

    // load rating summary + my rating
    axios
      .get(`${API}/courses/${courseId}/rating`, { headers })
      .then((res) => {
        setAvg(res.data?.ratingAvg ?? 0);
        setCount(res.data?.ratingCount ?? 0);
        setMyRating(res.data?.myRating ?? 0);
      })
      .catch(console.error);
  }, [courseId]);

  const handleRate = async (value) => {
    if (value < 1 || value > 5) return;
    setSaving(true);
    try {
      const { data } = await axios.post(
        `${API}/courses/${courseId}/rating`,
        { rating: value },
        { headers }
      );
      setAvg(data?.ratingAvg ?? 0);
      setCount(data?.ratingCount ?? 0);
      setMyRating(data?.myRating ?? value);

      alert(`You rated the course ${value}/5`);
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        "Failed to save rating (are you enrolled?)";
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRating = async () => {
  if (!myRating || saving) return;
  if (!window.confirm("Remove your rating?")) return;

  const prev = myRating;
  setSaving(true);
  setMyRating(0); // optimistic

  try {
    const { data } = await axios.delete(
      `${API}/courses/${courseId}/rating`,
      { headers }
    );
    setAvg(data?.ratingAvg ?? 0);
    setCount(data?.ratingCount ?? 0);
    setMyRating(0);
    alert("Your rating was removed.");
  } catch (err) {
    console.error(err);
    setMyRating(prev); // revert
    alert(err?.response?.data?.message || "Failed to remove rating.");
  } finally {
    setSaving(false);
  }
};

  return (
    <>
    <NavBar />
    <div className="B">
    <div className="Manage-Wrap">
      <h2>Course Files</h2>
      {!files.length ? (
        <p>No files yet.</p>
      ) : (
        <ul className="File-List">
          {files.map(f => (
            <li key={f._id} className="file-row">
              <a href={f.fileUrl} target="_blank" rel="noreferrer">{f.title}</a>
              <span className="muted">{(f.size/1024/1024).toFixed(1)} MB</span>
            </li>
          ))}
        </ul>
      )}
    </div>
    {/* Ratings */}
        <div className="reviews-wrap">
          <div className="rating-summary">
            <div className="rating-left">
              <strong>⭐ {Number(avg).toFixed(1)}</strong>
              <span className="muted">({count})</span>
            </div>
            <div className="rating-right">
              <span className="muted small">Your rating:</span>
              <div className="stars" aria-label="Rate this course">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`star ${n <= myRating ? "on" : ""}`}
                    onClick={() => handleRate(n)}
                    disabled={saving}
                    title={`Rate ${n} star${n > 1 ? "s" : ""}`}
                    aria-pressed={n <= myRating}
                  >
                    ★
                  </button>
                ))}
              </div>
              {/* Small remove button */}
              <button
              type="button"
              className="btn-link danger small"
              onClick={handleDeleteRating}
              disabled={saving || !myRating}
              aria-disabled={saving || !myRating}
              title="Remove my rating">
              Remove</button>
            </div>
          </div>

          <p className="muted small">
             Click a star to submit or update your course rating.
          </p>
        </div>
    </div>
    </>
  );
}
