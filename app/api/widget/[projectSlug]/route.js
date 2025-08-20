// Widget API endpoint - serves data for embedded widgets
import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongoose";
import Project from "@/models/Project";
import PatchNote from "@/models/PatchNote";

// Get widget data for a project (public endpoint)
export async function GET(request, { params }) {
  try {
    // Await params in Next.js 15
    const { projectSlug } = await params;

    // Get query parameters for customization
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days")) || 30; // Default: show updates from last 30 days
    const limit = parseInt(searchParams.get("limit")) || 3; // Default: max 3 recent updates

    // Connect to database
    await connectMongo();

    // Find project by slug
    const project = await Project.findOne({ 
      projectSlug,
      isActive: true 
    }).lean();

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Calculate date range
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);

    // Fetch recent published patch notes
    const recentNotes = await PatchNote.find({
      projectId: project._id,
      status: 'published',
      publishedAt: { $gte: sinceDate }
    })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .lean();

    // Calculate total updates in the period
    const totalUpdates = recentNotes.length;

    // Prepare widget data
    const widgetData = {
      project: {
        name: project.projectName,
        slug: project.projectSlug,
        description: project.description,
      },
      stats: {
        totalUpdates,
        period: `${days} days`,
        hasNewUpdates: totalUpdates > 0,
      },
      recentUpdates: recentNotes.map(note => ({
        id: note._id.toString(),
        title: note.title,
        publishedAt: note.publishedAt,
        summary: note.content.substring(0, 120) + (note.content.length > 120 ? '...' : ''),
      })),
      links: {
        changelog: `${process.env.NEXT_PUBLIC_APP_URL}/${project.projectSlug}`,
        widget: `${process.env.NEXT_PUBLIC_APP_URL}/api/widget/${project.projectSlug}`,
      }
    };

    // Set CORS headers for cross-origin requests
    const response = NextResponse.json(widgetData);
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    response.headers.set('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes

    return response;

  } catch (error) {
    console.error("Widget API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch widget data" },
      { status: 500 }
    );
  }
}

// Handle preflight requests for CORS
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}