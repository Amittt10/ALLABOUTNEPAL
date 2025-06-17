// src/components/ui/Spinner.jsx
import React from "react";

const Spinner = () => {
  return (
    <div className="spinner" aria-label="Loading">
      <style jsx>{`
        .spinner {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(0, 0, 0, 0.2);
          border-top-color: #000;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: auto;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Spinner;
