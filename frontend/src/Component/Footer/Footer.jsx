import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      {/* Decorative footer image */}
      <div className="footer-image-wrapper">
        <img
          src="/images/footer.png"
          alt="Footer Graphic"
          className="footer-image"
        />
      </div>

      {/* Footer content */}
      <div className="footer-container">
        <div className="footer-about footer-column">
          <h3>Cultural Heritage Guide</h3>
          <p>
            Preserving Nepal's rich culture and history through accessible
            digital exploration.
          </p>
        </div>

        <div className="footer-links footer-column">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <Link to="/home">Home</Link>
            </li>
            <li>
              <Link to="/cultural-heritage">Heritage</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </div>

        <div className="footer-contact footer-column">
          <h4>Contact</h4>
          <p>Email: info@heritageguide.com</p>
          <p>Phone: +977-01-1234567</p>
          <p>Location: Kathmandu, Nepal</p>
        </div>

        <div className="footer-follow footer-column">
          <button
            className="scroll-to-top-inside"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Scroll to top"
          >
            ↑
          </button>
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} Cultural Heritage Guide. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
