// src/pages/Home.jsx
import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <header className="home-header">
        <div className="overlay">
          <h1 className="title">Welcome to Cultural Heritage Guide</h1>
          <p className="subtitle">
            Discover Nepal’s timeless culture, temples, and traditions.
          </p>
          <a href="#explore" className="cta-button">Explore Now</a>
        </div>
      </header>

      {/* Intro Section */}
      <section id="explore" className="intro-section">
        <div className="intro-container">
          <h2>Explore Our Rich Heritage</h2>
          <p>
            Nepal is home to centuries-old monuments, sacred temples, and vibrant cultural traditions. Dive into a journey through time and tradition.
          </p>

          <div className="features-grid">
            <div className="feature-card">🛕 Temples</div>
            <div className="feature-card">🎨 Art & Architecture</div>
            <div className="feature-card">🎭 Culture & Festivals</div>
            <div className="feature-card">📜 Historical Monuments</div>
            <div className="feature-card">🌄 Natural Heritage</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
