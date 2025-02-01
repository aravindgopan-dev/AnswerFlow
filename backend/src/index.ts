import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Redis from "ioredis";
import faq from "./router/faq-router";


dotenv.config();


const mongoURI = process.env.MONGO;
const redisURL = process.env.REDIS;

if (!mongoURI) {
  throw new Error("MONGO environment variable is not defined");
}

if (!redisURL) {
  throw new Error("REDIS environment variable is not defined");
}


const redisClient = new Redis(redisURL, {
  tls: {}, // Enable TLS/SSL for secure connections
});

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});


mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Initialize Express app
const port = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(express.json()); // Parse JSON request bodies

// Routes
app.use("/api/v1/faq", faq);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});