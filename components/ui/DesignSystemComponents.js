// ShipNotes.dev Design System Components
// Reference file for all UI components with enhanced styling
"use client";
import React, { useState } from "react";

// =============================================================================
// TYPOGRAPHY COMPONENTS
// =============================================================================

// Main Headings (Raleway)
const Heading1 = ({ children, className = "" }) => (
  <h1 className={`font-raleway font-black tracking-tighter text-4xl leading-none ${className}`}>
    {children}
  </h1>
);

const Heading2 = ({ children, className = "" }) => (
  <h2 className={`font-raleway font-bold tracking-tighter text-2xl leading-tight ${className}`}>
    {children}
  </h2>
);

const Heading3 = ({ children, className = "" }) => (
  <h3 className={`font-raleway font-bold tracking-tighter text-xl leading-tight ${className}`}>
    {children}
  </h3>
);

const Heading4 = ({ children, className = "" }) => (
  <h4 className={`font-raleway font-semibold tracking-tighter text-lg leading-tight ${className}`}>
    {children}
  </h4>
);

// Body Text (Lora)
const BodyText = ({ children, className = "", size = "base" }) => {
  const sizeClasses = {
    sm: "text-sm leading-relaxed",
    base: "text-base leading-relaxed", 
    lg: "text-lg leading-relaxed"
  };
  
  return (
    <p className={`font-lora tracking-tighter opacity-80 text-neutral ${sizeClasses[size]} ${className}`}>
      {children}
    </p>
  );
};

// Technical Text (Space Mono)
const TechText = ({ children, className = "", size = "sm" }) => {
  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm", 
    base: "text-base"
  };
  
  return (
    <span className={`font-space tracking-tighter opacity-60 text-neutral ${sizeClasses[size]} ${className}`}>
      {children}
    </span>
  );
};

// Code/Commit Text (Space Mono)
const CodeText = ({ children, className = "", size = "sm" }) => {
  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base"
  };
  
  return (
    <code className={`font-space tracking-tighter opacity-80 text-neutral bg-base-200 px-2 py-1 rounded ${sizeClasses[size]} ${className}`}>
      {children}
    </code>
  );
};

// =============================================================================
// BUTTON COMPONENTS
// =============================================================================

