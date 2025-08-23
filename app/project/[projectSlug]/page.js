// Project page for managing commits and generating release notes
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import connectMongo from "@/lib/mongoose";
import Project from "@/models/Project";
import ProjectClient from "@/components/project/ProjectClient";
import ProjectSettings from "@/components/project/ProjectSettings";
import ReleaseNotesManager from "@/components/project/ReleaseNotesManager";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { SmallScreenMessage } from "@/components/ui";

export default async function ProjectPage({ params }) {
  const session = await auth();

  // If not logged in, redirect to auth
  if (!session?.user) {
    redirect("/auth");
  }

  // Await params in Next.js 15
  const { projectSlug } = await params;

  // Connect to database and fetch project
  await connectMongo();
  const project = await Project.findOne({
    projectSlug: projectSlug,
    userId: session.user.id,
  }).lean();

  // If project not found or doesn't belong to user, redirect to dashboard
  if (!project) {
    redirect("/dashboard");
  }

  // Convert ObjectId to string for serialization
  const serializedProject = {
    ...project,
    _id: project._id.toString(),
    userId: project.userId.toString(),
  };

  return (
    <main className="min-h-screen bg-base-100 p-6">
      <SmallScreenMessage />
      <Navbar session={session} />

      <section className="max-w-5xl mx-auto mt-4">
        {/* Project Header */}
        <div className="mb-6">
          <div className="flex justify-baseline">
            <div className="flex-2/3">
              <h1 className="font-raleway font-black tracking-tighter text-4xl lowercase">
                {project.projectName}
              </h1>
              <p className="font-space tracking-normal text-sm opacity-60 text-neutral lowercase mt-2">
                {project.repository}
              </p>
              {project.description && (
                <p className="font-lora tracking-wide opacity-80 text-neutral lowercase mt-2">
                  {project.description}
                </p>
              )}
            </div>

            <div className="flex-1/3 space-x-2 text-end">
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline font-raleway font-extrabold tracking-tighter lowercase border-1"
              >
                view on github
              </a>
              <Link
                href={`/${project.projectSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary font-raleway font-extrabold tracking-tighter lowercase border-1 border-neutral"
              >
                view changelog
              </Link>
            </div>
          </div>
        </div>

        {/* Project Management Tabs */}
        <ProjectClient
          project={serializedProject}
          session={session}
          ProjectSettings={ProjectSettings}
          ReleaseNotesManager={ReleaseNotesManager}
        />
      </section>
    </main>
  );
}
