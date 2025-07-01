// application.routes.ts
import express from "express";
import {
  applyToJob,
  getApplications,
  getUserApplications,
} from "./application.controller";
import { applicationRateLimiter } from "../common/middleware/rateLimiter";

const router = express.Router();

// Explicitly type the handler to avoid TS2769
router.post("/", applicationRateLimiter ,applyToJob); // POST /api/applications
router.get("/",applicationRateLimiter, getApplications); // GET /api/applications
router.get("/user/:userId", getUserApplications); // GET /api/applications/user/:userId

export default router;
