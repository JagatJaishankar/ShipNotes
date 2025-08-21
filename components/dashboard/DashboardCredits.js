"use client";
// Dashboard credits component with real-time user data
import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";

export default function DashboardCredits({ session }) {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      // We'll create this API endpoint to get user credit info
      const response = await axios.get('/api/user/credits');
      setUserInfo(response.data.user);
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      // Fallback data based on session
      setUserInfo({
        credits: 20,
        isProUser: false,
        pricing_status: 'free',
        can_generate: true
      });
    } finally {
      setLoading(false);
    }
  };

  const getProgressPercentage = () => {
    if (!userInfo || userInfo.isProUser) return 100;
    const totalCredits = 20;
    return Math.max(0, (userInfo.credits / totalCredits) * 100);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-between h-full w-full">
        <div className="flex flex-row justify-between items-center w-full">
          <div className="flex flex-col space-y-0">
            <div className="font-raleway font-bold tracking-tighter">
              ai generation credits
            </div>
            <div className="font-space tracking-tighter opacity-80 text-sm">
              <span className="flex items-end gap-1">
                loading
                <span className="loading loading-dots loading-xs"></span>
              </span>
            </div>
          </div>
        </div>
        <div className="mb-1">
          <div className="w-full bg-base-300 rounded-full h-2">
            <div className="h-2 rounded-sm bg-neutral animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between h-full w-full">
      <div className="flex flex-row justify-between items-center w-full">
        <div className="flex flex-col space-y-0">
          <div className="font-raleway font-bold tracking-tighter">
            ai generation credits
          </div>
          <div className="font-space tracking-tighter opacity-80 text-sm">
            {userInfo?.isProUser ? "pro user" : "free tier"}
          </div>
        </div>
        {!userInfo?.isProUser && userInfo?.credits < 20 && (
          <Link
            href="/feedback"
            className="btn btn-primary font-raleway font-bold text-md btn-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
              />
            </svg>
            {userInfo?.credits === 0 ? 'get credits' : 'more credits'}
          </Link>
        )}
      </div>
      <div className="mb-1">
        {!userInfo?.isProUser ? (
          <div className="w-full bg-base-300 rounded-full h-2">
            <div
              className={`h-2 rounded-sm transition-all duration-300 ${
                userInfo?.credits === 0 ? "bg-error" : "bg-neutral"
              }`}
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        ) : (
          <div className="w-full bg-base-300 rounded-full h-2">
            <div
              className="h-2 rounded-sm transition-all duration-300 bg-success"
              style={{ width: '100%' }}
            ></div>
          </div>
        )}
        <div className="flex items-baseline justify-between mt-1">
          <span className="font-space tracking-tighter text-xs opacity-80">
            {userInfo?.isProUser
              ? "unlimited remaining"
              : `${userInfo?.credits || 0} remaining`}
          </span>
          <span className="font-space tracking-tighter text-xs opacity-80">
            {userInfo?.isProUser
              ? "of unlimited credits"
              : "of 20 total credits"}
          </span>
        </div>
      </div>
    </div>
  );
}