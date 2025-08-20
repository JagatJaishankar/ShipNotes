// API route to fetch user's GitHub repositories
import { auth } from "@/auth";
import { fetchUserRepositories } from "@/lib/github-api";
import connectMongo from "@/lib/mongoose";
import User from "@/models/User";

export async function GET() {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to database and get user's GitHub access token
    await connectMongo();
    const user = await User.findOne({ email: session.user.email });
    
    if (!user || !user.githubAccessToken) {
      return Response.json({ 
        error: "GitHub access token not found. Please reconnect your GitHub account." 
      }, { status: 400 });
    }

    // Fetch repositories from GitHub
    const repositories = await fetchUserRepositories(user.githubAccessToken);

    return Response.json({ repositories });
  } catch (error) {
    console.error("❌ Error in /api/github/repositories:", error);
    return Response.json(
      { error: "Failed to fetch repositories" }, 
      { status: 500 }
    );
  }
}