const Button = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  loading = false, 
  disabled = false,
  className = "",
  ...props 
}) => {
  const baseClasses = "btn font-raleway font-bold tracking-tighter transition-all duration-200 border-0";
  
  const variants = {
    primary: "btn-primary hover:btn-primary-focus shadow-sm hover:shadow-md",
    secondary: "btn-secondary hover:btn-secondary-focus shadow-sm hover:shadow-md",
    neutral: "btn-neutral hover:btn-neutral-focus shadow-sm hover:shadow-md",
    ghost: "btn-ghost hover:bg-base-200 hover:shadow-sm",
    outline: "btn-outline border-neutral hover:bg-neutral hover:border-neutral hover:text-neutral-content",
    success: "btn-success hover:btn-success-focus shadow-sm hover:shadow-md",
    error: "btn-error hover:btn-error-focus shadow-sm hover:shadow-md",
    warning: "btn-warning hover:btn-warning-focus shadow-sm hover:shadow-md"
  };
  
  const sizes = {
    xs: "btn-xs text-xs",
    sm: "btn-sm text-sm", 
    md: "btn-md text-base",
    lg: "btn-lg text-lg"
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

// =============================================================================
// CARD COMPONENTS
// =============================================================================

const Card = ({ 
  children, 
  variant = "default", 
  hover = false, 
  clickable = false,
  className = "",
  ...props 
}) => {
  const baseClasses = "bg-base-100 rounded-lg transition-all duration-200";
  
  const variants = {
    default: "border border-base-300 shadow-sm",
    elevated: "shadow-md hover:shadow-lg",
    outlined: "border border-neutral",
    ghost: "border border-transparent hover:border-base-300 hover:shadow-sm"
  };
  
  const interactionClasses = {
    hover: hover ? "hover:shadow-md hover:-translate-y-0.5" : "",
    clickable: clickable ? "cursor-pointer hover:bg-base-200" : ""
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

const CardHeader = ({ children, className = "" }) => (
  <div className={`p-6 pb-4 ${className}`}>
    {children}
  </div>
);

const CardBody = ({ children, className = "" }) => (
  <div className={`px-6 py-4 ${className}`}>
    {children}
  </div>
);

const CardFooter = ({ children, className = "" }) => (
  <div className={`p-6 pt-4 border-t border-base-300 ${className}`}>
    {children}
  </div>
);

// =============================================================================
// INPUT COMPONENTS
// =============================================================================

const Input = ({ 
  label, 
  error, 
  helperText, 
  size = "md", 
  className = "",
  ...props 
}) => {
  const sizes = {
    sm: "input-sm text-sm",
    md: "input-md text-base", 
    lg: "input-lg text-lg"
  };
  
  const inputClasses = `input input-bordered w-full bg-base-100 border-base-300 focus:border-primary focus:outline-none transition-colors ${sizes[size]} ${error ? 'border-error focus:border-error' : ''}`;
  
  return (
    <div className="form-control w-full">
      {label && (
        <label className="label">
          <span className="label-text font-raleway font-semibold tracking-tighter">{label}</span>
        </label>
      )}
      <input 
        className={`${inputClasses} ${className}`}
        {...props}
      />
      {(error || helperText) && (
        <label className="label">
          <span className={`label-text-alt font-space tracking-tighter ${error ? 'text-error' : 'opacity-60'}`}>
            {error || helperText}
          </span>
        </label>
      )}
    </div>
  );
};

const Textarea = ({ 
  label, 
  error, 
  helperText, 
  rows = 4,
  className = "",
  ...props 
}) => {
  const textareaClasses = `textarea textarea-bordered w-full bg-base-100 border-base-300 focus:border-primary focus:outline-none transition-colors resize-none ${error ? 'border-error focus:border-error' : ''}`;
  
  return (
    <div className="form-control w-full">
      {label && (
        <label className="label">
          <span className="label-text font-raleway font-semibold tracking-tighter">{label}</span>
        </label>
      )}
      <textarea 
        className={`${textareaClasses} ${className}`}
        rows={rows}
        {...props}
      />
      {(error || helperText) && (
        <label className="label">
          <span className={`label-text-alt font-space tracking-tighter ${error ? 'text-error' : 'opacity-60'}`}>
            {error || helperText}
          </span>
        </label>
      )}
    </div>
  );
};

const Select = ({ 
  label, 
  error, 
  helperText, 
  options = [],
  placeholder = "Choose an option",
  className = "",
  ...props 
}) => {
  const selectClasses = `select select-bordered w-full bg-base-100 border-base-300 focus:border-primary focus:outline-none transition-colors ${error ? 'border-error focus:border-error' : ''}`;
  
  return (
    <div className="form-control w-full">
      {label && (
        <label className="label">
          <span className="label-text font-raleway font-semibold tracking-tighter">{label}</span>
        </label>
      )}
      <select 
        className={`${selectClasses} ${className}`}
        {...props}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {(error || helperText) && (
        <label className="label">
          <span className={`label-text-alt font-space tracking-tighter ${error ? 'text-error' : 'opacity-60'}`}>
            {error || helperText}
          </span>
        </label>
      )}
    </div>
  );
};

// =============================================================================
// BADGE COMPONENTS
// =============================================================================

const Badge = ({ 
  children, 
  variant = "default", 
  size = "md",
  className = "" 
}) => {
  const baseClasses = "badge font-space tracking-tighter font-medium";
  
  const variants = {
    default: "badge-neutral",
    primary: "badge-primary",
    secondary: "badge-secondary", 
    success: "badge-success",
    warning: "badge-warning",
    error: "badge-error",
    info: "badge-info",
    ghost: "badge-ghost border-base-300"
  };
  
  const sizes = {
    sm: "badge-sm text-xs",
    md: "badge-md text-xs", 
    lg: "badge-lg text-sm"
  };
  
  return (
    <span className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};

// Status-specific badges
const StatusBadge = ({ status, className = "" }) => {
  const statusConfig = {
    active: { variant: "success", text: "active" },
    inactive: { variant: "ghost", text: "inactive" },
    published: { variant: "success", text: "published" }, 
    draft: { variant: "warning", text: "draft" },
    pending: { variant: "info", text: "pending" },
    error: { variant: "error", text: "error" }
  };
  
  const config = statusConfig[status] || statusConfig.default;
  
  return (
    <Badge variant={config.variant} className={className}>
      {config.text}
    </Badge>
  );
};

// =============================================================================
// LOADING COMPONENTS
// =============================================================================

const LoadingSpinner = ({ size = "md", className = "" }) => {
  const sizes = {
    xs: "loading-xs",
    sm: "loading-sm", 
    md: "loading-md",
    lg: "loading-lg"
  };
  
  return (
    <span className={`loading loading-spinner ${sizes[size]} ${className}`}></span>
  );
};

const LoadingButton = ({ children, loading = false, ...props }) => (
  <Button loading={loading} {...props}>
    {children}
  </Button>
);

// Skeleton loaders for content placeholders
const SkeletonLine = ({ width = "full", className = "" }) => {
  const widths = {
    "1/4": "w-1/4",
    "1/2": "w-1/2", 
    "3/4": "w-3/4",
    "full": "w-full"
  };
  
  return (
    <div className={`h-4 bg-base-300 rounded animate-pulse ${widths[width]} ${className}`}></div>
  );
};

const SkeletonCard = ({ lines = 3, className = "" }) => (
  <Card className={`p-6 ${className}`}>
    <div className="space-y-3">
      <SkeletonLine width="3/4" />
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine key={i} width={i === lines - 1 ? "1/2" : "full"} />
      ))}
    </div>
  </Card>
);

// Loading state for entire sections
const LoadingState = ({ title = "Loading...", subtitle, size = "md" }) => {
  const sizes = {
    sm: { spinner: "sm", title: "text-lg", subtitle: "text-sm" },
    md: { spinner: "md", title: "text-xl", subtitle: "text-base" },
    lg: { spinner: "lg", title: "text-2xl", subtitle: "text-lg" }
  };
  
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <LoadingSpinner size={sizes[size].spinner} />
      <div className="text-center">
        <Heading3 className={sizes[size].title}>{title}</Heading3>
        {subtitle && (
          <TechText className={sizes[size].subtitle}>{subtitle}</TechText>
        )}
      </div>
    </div>
  );
};

// =============================================================================
// EMPTY STATE COMPONENTS
// =============================================================================

const EmptyState = ({ 
  icon = "📭", 
  title = "Nothing here yet", 
  description = "Get started by creating your first item.",
  action,
  className = "" 
}) => (
  <div className={`flex flex-col items-center justify-center py-16 text-center space-y-6 ${className}`}>
    <div className="text-6xl opacity-50">{icon}</div>
    <div className="space-y-2">
      <Heading3 className="opacity-70">{title}</Heading3>
      <BodyText className="max-w-md">{description}</BodyText>
    </div>
    {action && (
      <div className="pt-4">
        {action}
      </div>
    )}
  </div>
);

// Specific empty states
const NoProjectsEmptyState = ({ onCreateProject }) => (
  <EmptyState
    icon="🚀"
    title="No projects yet"
    description="Create your first project to start generating beautiful release notes from your GitHub commits."
    action={
      <Button variant="primary" onClick={onCreateProject}>
        Create your first project
      </Button>
    }
  />
);

const NoCommitsEmptyState = () => (
  <EmptyState
    icon="📝"
    title="No commits found"
    description="No commits found in the selected date range. Try expanding your date range or check your repository activity."
  />
);

const NoDraftsEmptyState = () => (
  <EmptyState
    icon="✍️"
    title="No drafts yet"
    description="Draft release notes will appear here as you create them. They'll be saved automatically."
  />
);

// =============================================================================
// ERROR STATE COMPONENTS  
// =============================================================================

const ErrorState = ({ 
  title = "Something went wrong", 
  description = "An unexpected error occurred. Please try again.",
  onRetry,
  className = "" 
}) => (
  <div className={`flex flex-col items-center justify-center py-16 text-center space-y-6 ${className}`}>
    <div className="text-6xl">⚠️</div>
    <div className="space-y-2">
      <Heading3 className="text-error">{title}</Heading3>
      <BodyText className="max-w-md">{description}</BodyText>
    </div>
    {onRetry && (
      <div className="pt-4">
        <Button variant="outline" onClick={onRetry}>
          Try again
        </Button>
      </div>
    )}
  </div>
);

// API Error state
const ApiErrorState = ({ error, onRetry }) => {
  const getErrorMessage = (error) => {
    if (error.response?.status === 404) return "The requested resource was not found.";
    if (error.response?.status === 403) return "You don't have permission to access this resource.";
    if (error.response?.status >= 500) return "Our servers are having issues. Please try again in a moment.";
    return error.message || "An unexpected error occurred.";
  };
  
  return (
    <ErrorState
      title="Request Failed"
      description={getErrorMessage(error)}
      onRetry={onRetry}
    />
  );
};

// =============================================================================
// MODAL COMPONENTS
// =============================================================================

const Modal = ({ 
  isOpen = false, 
  onClose, 
  title, 
  children, 
  size = "md",
  className = "" 
}) => {
  const sizes = {
    sm: "modal-box w-96 max-w-sm",
    md: "modal-box w-11/12 max-w-2xl", 
    lg: "modal-box w-11/12 max-w-4xl",
    xl: "modal-box w-11/12 max-w-6xl"
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="modal modal-open">
      <div className={`${sizes[size]} bg-base-100 shadow-xl ${className}`}>
        <div className="flex justify-between items-center p-6 border-b border-base-300">
          <Heading3>{title}</Heading3>
          <button 
            className="btn btn-sm btn-circle btn-ghost"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};

const ConfirmModal = ({ 
  isOpen = false, 
  onClose, 
  onConfirm, 
  title = "Confirm Action", 
  message = "Are you sure you want to continue?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning", // warning, error, info
  loading = false
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };
  
  const typeStyles = {
    warning: { alert: "alert-warning", button: "btn-warning" },
    error: { alert: "alert-error", button: "btn-error" }, 
    info: { alert: "alert-info", button: "btn-primary" }
  };
  
  const styles = typeStyles[type] || typeStyles.warning;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-6">
        <div className={`alert ${styles.alert}`}>
          <span className="font-lora tracking-tighter">{message}</span>
        </div>
        
        <div className="flex space-x-3 justify-end">
          <Button 
            variant="ghost" 
            onClick={onClose}
            disabled={isProcessing}
          >
            {cancelText}
          </Button>
          <Button 
            variant={type}
            onClick={handleConfirm}
            loading={isProcessing || loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// =============================================================================
// TABLE COMPONENTS
// =============================================================================

const Table = ({ children, className = "" }) => (
  <div className="overflow-x-auto">
    <table className={`table table-zebra w-full bg-base-100 ${className}`}>
      {children}
    </table>
  </div>
);

const TableHead = ({ children, className = "" }) => (
  <thead className={className}>
    <tr className="border-base-300">
      {children}
    </tr>
  </thead>
);

const TableBody = ({ children, className = "" }) => (
  <tbody className={className}>
    {children}
  </tbody>
);

const TableRow = ({ children, clickable = false, className = "", ...props }) => (
  <tr 
    className={`border-base-300 hover:bg-base-200 transition-colors ${clickable ? 'cursor-pointer' : ''} ${className}`}
    {...props}
  >
    {children}
  </tr>
);

const TableCell = ({ children, className = "" }) => (
  <td className={`py-4 px-6 ${className}`}>
    {children}
  </td>
);

const TableHeader = ({ children, className = "" }) => (
  <th className={`py-4 px-6 font-raleway font-bold tracking-tighter text-left ${className}`}>
    {children}
  </th>
);

// =============================================================================
// UTILITY COMPONENTS
// =============================================================================

const Avatar = ({ 
  src, 
  alt = "", 
  size = "md", 
  fallback,
  className = "" 
}) => {
  const sizes = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm", 
    md: "w-12 h-12 text-base",
    lg: "w-16 h-16 text-lg",
    xl: "w-24 h-24 text-xl"
  };
  
  return (
    <div className={`avatar ${className}`}>
      <div className={`${sizes[size]} rounded-full bg-base-300 flex items-center justify-center overflow-hidden`}>
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
          <span className="font-raleway font-bold tracking-tighter opacity-60">
            {fallback || alt.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
    </div>
  );
};

const Divider = ({ text, className = "" }) => (
  <div className={`divider font-space tracking-tighter opacity-60 ${className}`}>
    {text}
  </div>
);

const ProgressBar = ({ 
  value = 0, 
  max = 100, 
  size = "md", 
  variant = "primary",
  className = "" 
}) => {
  const sizes = {
    xs: "progress-xs",
    sm: "progress-sm",
    md: "progress-md", 
    lg: "progress-lg"
  };
  
  const variants = {
    primary: "progress-primary",
    secondary: "progress-secondary",
    success: "progress-success",
    warning: "progress-warning",
    error: "progress-error"
  };
  
  return (
    <progress 
      className={`progress ${sizes[size]} ${variants[variant]} ${className}`}
      value={value} 
      max={max}
    />
  );
};

const Tooltip = ({ children, text, position = "top", className = "" }) => {
  const positions = {
    top: "tooltip-top",
    bottom: "tooltip-bottom", 
    left: "tooltip-left",
    right: "tooltip-right"
  };
  
  return (
    <div className={`tooltip ${positions[position]} ${className}`} data-tip={text}>
      {children}
    </div>
  );
};

// =============================================================================
// ALERT/TOAST COMPONENTS
// =============================================================================

const Alert = ({ 
  children, 
  type = "info", 
  icon,
  dismissible = false,
  onDismiss,
  className = "" 
}) => {
  const types = {
    info: "alert-info",
    success: "alert-success", 
    warning: "alert-warning",
    error: "alert-error"
  };
  
  const icons = {
    info: "ℹ️",
    success: "✅",
    warning: "⚠️", 
    error: "❌"
  };
  
  return (
    <div className={`alert ${types[type]} ${className}`}>
      <span className="text-lg">{icon || icons[type]}</span>
      <div className="flex-1 font-lora tracking-tighter">
        {children}
      </div>
      {dismissible && (
        <button 
          className="btn btn-sm btn-circle btn-ghost"
          onClick={onDismiss}
        >
          ✕
        </button>
      )}
    </div>
  );
};

// =============================================================================
// DROPDOWN COMPONENTS
// =============================================================================

const Dropdown = ({ 
  trigger, 
  children, 
  position = "bottom-end",
  className = "" 
}) => {
  const positions = {
    "top": "dropdown-top",
    "top-start": "dropdown-top dropdown-start",
    "top-end": "dropdown-top dropdown-end", 
    "bottom": "dropdown-bottom",
    "bottom-start": "dropdown-bottom dropdown-start",
    "bottom-end": "dropdown-bottom dropdown-end",
    "left": "dropdown-left",
    "right": "dropdown-right"
  };
  
  return (
    <div className={`dropdown ${positions[position]} ${className}`}>
      <label tabIndex={0} className="cursor-pointer">
        {trigger}
      </label>
      <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-lg w-52 border border-base-300">
        {children}
      </ul>
    </div>
  );
};

const DropdownItem = ({ children, onClick, className = "" }) => (
  <li>
    <a 
      className={`font-raleway tracking-tighter hover:bg-base-200 ${className}`}
      onClick={onClick}
    >
      {children}
    </a>
  </li>
);

// =============================================================================
// ERROR BOUNDARY COMPONENT
// =============================================================================

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <Card className="m-4 p-6">
          <div className="text-center space-y-4">
            <div className="text-6xl">💥</div>
            <Heading3 className="text-error">Something went wrong</Heading3>
            <BodyText>
              A component crashed. Our team has been notified and we're working on a fix.
            </BodyText>
            {process.env.NODE_ENV === 'development' && (
              <details className="text-left mt-4">
                <summary className="cursor-pointer font-space text-sm opacity-60">
                  Error details (development only)
                </summary>
                <pre className="mt-2 p-4 bg-base-200 rounded text-xs overflow-auto">
                  {this.state.error && this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
            <div className="pt-4">
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
              >
                Reload page
              </Button>
            </div>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}

// =============================================================================
// EXPORTS (for reference only)
// =============================================================================

// Typography
// Heading1, Heading2, Heading3, Heading4, BodyText, TechText, CodeText

// Buttons
// Button, LoadingButton

// Cards
// Card, CardHeader, CardBody, CardFooter

// Forms
// Input, Textarea, Select

// Badges
// Badge, StatusBadge

// Loading
// LoadingSpinner, LoadingState, SkeletonLine, SkeletonCard

// Empty States
// EmptyState, NoProjectsEmptyState, NoCommitsEmptyState, NoDraftsEmptyState

// Error States
// ErrorState, ApiErrorState, ErrorBoundary

// Modals
// Modal, ConfirmModal

// Tables
// Table, TableHead, TableBody, TableRow, TableCell, TableHeader

// Utilities
// Avatar, Divider, ProgressBar, Tooltip, Alert, Dropdown, DropdownItem