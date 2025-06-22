import React, { useState, useContext, useRef, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import NepaliCalendar from "react-nepali-calendar";
import "./Header.css";
import Logo from "../../assets/logo.png";
import { useTranslation } from "react-i18next";

const Header = () => {
  const { t, i18n } = useTranslation();

  // We’ll remove heritage from this list because it’s a dropdown now
  const nav_links = [
    { path: "/festivals", display: t('nav.festivalsEvents') },
    { path: "/quiz", display: t('nav.quiz') },
    { path: "/about", display: t('nav.aboutUs') },
  ];

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [nepaliDate, setNepaliDate] = useState("2081-01-01");
  const [activeTab, setActiveTab] = useState("english");
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const profileRef = useRef();
  const calendarRef = useRef();
  const langDropdownRef = useRef();

  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileMenuOpen(false);
      if (calendarRef.current && !calendarRef.current.contains(e.target)) setCalendarOpen(false);
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) setLangDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLangDropdownOpen(false);
  };
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="header">
      <div className="nav_wrapper">
        <div className="logo">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <img src={Logo} alt="Logo" />
          </Link>
        </div>

        <nav className={`navigation ${menuOpen ? "active" : ""}`}>
          <ul className="menu">
            {/* Home link first */}
            <li className="nav_item">
              <NavLink
                to="/"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => (isActive ? "active_link" : "")}
              >
                {t('nav.home')}
              </NavLink>
            </li>

            {/* Heritage Sites dropdown */}
            <li className="nav_item dropdown">
              <span className="dropdown-toggle">
                {t('nav.heritageSites')} <i className="ri-arrow-down-s-line"></i>
              </span>
              <ul className="dropdown-menu">
                <li><Link to="/cultural-heritage?location=Kathmandu" onClick={() => setMenuOpen(false)}>Kathmandu</Link></li>
                <li><Link to="/cultural-heritage?location=Lalitpur" onClick={() => setMenuOpen(false)}>Lalitpur</Link></li>
                <li><Link to="/cultural-heritage?location=Bhaktapur" onClick={() => setMenuOpen(false)}>Bhaktapur</Link></li>
              </ul>
            </li>

            {/* Other nav links */}
            {nav_links
              .map((item, i) => (
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

            {/* Search */}
            <form className="search-bar" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder={t('search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" aria-label={t('search.buttonLabel')}>
                <i className="ri-search-line"></i>
              </button>
            </form>

            {/* Calendar */}
            <div className="calendar-dropdown" ref={calendarRef}>
              <button className="calendar-btn" onClick={() => setCalendarOpen(!calendarOpen)}>📆</button>
              {calendarOpen && (
                <div className="calendar-panel">
                  <div className="calendar-tabs">
                    <button className={activeTab === "english" ? "active" : ""} onClick={() => setActiveTab("english")}>English</button>
                    <button className={activeTab === "nepali" ? "active" : ""} onClick={() => setActiveTab("nepali")}>Nepali</button>
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

            {/* Language switcher */}
            <div className="language-switcher" ref={langDropdownRef}>
              <button className="lang-btn" onClick={() => setLangDropdownOpen(!langDropdownOpen)} aria-label="Change Language">🌐</button>
              {langDropdownOpen && (
                <ul className="lang-dropdown">
                  <li><button onClick={() => changeLanguage("en")} className={i18n.language === "en" ? "active" : ""}>English</button></li>
                  <li><button onClick={() => changeLanguage("np")} className={i18n.language === "np" ? "active" : ""}>नेपाली</button></li>
                </ul>
              )}
            </div>

            {/* User profile */}
            <div className="nav_btns">
              {!user?.email ? (
                <>
                  <Link to="/login" className="btn secondary_btn" onClick={() => setMenuOpen(false)}>
                    {t('auth.login')}
                  </Link>
                  <Link to="/register" className="btn primary_btn" onClick={() => setMenuOpen(false)}>
                    {t('auth.register')}
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
                          <Link to="/profile" onClick={() => { setMenuOpen(false); setProfileMenuOpen(false); }}>{t('profile.myProfile')}</Link>
                        </li>
                        <li>
                          <button onClick={handleLogout}>{t('auth.logout')}</button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </ul>
        </nav>

        <div className="mobile_menu" onClick={toggleMenu}>
          <i className="ri-menu-line"></i>
        </div>
      </div>
    </header>
  );
};

export default Header;
