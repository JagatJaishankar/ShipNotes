// Settings page for user account management
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import connectMongo from "@/lib/mongoose";
import User from "@/models/User";
import Navbar from "@/components/layout/Navbar";
import DeleteAccountButton from "@/components/settings/DeleteAccountButton";

export default async function SettingsPage() {
  const session = await auth();

  // If not logged in, redirect to auth
  if (!session?.user) {
    redirect("/auth");
  }

  // Connect to database and fetch user data
  await connectMongo();
  const user = await User.findById(session.user.id).lean();

  if (!user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-base-100 p-6">
      <Navbar session={session} />
      
      <section className="border border-neutral rounded-sm p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-raleway font-black tracking-tighter text-4xl mb-2">
            settings
          </h1>
          <p className="font-lora tracking-tighter opacity-80 text-neutral">
            manage your account and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Account Information */}
          <div className="border border-neutral rounded-sm p-6">
            <h2 className="font-raleway font-bold text-xl tracking-tighter mb-4">
              account information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-raleway font-bold tracking-tighter text-sm opacity-80 mb-2 block">
                  name
                </label>
                <p className="font-lora tracking-tighter opacity-80 text-neutral">
                  {user.githubUsername}
                </p>
              </div>
              <div>
                <label className="font-raleway font-bold tracking-tighter text-sm opacity-80 mb-2 block">
                  email
                </label>
                <p className="font-lora tracking-tighter opacity-80 text-neutral">
                  {user.email}
                </p>
              </div>
              <div>
                <label className="font-raleway font-bold tracking-tighter text-sm opacity-80 mb-2 block">
                  github profile
                </label>
                <a
                  href={`https://github.com/${user.githubUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-space tracking-tighter text-sm link link-primary"
                >
                  github.com/{user.githubUsername}
                </a>
              </div>
              <div>
                <label className="font-raleway font-bold tracking-tighter text-sm opacity-80 mb-2 block">
                  member since
                </label>
                <p className="font-space tracking-tighter text-sm opacity-60 text-neutral">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Credits & Usage */}
          <div className="border border-neutral rounded-sm p-6">
            <h2 className="font-raleway font-bold text-xl tracking-tighter mb-4">
              credits & usage
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-raleway font-bold tracking-tighter text-sm opacity-80 mb-2 block">
                  credits remaining
                </label>
                <div className="flex items-center space-x-2">
                  <span className="font-raleway font-black text-2xl">
                    {user.isProUser ? '∞' : user.credits}
                  </span>
                  <span className={`badge ${user.isProUser ? 'badge-success' : 'badge-secondary'} font-raleway font-bold tracking-tighter`}>
                    {user.isProUser ? 'pro user' : 'free plan'}
                  </span>
                </div>
              </div>
              <div>
                <label className="font-raleway font-bold tracking-tighter text-sm opacity-80 mb-2 block">
                  credits used
                </label>
                <p className="font-raleway font-bold text-lg">
                  {20 - user.credits}
                </p>
              </div>
            </div>
            
            {!user.isProUser && user.credits <= 5 && (
              <div className="mt-4 p-4 bg-warning/10 rounded border border-warning/20">
                <p className="font-lora tracking-tighter text-warning mb-2">
                  you&apos;re running low on credits!
                </p>
                <a
                  href="mailto:support@shipnotes.dev?subject=Request Credits"
                  className="btn btn-warning btn-sm font-raleway font-bold tracking-tighter"
                >
                  contact support for more credits
                </a>
              </div>
            )}
          </div>

          {/* GitHub Integration */}
          <div className="border border-neutral rounded-sm p-6">
            <h2 className="font-raleway font-bold text-xl tracking-tighter mb-4">
              github integration
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-lora tracking-tighter opacity-80 text-neutral mb-1">
                  connected to github account
                </p>
                <p className="font-space tracking-tighter text-sm opacity-60">
                  access to repositories and commit history
                </p>
              </div>
              <div className="badge badge-success font-raleway font-bold tracking-tighter">
                connected
              </div>
            </div>
          </div>

          {/* Support & Help */}
          <div className="border border-neutral rounded-sm p-6">
            <h2 className="font-raleway font-bold text-xl tracking-tighter mb-4">
              support & help
            </h2>
            <div className="space-y-3">
              <a
                href="https://github.com/anthropics/claude-code/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 p-2 hover:bg-base-200 rounded transition-colors"
              >
                <span className="font-lora tracking-tighter opacity-80 text-neutral">
                  report an issue or request a feature
                </span>
                <span className="text-primary">→</span>
              </a>
              <a
                href="mailto:support@shipnotes.dev"
                className="flex items-center space-x-2 p-2 hover:bg-base-200 rounded transition-colors"
              >
                <span className="font-lora tracking-tighter opacity-80 text-neutral">
                  contact support
                </span>
                <span className="text-primary">→</span>
              </a>
              <a
                href="https://shipnotes.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 p-2 hover:bg-base-200 rounded transition-colors"
              >
                <span className="font-lora tracking-tighter opacity-80 text-neutral">
                  about shipnotes.dev
                </span>
                <span className="text-primary">→</span>
              </a>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="border border-error rounded-sm p-6">
            <h2 className="font-raleway font-bold text-xl tracking-tighter mb-4 text-error">
              danger zone
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-raleway font-bold tracking-tighter mb-2">
                  delete account
                </h3>
                <p className="font-lora tracking-tighter opacity-80 text-neutral text-sm mb-3">
                  permanently delete your account and all associated data. this action cannot be undone.
                </p>
                <DeleteAccountButton />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}