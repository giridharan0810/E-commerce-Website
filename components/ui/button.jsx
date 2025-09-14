import * as React from "react";

export const Button = React.forwardRef(({ className = "", variant = "default", ...props }, ref) => {
  const base = "px-4 py-2 rounded font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-500";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-blue-600 text-blue-600 bg-white hover:bg-blue-50",
  };
  return (
    <button ref={ref} className={`${base} ${variants[variant] || variants.default} ${className}`} {...props} />
  );
});
Button.displayName = "Button";
