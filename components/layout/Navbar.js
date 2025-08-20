// Navigation component for authenticated user pages
import Link from "next/link";
import Image from "next/image";
import LogoutButton from "./LogoutButton";

export default function Navbar({ session }) {
  return (
    <section className="max-w-4xl mx-auto py-2">
      <div className="bg-base-200 rounded-sm border border-neutral p-2">
        <div className="flex flex-row justify-between">
          {/* Left side - Logo and dropdown menu */}
          <div className="flex items-center">
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-200 rounded-box z-[1] mt-3 w-52 p-2 font-lora tracking-tighter border border-neutral"
              >
                <li>
                  <Link href="/dashboard">dashboard</Link>
                </li>
                <li>
                  <Link href="/settings">settings</Link>
                </li>
                <li>
                  <hr className="my-1 border-neutral" />
                </li>
                <li>
                  <a
                    href="https://github.com/anthropics/claude-code/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    support
                  </a>
                </li>
                <li>
                  <a
                    href="https://shipnotes.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    about
                  </a>
                </li>
                <li>
                  <hr className="my-1 border-neutral" />
                </li>
                <li>
                  <LogoutButton />
                </li>
              </ul>
            </div>
            <Link
              href="/dashboard"
              className="font-raleway font-extrabold text-2xl tracking-tighter btn btn-ghost"
            >
              shipnotes.dev
            </Link>
          </div>

          {/* Right side - User profile */}
          <div className="flex items-center">
            <Link href="/settings" className="flex items-center space-x-2">
              <Image
                alt="Profile"
                src={session?.user?.image || "/placeholder-avatar.svg"}
                width={40}
                height={40}
                className="rounded-sm"
              />
              <div className="hidden md:block">
                <p className="font-raleway font-bold tracking-tighter text-sm">
                  {session?.user?.name || session?.user?.email || 'User'}
                </p>
                <p className="font-space tracking-tighter text-xs opacity-60">
                  {session?.user?.email}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}