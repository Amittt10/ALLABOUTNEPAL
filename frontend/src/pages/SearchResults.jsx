import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { axiosInstance as axios } from "../api/axiosConfig";
import "./SearchResults.css"; // import the CSS file

export default function SearchResults() {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract the `q` param
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q");

  // Helper function to get correct image URL based on item type and image string
  const getImageUrl = (item) => {
    if (!item.image) return "/default-image.jpg";

    if (item.type === "festival") {
      // Festivals store just filename, so prepend /uploads/
      return `http://localhost:3000/uploads/${item.image}`;
    }

    if (item.type === "heritage") {
      // Heritage images may already include 'uploads/' prefix
      return item.image.startsWith("uploads/")
        ? `http://localhost:3000/${item.image}`
        : `http://localhost:3000/uploads/${item.image}`;
    }

    // Default fallback
    return `http://localhost:3000/uploads/${item.image}`;
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
              <Link
                to={`/${item.type === "festival" ? "festival-detail" : "heritage"}/${item._id}`}
                className="search-results-link"
              >
                <div className="search-results-thumb">
                  {item.image && (
                    <img
                      src={getImageUrl(item)}
                      alt={item.name_en}
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="search-results-info">
                  <h3>{item.name_en}</h3>
                  <span className="search-results-type">
                    {item.type === "festival" ? "Festival" : "Heritage Site"}
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
