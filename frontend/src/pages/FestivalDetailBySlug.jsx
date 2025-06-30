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

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString(
      isNepali ? "ne-NP" : "en-US",
      { year: "numeric", month: "long", day: "numeric" }
    );
  };

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

  const gallery = festival.gallery || []; // Optional: support if added
  const rawLines = descriptionRaw.split("\n").map((line) => line.trim()).filter(Boolean);

  const parsedBlocks = rawLines.map((line) => {
    if (line.startsWith("### ")) return { type: "subtitle", content: line.slice(4).trim() };
    if (line.startsWith("## ")) return { type: "heading", content: line.slice(3).trim() };
    if (line.startsWith("# ")) return { type: "title", content: line.slice(2).trim() };
    return { type: "paragraph", content: line };
  });

  const descriptionBlocks = [];
  let paragraphCount = 0;
  let imageIndex = 0;

  parsedBlocks.forEach((block) => {
    descriptionBlocks.push(block);

    if (block.type === "paragraph") {
      paragraphCount++;
      if (paragraphCount % 2 === 0 && imageIndex < gallery.length) {
        descriptionBlocks.push({
          type: "image",
          src: gallery[imageIndex],
          alt: `${name} image ${imageIndex + 1}`,
        });
        imageIndex++;
      }
    }
  });

  const renderBlock = (block, key) => {
    switch (block.type) {
      case "paragraph":
        return <p key={key} className="desc-paragraph justify-text">{block.content}</p>;
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
      <button className="back-button" onClick={() => navigate(-1)}>
        &larr; {t("festival.back")}
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

        <p className="festival-detail-location">
        {festival[`location_${lang}`]}
        </p>

        <div className="description-content">
          {descriptionBlocks.map((block, idx) => renderBlock(block, idx))}
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
