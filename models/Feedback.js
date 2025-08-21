// Feedback model for user feedback submissions and credit management
import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  userEmail: {
    type: String,
    required: true,
    index: true,
  },
  // Question 1: What's the #1 feature you'd add to ShipNotes?
  desiredFeature: {
    type: String,
    required: true,
    minlength: [15, 'Feature suggestion must be at least 15 characters'],
    maxlength: [500, 'Feature suggestion cannot exceed 500 characters'],
    trim: true,
  },
  // Question 2: What almost stopped you from trying ShipNotes?
  barrier: {
    type: String,
    required: true,
    minlength: [15, 'Barrier description must be at least 15 characters'],
    maxlength: [500, 'Barrier description cannot exceed 500 characters'],
    trim: true,
  },
  // Question 3: How do you currently share product updates with customers?
  currentMethod: {
    type: String,
    required: true,
    minlength: [15, 'Current method description must be at least 15 characters'],
    maxlength: [500, 'Current method description cannot exceed 500 characters'],
    trim: true,
  },
  creditsBeforeReset: {
    type: Number,
    required: true,
  },
  creditsAfterReset: {
    type: Number,
    required: true,
    default: 20,
  },
  ipAddress: {
    type: String,
    required: false, // For anti-abuse tracking
  },
  userAgent: {
    type: String,
    required: false, // For anti-abuse tracking
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt
});

// Index for querying user feedback
feedbackSchema.index({ userId: 1, createdAt: -1 });

// Index for admin queries by email
feedbackSchema.index({ userEmail: 1, createdAt: -1 });

// Prevent duplicate feedback from same user within short timeframe (anti-abuse)
feedbackSchema.index({ userId: 1, createdAt: 1 }, { 
  partialFilterExpression: { 
    createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // 24 hours
  }
});

export default mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);