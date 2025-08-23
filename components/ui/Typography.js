// Typography components with perfected styling from design system
import React from 'react';

export const Heading1 = ({ children, className = "" }) => (
  <h1
    className={`font-raleway font-black tracking-tighter text-4xl leading-none lowercase ${className}`}
  >
    {children}
  </h1>
);

export const Heading2 = ({ children, className = "" }) => (
  <h2
    className={`font-raleway font-extrabold tracking-tighter text-2xl leading-tight lowercase ${className}`}
  >
    {children}
  </h2>
);

export const Heading3 = ({ children, className = "" }) => (
  <h3
    className={`font-raleway font-bold tracking-tighter text-xl leading-tight lowercase ${className}`}
  >
    {children}
  </h3>
);

export const BodyText = ({ children, className = "", size = "base" }) => {
  const sizeClasses = {
    sm: "text-sm leading-relaxed",
    base: "text-base leading-relaxed",
    lg: "text-lg leading-relaxed",
  };

  return (
    <p
      className={`font-lora tracking-wide opacity-80 text-neutral lowercase ${sizeClasses[size]} ${className}`}
    >
      {children}
    </p>
  );
};

export const TechText = ({ children, className = "", size = "sm" }) => {
  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
  };

  return (
    <span
      className={`font-space tracking-normal opacity-60 text-neutral lowercase ${sizeClasses[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export const CodeText = ({ children, className = "", size = "sm" }) => {
  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
  };

  return (
    <code
      className={`font-space tracking-normal opacity-80 text-neutral bg-base-200 px-2 py-1 border-1 border-neutral rounded ${sizeClasses[size]} ${className}`}
    >
      {children}
    </code>
  );
};