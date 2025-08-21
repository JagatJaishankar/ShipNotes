// OpenAI API route for generating release notes from GitHub commits
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectMongo from "@/lib/mongoose";
import User from "@/models/User";
import Project from "@/models/Project";
import PatchNote from "@/models/PatchNote";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const { projectId, selectedCommits, title } = await request.json();

    if (!projectId || !selectedCommits || selectedCommits.length === 0) {
      return NextResponse.json(
        { error: "Project ID and selected commits are required" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectMongo();

    // Find user and check credits
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has credits (unless pro user)
    if (!user.isProUser && user.credits <= 0) {
      return NextResponse.json(
        { 
          error: "No credits remaining. Please submit feedback to get more free credits.",
          errorType: "no_credits",
          redirectUrl: "/feedback"
        },
        { status: 403 }
      );
    }

    // Find and validate project
    const project = await Project.findOne({ _id: projectId, userId: user._id });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Format commits for OpenAI prompt
    const commitData = selectedCommits.map(commit => ({
      message: commit.message,
      author: commit.author.name,
      date: commit.author.date,
      sha: commit.sha.substring(0, 7),
      stats: commit.stats ? `+${commit.stats.additions || 0}/-${commit.stats.deletions || 0}` : "N/A"
    }));

    // Create OpenAI prompt
    const prompt = `You are a professional technical writer creating customer-facing release notes for a SaaS product called "${project.projectName}".

Transform the following GitHub commits into engaging, customer-friendly release notes that highlight user benefits and improvements.

Repository: ${project.repository}
Time Period: Recent commits
Total Commits: ${commitData.length}

COMMIT DATA:
${commitData.map(commit => 
  `• ${commit.message} (${commit.author} - ${commit.sha})\n  Changes: ${commit.stats}`
).join('\n')}

REQUIREMENTS:
- Write for end users, not developers
- Focus on user benefits and improvements
- Group related changes together
- Use clear, engaging language
- Avoid technical jargon
- Structure with clear sections (New Features, Improvements, Bug Fixes, etc.)
- Keep it concise but informative
- Use markdown formatting
- Don't mention commit hashes, file names, or technical implementation details

FORMAT:
# Release Notes - ${title || 'Latest Updates'}

## 🆕 New Features
[List new features with user benefits]

## ⚡ Improvements
[List enhancements and optimizations]

## 🐛 Bug Fixes
[List bug fixes and stability improvements]

## 📝 Other Updates
[Any other notable changes]

Generate professional, customer-focused release notes now:`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional technical writer specializing in customer-facing release notes. Always focus on user benefits and use clear, engaging language."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const generatedContent = completion.choices[0].message.content;

    // Create new patch note in database
    const patchNote = new PatchNote({
      userId: user._id,
      projectId: project._id,
      title: title || 'Latest Updates',
      content: generatedContent,
      commits: selectedCommits.map(commit => commit.sha),
      status: 'draft',
      viewCount: 0,
    });

    await patchNote.save();

    // Deduct credit (unless pro user)
    if (!user.isProUser) {
      user.credits -= 1;
      await user.save();
    }

    return NextResponse.json({
      success: true,
      patchNote: {
        id: patchNote._id,
        title: patchNote.title,
        content: patchNote.content,
        status: patchNote.status,
        createdAt: patchNote.createdAt,
      },
      creditsRemaining: user.isProUser ? -1 : user.credits,
    });

  } catch (error) {
    console.error("OpenAI generation error:", error);
    console.error("Error details:", {
      message: error.message,
      status: error.status,
      response: error.response?.data,
      stack: error.stack
    });
    
    // Handle specific OpenAI errors
    if (error.status === 429) {
      return NextResponse.json(
        { error: "AI service is currently busy. Please try again in a moment." },
        { status: 429 }
      );
    }
    
    if (error.status === 401) {
      return NextResponse.json(
        { error: "AI service configuration error. Please contact support." },
        { status: 500 }
      );
    }

    // Return more specific error for debugging
    return NextResponse.json(
      { 
        error: "Failed to generate release notes. Please try again.",
        debug: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}