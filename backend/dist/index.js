"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const ioredis_1 = __importDefault(require("ioredis"));
const faq_router_1 = __importDefault(require("./router/faq-router"));
dotenv_1.default.config();
const mongoURI = process.env.MONGO;
const redisURL = process.env.REDIS;
if (!mongoURI) {
    throw new Error("MONGO environment variable is not defined");
}
if (!redisURL) {
    throw new Error("REDIS environment variable is not defined");
}
const redisClient = new ioredis_1.default(redisURL, {
    tls: {}, // Enable TLS/SSL for secure connections
});
redisClient.on("connect", () => {
    console.log("Connected to Redis");
});
redisClient.on("error", (err) => {
    console.error("Redis error:", err);
});
mongoose_1.default
    .connect(mongoURI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));
// Initialize Express app
const port = process.env.PORT || 5000;
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json()); // Parse JSON request bodies
// Routes
app.use("/api/v1/faq", faq_router_1.default);
// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
