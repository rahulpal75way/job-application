import { Router } from "express";
import passport from "passport";
import {
  getJobs,
  handleCreateJob,
  handleGetJobById,
  handleGetJobs,
} from "./job.controller";
import { authorize } from "../common/middleware/authorize.middleware";
import { authenticateToken } from "../common/middleware/auth.middleware";

const router = Router();

// Public routes
router.get(
  "/search",
  authenticateToken,
  authorize("ADMIN", "CANDIDATE"),
  getJobs
);
router.get("/", handleGetJobs);
router.get("/:id", handleGetJobById);

// Protected + admin-only
router.post(
  "/",
  authenticateToken,
  authorize("ADMIN"),
  handleCreateJob
);

export default router;
