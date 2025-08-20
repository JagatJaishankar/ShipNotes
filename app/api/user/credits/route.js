// API route for fetching user credit information
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectMongo from "@/lib/mongoose";
import User from "@/models/User";

export async function GET() {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to database
    await connectMongo();
    
    console.log("User model:", User);
    console.log("Session user ID:", session.user.id);

    // Find user and get credit info
    const user = await User.findById(session.user.id).lean();
    if (!user) {
      console.error("User not found for ID:", session.user.id);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        credits: user.credits,
        isProUser: user.isProUser,
        pricing_status: user.isProUser ? 'pro' : 'free',
        can_generate: user.isProUser || user.credits > 0,
        githubUsername: user.githubUsername,
        email: user.email,
        createdAt: user.createdAt,
      }
    });

  } catch (error) {
    console.error("User credits fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user credits" },
      { status: 500 }
    );
  }
}