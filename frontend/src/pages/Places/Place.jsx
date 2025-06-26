// FILE: src/pages/Places/Place.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { axiosInstance } from '../../api/axiosConfig';
import { useTranslation } from "react-i18next";
import "./Place.css";

export default function Place() {
  const { i18n } = useTranslation();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const categories = ["All", "RN Provinces", "World Heritage", "Pilgrimage"];

  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const initialCategory = queryParams.get("category");
    if (initialCategory && categories.includes(capitalizeCategory(initialCategory))) {
      setFilter(capitalizeCategory(initialCategory));
    }
  }, [location.search]);

  function capitalizeCategory(slug) {
    switch (slug.toLowerCase()) {
      case "rn": return "RN Provinces";
      case "heritage": return "World Heritage";
      case "pilgrimage": return "Pilgrimage";
      default: return "All";
    }
  }

  useEffect(() => {
    axiosInstance.get("/places")
      .then(res => setPlaces(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredPlaces = filter === "All"
    ? places
    : places.filter(p => p.category === filter);

  return (
    <div className="place-listing">
      <h1 className="page-title">Places to Go</h1>
      <div className="filters">
        {categories.map(cat => (
          <button
            key={cat}
            className={filter === cat ? "active" : ""}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="grid">
          {filteredPlaces.map(place => (
            <Link to={`/places/${place.slug}`} className="place-card" key={place._id}>
              <img src={place.thumbnail} alt={place[`title_${i18n.language}`]} />
              <h2>{place[`title_${i18n.language}`]}</h2>
              <p>{place[`description_${i18n.language}`]?.slice(0, 100)}...</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}