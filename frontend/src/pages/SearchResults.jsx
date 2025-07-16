import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { axiosInstance as axios } from "../api/axiosConfig";
import "./SearchResults.css"; // import the CSS file

export default function SearchResults() {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q");

  // Determine detail link based on item type
  const getDetailLink = (item) => {
    switch (item.type) {
      case "festival":
        return `/festival-detail/${item._id}`;
      case "heritage":
        return `/heritage/${item._id}`;
      case "place":
        return `/places/${item._id}`;
      default:
        return "#";
    }
  };

  // Get appropriate image URL based on type
  const getImageUrl = (item) => {

    if (item.type === "festival") {
      return item.image
        ? `http://localhost:3000/uploads/${item.image}`
        : "/default-image.jpg";
    }

    if (item.type === "heritage") {
      if (!item.image) return "/default-image.jpg";
      return item.image.startsWith("uploads/")
        ? `http://localhost:3000/${item.image}`
        : `http://localhost:3000/uploads/${item.image}`;
    }

     if (item.type === "place") {
      if (!item.thumbnail) return "/default-image.jpg";
     return item.thumbnail.startsWith("/uploads")
      ? `http://localhost:3000${item.thumbnail}`
      : `http://localhost:3000/uploads/${item.thumbnail}`;
  }

    return "/default-image.jpg";
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get(`/search?q=${encodeURIComponent(searchQuery)}`);
        setResults(data);
      } catch (err) {
        setError(err?.message || "Error fetching search results");
      } finally {
        setLoading(false);
      }
    };
    if (searchQuery) {
      fetchSearchResults();
    } else {
      setLoading(false); // no search query
    }
  }, [searchQuery]);

  if (loading) {
    return <div className="search-results-loading">Loading results…</div>;
  }

  if (error) {
    return <div className="search-results-error">Error: {error}</div>;
  }

  return (
    <div className="search-results-container">
      <h2 className="search-results-title">Search Results for “{searchQuery}”</h2>
      {results.length === 0 ? (
        <p className="search-results-empty">No results found.</p>
      ) : (
        <ul className="search-results-list">
          {results.map((item) => (
            <li key={item._id} className="search-results-item">
              <Link to={getDetailLink(item)} className="search-results-link">
                <div className="search-results-thumb">
                  <img
                    src={getImageUrl(item)}
                    alt={item.name_en || item.title_en || "Result Image"}
                    loading="lazy"
                  />
                </div>
                <div className="search-results-info">
                  <h3>{item.name_en || item.title_en}</h3>
                  <span className="search-results-type">
                    {item.type === "festival"
                      ? "Festival"
                      : item.type === "heritage"
                      ? "Heritage Site"
                      : "Place"}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
