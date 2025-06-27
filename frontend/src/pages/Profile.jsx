import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { AuthContext } from "../context/AuthContext";
import "./Profile.css";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Load profile data if not available
  useEffect(() => {
    if (!user || !user.email) {
      const token = localStorage.getItem("token");
      if (!token) return;

      setLoading(true);
      axios
        .get("http://localhost:3000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUser(res.data);
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to load profile data.");
          setLoading(false);
        });
    }
  }, [user, setUser]);

  // Handle image drop
  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setMessage("");
    setError("");
    setLoading(true);

    const form = new FormData();
    form.append("photo", file);
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post("http://localhost:3000/api/profile/update", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setUser(res.data);
      setMessage("Profile photo updated successfully!");
    } catch {
      setError("Error updating profile photo.");
      setPreview(null);
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  if (!user) {
    return <div className="profile-container">Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>

      {message && <p className="profile-message success">{message}</p>}
      {error && <p className="profile-message error">{error}</p>}

      <div
        className={`profile-photo ${isDragActive ? "drag-active" : ""} ${loading ? "disabled" : ""}`}
        {...getRootProps()}
        title="Drag & drop or click to change photo"
      >
        <input {...getInputProps()} disabled={loading} />
        <img
          src={
            preview ||
            (user.photo ? `http://localhost:3000/${user.photo}` : "/default-avatar.png")
          }
          alt="profile"
          className="profile-img"
        />
      </div>

      <form className="profile-form">
        <label>Full Name</label>
        <input type="text" value={user.fullname || ""} disabled />

        <label>Username</label>
        <input type="text" value={user.username || ""} disabled />

        <label>Email</label>
        <input type="email" value={user.email || ""} disabled />
      </form>
    </div>
  );
};

export default Profile;
