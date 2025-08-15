import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function CourseView() {
  const { courseId } = useParams();
  const [files, setFiles] = useState([]);
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get(`${API}/courses/${courseId}/content/public`, { headers })
      .then(res => setFiles(res.data))
      .catch(console.error);
  }, [courseId]);

  return (
    <div className="manage-wrap">
      <h2>Course Files</h2>
      {!files.length ? (
        <p>No files yet.</p>
      ) : (
        <ul className="file-list">
          {files.map(f => (
            <li key={f._id} className="file-row">
              <a href={f.fileUrl} target="_blank" rel="noreferrer">{f.title}</a>
              <span className="muted">{(f.size/1024/1024).toFixed(1)} MB</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
