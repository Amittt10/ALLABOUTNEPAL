// components/ui/card.jsx
import React from "react";

// Core Card Container
export function Card({ children, className = "", onClick }) {
  return (
    <div className={`rounded-lg bg-white shadow-sm border ${className}`} onClick={onClick}>
      {children}
    </div>
  );
}

// Header Section
export function CardHeader({ children, className = "" }) {
  return (
    <div className={`px-6 py-4 border-b ${className}`}>
      {children}
    </div>
  );
}

// Title in Header
export function CardTitle({ children, className = "" }) {
  return (
    <h3 className={`text-xl font-semibold text-gray-900 ${className}`}>
      {children}
    </h3>
  );
}

// Optional Description in Header
export function CardDescription({ children, className = "" }) {
  return (
    <p className={`text-sm text-gray-500 mt-1 ${className}`}>
      {children}
    </p>
  );
}

// Card Body Content
export function CardContent({ children, className = "" }) {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );
}
