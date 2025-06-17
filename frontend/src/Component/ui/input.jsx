// src/components/ui/Input.jsx
import React from "react";

const Input = React.forwardRef(({ type = "text", placeholder, ...props }, ref) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      ref={ref}
      {...props}
      className="ui-input"
    />
  );
});

export default Input;
