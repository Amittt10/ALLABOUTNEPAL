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
    return new Date(dateStr).toLocaleDateString(isNepali ? "ne-NP" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const rawLines = descriptionRaw
    .replace(/^[\u2022\u2013\u2014•]/gm, "-")
    .replace(/\t/g, "  ")
    .split("\n")
    .map((line) => line.trimEnd())
    .filter(Boolean);

  function parseNestedList(lines, startIndex = 0, baseIndent = 0) {
    const items = [];
    let i = startIndex;

    while (i < lines.length) {
      const line = lines[i];
      const leadingSpaces = line.match(/^ */)?.[0]?.length ?? 0;

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

  function parseBlocks(lines) {
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

      if (line.startsWith("[image:") && line.endsWith("]")) {
        const filename = line.slice(7, -1).trim();
        blocks.push({
          type: "image",
          src: `/images/${filename}`,
          alt: filename,
        });
      } else if (line.startsWith("### ")) {
        blocks.push({ type: "subtitle", content: line.slice(4).trim() });
      } else if (line.startsWith("## ")) {
        blocks.push({ type: "heading", content: line.slice(3).trim() });
      } else if (line.startsWith("# ")) {
        blocks.push({ type: "title", content: line.slice(2).trim() });
      } else {
        blocks.push({ type: "paragraph", content: line });
      }

      i++;
    }

    return blocks;
  }

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
    <ul className={`nested-list-slug level-${level}`} key={keyPrefix}>
      {items.map((item, idx) => (
        <li key={`${keyPrefix}-${idx}`}>
          {renderFormattedText(item.content)}
          {item.children?.length > 0 && renderList(item.children, `${keyPrefix}-${idx}`, level + 1)}
        </li>
      ))}
    </ul>
  );

  const renderBlock = (block, key) => {
    switch (block.type) {
      case "paragraph":
        return (
          <p key={key} className="desc-paragraph-slug justify-text-slug">
            {renderFormattedText(block.content)}
          </p>
        );
      case "list":
        return renderList(block.items, `list-${key}`);
      case "image":
        return (
          <img
            key={key}
            src={block.src}
            alt={block.alt || "Festival Image"}
            className="inline-image-slug"
            onClick={() => setFullscreenImg(block.src)}
          />
        );
      case "title":
        return (
          <h2 key={key} className="desc-title-slug semibold-slug">
            {block.content}
          </h2>
        );
      case "heading":
        return (
          <h3 key={key} className="desc-heading-slug bold-slug">
            {block.content}
          </h3>
        );
      case "subtitle":
        return (
          <h4 key={key} className="desc-subtitle-slug italics-slug">
            {block.content}
          </h4>
        );
      default:
        return null;
    }
  };

  return (
    <div className="festival-detail-page">
      <div className="festival-slug-detail-card">
        <img
          src={festival.image}
          alt={name}
          className="festival-detail-image-slug"
          onClick={() => setFullscreenImg(festival.image)}
        />
        <h1 className="festival-detail-title-slug">{name}</h1>
        <p className="festival-detail-date-slug">{formatDate(festival.dateAD)}</p>
        <p className="festival-detail-location-slug">{location}</p>

        <div className="description-content-slug">
          {descriptionBlocks.map((block, idx) => renderBlock(block, idx))}
        </div>
      </div>

      {fullscreenImg && (
        <div className="fullscreen-modal-slug" onClick={() => setFullscreenImg(null)}>
          <img src={fullscreenImg} alt="Fullscreen" />
        </div>
      )}
    </div>
  );
}
