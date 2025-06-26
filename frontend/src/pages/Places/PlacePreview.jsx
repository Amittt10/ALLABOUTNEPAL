// FILE: src/pages/Places/PlacePreview.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../api/axiosConfig";
import { useTranslation } from "react-i18next";
import "./Place.css";

export default function PlacePreview() {
  const { i18n } = useTranslation();
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios.get("/places")
      .then(res => setPlaces(res.data.slice(0, 3))) // Show only 3 places
      .catch(console.error);
  }, []);

  return (
    <div className="place-listing">
      <h2 className="page-title">Places to Go</h2>
      <div className="grid">
        {places.map(place => (
          <Link to={`/places/${place.slug}`} className="place-card" key={place._id}>
            <img src={place.thumbnail} alt={place[`title_${i18n.language}`]} />
            <h2>{place[`title_${i18n.language}`]}</h2>
            <p>{place[`description_${i18n.language}`]?.slice(0, 100)}...</p>
          </Link>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        <Link to="/places" className="see-all-link">See All Places</Link>
      </div>
    </div>
  );
}
