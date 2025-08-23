// Card components with perfected styling from design system
import React from 'react';

export const Card = ({
  children,
  variant = "default",
  hover = false,
  clickable = false,
  className = "",
  ...props
}) => {
  const baseClasses = "bg-base-100 rounded-sm";

  const variants = {
    default: "border-1 border-base-300 hover:border-neutral",
    elevated:
      "border-1 border-base-300 hover:shadow-lg hover:bg-base-200 hover:border-neutral",
    outlined: "border border-neutral",
    ghost: "border-1 border-transparent hover:border-base-300",
  };

  const interactionClasses = {
    hover: hover ? "hover:shadow-md hover:-translate-y-1" : "",
    clickable: clickable ? "cursor-pointer hover:bg-base-200" : "",
  };

  return (
    <div
      className={`${baseClasses} ${variants[variant]} ${interactionClasses.hover} ${interactionClasses.clickable} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = "" }) => (
  <div className={`px-4 pt-4 ${className}`}>{children}</div>
);

export const CardBody = ({ children, className = "" }) => (
  <div className={`px-4 pt-2 pb-4 ${className}`}>{children}</div>
);