import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { places } from "../../data/staticPlaces"; // new static data file
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const [category, setCategory] = useState("unesco");

  const categories = [
    { key: "unesco", label_en: "World Heritage (UNESCO)", label_np: "विश्व सम्पदा" },
    { key: "province", label_en: "Provinces", label_np: "प्रदेशहरू" },
    { key: "pilgrims", label_en: "Pilgrimage Sites", label_np: "तीर्थ स्थल" },
  ];

  const filteredPlaces = places.filter((p) => p.category === category);

  return (
    <div className="home-page">

      {/* Big hero section with video */}
      <section className="video-hero-section">
        <video autoPlay loop muted playsInline className="background-video">
          <source src="/videos/intro-loop.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-overlay">
          <h1>{i18n.language === "np" ? "नेपालको जीवित सम्पदा अनुभव गर्नुहोस्" : "Experience the Living Heritage of Nepal"}</h1>
        </div>
      </section>

      {/* Category + cards section */}
      <section className="category-hero-section">
        <aside className="category-sidebar">
          {categories.map((cat) => (
            <button
              key={cat.key}
              className={`category-btn ${category === cat.key ? "active" : ""}`}
              onClick={() => setCategory(cat.key)}
            >
              {i18n.language === "np" ? cat.label_np : cat.label_en}
            </button>
          ))}
        </aside>

        <div className="places-grid">
          {filteredPlaces.map((place) => (
            <div
              className="place-card"
              key={place.id}
              onClick={() => navigate(`/places/${place.id}`)}
            >
              <img
                src={place.images[0]}
                alt={i18n.language === "np" ? place.title_np : place.title_en}
                className="place-thumbnail"
              />
              <h2>{i18n.language === "np" ? place.title_np : place.title_en}</h2>
              <p>
                {(i18n.language === "np"
                  ? place.description_np
                  : place.description_en
                ).slice(0, 100)}
                ...
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
