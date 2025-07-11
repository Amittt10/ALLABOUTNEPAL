import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon URLs for leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function NepalMap({ places }) {
  // Helper function to create a custom icon with thumbnail
  const createCustomIcon = (thumbnailUrl) => {
    return new L.Icon({
      iconUrl: thumbnailUrl,
      iconSize: [40, 40], // size of the thumbnail icon
      iconAnchor: [20, 40], // point of the icon which will correspond to marker's location
      popupAnchor: [0, -40], // point from which the popup should open relative to the iconAnchor
      className: "custom-marker-icon",
    });
  };

  return (
    <MapContainer
      center={[28.3949, 84.124]}
      zoom={7}
      scrollWheelZoom={false}
      style={{ height: "500px", width: "100%" }}
      className="nepal-map-container"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {places.map((place) => {
        if (
          place.location &&
          typeof place.location.lat === "number" &&
          typeof place.location.lng === "number"
        ) {
          // Use place.thumbnail as icon if available, else default icon
          const icon = place.thumbnail
            ? createCustomIcon(place.thumbnail)
            : undefined;

          return (
            <Marker
              key={place._id}
              position={[place.location.lat, place.location.lng]}
              icon={icon}
            >
              <Popup>
                <div style={{ textAlign: "center" }}>
                  <h3>{place.title_en}</h3>
                  {place.thumbnail ? (
                    <img
                      src={place.thumbnail}
                      alt={place.title_en}
                      style={{
                        width: "200px",
                        height: "auto",
                        borderRadius: "8px",
                        marginTop: "5px",
                      }}
                    />
                  ) : (
                    <p>No image available</p>
                  )}
                </div>
              </Popup>
              <Tooltip direction="top" offset={[0, -10]} permanent>
                {place.title_en}
              </Tooltip>
            </Marker>
          );
        }
        return null;
      })}
    </MapContainer>
  );
}
