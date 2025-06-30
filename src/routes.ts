import express from "express";
import userRoutes from "./user/user.routes";
import jobRoutes from './job/job.routes'
import applicationRoutes from './applications/application.routes'
import authRoutes from "./auth/auth.routes"; 

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/jobs", jobRoutes);
router.use("/applications", applicationRoutes);

export default router;
