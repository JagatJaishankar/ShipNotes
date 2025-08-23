// Input components with perfected styling from design system
import React from 'react';

export const Input = ({
  type = "text",
  placeholder = "",
  value,
  onChange,
  disabled = false,
  error = false,
  className = "",
  ...props
}) => {
  const baseClasses =
    "input input-bordered w-full font-lora tracking-wide border-1 border-neutral focus:border-primary focus:outline-none";
  const errorClasses = error ? "input-error border-error" : "";

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`${baseClasses} ${errorClasses} ${className}`}
      {...props}
    />
  );
};

export const TextArea = ({
  placeholder = "",
  value,
  onChange,
  rows = 3,
  disabled = false,
  error = false,
  className = "",
  ...props
}) => {
  const baseClasses =
    "textarea textarea-bordered w-full font-lora tracking-wide border-1 border-neutral focus:border-primary focus:outline-none resize-none";
  const errorClasses = error ? "textarea-error border-error" : "";

  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={rows}
      disabled={disabled}
      className={`${baseClasses} ${errorClasses} ${className}`}
      {...props}
    />
  );
};

export const Select = ({
  value,
  onChange,
  children,
  disabled = false,
  error = false,
  className = "",
  ...props
}) => {
  const baseClasses =
    "select select-bordered w-full font-lora tracking-wide text-sm border-1 border-neutral focus:border-primary focus:outline-none";
  const errorClasses = error ? "select-error border-error" : "";

  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`${baseClasses} ${errorClasses} ${className}`}
      {...props}
    >
      {children}
    </select>
  );
};