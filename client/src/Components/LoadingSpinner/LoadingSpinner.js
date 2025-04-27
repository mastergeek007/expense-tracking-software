import React from "react";

const LoadingSpinner = ({ color = "white", size = 16, borderSize = 2 }) => {
  return (
    <div
      className="animate-spin inline-block rounded-full border-solid"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderWidth: `${borderSize}px`,
        borderColor: color,
        borderTopColor: "transparent",
      }}
      role="status"
      aria-label="loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
