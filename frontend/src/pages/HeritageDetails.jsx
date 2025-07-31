import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import "./HeritageDetails.css";
import ReviewSection from "../Component/ReviewSection/ReviewSection";
import TTSControl from "../Component/TTSControl/TTSControl";
import RecommendedList from "../Component/RecommendedList/RecommendedList";

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const HeritageDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullscreenImg, setFullscreenImg] = useState(null);

  const lang = i18n.language || 'en';
  const langCode = lang === "np" ? "ne-NP" : "en-US";

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  });

const addToRecentlyViewed = (item) => {
  const existing = JSON.parse(localStorage.getItem("recentlyViewed")) || [];

  // Remove duplicates based on _id and type
  const filtered = existing.filter(
    (i) => !(i._id === item._id && i.type === item.type)
  );

  // === Robust image extraction ===
  let imagePath = "";

  if (item.thumbnail && typeof item.thumbnail === "string" && item.thumbnail.trim() !== "") {
    imagePath = item.thumbnail;
  } else if (Array.isArray(item.image) && item.image.length > 0 && typeof item.image[0] === "string") {
    imagePath = item.image[0];
  } else if (typeof item.image === "string" && item.image.trim() !== "") {
    imagePath = item.image;
  } else if (Array.isArray(item.gallery) && item.gallery.length > 0 && typeof item.gallery[0] === "string") {
    imagePath = item.gallery[0];
  }

  // === Construct full image URL ===
  const fullImageUrl = imagePath.startsWith("http")
    ? imagePath
    : imagePath
    ? `${API}/${imagePath.replace(/^\/+/, "")}`
    : "/fallback.jpg"; // fallback image

  // === Title fallback ===
  const title =
    item.name_en?.trim() ||
    item.title_en?.trim() ||
    item.title?.trim() ||
    (typeof item.name === "string" ? item.name.trim() : "") ||
    "No Title";

  // === Construct cleaned object for storage ===
  const cleaned = {
    _id: item._id,
    title,
    slug: item.slug || "",
    image: fullImageUrl,
    type: item.type || "unknown",
  };

  // === Add to front and trim to 10 ===
  const updated = [cleaned, ...filtered].slice(0, 10);
  localStorage.setItem("recentlyViewed", JSON.stringify(updated));
};


  useEffect(() => {
    const fetchSite = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API}/api/heritage/slug/${slug}`);
        if (!res.ok) throw new Error('Error fetching heritage site');
        const data = await res.json();
        setSite(data);
      } catch (err) {
        setError('Failed to load heritage site');
        setSite(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSite();
  }, [slug, i18n.language]);

  useEffect(() => {
    if (site) {
      addToRecentlyViewed({ ...site, type: "heritage" });
    }
  }, [site]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const name = site?.[`name_${lang}`] || site?.name_en || site?.name || 'No Name';
  const historyRaw = site?.[`history_${lang}`] || site?.history_en || site?.history || 'No history available.';
  const location = site?.[`location_${lang}`] || site?.location || 'Unknown';
  const entryFee = site?.entryFee;
  const images = site?.gallery || [];

  const rawLines = historyRaw
    .replace(/^[\u2022\u2013\u2014•]/gm, "-")
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

  const renderList = (items, keyPrefix = "", level = 1) => (
    <ul className={`nested-list level-${level}`} key={keyPrefix}>
      {items.map((item, idx) => (
        <li key={`${keyPrefix}-${idx}`}>
          {renderFormattedText(item.content)}
          {item.children?.length > 0 &&
            renderList(item.children, `${keyPrefix}-${idx}`, level + 1)}
        </li>
      ))}
    </ul>
  );

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
                if (images[index]) {
                  return (
                    <img
                      key={`img-${index}`}
                      src={`${API}/${images[index]}`}
                      alt={`${name} image ${index + 1}`}
                      className="inline-image"
                      onClick={() => setFullscreenImg(`${API}/${images[index]}`)}
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

      case "list":
        return renderList(block.items, `list-${key}`);

      case "title":
        return <h2 key={key} className="heritage-desc-title semibold">{block.content}</h2>;

      case "heading":
        return <h3 key={key} className="heritage-desc-heading bold">{block.content}</h3>;

      case "subtitle":
        return <h4 key={key} className="heritage-desc-subtitle italics">{block.content}</h4>;

      default:
        return null;
    }
  };

  if (loading) return <p className="loading">Loading heritage site...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!site) return <p className="error">No heritage site found</p>;

  return (
    <div className="heritage-details-container">
      {site.image && (
        <img
          className="heritage-main-image"
          src={`${API}/${site.image}`}
          alt={name}
          onClick={() => setFullscreenImg(`${API}/${site.image}`)}
          style={{ cursor: 'pointer' }}
        />
      )}

      <h1 className="heritage-main-title">{name}</h1>

      <p className="location-entryfee">
        <span className="location-text italics small-font">{location}</span><br />
        <span className="entryfee-heading bold">{lang === 'np' ? 'प्रवेश शुल्क:' : 'Entry Fee:'}</span>{' '}
        <span className="entryfee-text small-font">
          {entryFee ? `₹${entryFee}` : lang === 'np' ? 'नि:शुल्क' : 'Free'}
        </span>
      </p>

      <div className="description-content">
        {descriptionBlocks.map((block, idx) => renderBlock(block, idx))}
      </div>

      {isLoaded && site.lat && site.lng && (
        <div className="map-container">
          <GoogleMap
            center={{ lat: site.lat, lng: site.lng }}
            zoom={13}
            mapContainerStyle={{ width: "100%", height: "400px" }}
          >
            <Marker position={{ lat: site.lat, lng: site.lng }} />
          </GoogleMap>
        </div>
      )}

      {site && historyRaw && (
        <TTSControl text={historyRaw} lang={langCode} />
      )}

      <ReviewSection targetType="heritage" targetId={site._id} />

      <RecommendedList targetType="heritage" excludeId={site._id} lang={lang} />

      {fullscreenImg && (
        <div className="fullscreen-modal" onClick={() => setFullscreenImg(null)}>
          <img src={fullscreenImg} alt="Fullscreen" />
        </div>
      )}
    </div>
  );
};

export default HeritageDetails;
