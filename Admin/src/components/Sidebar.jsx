"use client";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { path: "/admin", label: "Dashboard", icon: "📊" },
    { path: "/admin/heritage", label: "Heritage Sites", icon: "🏛️" },
    { path: "/admin/festivals", label: "Festivals", icon: "🎉" },
    { path: "/admin/places", label: "Places", icon: "📍" },  
    { path: "/admin/quiz", label: "Quiz", icon: "❓" },
    { path: "/admin/quiz-feedback", label: "Quiz Feedback", icon: "💬" }, 
    { path: "/admin/reviews", label: "User Reviews", icon: "📝" },

  ];

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
      <div className="sidebar-header">
        <h2 className="sidebar-title">Admin Panel</h2>
        <button
          className="sidebar-close"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          ✕
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`sidebar-link ${
                  location.pathname.startsWith(item.path)
                    ? "sidebar-link-active"
                    : ""
                }`}
                onClick={onClose}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={handleLogout}>
          <span className="sidebar-icon">🚪</span>
          <span className="sidebar-label">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
