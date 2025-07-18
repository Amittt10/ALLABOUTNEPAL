import React, { useState, useContext, useRef, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Header.css";
import Logo from "../../assets/logo.png";
import { useTranslation } from "react-i18next";
import festivalsData from "../../data/festivalsData";
import FestivalBell from "../../Component/FestivalBell";

const Header = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [heritageDropdownOpen, setHeritageDropdownOpen] = useState(false);
  const [festivalsDropdownOpen, setFestivalsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const profileRef = useRef();
  const langDropdownRef = useRef();
  const heritageRef = useRef();
  const festivalsRef = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileMenuOpen(false);
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(e.target)
      )
        setLangDropdownOpen(false);
      if (heritageRef.current && !heritageRef.current.contains(e.target))
        setHeritageDropdownOpen(false);
      if (festivalsRef.current && !festivalsRef.current.contains(e.target))
        setFestivalsDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setProfileMenuOpen(false);
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
            <li className="nav_item">
              <NavLink
                to="/"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => (isActive ? "active_link" : "")}
              >
                {t("nav.home")}
              </NavLink>
            </li>


            {/* Heritage Sites dropdown */}
            <li
              className="nav_item dropdown"
              ref={heritageRef}
              onMouseEnter={() => setHeritageDropdownOpen(true)}
              onMouseLeave={() => setHeritageDropdownOpen(false)}
            >
              <span
                className="dropdown-toggle"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent click bubbling
                  setHeritageDropdownOpen((prev) => !prev);
                }}
                aria-haspopup="true"
                aria-expanded={heritageDropdownOpen}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter")
                    setHeritageDropdownOpen((prev) => !prev);
                }}
              >
                {t("nav.heritageSites")}{" "}
                <i className="ri-arrow-down-s-line"></i>
              </span>

              {heritageDropdownOpen && (
                <ul className="dropdown-menu centered-dropdown">
                  <li>
                    <Link
                      to="/cultural-heritage?location=Kathmandu"
                      onClick={() => {
                        setMenuOpen(false);
                        setHeritageDropdownOpen(false);
                      }}
                    >
                      Kathmandu
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/cultural-heritage?location=Lalitpur"
                      onClick={() => {
                        setMenuOpen(false);
                        setHeritageDropdownOpen(false);
                      }}
                    >
                      Lalitpur
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/cultural-heritage?location=Bhaktapur"
                      onClick={() => {
                        setMenuOpen(false);
                        setHeritageDropdownOpen(false);
                      }}
                    >
                      Bhaktapur
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            

            {/* Festivals & Events — Mega Dropdown */}
            <li
              className="nav_item dropdown mega-dropdown"
              ref={festivalsRef}
              onMouseEnter={() => setFestivalsDropdownOpen(true)}
              onMouseLeave={() => setFestivalsDropdownOpen(false)}
            >
              <span
                className="dropdown-toggle"
                onClick={(e) => {
                  e.stopPropagation();
                  setFestivalsDropdownOpen((prev) => !prev);
                }}
                aria-haspopup="true"
                aria-expanded={festivalsDropdownOpen}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter")
                    setFestivalsDropdownOpen((prev) => !prev);
                }}
              >
                {t("nav.festivalsEvents")}{" "}
                <i className="ri-arrow-down-s-line"></i>
              </span>

              {festivalsDropdownOpen && (
                <div className="mega-menu centered-dropdown">
                  <div className="mega-menu-left">
                    <ul>
                      {Object.values(festivalsData).map((festival) => (
                        <li
                          key={festival.slug}
                          className="festival-dropdown-item"
                        >
                          <Link
                            to={`/festivals/${festival.slug}`}
                            onClick={() => {
                              setMenuOpen(false);
                              setFestivalsDropdownOpen(false);
                            }}
                            className="festival-dropdown-link"
                          >
                            <img
                              src={festival.image}
                              alt={festival.name_en}
                              className="festival-thumb"
                            />
                            <span>{festival.name_en}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mega-menu-right">
                    <img
                      src="/images/event-thumbnail.jpg"
                      alt="Upcoming Event"
                      className="mega-menu-thumbnail"
                    />
                    <div className="mega-menu-buttons">
                      <button
                        onClick={() => {
                          setFestivalsDropdownOpen(false);
                          navigate("/festival-calendar");
                        }}
                      >
                        Event Calendar
                      </button>
                      <button
                        onClick={() => {
                          setFestivalsDropdownOpen(false);
                          navigate("/festivals-highlight");
                        }}
                      >
                        Festivals Highlight
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </li>

            <li className="nav_item">
              <NavLink
                to="/quiz"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => (isActive ? "active_link" : "")}
              >
                {t("nav.quiz")}
              </NavLink>
            </li>
            <li className="nav_item">
              <NavLink
                to="/about"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => (isActive ? "active_link" : "")}
              >
                {t("nav.aboutUs")}
              </NavLink>
            </li>

            {/* Search */}
            <form className="search-bar" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder={t("search.placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" aria-label={t("search.buttonLabel")}>
                <i className="ri-search-line"></i>
              </button>
            </form>

            {/* Language switcher */}
            <div className="language-switcher" ref={langDropdownRef}>
              <button
                className="lang-btn"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                aria-haspopup="true"
                aria-expanded={langDropdownOpen}
                aria-label="Language switcher"
              >
                🌐
              </button>
              {langDropdownOpen && (
                <ul className="lang-dropdown centered-dropdown">
                  <li>
                    <button
                      onClick={() => changeLanguage("en")}
                      className={i18n.language === "en" ? "active" : ""}
                    >
                      English
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => changeLanguage("np")}
                      className={i18n.language === "np" ? "active" : ""}
                    >
                      नेपाली
                    </button>
                  </li>
                </ul>
              )}
            </div>

            {/* Notification bell */}
            <div className="festival-bell-wrapper">
              <FestivalBell />
            </div>

            {/* User profile */}
            <div className="nav_btns" ref={profileRef}>
              {!user?.email ? (
                <>
                  <Link to="/login" className="btn secondary_btn">
                    {t("auth.login")}
                  </Link>
                  <Link to="/register" className="btn primary_btn">
                    {t("auth.register")}
                  </Link>
                </>
              ) : (
                <div className="profile-menu">
                  <div className="avatar-wrapper">
                    <img
                      src={
                        user.photo
                          ? `http://localhost:3000/${user.photo}`
                          : "/default-avatar.png"
                      }
                      alt="Profile"
                      className="avatar"
                      onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                      aria-haspopup="true"
                      aria-expanded={profileMenuOpen}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter")
                          setProfileMenuOpen(!profileMenuOpen);
                      }}
                    />
                    {user?.username && (
                      <span className="header-greeting">
                        Hi, {user.username}!
                      </span>
                    )}
                  </div>
                  {profileMenuOpen && (
                    <div className="dropdown">
                      <ul>
                        <li>
                          <Link
                            to="/profile"
                            onClick={() => {
                              setMenuOpen(false);
                              setProfileMenuOpen(false);
                            }}
                          >
                            {t("profile.myProfile")}
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/quiz/history"
                            onClick={() => {
                              setMenuOpen(false);
                              setProfileMenuOpen(false);
                            }}
                          >
                            Quiz History
                          </Link>
                        </li>
                        <li>
                          <button onClick={handleLogout}>
                            {t("auth.logout")}
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </ul>
        </nav>

        <div
          className="mobile_menu"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") toggleMenu();
          }}
        >
          <i className="ri-menu-line"></i>
        </div>
      </div>
    </header>
  );
};

export default Header;
