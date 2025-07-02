import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import festivalsData from "../data/festivalsData";
import "./FestivalDetailBySlug.css";

export default function FestivalDetailBySlug() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();

  const [fullscreenImg, setFullscreenImg] = useState(null);

  const festival = festivalsData[slug];
  const isNepali = i18n.language === "np";
  const lang = isNepali ? "np" : "en";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!festival) {
    return (
      <div className="festival-detail-page">
        <button className="back-button" onClick={() => navigate(-1)}>
          &larr; {t("festival.back")}
        </button>
        <p>{t("festival.notFound")}</p>
      </div>
    );
  }

  const name = festival[`name_${lang}`] || festival.name_en;
  const descriptionRaw = festival[`description_${lang}`] || "";
  const location = festival[`location_${lang}`] || festival.location_en || "";

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString(
      isNepali ? "ne-NP" : "en-US",
      { year: "numeric", month: "long", day: "numeric" }
    );
  };

  const rawLines = descriptionRaw.split("\n").map((line) => line.trim()).filter(Boolean);

  const parsedBlocks = rawLines.map((line) => {
    if (line.startsWith("[image:") && line.endsWith("]")) {
      const filename = line.slice(7, -1).trim();
      return {
        type: "image",
        src: `/images/${filename}`,
        alt: filename
      };
    }

    if (line.startsWith("### ")) return { type: "subtitle", content: line.slice(4).trim() };
    if (line.startsWith("## ")) return { type: "heading", content: line.slice(3).trim() };
    if (line.startsWith("# ")) return { type: "title", content: line.slice(2).trim() };
    return { type: "paragraph", content: line };
  });

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

  const renderBlock = (block, key) => {
    switch (block.type) {
      case "paragraph":
        return (
          <p key={key} className="desc-paragraph justify-text">
            {renderFormattedText(block.content)}
          </p>
        );
      case "image":
        return (
          <img
            key={key}
            src={block.src}
            alt={block.alt || "Festival Image"}
            className="inline-image"
            onClick={() => setFullscreenImg(block.src)}
            style={{ cursor: "pointer" }}
          />
        );
      case "title":
        return <h2 key={key} className="desc-title semibold">{block.content}</h2>;
      case "heading":
        return <h3 key={key} className="desc-heading bold">{block.content}</h3>;
      case "subtitle":
        return <h4 key={key} className="desc-subtitle italics">{block.content}</h4>;
      default:
        return null;
    }
  };

  return (
    <div className="festival-detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        &larr; Back
      </button>

      <div className="festival-detail-card">
        <img
          src={festival.image}
          alt={name}
          className="festival-detail-image"
          onClick={() => setFullscreenImg(festival.image)}
          style={{ cursor: "pointer" }}
        />
        <h1 className="festival-detail-title">{name}</h1>
        <p className="festival-detail-date">{formatDate(festival.dateAD)}</p>
        <p className="festival-detail-location">{location}</p>

        <div className="description-content">
          {parsedBlocks.map((block, idx) => renderBlock(block, idx))}
        </div>
      </div>

      {fullscreenImg && (
        <div className="fullscreen-modal" onClick={() => setFullscreenImg(null)}>
          <img src={fullscreenImg} alt="Fullscreen" />
        </div>
      )}
    </div>
  );
}
