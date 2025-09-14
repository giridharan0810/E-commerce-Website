import * as React from "react";

export function Card({ className = "", children, ...props }) {
  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-100 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ className = "", children, ...props }) {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}
