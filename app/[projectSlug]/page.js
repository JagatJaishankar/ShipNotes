// Public changelog page for customer-facing release notes
import { notFound } from "next/navigation";
import connectMongo from "@/lib/mongoose";
import Project from "@/models/Project";
import PatchNote from "@/models/PatchNote";
import PublicChangelog from "@/components/changelog/PublicChangelog";

export async function generateMetadata({ params }) {
  const { projectSlug } = await params;
  
  await connectMongo();
  const project = await Project.findOne({ projectSlug }).lean();
  
  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.projectName} - Release Notes`,
    description: `Stay updated with the latest changes and improvements to ${project.projectName}. View our changelog for new features, bug fixes, and updates.`,
    openGraph: {
      title: `${project.projectName} - Release Notes`,
      description: `Latest updates and improvements to ${project.projectName}`,
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function PublicChangelogPage({ params }) {
  // Await params in Next.js 15
  const { projectSlug } = await params;

  // Connect to database and fetch project
  await connectMongo();
  const project = await Project.findOne({ projectSlug }).lean();

  // If project not found, show 404
  if (!project) {
    notFound();
  }

  // Fetch published patch notes for this project
  const patchNotes = await PatchNote.find({
    projectId: project._id,
    status: 'published'
  })
  .sort({ publishedAt: -1 }) // Most recent first
  .lean();

  // Convert ObjectIds to strings for serialization
  const serializedProject = {
    ...project,
    _id: project._id.toString(),
    userId: project.userId.toString(),
  };

  const serializedPatchNotes = patchNotes.map(note => ({
    ...note,
    _id: note._id.toString(),
    userId: note.userId.toString(),
    projectId: note.projectId.toString(),
  }));

  return (
    <main className="min-h-screen bg-base-100">
      {/* Header */}
      <section className="border-b border-neutral bg-base-100">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="font-raleway font-black tracking-tighter text-4xl mb-4">
              {project.projectName}
            </h1>
            <p className="font-lora tracking-tighter opacity-80 text-neutral text-lg max-w-2xl mx-auto">
              {project.description || `Stay updated with the latest changes and improvements to ${project.projectName}.`}
            </p>
            <div className="mt-6 flex justify-center items-center space-x-4">
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm font-raleway font-bold tracking-tighter"
              >
                view on github
              </a>
              <span className="font-space tracking-tighter text-sm opacity-60 text-neutral">
                {project.repository}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Changelog Content */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <PublicChangelog 
          project={serializedProject}
          patchNotes={serializedPatchNotes}
        />
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral mt-16">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">
            <p className="font-space tracking-tighter text-sm opacity-60 text-neutral">
              powered by{" "}
              <a
                href="https://patchnote.dev"
                className="hover:opacity-100 transition-opacity"
                target="_blank"
                rel="noopener noreferrer"
              >
                patchnote.dev
              </a>
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}