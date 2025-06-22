import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../api/axiosConfig";
import "./CulturalHeritage.css";

const CulturalHeritage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const selectedLocation = params.get("location");

  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSites = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(
          `/heritage${selectedLocation ? `?location=${selectedLocation}` : ""}`
        );
        setSites(res.data);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    fetchSites();
  }, [selectedLocation]);

  if (loading) return <p>Loading heritage sites...</p>;
  if (sites.length === 0) return <p>No heritage sites found for {selectedLocation}.</p>;

  return (
    <div className="heritage-container">
      <h2 className="heritage-title">
        {selectedLocation ? `Heritage Sites in ${selectedLocation}` : "All Heritage Sites"}
      </h2>
      <div className="heritage-grid">
        {sites.map((site) => (
          <div
            key={site._id}
            className="heritage-card"
            onClick={() => navigate(`/heritage/${site._id}`)}
          >
            {site.image && (
              <img
                src={`http://localhost:3000/${site.image}`}
                alt={site.name_en}
              />
            )}
            <h3>{site.name_en}</h3>
            <p>{site.shortDescription_en}</p>
            <button className="read-more-btn">Read more</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CulturalHeritage;
