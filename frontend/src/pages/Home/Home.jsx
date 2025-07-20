import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";

import SubscribeForm from "../../Component/SubscribeForm/SubscribeForm";
import NepalMapImage from "../../Component/NepalMapImage";
import FAQSection from "../../Component/FAQSection/FAQSection";

import BlogCard from "../../Component/Cards/BlogCard";
import FestivalCard from "../../Component/Cards/FestivalCard";
import PlaceCard from "../../Component/Cards/PlaceCard";

import "./Home.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Home() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const [category, setCategory] = useState("unesco");
  const [places, setPlaces] = useState([]);
  const [festivals, setFestivals] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get(`${API}/api/blogs/latest?limit=3`)
      .then((res) => setBlogs(res.data))
      .catch((err) => console.error("Failed to load blogs:", err));
  }, []);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await axios.get(`${API}/api/places`);
        setPlaces(res.data);
      } catch (err) {
        setMessage("Failed to load places.");
        console.error(err);
      }
    };

    const fetchFestivals = async () => {
      try {
        const res = await axios.get(`${API}/api/festivals`);
        setFestivals(res.data);
      } catch (err) {
        console.error("Failed to load festivals.", err);
      }
    };

    fetchPlaces();
    fetchFestivals();
  }, []);

  const getFullImageUrl = (path, type = "general") => {
    if (!path) return "";
    if (path.startsWith("http")) return path;

    const baseUrl = API.replace(/\/$/, "");

    if (type === "blog") {
      return `${baseUrl}${path}`;
    }

    if (type === "festival") {
      return `${baseUrl}/uploads/${path}`;
    }

    if (path.startsWith("/uploads/")) {
      return `${baseUrl}${path}`;
    } else {
      return `${baseUrl}/uploads/${path}`;
    }
  };

  const filteredPlaces = places
    .filter((p) => p.category === category)
    .slice(0, 9);

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
      {/* Hero Section */}
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

      {/* Latest Blogs */}
      <section className="latest-blogs">
        <h2>
          {i18n.language === "np" ? "ब्लग र कथा" : "Latest Blogs & Stories"}
        </h2>
        <div className="blog-list">
          {blogs.map((blog) => (
            <BlogCard
              key={blog._id}
              blog={blog}
              getFullImageUrl={getFullImageUrl}
              i18n={i18n}
              onClick={() => navigate(`/blog/${blog.slug}`)}
            />
          ))}
        </div>
      </section>

      {/* Upcoming Festivals */}
      <div className="fullwidth-bg-wrapper">
        <section className="upcoming-festivals-section">
          <h2>
            {i18n.language === "np" ? "आगामी चाडपर्वहरू" : "Upcoming Festivals"}
          </h2>
          <div className="festival-card-list">
            {futureFestivals.slice(0, 3).map((festival) => (
              <FestivalCard
                key={festival._id}
                festival={festival}
                getFullImageUrl={getFullImageUrl}
                i18n={i18n}
                onClick={() => navigate(`/festival-detail/${festival.slug}`)}
                formatDate={formatDate}
              />
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <button
              className="view-all-btn"
              onClick={() => navigate("/festival-calendar")}
            >
              {i18n.language === "np" ? "सबै हेर्नुहोस्" : "View All Festivals"}
            </button>
          </div>
        </section>
      </div>

      {/* Explore Section */}
      <section
        className="explore-hero-section"
        style={{ backgroundImage: "url('/images/mainhero.jpg')" }}
      >
        <div className="explore-hero-overlay" />
        <div className="explore-left">
          <h2 className="explore-title">
            {i18n.language === "np"
              ? "अन्वेषण गर्न ठाउँहरू"
              : "Places to Explore"}
          </h2>

          <aside className="explore-sidebar">
            <div className="category-row">
              {[
                {
                  key: "unesco",
                  label_en: "World Heritage (UNESCO)",
                  label_np: "विश्व सम्पदा",
                },
                {
                  key: "province",
                  label_en: "Provinces",
                  label_np: "प्रदेशहरू",
                },
              ].map((c) => (
                <button
                  key={c.key}
                  className={`category-btn ${
                    category === c.key ? "active" : ""
                  }`}
                  onClick={() => setCategory(c.key)}
                >
                  {i18n.language === "np" ? c.label_np : c.label_en}
                </button>
              ))}
            </div>
            <div className="category-row centered">
              <button
                className={`category-btn ${
                  category === "pilgrims" ? "active" : ""
                }`}
                onClick={() => setCategory("pilgrims")}
              >
                {i18n.language === "np" ? "तीर्थ स्थल" : "Pilgrimage Sites"}
              </button>
            </div>
          </aside>

          <div className="explore-places-grid">
            {filteredPlaces.map((place) => (
              <PlaceCard
                key={place._id}
                place={place}
                getFullImageUrl={getFullImageUrl}
                i18n={i18n}
                onClick={() => navigate(`/places/${place.slug}`)}
              />
            ))}
          </div>
        </div>

        <div className="explore-right">
          <NepalMapImage places={filteredPlaces} />
        </div>
      </section>

      {/* FAQ and Subscribe */}
      <FAQSection />
      <SubscribeForm />
    </div>
  );
}
