// API route for feedback submission and credit reset
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectMongo from "@/lib/mongoose";
import User from "@/models/User";
import Feedback from "@/models/Feedback";
import { headers } from "next/headers";

export async function POST(request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const { desiredFeature, barrier, currentMethod } = await request.json();

    // Validation
    if (!desiredFeature || !barrier || !currentMethod) {
      return NextResponse.json(
        { error: "All feedback fields are required" },
        { status: 400 }
      );
    }

    // Validate minimum character requirements
    if (desiredFeature.trim().length < 15) {
      return NextResponse.json(
        { error: "Feature suggestion must be at least 15 characters" },
        { status: 400 }
      );
    }

    if (barrier.trim().length < 15) {
      return NextResponse.json(
        { error: "Barrier description must be at least 15 characters" },
        { status: 400 }
      );
    }

    if (currentMethod.trim().length < 15) {
      return NextResponse.json(
        { error: "Current method description must be at least 15 characters" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectMongo();

    // Find user
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user already has max credits
    if (user.credits >= 20) {
      return NextResponse.json(
        { error: "You already have the maximum number of credits" },
        { status: 400 }
      );
    }

    // Anti-abuse: Check if user submitted feedback in the last 24 hours
    const recentFeedback = await Feedback.findOne({
      userId: user._id,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // 24 hours
    });

    if (recentFeedback) {
      return NextResponse.json(
        { error: "You can only submit feedback once every 24 hours" },
        { status: 429 }
      );
    }

    // Get IP address and user agent for anti-abuse tracking
    const headersList = await headers();
    const ipAddress = headersList.get('x-forwarded-for') || 
                     headersList.get('x-real-ip') || 
                     'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    // Store current credits before reset
    const creditsBeforeReset = user.credits;

    // Create feedback entry
    const feedback = new Feedback({
      userId: user._id,
      userEmail: user.email,
      desiredFeature: desiredFeature.trim(),
      barrier: barrier.trim(),
      currentMethod: currentMethod.trim(),
      creditsBeforeReset,
      creditsAfterReset: 20,
      ipAddress: ipAddress.split(',')[0].trim(), // Take first IP if multiple
      userAgent,
    });

    await feedback.save();

    // Reset user credits to 20
    user.credits = 20;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Feedback submitted successfully! Your credits have been reset to 20.",
      creditsReset: {
        before: creditsBeforeReset,
        after: 20,
      },
    });

  } catch (error) {
    console.error("❌ Error processing feedback:", error);

    // Handle specific Mongoose validation errors
    if (error.name === 'ValidationError') {
      const firstError = Object.values(error.errors)[0];
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to process feedback. Please try again." },
      { status: 500 }
    );
  }
}

// Get user's feedback history (for admin or user viewing)
export async function GET(request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to database
    await connectMongo();

    // Get user's feedback history
    const feedbacks = await Feedback.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Format response (remove sensitive data)
    const formattedFeedbacks = feedbacks.map(feedback => ({
      id: feedback._id.toString(),
      desiredFeature: feedback.desiredFeature,
      barrier: feedback.barrier,
      currentMethod: feedback.currentMethod,
      creditsBeforeReset: feedback.creditsBeforeReset,
      creditsAfterReset: feedback.creditsAfterReset,
      createdAt: feedback.createdAt,
    }));

    return NextResponse.json({
      success: true,
      feedbacks: formattedFeedbacks,
    });

  } catch (error) {
    console.error("❌ Error fetching feedback:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback history" },
      { status: 500 }
    );
  }
}