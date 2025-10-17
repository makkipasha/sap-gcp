import React from "react";

export function Button({ children, variant = "default", disabled, ...props }) {
  const base =
    "px-4 py-2 rounded-xl font-semibold transition duration-200 " +
    "focus:outline-none focus:ring-2 focus:ring-offset-2 " +
    (disabled ? "opacity-60 cursor-not-allowed " : "");

  const variants = {
    default: base + "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-400",
    outline: base + "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50",
    secondary: base + "bg-gray-200 text-gray-800 hover:bg-gray-300",
  };

  return (
    <button className={variants[variant]} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
