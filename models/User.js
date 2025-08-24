// User model for shipnotes.dev - manages user accounts and credits
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    githubUsername: {
      type: String,
      required: true,
      unique: true,
    },
    githubUserId: {
      type: String,
      required: true,
      unique: true,
    },
    githubProfilePicture: {
      type: String,
      required: false,
    },
    githubAccessToken: {
      type: String,
      required: false, // Will be encrypted when stored
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    credits: {
      type: Number,
      default: 5, // 20 total credits, 5 free generations (out of 20)
      min: 0,
    },
    isProUser: {
      type: Boolean,
      default: false, // Pro users have credits = -1 (unlimited)
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  },
);

// Indexes are automatically created by unique: true fields

let User;
try {
  User = mongoose.model("User");
} catch (error) {
  User = mongoose.model("User", UserSchema);
}

export default User;
