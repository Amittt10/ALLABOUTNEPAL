import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./Profile.css";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user.email) {
      const token = localStorage.getItem("token");
      axios
        .get("http://localhost:3000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => {
          setMessage("Failed to load profile data.");
        });
    }
  }, [user.email, setUser]);

  // Upload photo immediately after selection
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setMessage("");

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
      setUser((prev) => ({
        ...prev,
        photo: res.data.photo || prev.photo,
      }));
      setMessage("Profile photo updated successfully!");
    } catch (err) {
      setMessage("Error updating profile photo.");
      // Reset preview if error
      setPreview(null);
    }
  };

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      {message && <p className="profile-message">{message}</p>}

      <div className="profile-photo">
        <label htmlFor="filepicker" className="profile-photo-label" title="Click to change photo">
          <img
            src={
              preview ||
              (user.photo ? `http://localhost:3000/${user.photo}` : "/default-avatar.png")
            }
            alt="profile"
          />
        </label>

        <input
          type="file"
          id="filepicker"
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: "none" }}
        />
      </div>

      <label>Email:</label>
      <input type="email" value={user.email || ""} disabled />
    </div>
  );
};

export default Profile;
