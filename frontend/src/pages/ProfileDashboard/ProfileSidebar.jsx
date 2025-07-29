import React, { useContext, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { showCustomToast } from "../utils/showCustomToast";
import "./ProfileSidebar.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const ProfileSidebar = ({ activeTab, setActiveTab }) => {
  const { user, setUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPreview(null);
  }, [user?.photo]);

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setLoading(true);

    const form = new FormData();
    form.append("photo", file);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${API_BASE_URL}/api/profile/update`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setUser(res.data);
      showCustomToast(
        "✅ PHOTO_UPDATED",
        "Your profile photo was updated successfully!"
      );
    } catch (err) {
      showCustomToast(
        "❌ UPDATE_FAILED",
        "Failed to update profile photo. Please try again."
      );
      setPreview(null);
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const handleLogout = () => {
    if (logout) logout();
    navigate("/");
  };

  return (
    <aside className="profile-sidebar" role="navigation" aria-label="Profile navigation">
      <div
        {...getRootProps()}
        className={`photo-upload ${isDragActive ? "drag-active" : ""} ${loading ? "disabled" : ""}`}
        tabIndex={0}
        title="Click or drag to change profile photo"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            getInputProps().onClick?.(e);
          }
        }}
      >
        <input {...getInputProps()} disabled={loading} />
        <img
          src={preview || (user?.photo ? `${API_BASE_URL}/${user.photo}` : "/default-avatar.png")}
          alt="User avatar"
        />
        {loading && <div className="spinner" aria-live="polite" aria-busy="true" />}
      </div>

      <h3 tabIndex={0}>{user?.fullname || "User Name"}</h3>
      <p className="username">@{user?.username || "username"}</p>

      <nav>
        <button
          type="button"
          aria-current={activeTab === "overview" ? "page" : undefined}
          className={activeTab === "overview" ? "active" : ""}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>

        <button
          type="button"
          className={activeTab === "quizHistory" ? "active" : ""}
          onClick={() => setActiveTab("quizHistory")}
        >
          My Quizzes
        </button>

        <button
          type="button"
          className={activeTab === "leaderboard" ? "active" : ""}
          onClick={() => setActiveTab("leaderboard")}
        >
          Leaderboard
        </button>

        <button
          type="button"
          className={activeTab === "achievements" ? "active" : ""}
          onClick={() => setActiveTab("achievements")}
        >
          Achievements
        </button>

        {user?.role === "admin" && (
          <button
            type="button"
            className={activeTab === "adminPanel" ? "active" : ""}
            onClick={() => setActiveTab("adminPanel")}
          >
            Admin Panel
          </button>
        )}

        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default ProfileSidebar;
