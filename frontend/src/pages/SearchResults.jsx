// src/pages/SearchResults.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const query = new URLSearchParams(useLocation().search).get("q");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const heritageRes = await axios.get("http://localhost:3000/api/heritage");
        const festivalRes = await axios.get("http://localhost:3000/api/festivals");

        const allItems = [...heritageRes.data, ...festivalRes.data];

        const filtered = allItems.filter(item =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(query.toLowerCase()))
        );

        setResults(filtered);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching search results:", err);
        setLoading(false);
      }
    };

    if (query?.trim()) {
      fetchResults();
    }
  }, [query]);

  if (loading) return <p style={{ padding: "2rem" }}>Loading...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Search Results for: <em>{query}</em></h2>
      {results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {results.map((item, idx) => (
            <li
              key={idx}
              style={{
                padding: "1rem",
                border: "1px solid #ccc",
                borderRadius: "10px",
                marginBottom: "1rem",
              }}
            >
              <h3>{item.name}</h3>
              <p>{item.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchResults;
