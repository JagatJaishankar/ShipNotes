"use client";
// Feedback form component for credit reset system
import { useState } from "react";
import axios from "axios";
import { toasts, showError, showLoading, dismissToast } from "@/lib/toast";

export default function FeedbackForm({ user }) {
  const [formData, setFormData] = useState({
    desiredFeature: '',
    barrier: '',
    currentMethod: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCounts, setCharCounts] = useState({
    desiredFeature: 0,
    barrier: 0,
    currentMethod: 0,
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setCharCounts(prev => ({ ...prev, [field]: value.length }));
  };

  const validateForm = () => {
    const errors = [];
    
    if (formData.desiredFeature.trim().length < 15) {
      errors.push("Feature suggestion must be at least 15 characters");
    }
    
    if (formData.barrier.trim().length < 15) {
      errors.push("Barrier description must be at least 15 characters");
    }
    
    if (formData.currentMethod.trim().length < 15) {
      errors.push("Current method description must be at least 15 characters");
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      showError(errors[0]);
      return;
    }

    setIsSubmitting(true);
    const loadingToast = showLoading("submitting feedback and resetting credits...");

    try {
      const response = await axios.post("/api/feedback", {
        desiredFeature: formData.desiredFeature.trim(),
        barrier: formData.barrier.trim(),
        currentMethod: formData.currentMethod.trim(),
      });

      if (response.data.success) {
        dismissToast(loadingToast);
        toasts.creditsReset();
        
        // Redirect to dashboard with success message
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);
      }
    } catch (error) {
      console.error("❌ Error submitting feedback:", error);
      dismissToast(loadingToast);
      
      const errorMessage = error.response?.data?.error || "Failed to submit feedback. Please try again.";
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return charCounts.desiredFeature >= 15 && 
           charCounts.barrier >= 15 && 
           charCounts.currentMethod >= 15;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Question 1: Desired Feature */}
      <div className="border border-neutral rounded-sm p-4">
        <label className="font-raleway font-bold tracking-tighter text-lg mb-3 block">
          1. what&apos;s the #1 feature you&apos;d add to shipnotes?
        </label>
        <p className="font-lora tracking-tighter text-sm opacity-60 text-neutral mb-3">
          example: email notifications, slack integration, custom templates
        </p>
        <textarea
          value={formData.desiredFeature}
          onChange={(e) => handleChange('desiredFeature', e.target.value)}
          className="textarea textarea-bordered w-full h-24 font-lora resize-none"
          placeholder="describe the feature you&apos;d most like to see..."
          maxLength={500}
          disabled={isSubmitting}
        />
        <div className="flex justify-between items-center mt-2">
          <span className={`font-space tracking-tighter text-xs ${
            charCounts.desiredFeature < 15 ? 'text-error' : 'text-success'
          }`}>
            {charCounts.desiredFeature >= 15 ? '✓' : '✗'} {charCounts.desiredFeature}/500 characters
          </span>
          {charCounts.desiredFeature < 15 && (
            <span className="font-space tracking-tighter text-xs text-error">
              {15 - charCounts.desiredFeature} more needed
            </span>
          )}
        </div>
      </div>

      {/* Question 2: Barrier */}
      <div className="border border-neutral rounded-sm p-4">
        <label className="font-raleway font-bold tracking-tighter text-lg mb-3 block">
          2. what almost stopped you from trying shipnotes?
        </label>
        <p className="font-lora tracking-tighter text-sm opacity-60 text-neutral mb-3">
          example: pricing unclear, setup looked complex, didn&apos;t trust the ai quality
        </p>
        <textarea
          value={formData.barrier}
          onChange={(e) => handleChange('barrier', e.target.value)}
          className="textarea textarea-bordered w-full h-24 font-lora resize-none"
          placeholder="what concerns or hesitations did you have?"
          maxLength={500}
          disabled={isSubmitting}
        />
        <div className="flex justify-between items-center mt-2">
          <span className={`font-space tracking-tighter text-xs ${
            charCounts.barrier < 15 ? 'text-error' : 'text-success'
          }`}>
            {charCounts.barrier >= 15 ? '✓' : '✗'} {charCounts.barrier}/500 characters
          </span>
          {charCounts.barrier < 15 && (
            <span className="font-space tracking-tighter text-xs text-error">
              {15 - charCounts.barrier} more needed
            </span>
          )}
        </div>
      </div>

      {/* Question 3: Current Method */}
      <div className="border border-neutral rounded-sm p-4">
        <label className="font-raleway font-bold tracking-tighter text-lg mb-3 block">
          3. how do you currently share product updates with customers?
        </label>
        <p className="font-lora tracking-tighter text-sm opacity-60 text-neutral mb-3">
          example: manual emails, slack posts, nothing (we should but don&apos;t)
        </p>
        <textarea
          value={formData.currentMethod}
          onChange={(e) => handleChange('currentMethod', e.target.value)}
          className="textarea textarea-bordered w-full h-24 font-lora resize-none"
          placeholder="describe your current process..."
          maxLength={500}
          disabled={isSubmitting}
        />
        <div className="flex justify-between items-center mt-2">
          <span className={`font-space tracking-tighter text-xs ${
            charCounts.currentMethod < 15 ? 'text-error' : 'text-success'
          }`}>
            {charCounts.currentMethod >= 15 ? '✓' : '✗'} {charCounts.currentMethod}/500 characters
          </span>
          {charCounts.currentMethod < 15 && (
            <span className="font-space tracking-tighter text-xs text-error">
              {15 - charCounts.currentMethod} more needed
            </span>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex flex-col space-y-4 pt-4">
        <div className="alert alert-success">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-raleway font-bold tracking-tighter">credits will be reset to 20</h3>
            <div className="font-lora tracking-tighter text-sm">
              you&apos;ll be able to generate 20 more release notes after submitting
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!isFormValid() || isSubmitting}
          className="btn btn-primary btn-lg w-full font-raleway font-bold tracking-tighter"
        >
          {isSubmitting ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              submitting feedback...
            </>
          ) : (
            "submit feedback & get 20 credits"
          )}
        </button>
        
        <p className="font-space tracking-tighter text-xs opacity-60 text-center">
          your feedback helps us build better features for indie developers
        </p>
      </div>
    </form>
  );
}