// Project model for patchnote.dev - manages user projects and GitHub repositories
import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectName: {
      type: String,
      required: true,
      trim: true,
    },
    projectSlug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    repository: {
      type: String,
      required: true, // Format: "owner/repo"
    },
    repositoryUrl: {
      type: String,
      required: true, // Full GitHub URL
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Indexes for faster lookups
ProjectSchema.index({ userId: 1 });
ProjectSchema.index({ projectSlug: 1 });
ProjectSchema.index({ repository: 1 });

// Ensure one project per repository per user
ProjectSchema.index({ userId: 1, repository: 1 }, { unique: true });

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);