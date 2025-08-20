// API routes for project management
import { auth } from "@/auth";
import connectMongo from "@/lib/mongoose";
import Project from "@/models/Project";

// Create a new project
export async function POST(request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const { projectName, repository, repositoryUrl, description } = await request.json();

    // Validation
    if (!projectName || !repository || !repositoryUrl) {
      return Response.json(
        { error: "Missing required fields: projectName, repository, repositoryUrl" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectMongo();

    // Create project slug from project name
    const projectSlug = projectName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    // Check if slug already exists
    const existingProject = await Project.findOne({ projectSlug });
    if (existingProject) {
      return Response.json(
        { error: "A project with this name already exists" },
        { status: 409 }
      );
    }

    // Create new project
    const newProject = new Project({
      userId: session.user.id,
      projectName,
      projectSlug,
      repository,
      repositoryUrl,
      description: description || "",
    });

    await newProject.save();

    return Response.json({
      message: "Project created successfully",
      project: {
        id: newProject._id,
        projectName: newProject.projectName,
        projectSlug: newProject.projectSlug,
        repository: newProject.repository,
        repositoryUrl: newProject.repositoryUrl,
        description: newProject.description,
        createdAt: newProject.createdAt,
      },
    });
  } catch (error) {
    console.error("❌ Error creating project:", error);
    return Response.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}

// Get user's projects
export async function GET() {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to database
    await connectMongo();

    // Fetch user's projects
    const projects = await Project.find({ userId: session.user.id })
      .sort({ updatedAt: -1 })
      .lean();

    return Response.json({ projects });
  } catch (error) {
    console.error("❌ Error fetching projects:", error);
    return Response.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}