// Button component with perfected styling from design system
import React from 'react';

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  ...props
}) => {
  const baseClasses =
    "btn font-raleway font-extrabold tracking-tighter lowercase";

  const variants = {
    primary: "btn-primary border-1 border-neutral",
    secondary: "btn-secondary border-1 border-neutral", 
    neutral: "btn-neutral border-1 border-neutral",
    ghost: "btn-ghost",
    outline: "btn-outline border-1 border-neutral",
    success: "btn-success border-1 border-neutral",
    error: "btn-error border-1 border-neutral",
    warning: "btn-warning border-1 border-neutral",
  };

  const sizes = {
    xs: "btn-xs text-xs",
    sm: "btn-sm text-sm", 
    md: "btn-md text-base",
    lg: "btn-lg text-lg",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="loading loading-spinner loading-sm"></span>}
      {children}
    </button>
  );
};