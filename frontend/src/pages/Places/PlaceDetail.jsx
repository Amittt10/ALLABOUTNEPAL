import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import "./PlaceDetail.css";
import ReviewSection from "../../Component/ReviewSection/ReviewSection";
import TTSControl from "../../Component/TTSControl/TTSControl";
import RecommendedList from '../../Component/RecommendedList/RecommendedList';

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function PlaceDetail() {
  const { placeId } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullscreenImg, setFullscreenImg] = useState(null);

  const lang = i18n.language || "en";
  const langCode = lang === "np" ? "ne-NP" : "en-US";

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  });

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${API}/api/places/${placeId}`);
        setPlace(res.data);
      } catch (err) {
        setError("Failed to load place details.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlace();
  }, [placeId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) return <p className="loading">Loading place details...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!place) return <p className="error">Place not found</p>;

  const title = place?.[`title_${lang}`] || place?.title_en || place?.title || "No Title";
  const descriptionRaw = place?.[`description_${lang}`] || place?.description_en || "No description.";
  const videoUrl = place?.video_url || "";
  const gallery = place?.images || [];

  const rawLines = descriptionRaw
  .replace(/^[\u2022\u2013\u2014•]/gm, "-")  // Replace common bullets/dashes
  .replace(/\t/g, "  ")
  .split("\n")
  .map(line => line.trimEnd());


  function parseNestedList(lines, startIndex = 0, baseIndent = 0) {
    const items = [];
    let i = startIndex;

    while (i < lines.length) {
      const line = lines[i];
      const leadingSpaces = line.match(/^ */)[0].length;
      if (line.trim().startsWith("- ")) {
        if (leadingSpaces < baseIndent) break;
        if (leadingSpaces > baseIndent) {
          if (items.length === 0) break;
          const [nestedList, nextIndex] = parseNestedList(lines, i, leadingSpaces);
          items[items.length - 1].children = nestedList;
          i = nextIndex;
          continue;
        }

        const content = line.trim().slice(2).trim();
        items.push({ content, children: [] });
        i++;
      } else {
        break;
      }
    }
    return [items, i];
  }

  const parseBlocks = (lines) => {
    const blocks = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      if (line.trim().startsWith("- ")) {
        const [listItems, nextIndex] = parseNestedList(lines, i);
        blocks.push({ type: "list", items: listItems });
        i = nextIndex;
        continue;
      }

      if (line.startsWith("### ")) {
        blocks.push({ type: "subtitle", content: line.slice(4).trim() });
      } else if (line.startsWith("## ")) {
        blocks.push({ type: "heading", content: line.slice(3).trim() });
      } else if (line.startsWith("# ")) {
        blocks.push({ type: "title", content: line.slice(2).trim() });
      } else if (/^[A-Z\s\-:]+$/.test(line)) {
        // You can add length condition if you want here
        blocks.push({ type: "heading", content: line.trim() });
      } else {
        blocks.push({ type: "paragraph", content: line });
      }
      i++;
    }
    return blocks;
  };

  const descriptionBlocks = parseBlocks(rawLines);

  const renderFormattedText = (text) => {
    const elements = [];
    const regex = /(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*|[^*]+)/g;

    let match;
    while ((match = regex.exec(text)) !== null) {
      const part = match[0];

      if (part.startsWith("***") && part.endsWith("***")) {
        elements.push(
          <strong key={elements.length}>
            <em>{part.slice(3, -3)}</em>
          </strong>
        );
      } else if (part.startsWith("**") && part.endsWith("**")) {
        elements.push(<strong key={elements.length}>{part.slice(2, -2)}</strong>);
      } else if (part.startsWith("*") && part.endsWith("*")) {
        elements.push(<em key={elements.length}>{part.slice(1, -1)}</em>);
      } else {
        elements.push(<span key={elements.length}>{part}</span>);
      }
    }
    return elements;
  };

  const renderList = (items, keyPrefix = "", level = 1) => (
    <ul className={`nested-list level-${level}`} key={keyPrefix}>
      {items.map((item, idx) => (
        <li key={`${keyPrefix}-${idx}`}>
          {renderFormattedText(item.content)}
          {item.children && item.children.length > 0 &&
            renderList(item.children, `${keyPrefix}-${idx}`, level + 1)}
        </li>
      ))}
    </ul>
  );

  const renderBlock = (block, key) => {
    switch (block.type) {
      case "paragraph":
        return <p key={key} className="desc-paragraph justify-text">{renderFormattedText(block.content)}</p>;
      case "list":
        return renderList(block.items, `list-${key}`);
      case "title":
        return <h2 key={key} className="place-desc-title semibold">{block.content}</h2>;
      case "heading":
        return <h3 key={key} className="place-desc-heading bold">{block.content}</h3>;
      case "subtitle":
        return <h4 key={key} className="place-desc-subtitle italics">{block.content}</h4>;
      default:
        return null;
    }
  };

  return (
    <div className="place-detail-page">
      {/* <button className="back-btn" onClick={() => navigate(-1)}>
        &larr; Back
      </button> */}

      {/* Media at the top (video or fallback thumbnail) */}
{videoUrl ? (
  <div className="video-wrapper">
    <video
      src={videoUrl}
      autoPlay
      loop
      muted
      playsInline
      className="place-video-top"
    />
  </div>
) : place.thumbnail ? (
  <div className="thumbnail-wrapper">
    <img
      src={place.thumbnail}
      alt={`${title} thumbnail`}
      className="place-thumbnail-top"
    />
  </div>
) : null}


      {/* Title */}
      <h1 className="place-main-title">{title}</h1>

      {/* Description with injected images via placeholders */}
      <div className="description-content">
        {(() => {
          const blocks = [];

          descriptionBlocks.forEach((block, idx) => {
            // Detect [image1], [image2], etc. placeholders inside paragraph blocks
            if (block.type === "paragraph" && /\[image(\d+)\]/i.test(block.content)) {
              const parts = block.content.split(/(\[image\d+\])/i);

              parts.forEach((part, i) => {
                if (/\[image(\d+)\]/i.test(part)) {
                  const match = part.match(/\[image(\d+)\]/i);
                  const num = parseInt(match[1], 10) - 1; // zero-based index
                  if (gallery[num]) {
                    blocks.push(
                      <div
                        key={`img-${num}`}
                        className="injected-img-wrapper"
                        onClick={() => setFullscreenImg(gallery[num])}
                      >
                        <img
                          src={gallery[num]}
                          alt={`${title} - छवि ${num + 1}`}
                          className="injected-img"
                        />
                      </div>
                    );
                  }
                } else if (part.trim() !== "") {
                  blocks.push(renderBlock({ ...block, content: part }, `${idx}-${i}`));
                }
              });
            } else {
              blocks.push(renderBlock(block, idx));
            }
          });

          return blocks;
        })()}
      </div>

      {/* Google Map */}
      {isLoaded && place.location?.lat && place.location?.lng && (
        <div className="map-container">
          <GoogleMap
            center={{ lat: place.location.lat, lng: place.location.lng }}
            zoom={13}
            mapContainerStyle={{ width: "100%", height: "100%" }}
          >
            <Marker position={{ lat: place.location.lat, lng: place.location.lng }} />
          </GoogleMap>
        </div>
      )}
      
       {descriptionRaw && (
       <TTSControl text={descriptionRaw} lang={langCode} />
      )}

      <ReviewSection targetType="place" targetId={placeId} />

      <RecommendedList targetType="place" excludeId={placeId} lang={lang} />


      {/* Fullscreen Image Modal */}
      {fullscreenImg && (
        <div className="fullscreen-modal" onClick={() => setFullscreenImg(null)}>
          <img src={fullscreenImg} alt={`${title} - Fullscreen`} />
        </div>
      )}
    </div>
  );
}
