import mongoose from "mongoose";
import { mongoURI } from "..";
import { sendLog } from "../utils/sendLogs";
import { searchIndexex } from "../db/searchIndex";

export const connectDb = async (retryCount = 0) => {
  try {
    if (!mongoURI) {
      sendLog("🚨 MongoDB connection string is not vailed or avalable");
      console.error("🚨 MongoDB connection string is not vailed or avalable");
      return;
    }
    await mongoose.connect(mongoURI, {
      dbName: "telegram",
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
    });
    console.log("✅ MongoDB connected");
    await sendLog("✅ MongoDB connected");
    await searchIndexex()
  } catch (error: any) {
    console.error("❌ MongoDB connection failed", error);
    sendLog(`🚨 MongoDB connection failed: ${error.message}`);
    if (retryCount < 3) {
      console.log(
        `⏳ Retrying in ${Math.min(1000 * Math.pow(2, retryCount), 30000)}ms...`
      );
      setTimeout(
        () => connectDb(retryCount + 1),
        Math.min(1000 * Math.pow(2, retryCount), 30000)
      );
    } else {
      console.error(
        "💀 Max retry attempts reached. Server continuing without DB"
      );
      await sendLog(
        "💀 Max DB retry attempts reached. Server in degraded mode"
      );
    }
  }
};
