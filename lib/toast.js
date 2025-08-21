// Toast utility functions for consistent notifications across ShipNotes
import toast from "react-hot-toast";

// Success toast - for successful operations
export const showSuccess = (message) => {
  return toast.success(message);
};

// Error toast - for failed operations
export const showError = (message) => {
  return toast.error(message);
};

// Loading toast - for ongoing operations (returns toast id for dismissal)
export const showLoading = (message) => {
  return toast.loading(message);
};

// Promise toast - handles loading, success, and error states automatically
export const showPromise = (promise, messages) => {
  return toast.promise(promise, {
    loading: messages.loading || 'Processing...',
    success: messages.success || 'Success!',
    error: messages.error || 'Something went wrong',
  });
};

// Custom toast with manual styling (if needed)
export const showCustom = (message, options = {}) => {
  return toast(message, {
    style: {
      fontFamily: 'var(--font-lora)',
      fontSize: '14px',
      letterSpacing: '-0.025em',
      opacity: '0.8',
      background: 'hsl(var(--b1))',
      border: '1px solid hsl(var(--n))',
      borderRadius: '0.125rem',
      boxShadow: 'none',
      ...options.style,
    },
    ...options,
  });
};

// Dismiss a specific toast
export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

// Dismiss all toasts
export const dismissAllToasts = () => {
  toast.dismiss();
};

// Specialized toasts for common ShipNotes operations
export const toasts = {
  // Draft operations
  draftSaved: () => showSuccess('draft saved successfully'),
  draftDeleted: () => showSuccess('draft deleted'),
  draftSaveError: () => showError('failed to save draft'),
  draftDeleteError: () => showError('failed to delete draft'),
  
  // Publishing operations
  notePublished: () => showSuccess('release notes published!'),
  publishError: () => showError('failed to publish release notes'),
  
  // Generation operations
  generating: () => showLoading('generating release notes...'),
  generated: () => showSuccess('release notes generated!'),
  generationError: () => showError('failed to generate release notes'),
  
  // Project operations
  projectCreated: (projectName) => showSuccess(`project "${projectName}" created!`),
  projectError: () => showError('failed to create project'),
  
  // Commit operations
  commitsFetched: () => showSuccess('commits loaded'),
  commitsError: () => showError('failed to load commits'),
  
  // Credit operations
  lowCredits: () => showError('you are running low on credits'),
  noCredits: () => showError('no credits remaining'),
  
  // Generic operations
  copied: () => showSuccess('copied to clipboard'),
  copyError: () => showError('failed to copy to clipboard'),
  
  // Network operations
  networkError: () => showError('network error - please try again'),
  unauthorized: () => showError('unauthorized - please log in again'),
};