import React from "react";

export function Progress({ value, className = "" }) {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-3 overflow-hidden ${className}`}>
      <div
        className="bg-green-500 h-3 rounded-full transition-all duration-500"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
