// ProfileOverview.jsx
import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./ProfileOverview.css";


const ProfileOverview = () => {
  const { user } = useContext(AuthContext);

  return (
    <section className="profile-panel" aria-label="Profile overview section">
      <h2 tabIndex={0}>Profile Overview</h2>

      <div className="field-group">
        <label htmlFor="fullname">Full Name</label>
        <input id="fullname" type="text" value={user?.fullname || ""} disabled />
      </div>
      <div className="field-group">
        <label htmlFor="username">Username</label>
        <input id="username" type="text" value={user?.username || ""} disabled />
      </div>
      <div className="field-group">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={user?.email || ""} disabled />
      </div>
    </section>
  );
};

export default ProfileOverview;
