import { Router } from "express";
import passport from "passport";
import {
  getJobs,
  handleCreateJob,
  handleGetJobById,
  handleGetJobs,
} from "./job.controller";
import { authorize } from "../common/middleware/authorize.middleware";

const router = Router();

// Public routes
router.get("/search", getJobs);
router.get("/", handleGetJobs);
router.get("/:id", handleGetJobById);

// Protected + admin-only
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  authorize("admin"),
  handleCreateJob
);

export default router;
