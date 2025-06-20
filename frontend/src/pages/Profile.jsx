import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { AuthContext } from "../context/AuthContext";
import "./Profile.css";

const AdvancedProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    address: "",
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Load user profile on mount or when user changes
  useEffect(() => {
    if (!user.email) {
      const token = localStorage.getItem("token");
      setLoading(true);
      axios
        .get("http://localhost:3000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUser(res.data);
          setFormData({
            name: res.data.name || "",
            email: res.data.email || "",
            phone: res.data.phone || "",
            bio: res.data.bio || "",
            address: res.data.address || "",
          });
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to load profile data.");
          setLoading(false);
        });
    } else {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
        address: user.address || "",
      });
    }
  }, [user, setUser]);

  // Drag & drop image upload
  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setMessage("");
    setError("");

    const form = new FormData();
    form.append("photo", file);
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post("http://localhost:3000/api/profile/update-photo", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setUser((prev) => ({
        ...prev,
        photo: res.data.photo || prev.photo,
      }));
      setMessage("Profile photo updated successfully!");
    } catch (err) {
      setError("Error updating profile photo.");
      setPreview(null);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  // Handle form field changes
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setMessage("");
    setError("");
  };

  // Submit updated profile details (excluding photo)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:3000/api/profile/update",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(res.data);
      setMessage("Profile updated successfully!");
    } catch (err) {
      setError("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container advanced-profile">
      <h2>User Profile</h2>

      {message && <p className="profile-message success">{message}</p>}
      {error && <p className="profile-message error">{error}</p>}

      <div
        className={`profile-photo ${isDragActive ? "drag-active" : ""}`}
        {...getRootProps()}
        title="Drag & drop or click to change photo"
      >
        <input {...getInputProps()} />
        <img
          src={
            preview ||
            (user.photo ? `http://localhost:3000/${user.photo}` : "/default-avatar.png")
          }
          alt="profile"
          className="profile-img"
        />
        <p className="upload-hint">{isDragActive ? "Drop the image..." : "Click or drag to upload"}</p>
      </div>

      <form className="profile-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Full Name</label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={loading}
          placeholder="Your full name"
        />

        <label htmlFor="email">Email (cannot change)</label>
        <input type="email" id="email" value={formData.email} disabled />

        <label htmlFor="phone">Phone Number</label>
        <input
          type="tel"
          name="phone"
          id="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Your phone number"
          disabled={loading}
        />

        <label htmlFor="bio">Bio</label>
        <textarea
          name="bio"
          id="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Tell us about yourself"
          disabled={loading}
          rows={4}
        />

        <label htmlFor="address">Address</label>
        <textarea
          name="address"
          id="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Your address"
          disabled={loading}
          rows={3}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default AdvancedProfile;
