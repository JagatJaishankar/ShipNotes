"use client";
// DaisyUI confirmation modal component
import { useState } from "react";

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "confirm action",
  message = "are you sure you want to proceed?",
  confirmText = "confirm",
  cancelText = "cancel",
  type = "warning" // warning, error, info
}) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirm();
    } finally {
      setIsProcessing(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  const typeStyles = {
    warning: "alert-warning",
    error: "alert-error", 
    info: "alert-info"
  };

  const buttonStyles = {
    warning: "btn-warning border-1 border-neutral",
    error: "btn-error border-1 border-neutral",
    info: "btn-primary border-1 border-neutral"
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 border-1 border-neutral rounded-sm p-6 max-w-md w-full mx-4">
        {/* Modal Header */}
        <div className="mb-4">
          <h2 className="font-raleway font-extrabold text-xl tracking-tighter lowercase mb-2">
            {title}
          </h2>
        </div>

        {/* Alert Message */}
        <div className={`alert ${typeStyles[type]} mb-6`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <div className="font-lora tracking-wide text-sm">
              {message}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="btn btn-outline border-1 border-neutral font-raleway font-extrabold tracking-tighter lowercase"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isProcessing}
            className={`btn ${buttonStyles[type]} font-raleway font-extrabold tracking-tighter lowercase`}
          >
            {isProcessing ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                processing...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}