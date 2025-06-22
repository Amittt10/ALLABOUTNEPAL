import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home">

      {/* Hero Section */}
      <header className="home-header">
        <div className="overlay">
          <h1 className="title">Experience the Living Heritage of Nepal</h1>
          <p className="subtitle">
            Discover centuries-old culture, festivals, and sacred places.
          </p>
          <a href="#explore" className="cta-button">Explore Now</a>
        </div>
      </header>

      {/* Intro Section */}
      <section id="explore" className="intro-section">
        <div className="intro-container">
          <h2>Explore Our Rich Heritage</h2>
          <p>Nepal is home to centuries-old monuments, sacred temples, and vibrant cultural traditions. Begin your journey into our unique living heritage.</p>
          <div className="features-grid">
            <div className="feature-card">🛕 Temples</div>
            <div className="feature-card">🎨 Art & Architecture</div>
            <div className="feature-card">🎭 Culture & Festivals</div>
            <div className="feature-card">📜 Historical Sites</div>
            <div className="feature-card">🌄 Natural Heritage</div>
          </div>
        </div>
      </section>

      {/* Play & Learn Section */}
      <section className="play-learn-section">
        <h2>Play &amp; Learn</h2>
        <p>Test your knowledge and have fun exploring Nepal’s culture through quizzes and games.</p>
        <Link to="/quiz" className="play-learn-btn">Start Quizzified</Link>
      </section>

      {/* Community Stories Section */}
      <section className="stories-section">
        <h2>Community Stories</h2>
        <p>Hear from fellow explorers and locals who treasure Nepal’s vibrant traditions.</p>
        <div className="stories-grid">
          <div className="story-card">
            <p>“An unforgettable trip to Bhaktapur — the heritage here feels alive.”</p>
            <span>- Maya S.</span>
          </div>
          <div className="story-card">
            <p>“The festivals in Kathmandu were a colorful and enriching experience!”</p>
            <span>- Rajesh T.</span>
          </div>
          <div className="story-card">
            <p>“Learning about Nepali history through this platform has been wonderful.”</p>
            <span>- Emily R.</span>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
