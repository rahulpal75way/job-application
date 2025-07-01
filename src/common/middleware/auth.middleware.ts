import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

interface JwtPayload {
  email: string;
  role: "ADMIN" | "CANDIDATE"; // Adjust based on your roles
}

const logger = {
  info: (message: string, meta?: any) =>
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, meta || ""),
  error: (message: string, meta?: any) =>
    console.error(
      `[ERROR] ${new Date().toISOString()} - ${message}`,
      meta || ""
    ),
};

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

  if (!token) {
    logger.error("No token provided", { path: req.path });
    res.status(401).json({ message: "Access token is required" });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET || "your_jwt_secret";
      const decoded = jwt.verify(token, secret);
      console.log(decoded);

    if (
      typeof decoded !== "object" ||
      !decoded ||
      !("email" in decoded) ||
      !("role" in decoded)
    ) {
      throw new Error("Invalid token payload");
    }

      const { email, role } = decoded as JwtPayload;

    logger.info("Token verified successfully", { email, path: req.path });
    req.user = { id: email, role: role as "ADMIN" | "CANDIDATE" };

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error("Validation failed", {
        errors: errors.array(),
        path: req.path,
      });
      res.status(400).json({ errors: errors.array() });
      return;
    }

    next();
  } catch (error) {
      console.log(error);
    logger.error("Token verification failed", {
      error: (error as Error).message,
      path: req.path,
    });
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
  
