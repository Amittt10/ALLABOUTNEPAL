import React, { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./NepalMap.css";

// Fix default Leaflet icon path issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function NepalMap({ places }) {
  // Cache icons by thumbnail URL
  const getIcon = useMemo(() => {
    const cache = new Map();
    return (thumbnailUrl) => {
      if (!thumbnailUrl || typeof thumbnailUrl !== "string") {
        return new L.Icon.Default(); // fallback to default icon
      }

      if (cache.has(thumbnailUrl)) return cache.get(thumbnailUrl);

      const icon = new L.Icon({
        iconUrl: thumbnailUrl,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
        className: "custom-marker-icon",
      });

      cache.set(thumbnailUrl, icon);
      return icon;
    };
  }, []);

  return (
    <MapContainer
        center={[28.3949, 84.124]}
        zoom={7}
        minZoom={7}
        maxZoom={7}
        scrollWheelZoom={false}
        zoomControl={false}
        doubleClickZoom={false}
        className="nepal-map-container"
    >

      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {places.map((place) => {
        const { _id, location, title_en, thumbnail } = place;

        if (
          location &&
          typeof location.lat === "number" &&
          typeof location.lng === "number"
        ) {
          const icon = getIcon(thumbnail);

          return (
            <Marker
              key={_id}
              position={[location.lat, location.lng]}
              icon={icon}
            >
              <Tooltip direction="top" offset={[0, -10]} interactive>
            <div className="tooltip-card">
              <div className="image-wrapper">
                <img
                  src={thumbnail}
                  alt={title_en}
                />
                <div className="image-title">{title_en}</div>
               </div>
              </div>
            </Tooltip>

            </Marker>
          );
        }

        return null;
      })}
    </MapContainer>
  );
}
