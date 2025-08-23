"use client";
// Demo page to showcase all design system components
import React, { useState } from "react";
import Image from "next/image";
import { SmallScreenMessage } from "@/components/ui";

// Import all components from our design system (you'll need to copy these individual components)
// For now, I'll include the components inline for the demo

// COPY ALL THE COMPONENTS FROM DesignSystemComponents.js HERE
// (I'll show you a better structure after you see the demo)

// =============================================================================
// TYPOGRAPHY COMPONENTS
// =============================================================================

const Heading1 = ({ children, className = "" }) => (
  <h1
    className={`font-raleway font-black tracking-tighter text-4xl leading-none lowercase ${className}`}
  >
    {children}
  </h1>
);

const Heading2 = ({ children, className = "" }) => (
  <h2
    className={`font-raleway font-extrabold tracking-tighter text-2xl leading-tight lowercase ${className}`}
  >
    {children}
  </h2>
);

const Heading3 = ({ children, className = "" }) => (
  <h3
    className={`font-raleway font-bold tracking-tighter text-xl leading-tight lowercase ${className}`}
  >
    {children}
  </h3>
);

const BodyText = ({ children, className = "", size = "base" }) => {
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

const TechText = ({ children, className = "", size = "sm" }) => {
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

const CodeText = ({ children, className = "", size = "sm" }) => {
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

const CardHeader = ({ children, className = "" }) => (
  <div className={`px-4 pt-4 ${className}`}>{children}</div>
);

const CardBody = ({ children, className = "" }) => (
  <div className={`px-4 pt-2 pb-4 ${className}`}>{children}</div>
);

// =============================================================================
// BADGE COMPONENTS
// =============================================================================

const Badge = ({
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
    ghost: "badge-ghost border-base-300",
  };

  const sizes = {
    sm: "badge-sm text-xs",
    md: "badge-md text-xs",
    lg: "badge-lg text-sm",
  };

  return (
    <span
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
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
    lg: "loading-lg",
  };

  return (
    <span
      className={`loading loading-spinner text-neutral ${sizes[size]} ${className}`}
    ></span>
  );
};

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
    lg: "input-lg text-lg",
  };

  const inputClasses = `input input-bordered w-full bg-base-100 border-base-300 border-1 font-lora tracking-normal focus:border-neutral text-sm ${sizes[size]} ${error ? "border-error focus:border-error" : ""}`;

  return (
    <div className="form-control w-full">
      {label && (
        <label className="label">
          <span className="label-text font-raleway font-bold tracking-tight lowercase mb-1">
            {label}
          </span>
        </label>
      )}
      <input className={`${inputClasses} ${className}`} {...props} />
      {(error || helperText) && (
        <label className="label">
          <span
            className={`label-text-alt font-space tracking-normal text-sm lowercase opacity-60 ${error ? "text-error" : ""}`}
          >
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
  const textareaClasses = `textarea textarea-bordered w-full bg-base-100 border-base-300 border-1 font-lora tracking-normal focus:border-neutral ${error ? "border-error focus:border-error" : ""}`;

  return (
    <div className="form-control w-full">
      {label && (
        <label className="label">
          <span className="label-text font-raleway font-bold tracking-tight lowercase mb-1">
            {label}
          </span>
        </label>
      )}
      <textarea
        className={`${textareaClasses} ${className}`}
        rows={rows}
        {...props}
      />
      {(error || helperText) && (
        <label className="label">
          <span
            className={`label-text-alt font-space tracking-normal text-sm lowercase opacity-60 ${error ? "text-error" : ""}`}
          >
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
  const selectClasses = `select select-bordered w-full bg-base-100 border-base-300 border-1 font-lora tracking-normal focus:border-neutral ${error ? "border-error focus:border-error" : ""} text-sm`;

  return (
    <div className="form-control w-full">
      {label && (
        <label className="label">
          <span className="label-text font-raleway font-bold tracking-tight lowercase mb-1">
            {label}
          </span>
        </label>
      )}
      <select className={`${selectClasses} ${className}`} {...props}>
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {(error || helperText) && (
        <label className="label">
          <span
            className={`label-text-alt font-space tracking-normal text-sm lowercase opacity-60 ${error ? "text-error" : ""}`}
          >
            {error || helperText}
          </span>
        </label>
      )}
    </div>
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

const TableHead = ({
  children,
  className = "lowercase font-extrabold text-base tracking-tight",
}) => <thead className={className}>{children}</thead>;

const TableBody = ({ children, className = "" }) => (
  <tbody className={className}>{children}</tbody>
);

const TableRow = ({
  children,
  clickable = false,
  className = "",
  ...props
}) => (
  <tr
    className={`border-base-300 ${clickable ? "cursor-pointer" : ""} ${className}`}
    {...props}
  >
    {children}
  </tr>
);

const TableCell = ({ children, className = "" }) => (
  <td className={`py-4 px-6 ${className}`}>{children}</td>
);

const TableHeader = ({ children, className = "" }) => (
  <th
    className={`py-4 px-6 font-raleway font-bold tracking-tighter text-left text-neutral ${className}`}
  >
    {children}
  </th>
);

// =============================================================================
// MODAL COMPONENTS
// =============================================================================

const Modal = ({
  isOpen = false,
  onClose,
  title,
  children,
  size = "md",
  className = "",
}) => {
  const sizes = {
    sm: "modal-box w-96 max-w-sm",
    md: "modal-box w-11/12 max-w-2xl",
    lg: "modal-box w-11/12 max-w-4xl",
    xl: "modal-box w-11/12 max-w-6xl",
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className={`${sizes[size]} bg-base-100 shadow-xl ${className}`}>
        <div className="flex justify-between items-center pb-4 border-b border-base-300">
          <Heading3>{title}</Heading3>
          <button
            className="btn btn-sm rounded-sm btn-outline border-1"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className="pt-4">{children}</div>
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
  loading = false,
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
    info: { alert: "alert-info", button: "btn-primary" },
  };

  const styles = typeStyles[type] || typeStyles.warning;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-4">
        <div className={`alert ${styles.alert}`}>
          <span className="font-lora tracking-normal">{message}</span>
        </div>

        <div className="flex space-x-4 justify-end">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
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
// TAB COMPONENTS
// =============================================================================

const Tabs = ({ children, name, className = "" }) => (
  <div className={`tabs tabs-lift ${className}`}>{children}</div>
);

const Tab = ({
  children,
  name,
  value,
  defaultChecked = false,
  className = "",
  ...props
}) => (
  <>
    <input
      type="radio"
      name={name}
      className={`tab ${className}`}
      aria-label={value}
      defaultChecked={defaultChecked}
      {...props}
    />
    <div className="tab-content bg-base-100 border-base-300 p-6">
      {children}
    </div>
  </>
);

// Simpler tab component for different styles
const TabsBoxed = ({ children, name, className = "" }) => (
  <div className={`tabs tabs-boxed ${className}`}>{children}</div>
);

const TabsBordered = ({ children, name, className = "" }) => (
  <div className={`tabs tabs-bordered ${className}`}>{children}</div>
);

// =============================================================================
// UTILITY COMPONENTS
// =============================================================================

const Avatar = ({ src, alt = "", size = "md", fallback, className = "" }) => {
  const sizes = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-base",
    lg: "w-16 h-16 text-lg",
    xl: "w-24 h-24 text-xl",
  };

  return (
    <div className={`avatar ${className}`}>
      <div
        className={`${sizes[size]} rounded-sm bg-base-300 border-1 border-neutral flex items-center justify-center overflow-hidden`}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            width={100}
            height={100}
            className="w-full h-full object-cover"
          />
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
  <div
    className={`divider font-space tracking-tighter opacity-60 ${className}`}
  >
    {text}
  </div>
);

const ProgressBar = ({
  value = 0,
  max = 100,
  size = "md",
  variant = "primary",
  className = "",
}) => {
  const sizes = {
    xs: "progress-xs",
    sm: "progress-sm",
    md: "progress-md",
    lg: "progress-lg",
  };

  const variants = {
    primary: "progress-primary",
    secondary: "progress-secondary",
    success: "progress-success",
    warning: "progress-warning",
    error: "progress-error",
  };

  return (
    <progress
      className={`progress ${sizes[size]} ${variants[variant]} ${className}`}
      value={value}
      max={max}
    />
  );
};

const Dropdown = ({
  trigger,
  children,
  position = "bottom-end",
  className = "",
}) => {
  const positions = {
    top: "dropdown-top",
    "top-start": "dropdown-top dropdown-start",
    "top-end": "dropdown-top dropdown-end",
    bottom: "dropdown-bottom",
    "bottom-start": "dropdown-bottom dropdown-start",
    "bottom-end": "dropdown-bottom dropdown-end",
    left: "dropdown-left",
    right: "dropdown-right",
  };

  return (
    <div className={`dropdown ${positions[position]} ${className}`}>
      <label tabIndex={0} className="cursor-pointer">
        {trigger}
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-lg w-52 border border-base-300"
      >
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

const Alert = ({
  children,
  type = "info",
  icon,
  dismissible = false,
  onDismiss,
  className = "",
}) => {
  const types = {
    info: "alert-info",
    success: "alert-success",
    warning: "alert-warning",
    error: "alert-error",
  };

  const icons = {
    info: "ℹ️",
    success: "✅",
    warning: "⚠️",
    error: "❌",
  };

  return (
    <div className={`alert ${types[type]} ${className}`}>
      <span className="text-lg">{icon || icons[type]}</span>
      <div className="flex-1 font-lora tracking-tighter">{children}</div>
      {dismissible && (
        <button className="btn btn-sm btn-circle btn-ghost" onClick={onDismiss}>
          ✕
        </button>
      )}
    </div>
  );
};

const Tooltip = ({ children, text, position = "top", className = "" }) => {
  const positions = {
    top: "tooltip-top",
    bottom: "tooltip-bottom",
    left: "tooltip-left",
    right: "tooltip-right",
  };

  return (
    <div
      className={`tooltip ${positions[position]} ${className}`}
      data-tip={text}
    >
      {children}
    </div>
  );
};

// =============================================================================
// EMPTY STATE COMPONENT
// =============================================================================

const EmptyState = ({
  icon = "📭",
  title = "Nothing here yet",
  description = "Get started by creating your first item.",
  action,
  className = "",
}) => (
  <div
    className={`flex flex-col items-center justify-center py-16 text-center space-y-6 ${className}`}
  >
    <div className="text-6xl opacity-50">{icon}</div>
    <div className="space-y-2">
      <Heading3 className="opacity-70">{title}</Heading3>
      <BodyText className="max-w-md">{description}</BodyText>
    </div>
    {action && <div className="pt-4">{action}</div>}
  </div>
);

// =============================================================================
// DEMO PAGE COMPONENT
// =============================================================================

export default function DesignSystemDemo() {
  const [buttonLoading, setButtonLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("projects");

  const handleLoadingDemo = () => {
    setButtonLoading(true);
    setTimeout(() => setButtonLoading(false), 2000);
  };

  // Sample data for components
  const repositoryOptions = [
    { label: "jagat/shipnotes-app", value: "jagat/shipnotes-app" },
    { label: "jagat/widget-sdk", value: "jagat/widget-sdk" },
    { label: "jagat/docs-site", value: "jagat/docs-site" },
  ];

  const sampleCommits = [
    {
      hash: "a1b2c3d",
      message: "feat: add dark mode toggle to user settings",
      author: "jagat",
      date: "2 hours ago",
      selected: true,
    },
    {
      hash: "e4f5g6h",
      message: "fix: resolve authentication bug in login flow",
      author: "jagat",
      date: "1 day ago",
      selected: true,
    },
    {
      hash: "i7j8k9l",
      message: "docs: update README with installation instructions",
      author: "jagat",
      date: "2 days ago",
      selected: false,
    },
    {
      hash: "m1n2o3p",
      message: "refactor: clean up dashboard component structure",
      author: "jagat",
      date: "3 days ago",
      selected: false,
    },
  ];

  return (
    <main className="min-h-screen bg-base-100 p-6">
      <SmallScreenMessage />
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <Heading1>ShipNotes Design System</Heading1>
          <BodyText size="lg">
            A comprehensive component library for building beautiful, consistent
            interfaces.
          </BodyText>
          <TechText>🎨 Built with Tailwind CSS + DaisyUI</TechText>
        </div>

        {/* Typography Section */}
        <section className="border border-neutral rounded-sm p-8">
          <Heading2 className="mb-6">Typography</Heading2>
          <div className="space-y-6">
            <div className="space-y-2">
              <Heading1>Heading 1 - Main Title</Heading1>
              <Heading2>Heading 2 - Section Header</Heading2>
              <Heading3>Heading 3 - Subsection</Heading3>
              <BodyText>
                Body text for customer-facing content with Lora font.
              </BodyText>
              <TechText>
                Technical text with Space Mono for developer content.
              </TechText>
              <div>
                Code example: <CodeText>npm install shipnotes</CodeText>
              </div>
            </div>
          </div>
        </section>

        {/* Buttons Section */}
        <section className="border border-neutral rounded-sm p-8">
          <Heading2 className="mb-6">Buttons</Heading2>
          <div className="space-y-6">
            {/* Button Variants */}
            <div>
              <Heading3 className="mb-4">Variants</Heading3>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="neutral">Neutral</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="success">Success</Button>
                <Button variant="warning">Warning</Button>
                <Button variant="error">Error</Button>
              </div>
            </div>

            {/* Button Sizes */}
            <div>
              <Heading3 className="mb-4">Sizes</Heading3>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="xs">Extra Small</Button>
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>

            {/* Loading States */}
            <div>
              <Heading3 className="mb-4">Loading States</Heading3>
              <div className="flex flex-wrap gap-3">
                <Button loading={true}>Loading...</Button>
                <Button
                  variant="outline"
                  onClick={handleLoadingDemo}
                  loading={buttonLoading}
                >
                  Click for 2s demo
                </Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Cards Section */}
        <section className="border border-neutral rounded-sm p-8">
          <Heading2 className="mb-6">Cards</Heading2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card variant="default">
              <CardHeader>
                <Heading3>Default Card</Heading3>
              </CardHeader>
              <CardBody>
                <BodyText size="sm">
                  Standard card with border and subtle shadow.
                </BodyText>
              </CardBody>
            </Card>

            <Card variant="elevated" hover>
              <CardHeader>
                <Heading3>Elevated Card</Heading3>
              </CardHeader>
              <CardBody>
                <BodyText size="sm">
                  Card with shadow that lifts on hover.
                </BodyText>
              </CardBody>
            </Card>

            <Card variant="outlined" clickable>
              <CardHeader>
                <Heading3>Outlined Card</Heading3>
              </CardHeader>
              <CardBody>
                <BodyText size="sm">Clickable card with border only.</BodyText>
              </CardBody>
            </Card>

            <Card variant="ghost">
              <CardHeader>
                <Heading3>Ghost Card</Heading3>
              </CardHeader>
              <CardBody>
                <BodyText size="sm">
                  Minimal card that appears on hover.
                </BodyText>
              </CardBody>
            </Card>
          </div>
        </section>

        {/* Badges Section */}
        <section className="border border-neutral rounded-sm p-8">
          <Heading2 className="mb-6">Badges</Heading2>
          <div className="space-y-6">
            <div>
              <Heading3 className="mb-4">Variants</Heading3>
              <div className="flex flex-wrap gap-3">
                <Badge variant="default">Default</Badge>
                <Badge variant="primary">Primary</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="error">Error</Badge>
                <Badge variant="info">Info</Badge>
                <Badge variant="ghost">Ghost</Badge>
              </div>
            </div>

            <div>
              <Heading3 className="mb-4">Sizes</Heading3>
              <div className="flex flex-wrap items-center gap-3">
                <Badge size="sm">Small</Badge>
                <Badge size="md">Medium</Badge>
                <Badge size="lg">Large</Badge>
              </div>
            </div>

            <div>
              <Heading3 className="mb-4">Status Examples</Heading3>
              <div className="flex flex-wrap gap-3">
                <Badge variant="success">Published</Badge>
                <Badge variant="warning">Draft</Badge>
                <Badge variant="success">Active</Badge>
                <Badge variant="ghost">Inactive</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Loading States Section */}
        <section className="border border-neutral rounded-sm p-8">
          <Heading2 className="mb-6">Loading States</Heading2>
          <div className="space-y-8">
            <div>
              <Heading3 className="mb-4">Loading Spinners</Heading3>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <LoadingSpinner size="xs" />
                  <TechText className="block mt-2">Extra Small</TechText>
                </div>
                <div className="text-center">
                  <LoadingSpinner size="sm" />
                  <TechText className="block mt-2">Small</TechText>
                </div>
                <div className="text-center">
                  <LoadingSpinner size="md" />
                  <TechText className="block mt-2">Medium</TechText>
                </div>
                <div className="text-center">
                  <LoadingSpinner size="lg" />
                  <TechText className="block mt-2">Large</TechText>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Empty States Section */}
        <section className="border border-neutral rounded-sm p-8">
          <Heading2 className="mb-6">Empty States</Heading2>

          <Card className="mb-6">
            <EmptyState
              icon="🚀"
              title="No projects yet"
              description="Create your first project to start generating beautiful release notes from your GitHub commits."
              action={<Button variant="primary">Create Project</Button>}
            />
          </Card>

          <Card>
            <EmptyState
              icon="📝"
              title="No commits found"
              description="No commits found in the selected date range. Try expanding your date range."
            />
          </Card>
        </section>

        {/* Project Example */}
        <section className="border border-neutral rounded-sm p-8">
          <Heading2 className="mb-6">Real World Example</Heading2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card variant="default" hover clickable>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Heading3>shipnotes-app</Heading3>
                  <Badge variant="success">Active</Badge>
                </div>
              </CardHeader>
              <CardBody>
                <TechText className="block mb-3">jagat/shipnotes-app</TechText>
                <BodyText size="sm" className="mb-4">
                  Main SaaS application for automated release notes generation.
                </BodyText>
                <div className="flex justify-between items-center">
                  <TechText>Created Jan 15, 2024</TechText>
                  <Badge variant="info" size="sm">
                    3 drafts
                  </Badge>
                </div>
              </CardBody>
            </Card>

            <Card variant="default" hover clickable>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Heading3>widget-sdk</Heading3>
                  <Badge variant="warning">Draft</Badge>
                </div>
              </CardHeader>
              <CardBody>
                <TechText className="block mb-3">jagat/widget-sdk</TechText>
                <BodyText size="sm" className="mb-4">
                  JavaScript SDK for embedding release notes widgets.
                </BodyText>
                <div className="flex justify-between items-center">
                  <TechText>Created Jan 20, 2024</TechText>
                  <Badge variant="warning" size="sm">
                    1 draft
                  </Badge>
                </div>
              </CardBody>
            </Card>
          </div>
        </section>

        {/* Form Components Section */}
        <section className="border border-neutral rounded-sm p-8">
          <Heading2 className="mb-6">Form Components</Heading2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Input
                label="Project Name"
                placeholder="Enter your project name"
                helperText="This will be used in your changelog URL"
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="your@email.com"
                error="Please enter a valid email address"
              />

              <Select
                label="Repository"
                options={repositoryOptions}
                placeholder="Choose a repository"
                helperText="Select the GitHub repository for this project"
              />
            </div>

            <div className="space-y-6">
              <Textarea
                label="Release Notes"
                placeholder="Write your release notes here..."
                rows={6}
                helperText="Describe what's new in this release"
              />

              <div>
                <Heading3 className="mb-4">Input Sizes</Heading3>
                <div className="space-y-3">
                  <Input size="sm" placeholder="Small input" />
                  <Input size="md" placeholder="Medium input (default)" />
                  <Input size="lg" placeholder="Large input" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Table Components Section */}
        <section className="border border-neutral rounded-sm p-8">
          <Heading2 className="mb-6">Table Components</Heading2>

          <div className="space-y-6">
            <div>
              <Heading3 className="mb-4">GitHub Commits Table</Heading3>
              <Table>
                <TableHead>
                  <tr className="border-base-300">
                    <TableHeader>
                      <input type="checkbox" className="checkbox checkbox-sm" />
                    </TableHeader>
                    <TableHeader>Commit</TableHeader>
                    <TableHeader>Author</TableHeader>
                    <TableHeader>Date</TableHeader>
                    <TableHeader>Status</TableHeader>
                  </tr>
                </TableHead>
                <TableBody>
                  {sampleCommits.map((commit) => (
                    <tr
                      key={commit.hash}
                      className="border-base-300 hover:bg-base-200 transition-colors cursor-pointer"
                    >
                      <TableCell>
                        <input
                          type="checkbox"
                          className="checkbox checkbox-sm"
                          defaultChecked={commit.selected}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <CodeText size="xs">{commit.hash}</CodeText>
                          <BodyText size="sm" className="mt-1">
                            {commit.message}
                          </BodyText>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar
                            size="sm"
                            fallback={commit.author[0].toUpperCase()}
                          />
                          <TechText>{commit.author}</TechText>
                        </div>
                      </TableCell>
                      <TableCell>
                        <TechText>{commit.date}</TechText>
                      </TableCell>
                      <TableCell>
                        <Badge variant={commit.selected ? "success" : "ghost"}>
                          {commit.selected ? "Selected" : "Available"}
                        </Badge>
                      </TableCell>
                    </tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>

        {/* Modal & Overlay Components */}
        <section className="border border-neutral rounded-sm p-8">
          <Heading2 className="mb-6">Modals & Overlays</Heading2>

          <div className="space-y-6">
            <div>
              <Heading3 className="mb-4">Modal Examples</Heading3>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                  Open Create Project Modal
                </Button>
                <Button
                  variant="error"
                  onClick={() => setIsConfirmModalOpen(true)}
                >
                  Open Confirm Dialog
                </Button>
              </div>
            </div>

            <div>
              <Heading3 className="mb-4">Dropdown Examples</Heading3>
              <div className="flex flex-wrap gap-6">
                <Dropdown
                  trigger={<Button variant="outline">Actions ▼</Button>}
                >
                  <DropdownItem>Edit Project</DropdownItem>
                  <DropdownItem>View Changelog</DropdownItem>
                  <DropdownItem>Copy Widget Code</DropdownItem>
                  <Divider />
                  <DropdownItem className="text-error">
                    Delete Project
                  </DropdownItem>
                </Dropdown>

                <Dropdown
                  trigger={<Button variant="ghost">Settings ⚙️</Button>}
                  position="bottom-start"
                >
                  <DropdownItem>Profile Settings</DropdownItem>
                  <DropdownItem>API Keys</DropdownItem>
                  <DropdownItem>Billing</DropdownItem>
                </Dropdown>
              </div>
            </div>

            <div>
              <Heading3 className="mb-4">Tooltip Examples</Heading3>
              <div className="flex flex-wrap gap-6">
                <Tooltip text="This is a helpful tooltip" position="top">
                  <Button variant="ghost">Hover me (top)</Button>
                </Tooltip>
                <Tooltip text="Widget installation guide" position="bottom">
                  <Button variant="ghost">Hover me (bottom)</Button>
                </Tooltip>
                <Tooltip text="GitHub integration status" position="left">
                  <Button variant="ghost">Hover me (left)</Button>
                </Tooltip>
                <Tooltip text="Release notes analytics" position="right">
                  <Button variant="ghost">Hover me (right)</Button>
                </Tooltip>
              </div>
            </div>
          </div>
        </section>

        {/* Alert & Feedback Components */}
        <section className="border border-neutral rounded-sm p-8">
          <Heading2 className="mb-6">Alerts & Feedback</Heading2>

          <div className="space-y-6">
            <div>
              <Heading3 className="mb-4">Alert Types</Heading3>
              <div className="space-y-4">
                <Alert type="info">
                  Your release notes have been saved as a draft.
                </Alert>
                <Alert type="success">
                  Release notes published successfully! Your changelog is now
                  live.
                </Alert>
                <Alert type="warning">
                  You have 3 credits remaining. Consider upgrading your plan.
                </Alert>
                <Alert type="error" dismissible onDismiss={() => {}}>
                  Failed to connect to GitHub. Please check your permissions.
                </Alert>
              </div>
            </div>

            <div>
              <Heading3 className="mb-4">Progress Indicators</Heading3>
              <div className="space-y-4">
                <div>
                  <TechText className="block mb-2">
                    Generating release notes... 60%
                  </TechText>
                  <ProgressBar value={60} variant="primary" />
                </div>
                <div>
                  <TechText className="block mb-2">
                    Credits used this month: 15/20
                  </TechText>
                  <ProgressBar value={75} variant="warning" />
                </div>
                <div>
                  <TechText className="block mb-2">
                    API requests: 950/1000
                  </TechText>
                  <ProgressBar value={95} variant="error" size="sm" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Components Section */}
        <section className="border border-neutral rounded-sm p-8">
          <Heading2 className="mb-6">Tab Components</Heading2>

          <div className="space-y-8">
            <div>
              <Heading3 className="mb-4">Lifted Tabs (Default)</Heading3>
              <BodyText size="sm" className="mb-6">
                Perfect for dashboard sections like Projects, Drafts, Published
              </BodyText>

              <div className="tabs tabs-lift">
                <input
                  type="radio"
                  name="demo_tabs_1"
                  className="tab font-raleway lowercase font-extrabold"
                  aria-label="Projects"
                  defaultChecked
                />
                <div className="tab-content bg-base-100 border-base-300 p-6">
                  <Heading3 className="mb-4">Your Projects</Heading3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card variant="default" hover clickable>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <Heading3 className="text-lg">shipnotes-app</Heading3>
                          <Badge variant="success">Active</Badge>
                        </div>
                      </CardHeader>
                      <CardBody>
                        <TechText className="block mb-3">
                          jagat/shipnotes-app
                        </TechText>
                        <BodyText size="sm">
                          Main SaaS application for automated release notes.
                        </BodyText>
                      </CardBody>
                    </Card>

                    <Card variant="default" hover clickable>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <Heading3 className="text-lg">widget-sdk</Heading3>
                          <Badge variant="warning">Draft</Badge>
                        </div>
                      </CardHeader>
                      <CardBody>
                        <TechText className="block mb-3">
                          jagat/widget-sdk
                        </TechText>
                        <BodyText size="sm">
                          JavaScript SDK for embedding widgets.
                        </BodyText>
                      </CardBody>
                    </Card>
                  </div>
                </div>

                <input
                  type="radio"
                  name="demo_tabs_1"
                  className="tab font-raleway lowercase font-extrabold"
                  aria-label="Drafts"
                />
                <div className="tab-content bg-base-100 border-base-300 p-6">
                  <Heading3 className="mb-4">Draft Release Notes</Heading3>
                  <div className="space-y-4">
                    <Card variant="outlined">
                      <CardBody>
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <Heading3 className="text-lg">
                              Weekly improvements & fixes
                            </Heading3>
                            <TechText>
                              shipnotes-app • Last edited 2 hours ago
                            </TechText>
                          </div>
                          <Badge variant="warning">Draft</Badge>
                        </div>
                        <BodyText size="sm">
                          Authentication fixes, dark mode toggle, cleaner
                          dashboard...
                        </BodyText>
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" variant="primary">
                            Continue Editing
                          </Button>
                          <Button size="sm" variant="ghost">
                            Preview
                          </Button>
                        </div>
                      </CardBody>
                    </Card>

                    <Card variant="outlined">
                      <CardBody>
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <Heading3 className="text-lg">
                              SDK Beta Release
                            </Heading3>
                            <TechText>
                              widget-sdk • Last edited 1 day ago
                            </TechText>
                          </div>
                          <Badge variant="warning">Draft</Badge>
                        </div>
                        <BodyText size="sm">
                          First beta release of our widget SDK with core
                          functionality...
                        </BodyText>
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" variant="primary">
                            Continue Editing
                          </Button>
                          <Button size="sm" variant="ghost">
                            Preview
                          </Button>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                </div>

                <input
                  type="radio"
                  name="demo_tabs_1"
                  className="tab font-raleway lowercase font-extrabold"
                  aria-label="Published"
                />
                <div className="tab-content bg-base-100 border-base-300 p-6">
                  <Heading3 className="mb-4">Published Release Notes</Heading3>
                  <div className="space-y-4">
                    <Card variant="outlined">
                      <CardBody>
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <Heading3 className="text-lg">
                              January 2024 Updates
                            </Heading3>
                            <TechText>
                              shipnotes-app • Published Jan 15, 2024
                            </TechText>
                          </div>
                          <Badge variant="success">Published</Badge>
                        </div>
                        <BodyText size="sm">
                          Major authentication improvements and UI
                          enhancements...
                        </BodyText>
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost">
                              View Changelog
                            </Button>
                            <Button size="sm" variant="ghost">
                              Analytics
                            </Button>
                          </div>
                          <TechText>142 views</TechText>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                </div>

                <input
                  type="radio"
                  name="demo_tabs_1"
                  className="tab font-raleway lowercase font-extrabold"
                  aria-label="Settings"
                />
                <div className="tab-content bg-base-100 border-base-300 p-6">
                  <Heading3 className="mb-4">Project Settings</Heading3>
                  <div className="space-y-6">
                    <Input
                      label="Project Name"
                      defaultValue="shipnotes-app"
                      helperText="This will be used in your changelog URL"
                    />
                    <Select
                      label="Repository"
                      options={repositoryOptions}
                      helperText="Connected GitHub repository"
                    />
                    <Textarea
                      label="Description"
                      defaultValue="Main SaaS application for automated release notes generation."
                      rows={3}
                    />
                    <div className="flex gap-3">
                      <Button variant="primary">Save Changes</Button>
                      <Button variant="ghost">Cancel</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Heading3 className="mb-4">Boxed Tabs</Heading3>
              <BodyText size="sm" className="mb-6">
                Good for smaller sections or secondary navigation
              </BodyText>

              <div className="tabs tabs-boxed mb-4">
                <input
                  type="radio"
                  name="demo_tabs_2"
                  className="tab"
                  aria-label="Overview"
                  defaultChecked
                />
                <input
                  type="radio"
                  name="demo_tabs_2"
                  className="tab"
                  aria-label="Commits"
                />
                <input
                  type="radio"
                  name="demo_tabs_2"
                  className="tab"
                  aria-label="Analytics"
                />
                <input
                  type="radio"
                  name="demo_tabs_2"
                  className="tab"
                  aria-label="Settings"
                />
              </div>

              <Alert type="info">
                Boxed tabs are great for inline navigation within content
                sections.
              </Alert>
            </div>

            <div>
              <Heading3 className="mb-4">Bordered Tabs</Heading3>
              <BodyText size="sm" className="mb-6">
                Minimal style for subtle navigation
              </BodyText>

              <div className="tabs tabs-bordered mb-4">
                <input
                  type="radio"
                  name="demo_tabs_3"
                  className="tab"
                  aria-label="All"
                  defaultChecked
                />
                <input
                  type="radio"
                  name="demo_tabs_3"
                  className="tab"
                  aria-label="Active"
                />
                <input
                  type="radio"
                  name="demo_tabs_3"
                  className="tab"
                  aria-label="Inactive"
                />
              </div>

              <Alert type="info">
                Bordered tabs work well for filtering or categorization within
                content.
              </Alert>
            </div>

            <div>
              <Heading3 className="mb-4">Tab Sizes</Heading3>
              <BodyText size="sm" className="mb-6">
                Different sizes for different contexts
              </BodyText>

              <div className="space-y-4">
                <div>
                  <TechText className="block mb-2">
                    Large tabs (default)
                  </TechText>
                  <div className="tabs tabs-boxed">
                    <input
                      type="radio"
                      name="demo_tabs_4"
                      className="tab"
                      aria-label="Large Tab 1"
                      defaultChecked
                    />
                    <input
                      type="radio"
                      name="demo_tabs_4"
                      className="tab"
                      aria-label="Large Tab 2"
                    />
                  </div>
                </div>

                <div>
                  <TechText className="block mb-2">Small tabs</TechText>
                  <div className="tabs tabs-boxed">
                    <input
                      type="radio"
                      name="demo_tabs_5"
                      className="tab tab-sm"
                      aria-label="Small Tab 1"
                      defaultChecked
                    />
                    <input
                      type="radio"
                      name="demo_tabs_5"
                      className="tab tab-sm"
                      aria-label="Small Tab 2"
                    />
                    <input
                      type="radio"
                      name="demo_tabs_5"
                      className="tab tab-sm"
                      aria-label="Small Tab 3"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Utility Components */}
        <section className="border border-neutral rounded-sm p-8">
          <Heading2 className="mb-6">Utility Components</Heading2>

          <div className="space-y-8">
            <div>
              <Heading3 className="mb-4">Avatars</Heading3>
              <div className="flex items-center gap-4">
                <Avatar size="xs" fallback="XS" />
                <Avatar size="sm" fallback="SM" />
                <Avatar size="md" fallback="MD" />
                <Avatar size="lg" fallback="LG" />
                <Avatar size="xl" fallback="XL" />
                <Avatar
                  size="md"
                  src="https://avatars.githubusercontent.com/u/1"
                  alt="GitHub User"
                />
              </div>
            </div>

            <div>
              <Heading3 className="mb-4">Dividers</Heading3>
              <div className="space-y-4">
                <Divider />
                <Divider text="OR" />
                <Divider text="Recent Activity" />
              </div>
            </div>
          </div>
        </section>

        {/* Real-World Application Example */}
        <section className="border border-neutral rounded-sm p-8">
          <Heading2 className="mb-6">Real Application Example</Heading2>

          <Card variant="elevated" className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <Heading3>Create New Project</Heading3>
                <BodyText size="sm">
                  Connect a GitHub repository to start generating release notes.
                </BodyText>
              </div>
              <Badge variant="info">Step 1 of 3</Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Input
                  label="Project Name"
                  placeholder="my-awesome-project"
                  helperText="This will be your changelog URL"
                />
                <Select
                  label="GitHub Repository"
                  options={repositoryOptions}
                  placeholder="Select a repository"
                />
              </div>

              <div className="space-y-4">
                <Textarea
                  label="Description (Optional)"
                  placeholder="Brief description of your project..."
                  rows={4}
                />
                <div className="flex justify-between items-center">
                  <TechText>Setup progress: 2/3 fields completed</TechText>
                  <div className="flex gap-2">
                    <Button variant="ghost">Cancel</Button>
                    <Button variant="primary">Create Project</Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Modals (hidden by default) */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create New Project"
          size="md"
        >
          <div className="space-y-6">
            <BodyText>
              This is what a create project modal would look like in your
              application.
            </BodyText>
            <Input label="Project Name" placeholder="Enter project name" />
            <Select
              label="Repository"
              options={repositoryOptions}
              placeholder="Choose repository"
            />
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary">Create Project</Button>
            </div>
          </div>
        </Modal>

        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={() => {
            return new Promise((resolve) => setTimeout(resolve, 1000));
          }}
          title="Delete Project"
          message="Are you sure you want to delete this project? This will permanently remove all release notes and cannot be undone."
          confirmText="Delete Project"
          type="error"
        />

        {/* Footer */}
        <div className="text-center py-8">
          <TechText>
            🎨 ShipNotes Design System - Built with ❤️ using DaisyUI
          </TechText>
        </div>
      </div>
    </main>
  );
}
