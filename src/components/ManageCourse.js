// pages/ManageCourse.js
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ManageCourse() {
  const { courseId } = useParams();
  const [files, setFiles] = useState([]);
  const [list, setList] = useState([]);
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  const fetchList = async () => {
    const { data } = await axios.get(`${API}/courses/${courseId}/content`, { headers });
    setList(data);
  };

  useEffect(() => { fetchList(); }, [courseId]);

  const upload = async (e) => {
  e.preventDefault();
  if (!files || files.length === 0) return alert("Pick at least one file");
  if (files.length > 10) return alert("You can upload up to 10 files at a time.");

  try {
    let fd = new FormData(formRef.current);
    let selected = fd.getAll('files');

    // If the browser didn't capture files from the form for any reason, fall back to manual append
    if (!selected || selected.length === 0) {
      fd = new FormData();
      files.forEach((f) => fd.append('files', f, f.name));
      selected = files;
    }

    // Debug: log what we're about to send
    try {
      const debugEntries = [];
      for (const [k, v] of fd.entries()) {
        debugEntries.push([k, v && v.name ? v.name : v]);
      }
      console.log('[ManageCourse] FormData entries:', debugEntries);
    } catch {}

    const res = await fetch(`${API}/courses/${courseId}/content`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data?.message || `Upload failed with status ${res.status}`);
    }

    setFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = null;
    await fetchList();
  } catch (error) {
    console.error('Upload error:', error);
    alert('Upload failed: ' + (error.message));
  }
};

  const remove = async (contentId) => {
    if (!window.confirm('Delete this file?')) return;
    await axios.delete(`${API}/courses/content/${contentId}`, { headers });
    await fetchList();
  };

  return (
    <div className="manage-wrap">
      <h2>Manage Course Files</h2>

      <form ref={formRef} onSubmit={upload} className="upload-box" encType="multipart/form-data">
        <input
          type="file"
          name="files"
          multiple
          ref={fileInputRef}
          onChange={(e) => setFiles(Array.from(e.target.files || []))}
          accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.jpg,.jpeg,.png,.webp,.gif"
        />
        <div style={{ marginTop: 8 }}>
          <span style={{ marginRight: 8 }}>
            {files.length ? `${files.length} selected (max 10)` : 'No files selected'}
          </span>
          <button type="submit" disabled={!files || !files.length || files.length > 10}>Upload</button>
        </div>
      </form>

      <ul className="file-list">
        {list.map(item => (
          <li key={item._id}>
            <a href={item.fileUrl} target="_blank" rel="noreferrer">{item.title}</a>
            <span>{(item.size/1024/1024).toFixed(1)} MB</span>
            <button onClick={() => remove(item._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}