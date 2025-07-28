import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./FestivalDetails.css";
import ReviewSection from '../Component/ReviewSection/ReviewSection';
import TTSControl from "../Component/TTSControl/TTSControl";
import RecommendedList from '../Component/RecommendedList/RecommendedList';


const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

const FestivalDetailById = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const [festival, setFestival] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullscreenImg, setFullscreenImg] = useState(null);

     // ✅ First define lang
  const lang = i18n.language || 'en';
  // ✅ Then use lang to define langCode
  const langCode = lang === "np" ? "ne-NP" : "en-US";

const addToRecentlyViewed = (item) => {
  const existing = JSON.parse(localStorage.getItem("recentlyViewed")) || [];

  // Remove duplicates by _id and type
  const filtered = existing.filter(
    (i) => !(i._id === item._id && i.type === item.type)
  );

  // ✅ Ensure full image URL is stored
  const rawImage =
    item.thumbnail ||
    (Array.isArray(item.image) ? item.image[0] : item.image) ||
    "";

  const fullImage =
    rawImage && !rawImage.startsWith("http")
      ? `${API}/uploads/${rawImage}`
      : rawImage;

  const cleaned = {
    _id: item._id,
    title: item[`title_${i18n.language}`] || item.title || "No Title",
    slug: item.slug,
    image: fullImage,
    type: item.type || "unknown",
  };

  const updated = [cleaned, ...filtered].slice(0, 10);
  localStorage.setItem("recentlyViewed", JSON.stringify(updated));
};


  useEffect(() => {
    const fetchFestival = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API}/api/festivals/slug/${slug}`);
        if (!res.ok) throw new Error("Error fetching festival");
        const data = await res.json();
        setFestival(data);
      } catch (err) {
        setError("Failed to load festival details.");
        setFestival(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFestival();
  }, [slug]);

  useEffect(() => {
  if (festival) {
    addToRecentlyViewed({ ...festival, type: "festival" });
  }
}, [festival]);


  const name = festival?.[`name_${lang}`] || festival?.name_en || "No Name";
  const dateAD = festival?.dateAD || "";
  const location = festival?.[`location_${lang}`] || festival?.location_en || "Unknown location";
  const gallery = festival?.gallery || [];

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString(lang === "np" ? "ne-NP" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const descriptionRaw = festival?.[`description_${lang}`] || festival?.description_en || "No content available.";
  const rawLines = descriptionRaw
  .replace(/^[\u2022\u2013\u2014•]/gm, "-")  // Replace common bullets/dashes
  .replace(/\t/g, "  ")
  .split("\n")
  .map(line => line.trimEnd());


  const parsedBlocks = rawLines.map(line => {
    if (line.startsWith("### ")) return { type: "subtitle", content: line.slice(4).trim() };
    if (line.startsWith("## ")) return { type: "heading", content: line.slice(3).trim() };
    if (line.startsWith("# ")) return { type: "title", content: line.slice(2).trim() };
    if (/^[A-Z\s\-:]+$/.test(line) && line.length < 40) {
      return { type: "heading", content: line.trim() };
    }
    return { type: "paragraph", content: line };
  });

  const renderFormattedText = (text) => {
    const elements = [];
    const regex = /(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*|[^*]+)/g;

    let match;
    while ((match = regex.exec(text)) !== null) {
      const part = match[0];

      if (part.startsWith("***") && part.endsWith("***")) {
        elements.push(<strong key={elements.length}><em>{part.slice(3, -3)}</em></strong>);
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

  const renderBlock = (block, key) => {
    switch (block.type) {
      case "paragraph":
        const parts = block.content.split(/(\[image\d+\])/i);
        return (
          <p key={key} className="desc-paragraph justify-text">
            {parts.map((part, i) => {
              const match = part.match(/\[image(\d+)\]/i);
              if (match) {
                const index = parseInt(match[1], 10) - 1;
                if (gallery[index]) {
                  return (
                    <img
                      key={`img-${index}`}
                      src={`${API}/uploads/${gallery[index]}`}
                      alt={`${name} image ${index + 1}`}
                      className="inline-image"
                      onClick={() => setFullscreenImg(`${API}/uploads/${gallery[index]}`)}
                      style={{ cursor: "pointer" }}
                    />
                  );
                }
                return null;
              } else {
                return <React.Fragment key={`text-${i}`}>{renderFormattedText(part)}</React.Fragment>;
              }
            })}
          </p>
        );

      case "title":
        return <h2 key={key} className="festival-desc-title semibold">{block.content}</h2>;
      case "heading":
        return <h3 key={key} className="festival-desc-heading bold">{block.content}</h3>;
      case "subtitle":
        return <h4 key={key} className="festival-desc-subtitle italics">{block.content}</h4>;
      default:
        return null;
    }
  };

  if (loading) return <p className="loading">Loading festival details...</p>;

  return (
    <div className="festival-details-container">
      
      {/* <button className="back-btn" onClick={() => navigate(-1)}>
        &larr; Back
      </button> */}

      {festival?.image && (
        <img
          src={`${API}/uploads/${festival.image}`}
          alt={name}
          className="festival-main-image"
          onClick={() => setFullscreenImg(`${API}/uploads/${festival.image}`)}
        />
      )}
    <div className="festival-author-date">
      <span className="festival-author">By Cultural Heritage Guide</span>
      <span className="meta-separator">-</span>
      <span className="festival-created-date">{formatDate(festival.createdAt)}</span>
    </div>

      <h2 className="desc-title semibold">{name}</h2>
      <p className="festival-date">{formatDate(dateAD)}</p>
      <p className="location-entryfee">
        <span className="location-text italics small-font">{location}</span>
      </p>

      <div className="description-content">
        {parsedBlocks.map((block, idx) => renderBlock(block, idx))}
      </div>

      {descriptionRaw && (
       <TTSControl text={descriptionRaw} lang={langCode} />
      )}


      <ReviewSection targetType="festival" targetId={festival._id} />

      {/* Recommended Festivals Section */}
      <RecommendedList targetType="festival" excludeId={festival._id} lang={lang} />

      {fullscreenImg && (
        <div className="fullscreen-modal" onClick={() => setFullscreenImg(null)}>
          <img src={fullscreenImg} alt="Fullscreen" />
        </div>
      )}
    </div>
  );
};

export default FestivalDetailById;
