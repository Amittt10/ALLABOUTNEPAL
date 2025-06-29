import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import "./FestivalBell.css";

const FestivalBell = () => {
  const [festivals, setFestivals] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/festivals/upcoming");
        setFestivals(res.data || []);
      } catch (err) {
        console.error("Error fetching upcoming festivals", err);
      }
    };
    fetchUpcoming();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="festival-bell-wrapper" ref={dropdownRef}>
      <div
        className="bell-icon"
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setIsOpen(!isOpen)}
        aria-label="Toggle festival notifications dropdown"
        role="button"
      >
        <Bell />
        {festivals.length > 0 && <span className="red-dot" />}
      </div>

      {isOpen && (
        <div className="festival-dropdown">
          {festivals.length > 0 ? (
            festivals.map((festival) => (
              <Link
                to={`/festival-detail/${festival._id}`}
                key={festival._id}
                className="festival-item-link"
                onClick={() => setIsOpen(false)}
              >
                <div className="festival-item">
                  <strong>{festival.name_en}</strong> <br />
                  <small>{new Date(festival.dateAD).toLocaleDateString()}</small>
                </div>
              </Link>
            ))
          ) : (
            <div className="festival-item">No upcoming festivals</div>
          )}
        </div>
      )}
    </div>
  );
};

export default FestivalBell;
