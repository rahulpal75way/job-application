import express from "express";
import { registerUser, listUsers } from "./user.controller";
import { validateCreateUser } from "./user.validation";


const router = express.Router();

router.post("/register", validateCreateUser, registerUser);
router.get("/", listUsers);

export default router;
