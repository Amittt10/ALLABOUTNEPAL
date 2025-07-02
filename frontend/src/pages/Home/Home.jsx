import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { places } from "../../data/staticPlaces";
import SubscribeForm from "../../Component/SubscribeForm/SubscribeForm";
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

  const filteredPlaces = places
    .filter((p) => p.category === category)
    .slice(0, 9);

  return (
    <div className="home-page">
      <section className="video-hero-section">
        <video autoPlay loop muted playsInline className="background-video">
          <source src="/videos/intro-loop.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-overlay">
          <h1>
            {i18n.language === "np"
              ? "नेपालको जीवित सम्पदा अनुभव गर्नुहोस्"
              : "Experience the Living Heritage of Nepal"}
          </h1>
        </div>
      </section>

      <section
        className="explore-hero-section"
        style={{ backgroundImage: "url('/images/mainhero.jpg')" }}
      >
        <div className="explore-hero-overlay"></div>
        <div className="explore-left">
          <h2 className="explore-title">
            {i18n.language === "np" ? "अन्वेषण गर्न ठाउँहरू" : "Places to explore"}
          </h2>
          <aside className="explore-sidebar">
            <div className="category-row">
              {categories.slice(0, 2).map((c) => (
                <button
                  key={c.key}
                  className={`category-btn ${category === c.key ? "active" : ""}`}
                  onClick={() => setCategory(c.key)}
                >
                  {i18n.language === "np" ? c.label_np : c.label_en}
                </button>
              ))}
            </div>
            <div className="category-row centered">
              <button
                className={`category-btn ${category === "pilgrims" ? "active" : ""}`}
                onClick={() => setCategory("pilgrims")}
              >
                {i18n.language === "np" ? "तीर्थ स्थल" : "Pilgrimage Sites"}
              </button>
            </div>
          </aside>
          <div className="explore-places-grid">
            {filteredPlaces.map((place) => (
              <div
                className="place-card"
                key={place.id}
                onClick={() => navigate(`/places/${place.id}`)}
              >
                <img
                  src={place.thumbnail}
                  alt={i18n.language === "np" ? place.title_np : place.title_en}
                  className="place-thumbnail"
                  loading="lazy"
                />
                <h2>{i18n.language === "np" ? place.title_np : place.title_en}</h2>
              </div>
            ))}
          </div>
        </div>
        <div className="explore-right"></div>
      </section>

      {/* Subscribe form component */}
      <SubscribeForm />
    </div>
  );
}
