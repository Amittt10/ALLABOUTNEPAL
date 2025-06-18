"use client"

import { useEffect, useRef } from "react"
import "./Home.css"
import Photo from "../../assets/photo.jpg" // Ensure this path is correct

const Home = () => {
  const featuresRef = useRef(null)

  useEffect(() => {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
          }
        })
      },
      { threshold: 0.1 },
    )

    // Observe feature cards
    if (featuresRef.current) {
      const featureCards = featuresRef.current.querySelectorAll(".feature-card")
      featureCards.forEach((card) => {
        card.classList.add("fade-in-up")
        observer.observe(card)
      })
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div className="home">
      <header className="home-header">
        <img src={Photo || "/placeholder.svg"} alt="Cultural Heritage" className="background-img" />
        <div className="overlay">
          <h1 className="title">Welcome to Cultural Heritage Guide</h1>
          <p className="subtitle">Discover Nepal's timeless culture, temples, and traditions</p>
          <a href="#explore" className="cta-button">
            Explore Now
          </a>
        </div>
      </header>

      <section id="explore" className="intro-section">
        <div className="section-container">
          <h2>Explore Our Heritage</h2>
          <p>
            Nepal is home to centuries-old monuments, sacred temples, and vibrant cultural traditions. Dive into a
            journey through time and tradition.
          </p>
        </div>
        <div className="features" ref={featuresRef}>
          <div className="feature-card">🛕 Temples</div>
          <div className="feature-card">🎨 Art & Architecture</div>
          <div className="feature-card">🎭 Culture & Festivals</div>
          <div className="feature-card">📜 Historical Monuments</div>
          <div className="feature-card">🌄 Natural Heritage</div>
        </div>
      </section>
    </div>
  )
}

export default Home
