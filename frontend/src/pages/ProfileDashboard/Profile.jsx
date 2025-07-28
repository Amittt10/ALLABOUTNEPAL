// Profile.jsx
import React, { useState } from "react";
import ProfileSidebar from "./ProfileSidebar";
import ProfileOverview from "./ProfileOverview";
import "./Profile.css";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Only Overview tab for now, no Settings tab
  const renderTab = () => {
    switch (activeTab) {
      case "overview":
      default:
        return <ProfileOverview />;
    }
  };

  return (
    <div className="profile-wrapper">
      <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="profile-content">{renderTab()}</div>
    </div>
  );
};

export default Profile;
