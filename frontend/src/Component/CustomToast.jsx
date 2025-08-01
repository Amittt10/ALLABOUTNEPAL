import React from "react";
import "./CustomToast.css";

const CustomToast = ({ code, message, linkText, linkHref = "#", onLinkClick, closeToast }) => {
  const handleClick = (e) => {
    e.preventDefault();
    if (onLinkClick) {
      onLinkClick();
      closeToast();
    } else {
      // fallback if no onLinkClick: navigate normally
      window.location.href = linkHref;
      closeToast();
    }
  };

  return (
    <div className="custom-toast" role="alert" aria-live="assertive">
      <button
        className="toast-close"
        onClick={closeToast}
        aria-label="Close notification"
        type="button"
      >
        &times;
      </button>
      <div className="toast-icon" aria-hidden="true"></div>
      <div>
        <div className="toast-code">{code}</div>
        <div className="toast-message">{message}</div>
        {linkText && (
          <a
            href={linkHref}
            className="toast-link"
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleClick(e);
            }}
          >
            {linkText}
          </a>
        )}
      </div>
    </div>
  );
};

export default CustomToast;
