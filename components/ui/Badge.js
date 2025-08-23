// Badge component with perfected styling from design system
import React from 'react';

export const Badge = ({
  children,
  variant = "default",
  size = "md",
  className = "",
}) => {
  const baseClasses =
    "badge font-space tracking-normal lowercase border-1 border-neutral";

  const variants = {
    default: "badge-neutral",
    primary: "badge-primary",
    secondary: "badge-secondary", 
    success: "badge-success",
    warning: "badge-warning",
    error: "badge-error",
    info: "badge-info",
  };

  const sizes = {
    xs: "badge-xs text-xs",
    sm: "badge-sm text-sm",
    md: "text-sm",
    lg: "badge-lg text-base",
  };

  return (
    <span className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};