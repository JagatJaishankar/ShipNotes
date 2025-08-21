// API routes for individual project management
import { auth } from "@/auth";
import connectMongo from "@/lib/mongoose";
import Project from "@/models/Project";
import PatchNote from "@/models/PatchNote";

// Update project details
export async function PUT(request, { params }) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = params;
    const { projectName, repository, repositoryUrl, description } = await request.json();

    // Connect to database
    await connectMongo();

    // Find project and verify ownership
    const project = await Project.findOne({
      _id: projectId,
      userId: session.user.id,
    });

    if (!project) {
      return Response.json(
        { error: "Project not found or you don't have permission" },
        { status: 404 }
      );
    }

    // If projectName is being changed, check for slug conflicts
    if (projectName && projectName !== project.projectName) {
      const newSlug = projectName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      // Check if new slug already exists (excluding current project)
      const existingProject = await Project.findOne({ 
        projectSlug: newSlug,
        _id: { $ne: projectId }
      });
      
      if (existingProject) {
        return Response.json(
          { error: "Project name already taken. Please choose a different name." },
          { status: 409 }
        );
      }

      project.projectSlug = newSlug;
    }

    // Update fields if provided
    if (projectName) project.projectName = projectName;
    if (repository) project.repository = repository;
    if (repositoryUrl) project.repositoryUrl = repositoryUrl;
    if (description !== undefined) project.description = description;

    await project.save();

    return Response.json({
      message: "Project updated successfully",
      project: {
        id: project._id,
        projectName: project.projectName,
        projectSlug: project.projectSlug,
        repository: project.repository,
        repositoryUrl: project.repositoryUrl,
        description: project.description,
        updatedAt: project.updatedAt,
      },
    });
  } catch (error) {
    console.error("❌ Error updating project:", error);
    return Response.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// Delete entire project
export async function DELETE(request, { params }) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = params;

    // Connect to database
    await connectMongo();

    // Find project and verify ownership
    const project = await Project.findOne({
      _id: projectId,
      userId: session.user.id,
    });

    if (!project) {
      return Response.json(
        { error: "Project not found or you don't have permission" },
        { status: 404 }
      );
    }

    // Delete all patch notes associated with this project
    await PatchNote.deleteMany({ projectId: projectId });

    // Delete the project
    await Project.findByIdAndDelete(projectId);

    return Response.json({
      message: "Project and all associated release notes deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting project:", error);
    return Response.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}