// components/ui/Badge.jsx
import React from "react"; // optional for your color themes

export function Badge({ children, className = "" }) {
  return <span className={`badge ${className}`}>{children}</span>;
}
