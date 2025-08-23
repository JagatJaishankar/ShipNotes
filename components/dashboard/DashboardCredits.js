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
      const response = await axios.get("/api/user/credits");
      setUserInfo(response.data.user);
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      // Fallback data based on session
      setUserInfo({
        credits: 20,
        isProUser: false,
        pricing_status: "free",
        can_generate: true,
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
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-row items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-5"
          >
            <path
              fillRule="evenodd"
              d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z"
              clipRule="evenodd"
            />
          </svg>
          <div className="flex flex-row justify-between items-center w-full">
            <div className="flex flex-col space-y-0">
              <div className="font-raleway font-extrabold tracking-tighter lowercase">
                ai generation credits
              </div>
              <div className="font-space tracking-normal opacity-80 text-sm lowercase">
                <span className="flex items-end gap-1">
                  loading
                  <span className="loading loading-dots loading-xs"></span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-1">
          <div className="w-full bg-base-300 rounded-full h-2">
            <div
              className="h-2 rounded-sm bg-neutral animate-pulse"
              style={{ width: "60%" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex flex-row items-center space-x-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-5"
        >
          <path
            fillRule="evenodd"
            d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z"
            clipRule="evenodd"
          />
        </svg>
        <div className="flex flex-row justify-between items-start w-full">
          <div className="flex flex-col space-y-0">
            <div className="font-raleway font-extrabold tracking-tighter lowercase">
              ai generation credits
            </div>
            <div className="font-space tracking-normal opacity-80 text-sm lowercase">
              {userInfo?.isProUser ? "pro user" : "free tier"}
            </div>
          </div>
          {!userInfo?.isProUser && userInfo?.credits < 20 && (
            <Link
              href="/feedback"
              className="btn btn-primary font-raleway font-extrabold tracking-tighter lowercase text-md border-1 border-neutral"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
                />
              </svg>

              {userInfo?.credits === 0 ? "get credits" : "more credits"}
            </Link>
          )}
        </div>
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
              style={{ width: "100%" }}
            ></div>
          </div>
        )}
        <div className="flex items-baseline justify-between mt-1">
          <span className="font-space tracking-normal text-xs opacity-80 lowercase">
            {userInfo?.isProUser
              ? "unlimited remaining"
              : `${userInfo?.credits || 0} remaining`}
          </span>
          <span className="font-space tracking-normal text-xs opacity-80 lowercase">
            {userInfo?.isProUser
              ? "of unlimited credits"
              : "of 20 total credits"}
          </span>
        </div>
      </div>
    </div>
  );
}
