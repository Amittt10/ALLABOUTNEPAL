import React, { useState, useContext, useRef, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import NepaliCalendar from "react-nepali-calendar";
import * as jss from 'react-jss';
import "./Header.css";
import Logo from "../../assets/logo.png";

const nav_links = [
  { path: "/", display: "Home" },
  { path: "/cultural-heritage", display: "Heritage Sites" },
  { path: "/festivals", display: "Festivals & Events" },
  { path: "/quiz", display: "Quiz" },
  { path: "/about", display: "About Us" },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [nepaliDate, setNepaliDate] = useState("2081-01-01"); // Valid default Nepali date
  const [activeTab, setActiveTab] = useState("english");

  const profileRef = useRef();
  const calendarRef = useRef();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setCalendarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setProfileMenuOpen(false);
    navigate("/");
  };
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMenuOpen(false);
    }
  };

  return (
    <header className="header">
      <div className="nav_wrapper">
        <div className="logo">
          <Link to="/">
            <img src={Logo} alt="Logo" />
          </Link>
        </div>

        <nav className={`navigation ${menuOpen ? "active" : ""}`}>
          <ul className="menu">
            {nav_links.map((item, i) => (
              <li className="nav_item" key={i}>
                <NavLink
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => (isActive ? "active_link" : "")}
                >
                  {item.display}
                </NavLink>
              </li>
            ))}
          </ul>

          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">
              <i className="ri-search-line"></i>
            </button>
          </form>

          {/* CALENDAR DROPDOWN */}
          <div className="calendar-dropdown" ref={calendarRef}>
            <button className="calendar-btn" onClick={() => setCalendarOpen(!calendarOpen)}>
              📆
            </button>

            {calendarOpen && (
              <div className="calendar-panel">
                <div className="calendar-tabs">
                  <button
                    className={activeTab === "english" ? "active" : ""}
                    onClick={() => setActiveTab("english")}
                  >
                    English
                  </button>
                  <button
                    className={activeTab === "nepali" ? "active" : ""}
                    onClick={() => setActiveTab("nepali")}
                  >
                    Nepali
                  </button>
                </div>

                <div className="calendar-content">
                  {activeTab === "english" ? (
                    <DatePicker inline selected={selectedDate} onChange={setSelectedDate} />
                  ) : (
                    <NepaliCalendar value={nepaliDate} onChange={setNepaliDate} />
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="nav_btns">
            {!user.email ? (
              <>
                <Link to="/login" className="btn secondary_btn" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="btn primary_btn" onClick={() => setMenuOpen(false)}>
                  Register
                </Link>
              </>
            ) : (
              <div className="profile-menu" ref={profileRef}>
                <img
                  src={user.photo ? `http://localhost:3000/${user.photo}` : "/default-avatar.png"}
                  alt="Profile"
                  className="avatar"
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                />
                {profileMenuOpen && (
                  <div className="dropdown">
                    <ul>
                      <li>
                        <Link to="/profile" onClick={() => { setMenuOpen(false); setProfileMenuOpen(false); }}>
                          My Profile
                        </Link>
                      </li>
                      <li>
                        <button onClick={handleLogout}>Logout</button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>

        <div className="mobile_menu" onClick={toggleMenu}>
          <i className="ri-menu-line"></i>
        </div>
      </div>
    </header>
  );
};

export default Header;
