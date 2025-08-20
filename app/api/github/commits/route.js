// API route for fetching commits from a GitHub repository
import { auth } from "@/auth";
import connectMongo from "@/lib/mongoose";
import User from "@/models/User";
import { fetchRepositoryCommits } from "@/lib/github-api";

export async function GET(request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const repository = searchParams.get("repository"); // Format: "owner/repo"
    const since = searchParams.get("since"); // ISO 8601 date string

    // Validation
    if (!repository) {
      return Response.json(
        { error: "Repository parameter is required" },
        { status: 400 }
      );
    }

    // Parse repository owner and name
    const [owner, repo] = repository.split("/");
    if (!owner || !repo) {
      return Response.json(
        { error: "Invalid repository format. Expected 'owner/repo'" },
        { status: 400 }
      );
    }

    // Connect to database and get user's GitHub access token
    await connectMongo();
    const user = await User.findOne({ email: session.user.email });
    
    if (!user || !user.githubAccessToken) {
      return Response.json({ 
        error: "GitHub access token not found. Please reconnect your GitHub account." 
      }, { status: 400 });
    }

    // Fetch commits from GitHub
    const commits = await fetchRepositoryCommits(
      user.githubAccessToken,
      owner,
      repo,
      since
    );

    return Response.json({ 
      commits,
      repository,
      since,
      count: commits.length 
    });
  } catch (error) {
    console.error("❌ Error in /api/github/commits:", error);
    
    // Handle specific GitHub API errors
    if (error.message.includes("Failed to fetch commits")) {
      return Response.json(
        { error: "Failed to fetch commits from GitHub. Please check repository access." },
        { status: 400 }
      );
    }

    return Response.json(
      { error: "Failed to fetch commits" }, 
      { status: 500 }
    );
  }
}