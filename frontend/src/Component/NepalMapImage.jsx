import React, { useState, useEffect, useRef } from "react";
import "./NepalMapImage.css";
import { useNavigate } from "react-router-dom";

const bounds = {
  top: 30.45,
  bottom: 26.35,
  left: 80.05,
  right: 88.2,
};

function latLngToPercent({ lat, lng }) {
  const y = ((bounds.top - lat) / (bounds.top - bounds.bottom)) * 100;
  const x = ((lng - bounds.left) / (bounds.right - bounds.left)) * 100;
  return { xPercent: x, yPercent: y };
}

function roundCoord(coord, precision = 3) {
  return Math.round(coord * Math.pow(10, precision)) / Math.pow(10, precision);
}

export default function NepalMapImage({ places }) {
  const navigate = useNavigate();
  const [openKey, setOpenKey] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleDocumentClick = (event) => {
      // If click outside the map container, close tooltip
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpenKey(null);
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  const grouped = {};
  places.forEach((place) => {
    const { lat, lng } = place.location || {};
    if (typeof lat === "number" && typeof lng === "number") {
      const key = `${roundCoord(lat)},${roundCoord(lng)}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(place);
    }
  });

  return (
    <div className="nepal-map-container" ref={containerRef}>
      <img src="/images/np.png" alt="Nepal Map" className="map-base-img" />

      {Object.entries(grouped).map(([key, group]) => {
        const { location } = group[0];
        const { xPercent, yPercent } = latLngToPercent(location);
        const isOpen = openKey === key;

        return (
          <div
            key={key}
            className="map-marker-group"
            style={{ left: `${xPercent}%`, top: `${yPercent}%` }}
            onClick={(e) => {
              e.stopPropagation(); // prevent event bubbling up to document
              setOpenKey(isOpen ? null : key);
            }}
          >
            <img
              src={group[0].thumbnail || "/default-marker.png"}
              alt="marker"
              className="custom-marker-icon"
              // No need for separate click handler here as div handles it
            />

            {isOpen && (
              <div
                className="marker-tooltip-card"
                onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside tooltip
              >
                {group.map((place) => (
                  <div
                    key={place._id}
                    className="tooltip-card"
                    onClick={() => navigate(`/places/${place._id}`)}
                  >
                    <div className="image-wrapper">
                      <img src={place.thumbnail} alt={place.title_en} />
                      <div className="image-title">{place.title_en}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
