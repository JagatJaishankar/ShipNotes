"use client";
// Delete account button component
import { showError } from "@/lib/toast";

export default function DeleteAccountButton() {
  const handleDeleteAccount = () => {
    showError("Account deletion not yet implemented. Please contact support.");
  };

  return (
    <button
      className="btn btn-error btn-outline btn-sm font-raleway font-bold tracking-tighter"
      onClick={handleDeleteAccount}
    >
      delete account
    </button>
  );
}