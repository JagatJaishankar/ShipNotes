// Settings page for user account management
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import connectMongo from "@/lib/mongoose";
import User from "@/models/User";
import Project from "@/models/Project";
import Navbar from "@/components/layout/Navbar";
import DeleteAccountButton from "@/components/settings/DeleteAccountButton";
import Link from "next/link";
import { SmallScreenMessage } from "@/components/ui";

export default async function SettingsPage() {
  const session = await auth();

  // If not logged in, redirect to auth
  if (!session?.user) {
    redirect("/auth");
  }

  // Connect to database and fetch user data
  await connectMongo();
  const user = await User.findById(session.user.id).lean();
  const projects = await Project.find({ userId: session.user.id }).lean();

  if (!user) {
    redirect("/dashboard");
  }

  // Serialize data for client components
  const serializedProjects = projects.map((project) => ({
    id: project._id.toString(),
    projectName: project.projectName,
    projectSlug: project.projectSlug,
    repository: project.repository,
    repositoryUrl: project.repositoryUrl,
    description: project.description,
    isActive: project.isActive,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  }));

  return (
    <main className="min-h-screen bg-base-100 px-6 py-2">
      <SmallScreenMessage />
      <Navbar session={session} />

      <section className="rounded-sm mt-4 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-raleway font-extrabold tracking-tighter text-4xl mb-2 lowercase">
            settings
          </h1>
          <p className="font-lora tracking-wide opacity-80 text-neutral lowercase">
            manage your account and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Account Information */}
          <div className="border-1 border-neutral rounded-sm p-6">
            <h2 className="font-raleway font-extrabold text-xl tracking-tighter mb-4 lowercase">
              account information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-raleway font-extrabold tracking-tighter text-sm opacity-80 mb-2 block lowercase">
                  name
                </label>
                <p className="font-lora tracking-wide opacity-80 text-neutral">
                  {user.githubUsername}
                </p>
              </div>
              <div>
                <label className="font-raleway font-extrabold tracking-tighter text-sm opacity-80 mb-2 block lowercase">
                  email
                </label>
                <p className="font-lora tracking-wide opacity-80 text-neutral">
                  {user.email}
                </p>
              </div>
              <div>
                <label className="font-raleway font-extrabold tracking-tighter text-sm opacity-80 mb-2 block lowercase">
                  github profile
                </label>
                <a
                  href={`https://github.com/${user.githubUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-space tracking-normal text-sm link link-primary"
                >
                  github.com/{user.githubUsername}
                </a>
              </div>
              <div>
                <label className="font-raleway font-extrabold tracking-tighter text-sm opacity-80 mb-2 block lowercase">
                  member since
                </label>
                <p className="font-space tracking-normal text-sm opacity-60 text-neutral lowercase">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Credits & Usage */}
          <div className="border-1 border-neutral rounded-sm p-6">
            <h2 className="font-raleway font-extrabold text-xl tracking-tighter mb-4 lowercase">
              credits & usage
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-raleway font-extrabold tracking-tighter text-sm opacity-80 mb-2 block lowercase">
                  credits remaining
                </label>
                <div className="flex items-center space-x-2">
                  <span className="font-raleway font-extrabold text-2xl">
                    {user.isProUser ? "∞" : user.credits}
                  </span>
                  <span
                    className={`badge ${user.isProUser ? "badge-success" : "badge-secondary"} font-space tracking-normal border-1 border-neutral lowercase`}
                  >
                    {user.isProUser ? "pro user" : "free plan"}
                  </span>
                </div>
              </div>
              <div>
                <label className="font-raleway font-extrabold tracking-tighter text-sm opacity-80 mb-2 block lowercase">
                  credits used
                </label>
                <p className="font-raleway font-extrabold text-lg">
                  {20 - user.credits}
                </p>
              </div>
            </div>

            {!user.isProUser && user.credits < 20 && (
              <div className="mt-4 p-4 bg-primary/10 rounded-sm border-1 border-primary/20">
                <p className="font-lora tracking-wide text-primary mb-2 lowercase">
                  {user.credits === 0
                    ? "out of credits!"
                    : "get more free credits!"}
                </p>
                <Link
                  href="/feedback"
                  className="btn btn-primary btn-sm font-raleway font-extrabold tracking-tighter lowercase border-1 border-neutral"
                >
                  get free credits via feedback
                </Link>
                <p className="font-space tracking-normal text-xs opacity-60 mt-2 lowercase">
                  share quick feedback to reset credits to 20
                </p>
              </div>
            )}
          </div>

          {/* Projects Overview */}
          <div className="border-1 border-neutral rounded-sm p-6">
            <h2 className="font-raleway font-extrabold text-xl tracking-tighter mb-4 lowercase">
              your projects
            </h2>
            {serializedProjects.length === 0 ? (
              <div className="text-center py-4">
                <p className="font-lora tracking-wide opacity-60 text-neutral mb-3 lowercase">
                  no projects yet. create your first project to get started.
                </p>
                <Link
                  href="/dashboard"
                  className="btn btn-primary btn-sm font-raleway font-extrabold tracking-tighter lowercase border-1 border-neutral"
                >
                  create project
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {serializedProjects.map((project) => (
                  <div
                    key={project.id}
                    className="border-1 border-neutral rounded-sm p-3 flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-raleway font-extrabold tracking-tighter lowercase">
                        {project.projectName}
                      </h3>
                      <p className="font-space text-sm opacity-60 tracking-normal">
                        {project.repository}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`badge ${project.isActive ? "badge-primary" : "badge-error"} badge-sm border-1 border-neutral font-space tracking-normal lowercase`}
                      >
                        {project.isActive ? "active" : "inactive"}
                      </span>
                      <Link
                        href={`/project/${project.projectSlug}`}
                        className="btn btn-ghost btn-sm font-raleway font-extrabold tracking-tighter lowercase"
                      >
                        view →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* GitHub Integration */}
          <div className="border-1 border-neutral rounded-sm p-6">
            <h2 className="font-raleway font-extrabold text-xl tracking-tighter mb-4 lowercase">
              github integration
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-lora tracking-wide opacity-80 text-neutral mb-1 lowercase">
                  connected to github account
                </p>
                <p className="font-space tracking-normal text-sm opacity-60 lowercase">
                  access to repositories and commit history
                </p>
              </div>
              <div className="badge badge-primary font-space tracking-normal border-1 border-neutral lowercase">
                connected
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="border-1 border-error rounded-sm p-6">
            <h2 className="font-raleway font-extrabold text-xl tracking-tighter mb-4 text-error lowercase">
              danger zone
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-raleway font-extrabold tracking-tighter mb-2 lowercase">
                  delete account
                </h3>
                <p className="font-lora tracking-wide opacity-80 text-neutral text-sm mb-3 lowercase">
                  permanently delete your account and all associated data. this
                  action cannot be undone.
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
