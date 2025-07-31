import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { api } from "../../api/api";
import "./RecentlyViewed.css";

const RecentlyViewed = () => {
  const [items, setItems] = useState([]);
  const [ratingsMap, setRatingsMap] = useState({});
  const [visibilityMap, setVisibilityMap] = useState({});
  const refs = useRef({});
  const scrollRef = useRef(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    setItems(stored);

    const visMap = {};
    stored.forEach((item) => {
      const id = (item._id || item.targetId || "").toString();
      visMap[id] = false;
    });
    setVisibilityMap(visMap);

    const grouped = stored.reduce((acc, item) => {
      const itemId = item._id || item.targetId;
      if (!itemId) return acc;
      if (!acc[item.type]) acc[item.type] = [];
      acc[item.type].push(itemId);
      return acc;
    }, {});

    const fetchRatings = async () => {
      try {
        const promises = Object.entries(grouped).map(([type, ids]) =>
          api
            .get(`/reviews/summary`, {
              params: {
                targetType: type,
                targetIds: ids.join(","),
              },
            })
            .then((res) => ({ type, data: res.data }))
        );

        const results = await Promise.all(promises);

        const combined = {};
        results.forEach(({ data }) => {
          Object.entries(data).forEach(([id, summary]) => {
            combined[id] = {
              averageRating: summary.averageRating,
              reviewCount: summary.reviewCount,
            };
          });
        });

        setRatingsMap(combined);
      } catch (err) {
        console.error("Failed to fetch ratings:", err);
      }
    };

    if (stored.length) fetchRatings();
  }, []);

  useEffect(() => {
    if (!items.length) return;

    const observers = [];

    items.forEach((item) => {
      const id = (item._id || item.targetId || "").toString();
      if (!refs.current[id]) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          setVisibilityMap((prev) => ({
            ...prev,
            [id]: entry.isIntersecting,
          }));
        },
        { threshold: 0.1 }
      );

      observer.observe(refs.current[id]);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, [items]);

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  // console.log("Recently viewed items:", items);


  if (!items.length) return null;

  return (
    <div className="recently-viewed-container">
      <h2 className="recently-viewed-title">Recently Viewed</h2>

      <div className="recent-scroll-controls">
        <button className="recent-scroll-button left" onClick={scrollLeft}>
          <ArrowLeft />
        </button>

        <div className="recent-scroll-wrapper" ref={scrollRef}>
          {items.map((item) => {
            const itemId = (item._id || item.targetId || "").toString();
            const ratingInfo = ratingsMap[itemId] || {};
            const starCount = Math.round(ratingInfo.averageRating || 0);
            const validStarCount = Math.min(Math.max(starCount, 0), 5);
            const stars = "★".repeat(validStarCount).padEnd(5, "☆");
            const visible = visibilityMap[itemId];

            return (
              <Link
                to={
                  item.type === "place"
                    ? `/places/${item.slug}`
                    : item.type === "blog"
                    ? `/blog/${item.slug}`
                    : item.type === "heritage"
                    ? `/heritage-detail/${item.slug}`
                    : item.type === "festival"
                    ? `/festival-detail/${item.slug}`
                    : "/"
                    
                }
                className={`recent-card-link fade-in-section ${
                  visible ? "fade-in-visible" : ""
                }`}
                key={`${item.type}-${itemId}`}
                ref={(el) => (refs.current[itemId] = el)}
              >
                <div className="recent-card">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="recent-img"
                    loading="lazy"
                    onError={(e) => (e.target.src = "/fallback.jpg")}
                  />
                  <h4 className="recent-title">{item.title}</h4>

                  {ratingInfo.reviewCount > 0 ? (
                    <p className="recent-rating">
                      <span className="stars">{stars}</span> ({ratingInfo.reviewCount})
                    </p>
                  ) : (
                    <p className="recent-rating no-ratings">No ratings yet</p>
                  )}

                  <p className="recent-type">{item.type}</p>
                </div>
              </Link>
            );
          })}
        </div>

        <button className="recent-scroll-button right" onClick={scrollRight}>
          <ArrowRight />
        </button>
      </div>
    </div>
  );
};

export default RecentlyViewed;
