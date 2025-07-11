import React, { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./NepalMap.css";

// Fix default marker icon URLs for Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function NepalMap({ places }) {
  // Memoize icons for performance and safety
  const getIcon = useMemo(() => {
    const cache = new Map();
    return (thumbnailUrl) => {
      if (!thumbnailUrl || typeof thumbnailUrl !== "string") {
        return new L.Icon.Default(); // fallback to default if no image
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
      scrollWheelZoom={false}
      className="nepal-map-container"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {places.map((place) => {
        const { location, _id, title_en, thumbnail } = place;

        if (
          location &&
          typeof location.lat === "number" &&
          typeof location.lng === "number"
        ) {
          const icon = getIcon(thumbnail);

          return (
            <Marker key={_id} position={[location.lat, location.lng]} icon={icon}>
              <Popup>
                <div className="popup-content">
                  <h3>{title_en}</h3>
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt={title_en}
                      className="popup-image"
                    />
                  ) : (
                    <p>No image available</p>
                  )}
                </div>
              </Popup>
              <Tooltip direction="top" offset={[0, -10]} permanent>
                {title_en}
              </Tooltip>
            </Marker>
          );
        }

        return null;
      })}
    </MapContainer>
  );
}
