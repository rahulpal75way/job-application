import { Request, Response, NextFunction } from "express";
import { createUserSchema } from "./user.schema";

export const validateCreateUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    req.body = createUserSchema.parse(req.body);
    next();
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.errors });
  }
};
