// src/components/Header.jsx
import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import './Header.css';
import Logo from '../../assets/logo.png';

const nav_links = [
  { path: '/', display: 'Home' },
  { path: '/CulturalHeritageGuide', display: 'CulturalHeritage' },
  { path: '/about', display: 'About' },
  
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const location = useLocation();

  const handleLogoClick = () => {
    if (location.pathname === '/') {
      // If already on home page, just scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // If not, router <Link> will take care of redirecting to "/"
  };

  return (
    <header className="header">
      <div className="nav_wrapper">
        <div className="logo">
          <Link to="/" onClick={handleLogoClick}>
            <img src={Logo} alt="Logo" />
          </Link>
        </div>

        <nav className={`navigation ${menuOpen ? 'active' : ''}`}>
          <ul className="menu">
            {nav_links.map((item, index) => (
              <li className="nav_item" key={index}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => (isActive ? 'active_link' : '')}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.display}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="nav_btns">
            <Link to="/login" className="btn secondary_btn">Login</Link>
            <Link to="/register" className="btn primary_btn">Register</Link>
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
