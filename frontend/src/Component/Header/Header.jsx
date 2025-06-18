import React, { useState, useContext, useRef, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
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
  const { user, logout } = useContext(AuthContext);
  const profileRef = useRef();
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleProfileMenu = () => setProfileMenuOpen((p) => !p);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setProfileMenuOpen(false);
    navigate("/");
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

          <div className="nav_btns">
            {!user.email ? (
              <>
                <Link
                  to="/login"
                  className="btn secondary_btn"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn primary_btn"
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="profile-menu" ref={profileRef}>
                <img
                  src={
                    user.photo
                      ? `http://localhost:3000/${user.photo}`
                      : "/default-avatar.png"
                  }
                  alt="Profile"
                  className="avatar"
                  onClick={toggleProfileMenu}
                />
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
