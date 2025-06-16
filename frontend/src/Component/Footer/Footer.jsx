// src/components/Footer.jsx
import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-about">
          <h3>Cultural Heritage Guide</h3>
          <p>Preserving Nepal's rich culture and history through accessible digital exploration.</p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/CulturalHeritageGuide">Heritage</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>Contact</h4>
          <p>Email: info@heritageguide.com</p>
          <p>Phone: +977-01-1234567</p>
          <p>Location: Kathmandu, Nepal</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Cultural Heritage Guide. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
