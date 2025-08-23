"use client";
// Client-side logout button component
import { signOut } from "@/auth";

export default function LogoutButton() {
  const handleLogout = async () => {
    try {
      // For NextAuth v5, we'll redirect to the signout API endpoint
      window.location.href = '/api/auth/signout';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className="w-full text-left font-lora tracking-wide lowercase"
    >
      logout
    </button>
  );
}