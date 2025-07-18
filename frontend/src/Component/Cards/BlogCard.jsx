import React from "react";
import { Link } from "react-router-dom";
import useScrollAnimation from "../../hooks/useScrollAnimation";
import "./BlogCard.css"; // Assuming you have styles for the blog card


export default function BlogCard({ blog, getFullImageUrl, i18n }) {
  const { ref, visible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`blog-card fade-in-section ${visible ? "fade-in-visible" : ""}`}
      data-category={blog.category || "Other"}
    >
      {blog.category && (
        <span className="blog-category-label">{blog.category.toUpperCase()}</span>
      )}
      <img src={getFullImageUrl(blog.thumbnail, "blog")} alt={blog.title} loading="lazy" />
      <h3>{blog.title}</h3>
      <div className="meta">
        BY {blog.author?.toUpperCase() || "ALLABOUTNEPAL"} —{" "}
        {new Date(blog.createdAt).toLocaleDateString()}
      </div>
      <p>{blog.snippet}</p>
      <Link to={`/blog/${blog.slug}`}>
        {i18n.language === "np" ? "थप पढ्नुहोस्" : "Read More"}
      </Link>
    </div>
  );
}
