import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { showCustomToast } from "../utils/showCustomToast";
import "./ProfileOverview.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const ProfileOverview = () => {
  const { user, setUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullname: user.fullname || "",
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE_URL}/api/profile/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setUser(res.data);
      showCustomToast(
        "✅ PROFILE_SAVED",
        "Your profile details have been saved!"
      );
      setEditing(false);
    } catch (err) {
      showCustomToast(
        "❌ SAVE_FAILED",
        "Failed to save profile details. Please try again."
      );
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <section className="profile-panel" aria-label="Profile overview section">
      <h2 tabIndex={0}>Profile Overview</h2>

      <div className="form-row">
        <div className="field-group">
          <label htmlFor="fullname">Full Name</label>
          <input
            id="fullname"
            name="fullname"
            type="text"
            value={formData.fullname}
            onChange={handleChange}
            disabled={!editing}
            autoComplete="name"
          />
        </div>

        <div className="field-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            disabled={!editing}
            autoComplete="username"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="field-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            disabled
            autoComplete="email"
          />
        </div>

        <div className="field-group">
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            disabled={!editing}
            autoComplete="tel"
            placeholder="Phone (optional)"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="field-group" style={{ flex: "1 1 100%" }}>
          <label htmlFor="address">Address</label>
          <input
            id="address"
            name="address"
            type="text"
            value={formData.address}
            onChange={handleChange}
            disabled={!editing}
            autoComplete="street-address"
            placeholder="Address (optional)"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="field-group" style={{ flex: "1 1 100%" }}>
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            rows="3"
            value={formData.bio}
            onChange={handleChange}
            disabled={!editing}
            placeholder="Write something about yourself (optional)"
            style={{ resize: "vertical" }}
          />
        </div>
      </div>

      {!editing ? (
        <button onClick={() => setEditing(true)} className="edit-btn">
          Edit Profile
        </button>
      ) : (
        <>
          <button
            onClick={handleSave}
            disabled={loading}
            className="save-btn"
            aria-busy={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={() => {
              setEditing(false);
              setFormData({
                fullname: user.fullname || "",
                username: user.username || "",
                email: user.email || "",
                phone: user.phone || "",
                address: user.address || "",
                bio: user.bio || "",
              });
            }}
            disabled={loading}
            className="cancel-btn"
          >
            Cancel
          </button>
        </>
      )}
    </section>
  );
};

export default ProfileOverview;
