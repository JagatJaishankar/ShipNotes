// API routes for patch notes management
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectMongo from "@/lib/mongoose";
import PatchNote from "@/models/PatchNote";
import Project from "@/models/Project";

// Get user's patch notes (drafts and published)
export async function GET(request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse URL parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // "draft", "published", or null for all
    const projectId = searchParams.get("projectId"); // Filter by specific project
    const limit = parseInt(searchParams.get("limit")) || 50;

    // Connect to database
    await connectMongo();

    // Build query filter
    const filter = { userId: session.user.id };
    if (status) {
      filter.status = status;
    }
    if (projectId) {
      filter.projectId = projectId;
    }

    // Fetch patch notes with project details
    const patchNotes = await PatchNote.find(filter)
      .populate({
        path: 'projectId',
        select: 'projectName projectSlug repository',
        // Handle case where project might be deleted
        options: { strictPopulate: false }
      })
      .sort({ updatedAt: -1 }) // Most recently updated first
      .limit(limit)
      .lean();

    // Format response
    const formattedPatchNotes = patchNotes.map(note => ({
      id: note._id.toString(),
      title: note.title,
      content: note.content,
      status: note.status,
      publishedAt: note.publishedAt,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
      commits: note.commits || [],
      project: note.projectId ? {
        id: note.projectId._id.toString(),
        name: note.projectId.projectName,
        slug: note.projectId.projectSlug,
        repository: note.projectId.repository,
      } : null,
    }));

    return NextResponse.json({
      success: true,
      patchNotes: formattedPatchNotes,
      total: formattedPatchNotes.length,
    });

  } catch (error) {
    console.error("❌ Error fetching patch notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch patch notes" },
      { status: 500 }
    );
  }
}