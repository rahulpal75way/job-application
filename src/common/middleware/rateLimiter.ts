// middlewares/rateLimiter.ts
import { rateLimit } from "express-rate-limit";

// Create a rate limiter middleware
export const applicationRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // ⏱️ 15 minutes
  limit: 10, // ⛔ Max 10 requests per IP per window
  message: {
    success: false,
    message: "Too many requests, please try again after 15 minutes.",
  },
  statusCode: 429, // 🔁 HTTP status code
  standardHeaders: "draft-7", // 📦 Use standardized headers
  legacyHeaders: false, // ❌ Disable old headers
});
