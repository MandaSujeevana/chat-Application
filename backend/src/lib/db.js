import mongoose from "mongoose";
import dns from "node:dns";

export async function connectDB() {
  try {
    try {
      dns.setServers(["8.8.8.8", "1.1.1.1"]);
    } catch (e) {
      console.warn("Could not set custom DNS servers:", e.message);
    }

    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI is required");
    }

    console.log("MONGO_URI:", process.env.MONGO_URI);
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      family: 4,
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB connected:", conn.connection.host);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
  }
}