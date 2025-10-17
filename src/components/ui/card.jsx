import React from "react";

export function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-gray-200 shadow-md bg-white ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}
