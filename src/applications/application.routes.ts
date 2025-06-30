// application.routes.ts
import express from "express";
import {
  applyToJob,
  getApplications,
  getUserApplications,
} from "./application.controller";

const router = express.Router();

// Explicitly type the handler to avoid TS2769
router.post("/", applyToJob); // POST /api/applications
router.get("/", getApplications); // GET /api/applications
router.get("/user/:userId", getUserApplications); // GET /api/applications/user/:userId

export default router;
