import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SubscribeForm from "../../Component/SubscribeForm/SubscribeForm";
import axios from "axios";
import "./Home.css";
import FeaturedCarousel from "../../Component/FeaturedCarousel/FeaturedCarousel";
import NepalMap from "../../Component/NepalMap/NepalMap";


const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Home() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [category, setCategory] = useState("unesco");
  const [places, setPlaces] = useState([]);
  const [festivals, setFestivals] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await axios.get(`${API}/api/places`);
        setPlaces(res.data);
      } catch (err) {
        setMessage("Failed to load places.");
      }
    };
    const fetchFestivals = async () => {
      try {
        const res = await axios.get(`${API}/api/festivals`);
        setFestivals(res.data);
      } catch (err) {
        console.error("Failed to load festivals.");
      }
    };
    fetchPlaces();
    fetchFestivals();
  }, []);

  const filteredPlaces = places.filter((p) => p.category === category).slice(0, 9);

  const featuredHeritage = places
  .filter(p => p.category === "unesco")
  .slice(0, 5)
  .map(place => ({
    ...place,
    shortDescription: place.description_en?.slice(0, 100) + "..."
  }));

  const today = new Date();
  const futureFestivals = festivals
    .filter((f) => f.dateAD && new Date(f.dateAD) >= today)
    .sort((a, b) => new Date(a.dateAD) - new Date(b.dateAD));

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(i18n.language === "np" ? "ne-NP" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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

{/* Upcoming Festivals Section */}
<div className="fullwidth-bg-wrapper">
  <section className="upcoming-festivals-section">
    <h2>
      {i18n.language === "np" ? "आगामी चाडपर्वहरू" : "Upcoming Festivals"}
    </h2>

    <div className="festival-card-list">
      {futureFestivals.slice(0, 3).map((festival) => (
        <div
          key={festival._id}
          className="festival-card"
          onClick={() => navigate(`/festival-detail/${festival._id}`)}
        >
          <div className="festival-image-wrapper">
            <img
              src={`${API}/uploads/${festival.image}`}
              alt={i18n.language === "np" ? festival.name_np : festival.name_en}
            />
          </div>
          <div className="festival-info">
            <p className="festival-date">{formatDate(festival.dateAD)}</p>
            <h3>
              {i18n.language === "np"
                ? festival.name_np
                : festival.name_en}
            </h3>
          </div>
        </div>
      ))}
    </div>

    <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
      <button
        className="view-all-btn"
        onClick={() => navigate("/festivals-highlight")}
      >
        {i18n.language === "np" ? "सबै हेर्नुहोस्" : "View All Festivals"}
      </button>
    </div>
  </section>
</div>



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
              {[
                { key: "unesco", label_en: "World Heritage (UNESCO)", label_np: "विश्व सम्पदा" },
                { key: "province", label_en: "Provinces", label_np: "प्रदेशहरू" }
              ].map((c) => (
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
                key={place._id}
                onClick={() => navigate(`/places/${place._id}`)}
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
        <div className="explore-right">
           <NepalMap places={filteredPlaces} />
        </div>
      </section>

       {/* <FeaturedCarousel items={featuredHeritage} /> */}

      <SubscribeForm />
    </div>
  );
}
