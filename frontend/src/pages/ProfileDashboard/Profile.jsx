import React, { useState } from "react";
import ProfileSidebar from "./ProfileSidebar";
import ProfileOverview from "./ProfileOverview";
import QuizHistory from "../Quiz/QuizHistory"; // Adjust import paths if needed
import Leaderboard from "../Quiz/Leaderboard";
// import AdminPanel from "./AdminPanel"; // You'll create this component
import Achievements from "./Achievements"; // You'll create this component
import "./Profile.css";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const renderTab = () => {
    switch (activeTab) {
      case "overview":
        return <ProfileOverview />;
      case "quizHistory":
        return <QuizHistory />;
      case "leaderboard":
        return <Leaderboard />;
      case "achievements":
        return <Achievements />;
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
