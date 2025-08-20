import mongoose from "mongoose";

const connectMongo = async () => {
  try {
    // Check if already connected
    if (mongoose.connections[0].readyState) {
      return;
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    throw error;
  }
};

export default connectMongo;
