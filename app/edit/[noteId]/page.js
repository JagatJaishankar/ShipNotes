// Release note editor page for editing generated patch notes
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import connectMongo from "@/lib/mongoose";
import PatchNote from "@/models/PatchNote";
import Project from "@/models/Project";
import ReleaseNoteEditor from "@/components/editor/ReleaseNoteEditor";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

export default async function EditPage({ params }) {
  const session = await auth();

  // If not logged in, redirect to auth
  if (!session?.user) {
    redirect("/auth");
  }

  // Await params in Next.js 15
  const { noteId } = await params;

  // Connect to database and fetch patch note
  await connectMongo();
  
  const patchNote = await PatchNote.findOne({ 
    _id: noteId,
    userId: session.user.id 
  }).lean();

  // If patch note not found or doesn't belong to user, redirect to dashboard
  if (!patchNote) {
    redirect("/dashboard");
  }

  // Fetch associated project
  const project = await Project.findById(patchNote.projectId).lean();
  if (!project) {
    redirect("/dashboard");
  }

  // Convert ObjectIds to strings for serialization
  const serializedPatchNote = {
    ...patchNote,
    _id: patchNote._id.toString(),
    userId: patchNote.userId.toString(),
    projectId: patchNote.projectId.toString(),
  };

  const serializedProject = {
    ...project,
    _id: project._id.toString(),
    userId: project.userId.toString(),
  };

  return (
    <main className="min-h-screen bg-base-100 p-6">
      <Navbar session={session} />
      
      <section className="border border-neutral rounded-sm p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <Link 
              href={`/project/${project.projectSlug}`}
              className="btn btn-ghost btn-sm font-raleway font-bold tracking-tighter"
            >
              ← back to project
            </Link>
          </div>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="font-raleway font-black tracking-tighter text-4xl">
                edit release notes
              </h1>
              <p className="font-space tracking-tighter text-sm opacity-60 text-neutral mt-2">
                {project.projectName} - {patchNote.title}
              </p>
              <div className="flex items-center space-x-4 mt-2">
                <span className={`badge ${patchNote.status === 'published' ? 'badge-success' : 'badge-secondary'} font-raleway font-bold tracking-tighter`}>
                  {patchNote.status}
                </span>
                <span className="font-lora tracking-tighter opacity-80 text-neutral text-sm">
                  created {new Date(patchNote.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {patchNote.status === 'published' && (
                <Link
                  href={`/${project.projectSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm font-raleway font-bold tracking-tighter"
                >
                  view live changelog
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Editor Component */}
        <ReleaseNoteEditor 
          patchNote={serializedPatchNote} 
          project={serializedProject}
          session={session} 
        />
      </section>
    </main>
  );
}