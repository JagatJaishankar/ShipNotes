// API route for tracking patch note views
import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongoose";
import PatchNote from "@/models/PatchNote";

// Track a view for a published patch note
export async function POST(request, { params }) {
  try {
    // Await params in Next.js 15
    const { noteId } = await params;

    // Connect to database
    await connectMongo();

    // Find the patch note and ensure it's published
    const patchNote = await PatchNote.findOne({
      _id: noteId,
      status: 'published'
    });

    if (!patchNote) {
      return NextResponse.json(
        { error: "Published patch note not found" },
        { status: 404 }
      );
    }

    // Increment view count
    await PatchNote.findByIdAndUpdate(
      noteId,
      { $inc: { viewCount: 1 } },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: "View tracked successfully"
    });

  } catch (error) {
    console.error("View tracking error:", error);
    return NextResponse.json(
      { error: "Failed to track view" },
      { status: 500 }
    );
  }
}