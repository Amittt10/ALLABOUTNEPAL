// components/ui/button.jsx
import React from "react";

export function Button({
  children,
  onClick,
  variant = "default",
  size = "md",
  className = "",
  type = "button",
}) {
  const baseStyle = "inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200";

  const variants = {
    default: "bg-orange-500 text-white hover:bg-orange-600",
    outline: "border border-orange-300 text-orange-600 bg-white hover:bg-orange-100",
  };

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}
