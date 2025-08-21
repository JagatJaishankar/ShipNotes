// API routes for project repository management
import { auth } from "@/auth";
import connectMongo from "@/lib/mongoose";
import Project from "@/models/Project";
import User from "@/models/User";
import { fetchRepositoryInfo } from "@/lib/github-api";

// Update project repository
export async function PUT(request, { params }) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = params;
    const { repository, repositoryUrl } = await request.json();

    // Validation
    if (!repository || !repositoryUrl) {
      return Response.json(
        { error: "Missing required fields: repository, repositoryUrl" },
        { status: 400 }
      );
    }

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

    // Get user's GitHub access token for validation
    const user = await User.findById(session.user.id);
    if (!user?.githubAccessToken) {
      return Response.json(
        { error: "GitHub access token not found. Please reconnect your GitHub account." },
        { status: 400 }
      );
    }

    // Validate repository access
    try {
      const [owner, repo] = repository.split('/');
      const repoInfo = await fetchRepositoryInfo(user.githubAccessToken, owner, repo);
      
      // Update project with validated repository info
      project.repository = repository;
      project.repositoryUrl = repositoryUrl;
      await project.save();

      return Response.json({
        message: "Repository updated successfully",
        project: {
          id: project._id,
          projectName: project.projectName,
          projectSlug: project.projectSlug,
          repository: project.repository,
          repositoryUrl: project.repositoryUrl,
          description: project.description,
          updatedAt: project.updatedAt,
        },
        repositoryInfo: repoInfo,
      });
    } catch (repoError) {
      return Response.json(
        { error: "Repository not accessible. Please check permissions or repository name." },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error("❌ Error updating project repository:", error);
    return Response.json(
      { error: "Failed to update repository" },
      { status: 500 }
    );
  }
}

// Disconnect repository (set to inactive)
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

    // Set project as inactive instead of deleting
    project.isActive = false;
    await project.save();

    return Response.json({
      message: "Repository disconnected successfully",
      project: {
        id: project._id,
        projectName: project.projectName,
        projectSlug: project.projectSlug,
        repository: project.repository,
        repositoryUrl: project.repositoryUrl,
        isActive: project.isActive,
        updatedAt: project.updatedAt,
      },
    });
  } catch (error) {
    console.error("❌ Error disconnecting repository:", error);
    return Response.json(
      { error: "Failed to disconnect repository" },
      { status: 500 }
    );
  }
}

// Reconnect repository (set to active)
export async function PATCH(request, { params }) {
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

    // Get user's GitHub access token for validation
    const user = await User.findById(session.user.id);
    if (!user?.githubAccessToken) {
      return Response.json(
        { error: "GitHub access token not found. Please reconnect your GitHub account." },
        { status: 400 }
      );
    }

    // Validate repository is still accessible
    try {
      const [owner, repo] = project.repository.split('/');
      const repoInfo = await fetchRepositoryInfo(user.githubAccessToken, owner, repo);
      
      // Reactivate project
      project.isActive = true;
      await project.save();

      return Response.json({
        message: "Repository reconnected successfully",
        project: {
          id: project._id,
          projectName: project.projectName,
          projectSlug: project.projectSlug,
          repository: project.repository,
          repositoryUrl: project.repositoryUrl,
          isActive: project.isActive,
          updatedAt: project.updatedAt,
        },
        repositoryInfo: repoInfo,
      });
    } catch (repoError) {
      return Response.json(
        { error: "Repository no longer accessible. Please update repository or check permissions." },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error("❌ Error reconnecting repository:", error);
    return Response.json(
      { error: "Failed to reconnect repository" },
      { status: 500 }
    );
  }
}