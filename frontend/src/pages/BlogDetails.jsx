import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./BlogDetails.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function BlogDetails() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fullscreenImg, setFullscreenImg] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${API}/api/blogs/${slug}`);
        setBlog(res.data);
      } catch (err) {
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) return <p className="blog-loading">Loading blog...</p>;
  if (!blog) return <p className="blog-error">Blog not found.</p>;

  const gallery = blog.gallery || [];
  const contentLines = blog.content
    ?.replace(/\t/g, "  ")
    .split("\n")
    .map((line) => line.trimEnd())
    .filter(Boolean);

  // Recursive nested list parser
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

  // Parse blocks with list detection
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
      } else if (/\[image\d+\]/i.test(line)) {
        blocks.push({ type: "image", index: parseInt(line.match(/\d+/)[0], 10) - 1 });
      } else {
        blocks.push({ type: "paragraph", content: line });
      }
      i++;
    }
    return blocks;
  };

  const blocks = parseBlocks(contentLines || []);

  // Inline markdown formatting for bold, italic, bold-italic
  const renderFormattedText = (text) => {
    const parts = [];
    const regex = /(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*|[^*]+)/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const segment = match[0];
      if (segment.startsWith("***") && segment.endsWith("***")) {
        parts.push(<strong key={parts.length}><em>{segment.slice(3, -3)}</em></strong>);
      } else if (segment.startsWith("**") && segment.endsWith("**")) {
        parts.push(<strong key={parts.length}>{segment.slice(2, -2)}</strong>);
      } else if (segment.startsWith("*") && segment.endsWith("*")) {
        parts.push(<em key={parts.length}>{segment.slice(1, -1)}</em>);
      } else {
        parts.push(<span key={parts.length}>{segment}</span>);
      }
    }

    return parts;
  };

  // Recursive render of nested lists
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

  // Render block by type
  const renderBlock = (block, idx) => {
    switch (block.type) {
      case "title":
        return <h2 key={idx} className="blog-title">{block.content}</h2>;
      case "heading":
        return <h3 key={idx} className="blog-heading">{block.content}</h3>;
      case "subtitle":
        return <h4 key={idx} className="blog-subtitle">{block.content}</h4>;
      case "paragraph":
        return <p key={idx} className="blog-paragraph">{renderFormattedText(block.content)}</p>;
      case "image":
        const imgSrc = gallery?.[block.index];
        return imgSrc ? (
          <div
            key={idx}
            className="blog-image-wrapper"
            onClick={() => setFullscreenImg(imgSrc)}
          >
            <img src={imgSrc} alt={`Image ${block.index + 1}`} className="blog-gallery-img" />
          </div>
        ) : null;
      case "list":
        return renderList(block.items, `list-${idx}`);
      default:
        return null;
    }
  };

  return (
    <div className="blog-details-container">
      {/* Full width top image */}
      {blog.thumbnail && (
        <div className="blog-thumbnail-wrapper">
          <img
            src={`${API}${blog.thumbnail}`}
            alt={blog.title}
            className="blog-details-thumbnail"
          />
        </div>
      )}

      {/* Meta info top-right with dot separator */}
      <div className="blog-details-meta">
        <span className="blog-category">{blog.category.toUpperCase()}</span>
        <span className="meta-separator">·</span>
        <span className="blog-date">{new Date(blog.createdAt).toLocaleDateString()}</span>
      </div>

      {/* Title */}
      <h1 className="blog-details-title">{blog.title}</h1>

      {/* Snippet */}
      <p className="blog-details-snippet">{blog.snippet}</p>

      {/* Content */}
      <div className="blog-content">
        {blocks.map((block, idx) => renderBlock(block, idx))}
      </div>

      {/* Fullscreen image modal */}
      {fullscreenImg && (
        <div className="fullscreen-modal" onClick={() => setFullscreenImg(null)}>
          <img src={fullscreenImg} alt="Fullscreen" />
        </div>
      )}
    </div>
  );
}
