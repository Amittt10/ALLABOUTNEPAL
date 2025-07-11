import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./FeaturedCarousel.css";

export default function FeaturedCarousel({ items }) {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const containerRef = useRef(null);

  // Auto scroll effect
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollAmount = 0;
    let direction = 1; // 1 = right, -1 = left

    const maxScrollLeft = container.scrollWidth - container.clientWidth;

    const intervalId = setInterval(() => {
      if (scrollAmount >= maxScrollLeft) direction = -1;
      else if (scrollAmount <= 0) direction = 1;

      scrollAmount += direction * 1; // scroll speed
      container.scrollTo({ left: scrollAmount, behavior: "smooth" });
    }, 30);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <section className="featured-carousel">
      <h2>{i18n.language === "np" ? "विशेष प्रदर्शनी" : "Featured Heritage Sites"}</h2>
      <div className="carousel-container" ref={containerRef} tabIndex={0} aria-label="Featured Heritage Sites Carousel">
        {items.map((item) => (
          <div
            key={item._id}
            className="carousel-card"
            onClick={() => navigate(`/places/${item._id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter") navigate(`/places/${item._id}`); }}
            aria-label={`${i18n.language === "np" ? item.title_np : item.title_en} details`}
          >
            <img
              src={item.thumbnail}
              alt={i18n.language === "np" ? item.title_np : item.title_en}
              loading="lazy"
            />
            <div className="carousel-info">
              <h3>{i18n.language === "np" ? item.title_np : item.title_en}</h3>
              <p>{item.shortDescription || ""}</p>
              <button
                onClick={e => {
                  e.stopPropagation();
                  navigate(`/places/${item._id}`);
                }}
                aria-label={`Learn more about ${i18n.language === "np" ? item.title_np : item.title_en}`}
              >
                {i18n.language === "np" ? "थप जान्नुहोस्" : "Learn More"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
