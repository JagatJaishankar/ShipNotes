// API route for updating and publishing patch notes
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectMongo from "@/lib/mongoose";
import PatchNote from "@/models/PatchNote";
import Project from "@/models/Project";

// Update patch note (save draft or publish)
export async function PUT(request, { params }) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Await params in Next.js 15
    const { noteId } = await params;

    // Parse request body
    const { title, content, status } = await request.json();

    // Validation
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    if (status && !['draft', 'published'].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be 'draft' or 'published'" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectMongo();

    // Find patch note and verify ownership
    const patchNote = await PatchNote.findOne({
      _id: noteId,
      userId: session.user.id
    });

    if (!patchNote) {
      return NextResponse.json(
        { error: "Patch note not found or access denied" },
        { status: 404 }
      );
    }

    // Update patch note
    const updateData = {
      title,
      content,
      updatedAt: new Date()
    };

    // If publishing for the first time, set publishedAt
    if (status === 'published' && patchNote.status !== 'published') {
      updateData.status = 'published';
      updateData.publishedAt = new Date();
    } else if (status) {
      updateData.status = status;
    }

    const updatedPatchNote = await PatchNote.findByIdAndUpdate(
      noteId,
      updateData,
      { new: true }
    );

    return NextResponse.json({
      success: true,
      patchNote: {
        id: updatedPatchNote._id,
        title: updatedPatchNote.title,
        content: updatedPatchNote.content,
        status: updatedPatchNote.status,
        publishedAt: updatedPatchNote.publishedAt,
        updatedAt: updatedPatchNote.updatedAt,
      },
    });

  } catch (error) {
    console.error("Patch note update error:", error);
    return NextResponse.json(
      { error: "Failed to update patch note" },
      { status: 500 }
    );
  }
}

// Get patch note details
export async function GET(request, { params }) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Await params in Next.js 15
    const { noteId } = await params;

    // Connect to database
    await connectMongo();

    // Find patch note and verify ownership
    const patchNote = await PatchNote.findOne({
      _id: noteId,
      userId: session.user.id
    }).populate('projectId', 'projectName projectSlug repository');

    if (!patchNote) {
      return NextResponse.json(
        { error: "Patch note not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      patchNote: {
        id: patchNote._id,
        title: patchNote.title,
        content: patchNote.content,
        status: patchNote.status,
        publishedAt: patchNote.publishedAt,
        createdAt: patchNote.createdAt,
        updatedAt: patchNote.updatedAt,
        commits: patchNote.commits,
        project: patchNote.projectId,
      },
    });

  } catch (error) {
    console.error("Patch note fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch patch note" },
      { status: 500 }
    );
  }
}

// Delete patch note
export async function DELETE(request, { params }) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Await params in Next.js 15
    const { noteId } = await params;

    // Connect to database
    await connectMongo();

    // Find and delete patch note (verify ownership)
    const deletedPatchNote = await PatchNote.findOneAndDelete({
      _id: noteId,
      userId: session.user.id
    });

    if (!deletedPatchNote) {
      return NextResponse.json(
        { error: "Patch note not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Patch note deleted successfully"
    });

  } catch (error) {
    console.error("Patch note delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete patch note" },
      { status: 500 }
    );
  }
}