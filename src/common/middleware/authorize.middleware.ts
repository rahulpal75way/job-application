import { Request, Response, NextFunction } from "express";
import createError from "http-errors";

export const authorize =
  (...allowedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return next(createError(403, "Forbidden: You don't have access"));
    }
    next();
  };
