// PatchNote model for shipnotes.dev - manages release notes and changelogs
import mongoose from "mongoose";

const PatchNoteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true, // Markdown content
    },
    version: {
      type: String,
      required: false, // Optional version number
      trim: true,
    },
    publishedAt: {
      type: Date,
      required: false, // Only set when status is "published"
    },
    commits: {
      type: [String], // Array of commit hashes included
      default: [],
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    viewCount: {
      type: Number,
      default: 0, // For analytics
      min: 0,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Indexes for faster lookups
PatchNoteSchema.index({ userId: 1 });
PatchNoteSchema.index({ projectId: 1 });
PatchNoteSchema.index({ status: 1 });
PatchNoteSchema.index({ publishedAt: -1 }); // Most recent first
PatchNoteSchema.index({ projectId: 1, publishedAt: -1 }); // Project changelogs

// Middleware to set publishedAt when status changes to published
PatchNoteSchema.pre("save", function (next) {
  if (this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

let PatchNote;
try {
  PatchNote = mongoose.model("PatchNote");
} catch (error) {
  PatchNote = mongoose.model("PatchNote", PatchNoteSchema);
}

export default PatchNote;